require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
// NOTE: Ideally getting API Key from env. 
// If not present, we will gracefully degrade or fail.
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Scoring Logic Helper
const calculateScore = (answers) => {
    // Answers is object { questionId: value }
    // Values are 0-100 based on frontend logic
    // Simple average for now
    const values = Object.values(answers);
    if (values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
    return Math.round(sum / values.length);
};

// Keep-Alive Endpoint
app.get('/ping', (req, res) => {
    res.json({ status: "Active", timestamp: new Date() });
});

app.post('/api/analyze-stress', async (req, res) => {
    try {
        const { answers } = req.body;

        // 1. Calculate Score Deterministically
        const score = calculateScore(answers);

        let level = 'Low Stress';
        if (score > 30) level = 'Moderate Stress';
        if (score > 60) level = 'High Stress';

        // 2. Generate Tips using AI
        let tips = [
            "Practice deep breathing exercises.",
            "Take short breaks during work.",
            "Ensure you get 7-8 hours of sleep."
        ]; // Default tips

        if (model) {
            try {
                const prompt = `
          Based on the following stress assessment data (Score: ${score}/100, Level: ${level}), 
          provide 4 personalized, actionable, short tips (max 10 words each) to reduce stress.
          Return ONLY a raw JSON array of strings, e.g. ["Tip 1", "Tip 2"].
          Do not include markdown formatting.
        `;

                const aiResult = await model.generateContent(prompt);
                const response = await aiResult.response;
                const text = response.text();

                // Clean markdown if present (```json ... ```)
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                if (Array.isArray(parsed)) {
                    tips = parsed;
                }
            } catch (aiError) {
                console.error("AI Generation failed:", aiError);
                // Fallback to default tips
            }
        }

        res.json({
            score,
            level,
            tips
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
