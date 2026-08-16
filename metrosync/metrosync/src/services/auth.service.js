const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Look up the admin, compare the bcrypt hash, and sign a JWT on success.
 * Never compares plain text passwords directly.
 */
async function login(email, password) {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    // Same error/status for "no such user" and "wrong password" to avoid
    // leaking which emails exist in the system.
    throw new AuthError('Invalid email or password', 401);
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new AuthError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return {
    token,
    admin: { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
  };
}

module.exports = { login, AuthError };
