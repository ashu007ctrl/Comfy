const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const MODEL_NAME = "gemini-2.5-flash";

const getModel = () => {
    if (!genAI) return null;
    return genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
            temperature: 1.0,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
        },
    });
};

const SYSTEM_INSTRUCTION = `
You are an AI-powered stress awareness engine for a non-clinical, privacy-first web app called "Comfy".
You must NOT diagnose medical or psychological conditions.
Your purpose is to generate adaptive stress assessment questions, analyze user responses, and provide personalized, practical guidance.

CORE RULES:
- No medical diagnosis or treatment advice
- Neutral, ethical, supportive tone
- General well-being guidance only
- Output MUST be valid JSON ONLY (no markdown fences, no explanation text, no code blocks)
- Every response must feel unique and tailored — NEVER give generic or cookie-cutter output
`;

// Retry helper with exponential backoff for rate limits
const retryWithBackoff = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.message?.includes('429') || error.message?.includes('quota');
            if (!isRateLimit || i === maxRetries - 1) throw error;
            const delay = Math.pow(2, i + 1) * 1000 + Math.random() * 1000; // 2s, 4s, 8s + jitter
            console.log(`Rate limited. Retrying in ${Math.round(delay / 1000)}s (attempt ${i + 2}/${maxRetries})...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
};

// Fallback questions when AI is completely unavailable (rate-limited or down)
const getFallbackQuestions = (userInfo) => {
    const occ = userInfo?.occupation || 'your daily routine';
    const mood = userInfo?.mood || 'your current state';
    const seed = Date.now().toString(36);
    const isHindi = userInfo?.language === 'Hindi';

    const questionPool = isHindi ? [
        { cluster: "Work/Academic Pressure", text: `एक ${occ} के रूप में, क्या आप अक्सर भारी दबाव या डेडलाइन के कारण तनाव महसूस करते हैं?` },
        { cluster: "Work/Academic Pressure", text: `क्या ${occ} से जुड़ा तनाव आपको एक समय में एक चीज़ पर ध्यान केंद्रित करने से रोकता है?` },
        { cluster: "Emotional Well-being", text: `यह देखते हुए कि आप "${mood}" महसूस कर रहे हैं, क्या आप अक्सर अपने खाली समय में भी नकारात्मक विचारों से घिरे रहते हैं?` },
        { cluster: "Emotional Well-being", text: `क्या आप दिन के अंत में खुद को भावनात्मक रूप से थका हुआ महसूस करते हैं?` },
        { cluster: "Physical & Sleep Health", text: `क्या आपकी वर्तमान स्थिति (${mood}) ने आपकी नींद या आराम करने की क्षमता को प्रभावित किया है?` },
        { cluster: "Physical & Sleep Health", text: `क्या आप अक्सर ${occ} के रूप में अपने जीवन से संबंधित सिरदर्द या थकान महसूस करते हैं?` },
        { cluster: "Social & Lifestyle Balance", text: `क्या आप अक्सर ${occ} के दबाव के कारण सामाजिक योजनाओं या अपने शौक को छोड़ देते हैं?` },
        { cluster: "Social & Lifestyle Balance", text: `जब आप "${mood}" महसूस करते हैं, तो क्या आप अक्सर उन लोगों से दूर हो जाते हैं जो आमतौर पर आपका समर्थन करते हैं?` },
    ] : [
        { cluster: "Work/Academic Pressure", text: `In your role as a ${occ}, how often do you feel overwhelmed by deadlines or responsibilities that pile up faster than you can handle them?` },
        { cluster: "Work/Academic Pressure", text: `How frequently does ${occ}-related pressure make it hard for you to focus on one thing at a time?` },
        { cluster: "Emotional Well-being", text: `Considering you're feeling "${mood}", how often do you find yourself unable to shake off negative thoughts even during your free time?` },
        { cluster: "Emotional Well-being", text: `How often do you feel emotionally drained at the end of the day, as if you have nothing left for yourself?` },
        { cluster: "Physical & Sleep Health", text: `How frequently has your current mood (${mood}) affected your sleep pattern or ability to rest properly?` },
        { cluster: "Physical & Sleep Health", text: `How often do you notice physical signs of stress — like tension, headaches, or fatigue — related to your life as a ${occ}?` },
        { cluster: "Social & Lifestyle Balance", text: `How often do you skip social plans or personal hobbies because of demands from your role as a ${occ}?` },
        { cluster: "Social & Lifestyle Balance", text: `When feeling "${mood}", how frequently do you withdraw from people who usually support or energize you?` },
    ];

    // Shuffle and pick 7
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 7);

    return {
        questions: selected.map((q, i) => ({
            id: `${seed}_q${i + 1}`,
            cluster: q.cluster,
            text: q.text,
            minLabel: isHindi ? "कभी नहीं" : "Never",
            maxLabel: isHindi ? "अक्सर" : "Very Often"
        }))
    };
};

const cleanJson = (text) => {
    try {
        // Find the FIRST '{' and the LAST '}' to extract the object
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in response");
        }

        // Extract just the JSON part
        let jsonStr = text.substring(firstBrace, lastBrace + 1);

        // Remove trailing commas before closing braces/brackets (common AI mistake) //
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

        // Remove markdown formatting within the string if it snuck inside the extracted block
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```/g, '');

        return jsonStr.trim();
    } catch (err) {
        console.error("cleanJson Error:", err.message);
        return "{}"; // Return empty object string to let JSON.parse fail cleanly or just throw
    }
};

exports.generateQuestions = async (userInfo) => {
    const model = getModel();
    if (!model) throw new Error("AI Service Unavailable: Missing API Key");

    // Random seed to force variety in every request
    const sessionSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().toISOString();

    const prompt = `
${SYSTEM_INSTRUCTION}

SESSION: ${sessionSeed} | TIME: ${timestamp}
(Use the session ID to ensure this response is completely unique from any prior response.)

INPUT — User Profile:
- Age: ${userInfo?.age || 'Not specified'}
- Gender: ${userInfo?.gender || 'Not specified'}
- Occupation: ${userInfo?.occupation || 'Not specified'}
- Current Mood / Context: ${userInfo?.mood || 'Not specified'}
- Language Preference: ${userInfo?.language || 'English'}

YOUR TASK:
Generate 7 stress assessment questions that are HIGHLY PERSONALIZED to this specific user.

REQUIREMENTS:
1. The questions MUST be generated inside the requested language: ${userInfo?.language || 'English'}.
2. Questions MUST directly reference the user's occupation ("${userInfo?.occupation || 'their work'}") and mood ("${userInfo?.mood || 'current state'}").
   - For a student: ask about exams, deadlines, peer pressure, study-life balance
   - For a software engineer: ask about burnout, code reviews, work-from-home isolation, screen fatigue
   - For a doctor: ask about patient load, emotional toll, long shifts, work-life boundaries
   - For any other role: deeply tailor to what stresses THAT specific role
3. Group questions into these clusters: "Work/Academic Pressure", "Emotional Well-being", "Physical & Sleep Health", "Social & Lifestyle Balance" (Ensure the cluster names themselves are still in English for internal logic processing, but the "text", "minLabel", and "maxLabel" must be in ${userInfo?.language || 'English'}.)
4. Use a 1-5 Likert scale (1=Never, 5=Very Often).
5. Each question must feel conversational and empathetic, not clinical.
6. DO NOT use generic questions like "How stressed do you feel?" — be SPECIFIC.
7. Vary the question structure: some direct, some scenario-based, some reflective.

OUTPUT (STRICT JSON, nothing else):
{
  "questions": [
    {
      "id": "q1",
      "cluster": "Category Name in English",
      "text": "[Write the personalized question here translated into ${userInfo?.language || 'English'}]",
      "minLabel": "[Translate 'Never' into ${userInfo?.language || 'English'}]",
      "maxLabel": "[Translate 'Very Often' into ${userInfo?.language || 'English'}]"
    }
  ]
}
`;

    try {
        const data = await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log("AI Raw Response (Questions):", text.substring(0, 300));
            const cleaned = cleanJson(text);
            return JSON.parse(cleaned);
        });
        return data;
    } catch (error) {
        console.error("AI Service Error (Generate Questions):", error.message);
        console.log("Using fallback questions for:", userInfo?.occupation);
        return getFallbackQuestions(userInfo);
    }
};

exports.analyzeStress = async (userInfo, answers, questions, score) => {
    const model = getModel();
    if (!model) throw new Error("AI Service Unavailable");

    const sessionSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().toISOString();

    // Format responses for the prompt
    const formattedResponses = questions.map(q => {
        const answerVal = answers[q.id];
        let intensity = "low";
        if (answerVal >= 4) intensity = "high";
        else if (answerVal >= 3) intensity = "moderate";
        return `- "${q.text}" (${q.cluster}) → ${answerVal}/5 [${intensity} stress signal]`;
    }).join('\n');

    const prompt = `
${SYSTEM_INSTRUCTION}

SESSION: ${sessionSeed} | TIME: ${timestamp}

INPUT — User Profile:
- Age: ${userInfo?.age || 'Not specified'}
- Gender: ${userInfo?.gender || 'Not specified'}
- Occupation: ${userInfo?.occupation || 'Not specified'}
- Current Mood: ${userInfo?.mood || 'Not specified'}
- Language Preference: ${userInfo?.language || 'English'}

User's Assessment Responses:
${formattedResponses}

Calculated Stress Score: ${score}/100

YOUR TASK:
Provide a deeply personalized stress analysis for this ${userInfo?.occupation || 'person'}.

REQUIREMENTS:
1. All generated text (summary, keyStressors, stressLevelExplanation, tips) MUST be written in the user's language preference: ${userInfo?.language || 'English'}.
2. STRESS EVALUATION:
   - Interpret the ${score}/100 score in context of their role as a ${userInfo?.occupation || 'person'}
   - Identify which clusters showed highest stress (answers >= 4)
   - Name 2-4 specific stressors drawn from their HIGH-scoring answers

3. PERSONALIZED TIPS (exactly 5):
   - Each tip MUST be specific to their occupation ("${userInfo?.occupation || 'their work'}")
   - Include one tip about their current mood ("${userInfo?.mood || 'general well-being'}")
   - Tips must be actionable with concrete steps (not vague advice like "manage your time better")
   - Example good tip for a student: "Use the Pomodoro technique — study for 25 minutes, then take a 5-minute walk outside. This resets focus and reduces eye strain."
   - Example bad tip: "Try to relax more." (too vague)

4. Include a short, friendly disclaimer

OUTPUT (STRICT JSON, nothing else):
{
  "score": ${score},
  "level": "[Translate 'Low', 'Moderate', or 'High' into ${userInfo?.language || 'English'}]",
  "analysis": {
    "summary": "[2-3 sentence personalized summary written in ${userInfo?.language || 'English'}]",
    "keyStressors": ["[Stressor 1 in ${userInfo?.language}]", "[Stressor 2 in ${userInfo?.language}]"],
    "stressLevelExplanation": "[Detailed explanation written in ${userInfo?.language || 'English'}]"
  },
  "personalizedTips": [
    {
      "title": "[Short actionable title in ${userInfo?.language || 'English'}]",
      "description": "[Detailed actionable tip in ${userInfo?.language || 'English'}]"
    }
  ],
  "disclaimer": "[Translate friendly disclaimer into ${userInfo?.language || 'English'}]"
}
`;

    try {
        const data = await retryWithBackoff(async () => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            console.log("AI Raw Response (Analysis):", text.substring(0, 300));
            const cleaned = cleanJson(text);
            const parsed = JSON.parse(cleaned);
            parsed.score = score;
            return parsed;
        });
        return data;
    } catch (error) {
        console.error("AI Service Error (Analyze Stress):", error.message);
        throw error;
    }
};
