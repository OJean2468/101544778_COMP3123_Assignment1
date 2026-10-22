const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user info (id, username, email) to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token.'
    });
  }
};