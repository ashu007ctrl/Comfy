require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const assessmentRoutes = require('./routes/assessmentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'https://mycomfyy.netlify.app',
        'http://localhost:5173'
    ].filter(Boolean),
    credentials: true, // Allow sending cookies
}));
app.use(helmet()); // Security Headers

// Use morgan to log HTTP requests, but stream it to winston
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(cookieParser()); // Added for HTTP-only cookies

// Rate Limiting (Basic IP protection)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    skip: (req, res) => process.env.NODE_ENV === 'development',
    handler: (req, res, next, options) => {
        const error = new Error('Too many requests from this IP, please try again later.');
        error.status = 429;
        next(error);
    }
});
app.use(limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', assessmentRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/user', userRoutes);

// Health Check
app.get('/ping', (req, res) => {
    res.json({ status: "Active", timestamp: new Date() });
});

// 404 Handler
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
    logger.info(`Server running on https://comfy-o2ia.onrender.com (Port ${PORT})`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        require('mongoose').connection.close(false).then(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        require('mongoose').connection.close(false).then(() => {
            logger.info('MongoDB connection closed');
            process.exit(0);
        });
    });
});
