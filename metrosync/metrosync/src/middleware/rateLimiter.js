const rateLimit = require('express-rate-limit');

// Guards the login route against brute-force / abuse.
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

module.exports = { loginRateLimiter };
