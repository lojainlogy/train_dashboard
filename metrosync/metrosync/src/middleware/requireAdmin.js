const jwt = require('jsonwebtoken');

/**
 * Reads the Bearer token from the Authorization header, verifies its
 * signature, and confirms the payload has an admin role before allowing
 * the request through. Attaches the decoded payload to req.admin.
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Missing or malformed Authorization header' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  if (payload.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin privileges required' });
  }

  req.admin = payload;
  next();
}

module.exports = requireAdmin;
