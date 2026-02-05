const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Helmet Configuration
const helmetMiddleware = helmet({
    contentSecurityPolicy: false,
});

// Global Rate Limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});

// Strict Rate Limiter (Auth/Permissions)
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // Limit each IP to 20 failed login/check attempts
    keyGenerator: (req) => req.body.email || req.ip, // Rate limit by email if provided, else IP
});

module.exports = {
    helmetMiddleware,
    globalLimiter,
    strictLimiter
};
