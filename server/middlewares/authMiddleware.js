const jwt = require('jsonwebtoken');
const User = require('../models/User');
const formatResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * Protect routes
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        // Fallback for cookie-based access token if used anywhere
        token = req.cookies.token;
    }

    if (!token) {
        return formatResponse(res, 401, 'Not authorized to access this route', null, 'No token provided');
    }

    try {
        // Verify token (Make sure JWT_SECRET is set in .env)
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
        const decoded = jwt.verify(token, secret);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return formatResponse(res, 401, 'Not authorized to access this route', null, 'User no longer exists');
        }

        next();
    } catch (err) {
        logger.error('Token verification failed: ' + err.message);
        return formatResponse(res, 401, 'Not authorized to access this route', null, err.message);
    }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return formatResponse(res, 403, 'User role is not authorized to access this route', null, `Role ${req.user.role} restricted`);
        }
        next();
    };
};
