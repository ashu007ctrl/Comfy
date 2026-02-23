const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    refreshToken
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Stricter rate limiting for auth routes (10 requests per 10 minutes)
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, // Increased to 100 for intense dev testing
    skip: (req, res) => process.env.NODE_ENV === 'development',
    message: { success: false, message: 'Too many auth requests from this IP, please try again after 10 minutes' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

module.exports = router;
