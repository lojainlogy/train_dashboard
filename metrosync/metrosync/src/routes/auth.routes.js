const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');
const { loginValidators } = require('../middleware/validators');
const { loginRateLimiter } = require('../middleware/rateLimiter');

// POST /api/v1/auth/login - public, rate limited, validated before any DB/auth logic
router.post('/login', loginRateLimiter, loginValidators, login);

module.exports = router;
