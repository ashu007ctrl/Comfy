const logger = require('../utils/logger');
const formatResponse = require('../utils/responseFormatter');

/**
 * Global error handler middleware.
 * Ensures consistent error responses and logs errors appropriately.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) {
        logger.error(err.stack);
    }

    // Default to 500 server error
    const statusCode = err.status || 500;

    // Hide stack trace and detailed errors in production
    const isProduction = process.env.NODE_ENV === 'production';
    const message = err.message || 'Internal Server Error';

    // Only send string errors or safe object errors, not the full Error object footprint
    let errorDetails = isProduction ? null : err.stack;

    // Specific error handling (Mongoose validation, etc.)
    if (err.name === 'ValidationError') {
        return formatResponse(res, 400, 'Validation Error', null, err.errors);
    }

    if (err.name === 'UnauthorizedError') {
        return formatResponse(res, 401, 'Unauthorized', null, 'Invalid token or no token provided');
    }

    formatResponse(res, statusCode, message, null, errorDetails);
};

module.exports = errorHandler;
