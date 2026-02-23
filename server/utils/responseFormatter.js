/**
 * Standardized API response formatter.
 * Ensures all API responses have a consistent structure.
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable message
 * @param {Object|Array|null} data - The payload
 * @param {Object|string|null} error - Error details or string
 */
const formatResponse = (res, statusCode, message, data = null, error = null) => {
    const success = statusCode >= 200 && statusCode < 300;

    return res.status(statusCode).json({
        success,
        message,
        data,
        error: error ? (typeof error === 'string' ? { message: error } : error) : null,
        timestamp: new Date().toISOString()
    });
};

module.exports = formatResponse;
