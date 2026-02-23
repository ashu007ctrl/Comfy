const rateLimit = require('express-rate-limit');
const formatResponse = require('../utils/responseFormatter');

/**
 * User-based rate limiter
 * Limits requests per authenticated user. Must be used AFTER authMiddleware (protect)
 */
const userRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Mins
    max: 200, // 200 requests per 15 mins per user
    keyGenerator: (req) => {
        // Use user ID if authenticated, else use IP
        return req.user ? req.user.id : req.ip;
    },
    validate: { xForwardedForHeader: false, default: false },
    handler: (req, res, next, options) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests',
            error: { message: 'Too many requests from this user, please try again later' }
        });
    }
});

module.exports = userRateLimiter;
