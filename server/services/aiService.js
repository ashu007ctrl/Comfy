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
            const delay = Math.pow(2, i + 1) * 1000 + Math.random() * 1000;
            console.log(`Rate limited. Retrying in ${Math.round(delay / 1000)}s (attempt ${i + 2}/${maxRetries})...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
};

// Classify occupation type for role-aware prompting
const classifyOccupation = (occupation = '') => {
    const occ = occupation.toLowerCase();
    const studentKeywords = ['student', 'college', 'university', 'school', 'pupil', 'learner', 'intern', 'phd', 'mba', 'btech', 'bsc', 'ba'];
    const professionalKeywords = ['engineer', 'developer', 'doctor', 'manager', 'teacher', 'nurse', 'analyst', 'designer', 'accountant', 'lawyer', 'consultant', 'executive', 'officer', 'employee', 'professional', 'worker', 'staff', 'architect', 'scientist'];
    const freelancerKeywords = ['freelancer', 'freelance', 'self-employed', 'contractor', 'entrepreneur', 'founder', 'business', 'owner'];

    if (studentKeywords.some(k => occ.includes(k))) return 'STUDENT';
    if (freelancerKeywords.some(k => occ.includes(k))) return 'FREELANCER';
    if (professionalKeywords.some(k => occ.includes(k))) return 'WORKING_PROFESSIONAL';
    return 'OTHER';
};

// Random session-level directives to force variety
const QUESTION_ANGLES_EN = [
    "Focus on TIME MANAGEMENT and scheduling overload",
    "Focus on DECISION FATIGUE and cognitive overload",
    "Focus on RELATIONSHIP TENSION and interpersonal friction",
    "Focus on PHYSICAL SYMPTOMS (tension, headaches, appetite changes)",
    "Focus on SELF-WORTH, perfectionism, and imposter syndrome",
    "Focus on DIGITAL OVERLOAD and notification fatigue",
    "Focus on FINANCIAL PRESSURE and resource anxiety",
    "Focus on FUTURE UNCERTAINTY and goal-related anxiety",
    "Focus on RECOVERY CAPACITY — can the user unwind and disconnect?",
    "Focus on MOTIVATION DRAIN and energy depletion",
];

const STYLE_MIXES = [
    "Mix of scenario-based ('When a deadline hits...') and reflective questions",
    "Mix of frequency ('How often...') and intensity ('How severely...') questions",
    "Mix of behavioral ('Do you find yourself...') and introspective questions",
    "Mix of past-focused ('In the last two weeks...') and present-focused questions",
    "Mix of comparison ('More than usual lately...') and absolute questions",
];

// Large fallback question pool (10 per language, shuffled each call)
const getFallbackQuestions = (userInfo) => {
    const occ = userInfo?.occupation || 'your daily routine';
    const seed = Date.now().toString(36);
    const isHindi = userInfo?.language === 'Hindi';
    const occType = classifyOccupation(occ);

    const workLabel = occType === 'STUDENT' ? 'Academic Pressure' : 'Work Pressure';

    const enPool = [
        // Work / Academic Pressure
        { cluster: "Work/Academic Pressure", text: `As a ${occ}, how often do you feel like your responsibilities pile up faster than you can realistically address them?` },
        { cluster: "Work/Academic Pressure", text: `How frequently do you find yourself mentally replaying ${occType === 'STUDENT' ? 'assignments or exam prep' : 'tasks or decisions from work'} even when you're off the clock?` },
        { cluster: "Work/Academic Pressure", text: occType === 'STUDENT'
            ? `How often does the pressure of upcoming exams or deadlines make it hard to focus on anything else?`
            : `How often does pressure from your manager, clients, or workload make you feel like you're barely keeping up?` },
        // Emotional Well-being
        { cluster: "Emotional Well-being", text: `How often do you reach the end of the day feeling emotionally drained, as if you have nothing left for yourself?` },
        { cluster: "Emotional Well-being", text: `How frequently do small setbacks or mistakes stick with you far longer than they should?` },
        { cluster: "Emotional Well-being", text: `How often do you catch yourself comparing your progress to others and feeling like you fall short?` },
        // Physical & Sleep Health
        { cluster: "Physical & Sleep Health", text: `How often do you notice physical signs of stress — neck tension, headaches, or a tight chest — during or after your ${occType === 'STUDENT' ? 'study sessions' : 'workday'}?` },
        { cluster: "Physical & Sleep Health", text: `How frequently has your sleep been disrupted, irregular, or left you feeling unrefreshed?` },
        // Social & Lifestyle Balance
        { cluster: "Social & Lifestyle Balance", text: `How often do demands from your role as a ${occ} leave you with no time or energy for hobbies or people you care about?` },
        { cluster: "Social & Lifestyle Balance", text: `How frequently do you delay replying to people close to you because you simply feel too drained?` },
        // Lifestyle & Habits
        { cluster: "Lifestyle & Habits", text: `How often do you skip meals, eat irregularly, or rely on caffeine to push through the day?` },
        { cluster: "Lifestyle & Habits", text: `How frequently do you spend most of your day sedentary — sitting for hours without any meaningful movement or break?` },
    ];

    const hiPool = [
        // कार्य / शैक्षणिक दबाव
        { cluster: "Work/Academic Pressure", text: `एक ${occ} के रूप में, आप कितनी बार महसूस करते हैं कि जिम्मेदारियां आपकी क्षमता से तेज़ी से बढ़ रही हैं?` },
        { cluster: "Work/Academic Pressure", text: `काम बंद होने के बाद भी आप कितनी बार ${occType === 'STUDENT' ? 'पढ़ाई या असाइनमेंट' : 'काम या निर्णयों'} के बारे में सोचते रहते हैं?` },
        { cluster: "Work/Academic Pressure", text: occType === 'STUDENT'
            ? `आगामी परीक्षाओं या डेडलाइन का दबाव कितनी बार आपको किसी और चीज़ पर ध्यान केंद्रित करने से रोकता है?`
            : `प्रबंधक, ग्राहकों या कार्यभार का दबाव कितनी बार आपको महसूस कराता है कि आप मुश्किल से टिक पा रहे हैं?` },
        // भावनात्मक स्वास्थ्य
        { cluster: "Emotional Well-being", text: `आप दिन के अंत में कितनी बार खुद को भावनात्मक रूप से थका हुआ महसूस करते हैं, जैसे आपके पास खुद के लिए कुछ नहीं बचा?` },
        { cluster: "Emotional Well-being", text: `छोटी गलतियां या असफलताएं आपके मन में कितनी बार ज़रूरत से ज़्यादा देर तक बनी रहती हैं?` },
        { cluster: "Emotional Well-being", text: `आप कितनी बार खुद को दूसरों से तुलना करके कम महसूस करते हैं?` },
        // शारीरिक व नींद स्वास्थ्य
        { cluster: "Physical & Sleep Health", text: `आप कितनी बार तनाव के शारीरिक संकेत महसूस करते हैं — गर्दन में तनाव, सिरदर्द, या सीने में जकड़न?` },
        { cluster: "Physical & Sleep Health", text: `आपकी नींद कितनी बार बाधित, अनियमित, या अपर्याप्त रही है?` },
        // सामाजिक व जीवनशैली संतुलन
        { cluster: "Social & Lifestyle Balance", text: `एक ${occ} होने की मांगें कितनी बार आपको अपने शौक या प्रियजनों के लिए समय नहीं दे पातीं?` },
        { cluster: "Social & Lifestyle Balance", text: `आप कितनी बार अपने करीबी लोगों के संदेशों का जवाब देने में देरी करते हैं क्योंकि आप बहुत थके होते हैं?` },
        // जीवनशैली व आदतें
        { cluster: "Lifestyle & Habits", text: `आप कितनी बार भोजन छोड़ते हैं, अनियमित खाते हैं, या दिन भर काम करने के लिए कैफीन पर निर्भर रहते हैं?` },
        { cluster: "Lifestyle & Habits", text: `आप कितनी बार बिना किसी सार्थक हलचल के घंटों बैठे रहते हैं?` },
    ];

    const pool = isHindi ? hiPool : enPool;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    return {
        questions: selected.map((q, i) => ({
            id: `${seed}_q${i + 1}`,
            cluster: q.cluster,
            text: q.text,
            minLabel: isHindi ? "कभी नहीं" : "Never",
            maxLabel: isHindi ? "बहुत अक्सर" : "Very Often"
        }))
    };
};

const cleanJson = (text) => {
    try {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON object found in response");
        let jsonStr = text.substring(firstBrace, lastBrace + 1);
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```/g, '');
        return jsonStr.trim();
    } catch (err) {
        console.error("cleanJson Error:", err.message);
        return "{}";
    }
};

// ─────────────────────────────────────────────
// GENERATE QUESTIONS  (10 questions, 5 clusters)
// ─────────────────────────────────────────────
exports.generateQuestions = async (userInfo) => {
    const model = getModel();
    if (!model) throw new Error("AI Service Unavailable: Missing API Key");

    const sessionSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().toISOString();
    const isHindi = userInfo?.language === 'Hindi';
    const occType = classifyOccupation(userInfo?.occupation);

    const randomAngle = QUESTION_ANGLES_EN[Math.floor(Math.random() * QUESTION_ANGLES_EN.length)];
    const randomStyle = STYLE_MIXES[Math.floor(Math.random() * STYLE_MIXES.length)];

    const allClusters = ["Work/Academic Pressure", "Emotional Well-being", "Physical & Sleep Health", "Social & Lifestyle Balance", "Lifestyle & Habits"];
    const shuffledClusters = [...allClusters].sort(() => 0.5 - Math.random());
    const emphasizedClusters = shuffledClusters.slice(0, 2).join(" and ");

    const moodContext = userInfo?.mood
        ? `Current mood: "${userInfo.mood}" — use as background context only, do NOT build every question around it.`
        : `No mood shared. Do NOT invent or assume one.`;

    const stressContext = userInfo?.stressContext
        ? `Primary stressor mentioned: "${userInfo.stressContext}" — weave this into at least 1–2 questions.`
        : '';

    // Role-specific coaching for the AI
    const roleGuidance = {
        STUDENT: `This user is a STUDENT. Tailor questions around:
   - Exam anxiety, assignment deadlines, study-life balance
   - Parental or societal expectations around grades/career
   - Peer comparison, competition, feeling behind
   - Loss of personal time, campus social pressure
   - Irregular sleep due to late-night studying`,
        WORKING_PROFESSIONAL: `This user is a WORKING PROFESSIONAL. Tailor questions around:
   - Manager pressure, KPIs, performance reviews
   - Meeting overload, context-switching, email fatigue
   - Job security, career growth anxiety
   - Work-from-home boundary erosion or office politics
   - Burnout, long hours, lack of recognition`,
        FREELANCER: `This user is a FREELANCER / ENTREPRENEUR. Tailor questions around:
   - Client acquisition stress, unstable income anxiety
   - Isolation from working alone, blurred work/life lines
   - Self-discipline pressure, no paid time-off
   - Financial uncertainty, managing multiple projects
   - Imposter syndrome in client pitches`,
        OTHER: `Tailor questions to the general stressors of someone in "${userInfo?.occupation || 'their daily life'}".`,
    };

    const lifestyleGuidance = userInfo?.sleepHours
        ? `The user sleeps ~${userInfo.sleepHours} hours/night. If this is low (< 7), weight sleep-related questions more.`
        : '';

    const activityGuidance = userInfo?.activityLevel
        ? `Activity level: ${userInfo.activityLevel}. For sedentary users, probe physical health impact more.`
        : '';

    const prompt = `
${SYSTEM_INSTRUCTION}

SESSION ID: ${sessionSeed} | TIME: ${timestamp}
This session is COMPLETELY UNIQUE. Do NOT reuse questions from any prior session.

INPUT — User Profile:
- Age: ${userInfo?.age || 'Not specified'}
- Gender: ${userInfo?.gender || 'Not specified'}
- Occupation: ${userInfo?.occupation || 'Not specified'} (Type: ${occType})
- Language: ${userInfo?.language || 'English'}
- ${moodContext}
${stressContext ? `- ${stressContext}` : ''}
${lifestyleGuidance ? `- ${lifestyleGuidance}` : ''}
${activityGuidance ? `- ${activityGuidance}` : ''}

SESSION DIRECTIVE (changes every session):
🎯 THEME: ${randomAngle}
📌 EMPHASIZE: ${emphasizedClusters}
✍️ STYLE: ${randomStyle}

ROLE-SPECIFIC GUIDANCE:
${roleGuidance[occType]}

YOUR TASK:
Generate EXACTLY 10 personalized stress assessment questions in ${userInfo?.language || 'English'}.

CLUSTER DISTRIBUTION (MANDATORY — exactly this many per cluster):
- "Work/Academic Pressure" → 2 questions
- "Emotional Well-being" → 2 questions
- "Physical & Sleep Health" → 2 questions
- "Social & Lifestyle Balance" → 2 questions
- "Lifestyle & Habits" → 2 questions (focus: sleep hygiene, eating patterns, physical movement, screen time, recovery rituals)

STRICT REQUIREMENTS:
1. All text in ${userInfo?.language || 'English'}. Cluster names MUST stay in English (used by backend logic).
2. Anchor every question to the user's role as a "${userInfo?.occupation || 'person'}".
3. Follow SESSION DIRECTIVE — theme and style must be visible in the questions.
4. NO generic openers: "How stressed do you feel?", "How overwhelmed are you?" — be SPECIFIC.
5. Each question must feel empathetic, conversational — a caring friend asking, not a clinician.
6. At least 3 questions must use a unique structure: scenario, comparison, behavioral, or past-focused.
7. Lifestyle & Habits questions must probe: sleep consistency, meal habits, physical movement, screen/device time, or recovery practices.

OUTPUT (STRICT JSON — no markdown, no extra text):
{
  "questions": [
    {
      "id": "q1",
      "cluster": "Cluster Name in English",
      "text": "question text in ${userInfo?.language || 'English'}",
      "minLabel": "Never in ${userInfo?.language || 'English'}",
      "maxLabel": "Very Often in ${userInfo?.language || 'English'}"
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

// ─────────────────────────────────────────────
// ANALYZE STRESS  (returns wellnessPlan too)
// ─────────────────────────────────────────────
exports.analyzeStress = async (userInfo, answers, questions, score) => {
    const model = getModel();
    if (!model) throw new Error("AI Service Unavailable");

    const sessionSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().toISOString();
    const occType = classifyOccupation(userInfo?.occupation);

    const formattedResponses = questions.map(q => {
        const answerVal = answers[q.id];
        let intensity = "low";
        if (answerVal >= 4) intensity = "high";
        else if (answerVal >= 3) intensity = "moderate";
        return `- "${q.text}" (${q.cluster}) → ${answerVal}/5 [${intensity} stress signal]`;
    }).join('\n');

    // ── Variety pools — all randomized per session to prevent repetition ──
    const TIP_STYLES = [
        "HABIT-BUILDING: each tip introduces a small daily habit the user can start TODAY (max 5 min to begin)",
        "MINDSET-SHIFT: each tip reframes HOW the user thinks about their stressor, not just what they do",
        "QUICK WIN: each tip must be doable in the NEXT 30 MINUTES for immediate stress relief",
        "ENVIRONMENTAL DESIGN: each tip changes the user's space, schedule, or setup to reduce friction",
        "RECOVERY-FOCUSED: each tip is about REST and protecting energy — not about doing more things",
        "SOCIAL & CONNECTION: at least 2 of the 5 tips involve other people, communication, or accountability",
        "BODY-FIRST: tips focus on physical actions — movement, posture, food, sleep — as direct stress levers",
    ];

    const TIP_ANGLES = [
        "Focus tips on the user's MORNING ROUTINE — how they start the day sets stress levels",
        "Focus tips on EVENING & WIND-DOWN — recovery quality is determined here",
        "Focus tips on WORK HOURS structure — how to protect time and attention during peak stress",
        "Focus tips on DIGITAL HABITS — phone, notifications, and screen time as stress amplifiers",
        "Focus tips on RELATIONSHIP & COMMUNICATION patterns that drain or restore energy",
        "Focus tips on PHYSICAL HEALTH: movement, food, sleep, hydration as direct stress regulators",
        "Focus tips on MINDFULNESS & PRESENCE — becoming less reactive in stressful moments",
    ];

    const SUMMARY_TONES = [
        "warm and empathetic — like a supportive friend who genuinely understands",
        "clear and direct — acknowledge the situation honestly without sugarcoating",
        "growth mindset — acknowledge difficulty but emphasize capacity to improve",
        "practical problem-solver — focus squarely on what IS in the user's control right now",
    ];

    // Banned themes rotate each session — forces AI away from its default tip clusters
    const BAN_POOLS = [
        ["Pomodoro", "time blocking", "to-do list", "scheduling tasks"],
        ["meditation", "mindfulness", "body scan", "deep breathing exercises"],
        ["journaling", "gratitude list", "writing feelings", "reflection diary"],
        ["sleep schedule", "bedtime routine", "digital sunset", "no-screens rule"],
        ["gym", "exercise routine", "daily walk", "stretching routine"],
    ];
    const shuffledBans = [...BAN_POOLS].sort(() => 0.5 - Math.random());
    const bannedThemes = shuffledBans.slice(0, 2).flat();

    const ALL_TECHNIQUES = [
        "Box Breathing (4-4-4-4)", "4-7-8 Breathing", "5-Minute Journaling",
        "Pomodoro Technique (25-5 blocks)", "Digital Sunset (no screens 1h before bed)",
        "Progressive Muscle Relaxation", "Cold Water Face Reset",
        "2-Minute Desk Stretch Routine", "15-Minute Nature Walk", "Gratitude Log (3 items nightly)",
        "Single-Tasking Hour (one tab, one task)", "Weekly Review (15-min Sunday planning)",
        "Worry Window (10-min scheduled worry time)", "Phone-Free Morning (30 min no phone after waking)",
        "Body Scan Meditation (5-min tension check-in)", "Power Nap Protocol (10-20 min only)",
        "Accountability Buddy (share one goal with a friend)", "No-Meeting Focus Block (daily calendar protection)",
    ];

    const tipStyle    = TIP_STYLES[Math.floor(Math.random() * TIP_STYLES.length)];
    const tipAngle    = TIP_ANGLES[Math.floor(Math.random() * TIP_ANGLES.length)];
    const summaryTone = SUMMARY_TONES[Math.floor(Math.random() * SUMMARY_TONES.length)];

    const prompt = `
${SYSTEM_INSTRUCTION}

SESSION ID: ${sessionSeed} | TIME: ${timestamp}
This session is COMPLETELY UNIQUE — generate fresh recommendations every call. Never recycle common advice from prior sessions.

INPUT — User Profile:
- Age: ${userInfo?.age || 'Not specified'}
- Gender: ${userInfo?.gender || 'Not specified'}
- Occupation: ${userInfo?.occupation || 'Not specified'} (Type: ${occType})
- Mood: ${userInfo?.mood || 'Not specified'}
- Sleep: ${userInfo?.sleepHours ? userInfo.sleepHours + ' hours/night' : 'Not specified'}
- Activity Level: ${userInfo?.activityLevel || 'Not specified'}
- Primary Stressor: ${userInfo?.stressContext || 'Not specified'}
- Language: ${userInfo?.language || 'English'}

Assessment Responses (with stress intensity):
${formattedResponses}

Calculated Stress Score: ${score}/100

SESSION DIRECTIVES (MANDATORY — enforces variety, changes every session):
🎨 TIP STYLE: ${tipStyle}
🎯 TIP ANGLE: ${tipAngle}
🗣️  SUMMARY TONE: ${summaryTone}
🚫 BANNED THEMES — DO NOT use these in ANY tip this session: ${bannedThemes.join(', ')}
   If a tip would normally use these, replace it with a completely different creative approach.

YOUR TASK:
Provide a deeply personalized stress analysis for this ${userInfo?.occupation || 'person'} (type: ${occType}).

ALL text fields MUST be in: ${userInfo?.language || 'English'}

REQUIREMENTS:
1. STRESS EVALUATION:
   - Interpret ${score}/100 in the specific context of this person's life — not generically
   - Identify which questions had the highest scores (>= 4) — these reveal the real pain points
   - Name 2-4 specific stressors grounded in HIGH-scoring answers (be precise, not generic like "work stress")

2. PERSONALIZED TIPS (exactly 5) — CRITICAL RULES:
   - STRICTLY follow the TIP STYLE directive — it defines the TYPE of tips you write this session
   - STRICTLY follow the TIP ANGLE — it defines WHERE in life the tip operates
   - ABSOLUTELY avoid BANNED THEMES — pivot to creative alternatives if you'd normally go there
   - Every tip MUST reference the user's role or specific stressor — no generic advice
   - Tips must be specific, surprising, and immediately actionable — not platitudes
   - BAD: "Try to manage your time better."
   - GOOD: "Before your next ${occType === 'STUDENT' ? 'study session' : 'workday'}, write exactly 3 tasks — not a full list. A short list creates urgency without the paralysis of too many choices."

3. WELLNESS PLAN:
   - weeklyGoals: 3 measurable goals for THIS specific week (not vague — say "walk 10 min after dinner 3 evenings" not "exercise more")
   - techniqueRecommended: the ONE technique from this list that best fits the user's highest stress cluster and lifestyle: ${ALL_TECHNIQUES.join(', ')}
   - reasonForTechnique: 1 specific sentence explaining why THIS technique for THIS user's exact situation — not generic

4. SHORT DISCLAIMER (1 friendly sentence)

OUTPUT (STRICT JSON — no markdown, no extra text):
{
  "score": ${score},
  "level": "Low OR Moderate OR High in ${userInfo?.language || 'English'}",
  "analysis": {
    "summary": "2-3 sentence personalized summary (${summaryTone}) in ${userInfo?.language || 'English'}",
    "keyStressors": ["specific stressor 1", "specific stressor 2"],
    "stressLevelExplanation": "detailed personalized explanation in ${userInfo?.language || 'English'}"
  },
  "personalizedTips": [
    {
      "title": "short specific action title in ${userInfo?.language || 'English'}",
      "description": "concrete 2-3 sentence tip in ${userInfo?.language || 'English'}"
    }
  ],
  "wellnessPlan": {
    "weeklyGoals": ["measurable goal 1 in ${userInfo?.language || 'English'}", "measurable goal 2", "measurable goal 3"],
    "techniqueRecommended": "exact technique name from the list above",
    "reasonForTechnique": "1 specific sentence in ${userInfo?.language || 'English'}"
  },
  "disclaimer": "friendly 1-sentence disclaimer in ${userInfo?.language || 'English'}"
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
