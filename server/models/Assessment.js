const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    userInfo: {
        age: String,
        gender: String,
        occupation: String,
        mood: String
    },
    questions: [
        {
            id: String,
            text: String,
            cluster: String,
            answer: Number // 1-5
        }
    ],
    score: Number,
    // Deterministic cluster scoring
    clusterScores: {
        Work: { type: Number, default: 0 },
        Emotional: { type: Number, default: 0 },
        Physical: { type: Number, default: 0 },
        Social: { type: Number, default: 0 }
    },
    level: {
        type: String,
        enum: ['Low', 'Moderate', 'High']
    },
    analysis: {
        summary: String,
        keyStressors: [String],
        stressLevelExplanation: String
    },
    personalizedTips: [
        {
            title: String,
            description: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for fast queries of user's latest history
assessmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
