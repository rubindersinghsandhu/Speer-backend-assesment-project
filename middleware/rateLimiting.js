// middleware/rateLimiting.js
const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 1 * 1000, // 1 sec
    max: 10, // max 10 requests per secs
    message: 'Too many requests from this IP, please try again later.'
  });

module.exports = limiter;

