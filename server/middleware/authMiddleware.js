const jwt = require('jsonwebtoken');

/**
 * AUTH MIDDLEWARE
 * Protects private routes by verifying the JWT token from the Authorization header.
 * If valid, it attaches the user ID to the request object.
 */
exports.protect = (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (Format: "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Verify token integrity
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to request for downstream controllers
      req.user = { id: decoded.id };

      // Proceed to the next middleware/controller
      return next(); 
      
    } catch (error) {
      // Token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 2. Handle missing token case
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};