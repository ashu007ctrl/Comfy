const express = require('express');
const router = express.Router();
const { generateQuestions, analyzeStress, getHistory } = require('../controllers/assessmentController');
const { protect } = require('../middlewares/authMiddleware');
const userRateLimiter = require('../middlewares/rateLimiter');

router.post('/generate-questions', protect, userRateLimiter, generateQuestions);
router.post('/analyze-stress', protect, userRateLimiter, analyzeStress);
router.get('/history', protect, getHistory);

module.exports = router;
