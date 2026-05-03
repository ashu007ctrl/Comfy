const express = require('express');
const router = express.Router();
const { generateQuestions, analyzeStress, getHistory } = require('../controllers/assessmentController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const userRateLimiter = require('../middlewares/rateLimiter');

// Public — anyone can take the test (optionalAuth attaches user if logged in, otherwise req.user = null)
router.post('/generate-questions', optionalAuth, userRateLimiter, generateQuestions);
router.post('/analyze-stress', optionalAuth, userRateLimiter, analyzeStress);

// Protected — only logged-in users can view saved history / dashboard trends
router.get('/history', protect, getHistory);

module.exports = router;
