const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const { token, admin } = await authService.login(email, password);

    res.status(200).json({ success: true, token, admin });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
