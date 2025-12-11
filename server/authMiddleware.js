// server/authMiddleware.js

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';

  // شكل الهيدر لازم يكون: "Bearer token"
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');

    // نخزن معلومات بسيطة عن المستخدم في req.user
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
