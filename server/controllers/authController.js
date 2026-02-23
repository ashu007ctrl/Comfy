const User = require('../models/User');
const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/responseFormatter');
const logger = require('../utils/logger');

// Generate Access Token (15 mins)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    });
};

// Generate Refresh Token (7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret', {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
};

// Helper: send response with token
const sendTokenResponse = (user, statusCode, res, message) => {
    // Create tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: true, // Always true for HTTPS, Render and Netlify use HTTPS
        sameSite: 'none' // Required for cross-site cookies (Netlify -> Render)
    };

    res
        .status(statusCode)
        .cookie('refreshToken', refreshToken, options)
        .json({
            success: true,
            message,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                accessToken
            }
        });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return formatResponse(res, 400, 'Registration failed', null, 'Email already in use');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return formatResponse(res, 400, 'Login failed', null, 'Please provide an email and password');
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return formatResponse(res, 401, 'Login failed', null, 'Invalid credentials');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return formatResponse(res, 401, 'Login failed', null, 'Invalid credentials');
        }

        sendTokenResponse(user, 200, res, 'Login successful');
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
    try {
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        formatResponse(res, 200, 'User logged out successfully', {});
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        formatResponse(res, 200, 'User fetched successfully', user);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Refresh Token
 * @route   POST /api/auth/refresh
 * @access  Public (Expects cookie with refresh token)
 */
exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return formatResponse(res, 401, 'Not authorized', null, 'No refresh token provided');
        }

        // Decode and verify
        const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
        const decoded = jwt.verify(refreshToken, secret);

        const user = await User.findById(decoded.id);

        if (!user) {
            return formatResponse(res, 401, 'Not authorized', null, 'User no longer exists');
        }

        // Issue new access token
        const newAccessToken = generateAccessToken(user._id);

        formatResponse(res, 200, 'Token refreshed', { accessToken: newAccessToken });
    } catch (err) {
        logger.error('Refresh token failed: ' + err.message);
        return formatResponse(res, 401, 'Not authorized', null, 'Invalid refresh token');
    }
};
