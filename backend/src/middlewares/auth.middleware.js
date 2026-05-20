/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user payload to `req.user` on success.
 */

import { verifyToken } from '../services/auth.service.js';

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" format
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach decoded user data to request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

export default authMiddleware;
