const Assessment = require('../models/Assessment');
const aiService = require('../services/aiService');
const formatResponse = require('../utils/responseFormatter');

// Helper to check and update AI limit
const checkAiLimit = async (user, res) => {
    const today = new Date().toISOString().split('T')[0];
    if (user.aiRequestCount.date !== today) {
        user.aiRequestCount.date = today;
        user.aiRequestCount.count = 0;
    }

    // We count each full assessment (generation + analysis) as 2 requests, 
    // restrict to 100 requests (50 full assessments) for debugging
    if (user.aiRequestCount.count >= 100) {
        return false;
    }

    user.aiRequestCount.count += 1;
    await user.save();
    return true;
};

// @desc    Generate Questions
// @route   POST /api/generate-questions
// @access  Private
exports.generateQuestions = async (req, res, next) => {
    try {
        const { userInfo } = req.body;

        // AI Cost Protection
        const canProceed = await checkAiLimit(req.user, res);
        if (!canProceed) {
            return formatResponse(res, 429, 'AI generation limit reached', null, 'You have reached your daily limit for AI assessments. Please try again tomorrow.');
        }

        const data = await aiService.generateQuestions(userInfo);
        formatResponse(res, 200, 'Questions generated successfully', data);
    } catch (error) {
        console.error("Controller Error:", error.message);
        if (error.message.includes("404")) {
            return formatResponse(res, 503, 'AI Service Unavailable', null, 'AI Model not found (Check configuration)');
        }
        next(error);
    }
};

// @desc    Analyze Stress & Save Result
// @route   POST /api/analyze-stress
// @access  Private
exports.analyzeStress = async (req, res, next) => {
    try {
        const { userInfo, answers, questions } = req.body;

        // AI Cost Protection
        const canProceed = await checkAiLimit(req.user, res);
        if (!canProceed) {
            return formatResponse(res, 429, 'AI generation limit reached', null, 'You have reached your daily limit for AI assessments. Please try again tomorrow.');
        }

        // 1. Calculate Score Locally
        const vals = Object.values(answers);
        const sum = vals.reduce((acc, v) => acc + (Number(v) || 0), 0);
        const maxPossible = (questions?.length || vals.length) * 5;
        const score = Math.round((sum / maxPossible) * 100);

        // 2. Deterministic Cluster Scoring
        const clusterTracker = {
            'Work/Academic Pressure': { sum: 0, count: 0, id: 'Work' },
            'Emotional Well-being': { sum: 0, count: 0, id: 'Emotional' },
            'Physical & Sleep Health': { sum: 0, count: 0, id: 'Physical' },
            'Social & Lifestyle Balance': { sum: 0, count: 0, id: 'Social' }
        };

        questions.forEach(q => {
            const val = Number(answers[q.id]) || 0;
            if (clusterTracker[q.cluster]) {
                clusterTracker[q.cluster].sum += val;
                clusterTracker[q.cluster].count += 1;
            }
        });

        const clusterScores = { Work: 0, Emotional: 0, Physical: 0, Social: 0 };
        for (const key in clusterTracker) {
            const { sum, count, id } = clusterTracker[key];
            if (count > 0) {
                // Normalize to 0-100 scale (val is 1-5, so (avg / 5) * 100)
                const avg = sum / count;
                clusterScores[id] = Math.round((avg / 5) * 100);
            }
        }

        // 3. Get AI Analysis
        let result;
        try {
            result = await aiService.analyzeStress(userInfo, answers, questions, score);
        } catch (aiError) {
            console.warn("AI Analysis failed, using fallback:", aiError.message);

            const isHindi = userInfo?.language === 'Hindi';
            const level = score > 60 ? (isHindi ? 'उच्च' : 'High') : score > 30 ? (isHindi ? 'मध्यम' : 'Moderate') : (isHindi ? 'निम्न' : 'Low');
            const occupation = userInfo?.occupation || (isHindi ? 'आपकी दिनचर्या' : 'your daily routine');

            // Varied fallback tips pool
            const fallbackTipPool = isHindi ? [
                { title: "5-4-3-2-1 तकनीक अपनाएं", description: "जब तनाव महसूस हो, तो 5 चीजें पहचानें जो आप देख सकते हैं, 4 जिन्हें छू सकते हैं, 3 जिन्हें सुन सकते हैं, 2 जिन्हें सूंघ सकते हैं, और 1 जिसका स्वाद ले सकते हैं।" },
                { title: "छोटे ब्रेक लें", description: `एक ${occupation} के रूप में, हर 90 मिनट में 5 मिनट का ब्रेक लें। अपनी जगह से उठें और स्क्रीन से दूर देखें।` },
                { title: "गहरी सांस लें", description: "4 सेकंड के लिए सांस लें, 4 सेकंड रोकें, 4 सेकंड छोड़ें। इसे 4 बार दोहराएं। यह आपके तंत्रिका तंत्र को शांत करता है।" },
                { title: "सोने से पहले स्क्रीन बंद करें", description: "सोने से 1 घंटे पहले स्क्रीन से दूर रहें। किताबें पढ़ें या हल्का स्ट्रेचिंग करें।" },
                { title: "निर्णय लेने का तनाव कम करें", description: `एक ${occupation} के रूप में आप रोजाना कई निर्णय लेते हैं। छोटे विकल्पों (जैसे खाना, कपड़े) को सरल बनाएं ताकि मानसिक ऊर्जा बच सके।` },
            ] : [
                { title: "Try the 5-4-3-2-1 Grounding Technique", description: "When overwhelmed, name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This anchors you to the present moment." },
                { title: "Schedule Micro-Breaks", description: `As a ${occupation}, build in 5-minute breaks every 90 minutes. Stand up, stretch, and look away from screens. Small resets prevent burnout.` },
                { title: "Practice Box Breathing", description: "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat 4 times. This activates your parasympathetic nervous system." },
                { title: "Set a Wind-Down Alarm", description: "Set an alarm 1 hour before bed to start disconnecting from work and screens. Use this time for light reading or gentle stretching." },
                { title: "Limit Decision Fatigue", description: `In ${occupation}, you make many decisions daily. Simplify low-stakes choices (meals, outfits) to save mental energy for what matters.` },
            ];

            const shuffled = fallbackTipPool.sort(() => 0.5 - Math.random());
            const selectedTips = shuffled.slice(0, 4);

            result = {
                score,
                level,
                analysis: {
                    summary: isHindi ? `आपकी प्रतिक्रियाओं के आधार पर, आपका तनाव स्तर ${level} है। एक ${occupation} के रूप में, आपकी दिनचर्या इसमें योगदान दे सकती है।` : `Based on your responses, your stress level is ${level.toLowerCase()}. As a ${occupation}, your daily demands may be contributing to this.`,
                    keyStressors: score > 50 ? (isHindi ? ["दबाव", "भावनात्मक थकान"] : ["Work/Academic Pressure", "Emotional Fatigue"]) : (isHindi ? ["सामान्य तनाव"] : ["General Daily Stress"]),
                    stressLevelExplanation: isHindi ? `आपका ${score}/100 का स्कोर ${level} तनाव दर्शाता है।` : `Your score of ${score}/100 indicates ${level.toLowerCase()} stress.`
                },
                personalizedTips: selectedTips,
                disclaimer: isHindi ? "यह मूल्यांकन केवल जागरूकता के लिए है और चिकित्सा निदान नहीं है।" : "This assessment is for awareness purposes only and is not a medical diagnosis."
            };
        }

        // 4. Save to DB (Professional App Feature)
        if (require('mongoose').connection.readyState === 1 && req.user) {
            try {
                const assessment = await Assessment.create({
                    userId: req.user._id,
                    userInfo,
                    questions: questions.map(q => ({ ...q, answer: answers[q.id] })),
                    score: result.score,
                    clusterScores,
                    level: result.level,
                    analysis: result.analysis,
                    personalizedTips: result.personalizedTips
                });
                console.log("Assessment saved:", assessment._id);
            } catch (dbError) {
                console.error("DB Save Failed:", dbError.message);
            }
        }

        result.clusterScores = clusterScores; // Send back to client as well
        formatResponse(res, 200, 'Analysis completed successfully', result);

    } catch (error) {
        next(error);
    }
};

// @desc    Get History
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res, next) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            return formatResponse(res, 200, 'No DB connection', []);
        }
        // Fetch only current user's history using lean for performance
        const assessments = await Assessment.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        formatResponse(res, 200, 'History fetched successfully', assessments);
    } catch (error) {
        next(error);
    }
};
