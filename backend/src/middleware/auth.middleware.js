// middleware/auth.middleware.js
// Verifies the JWT token and attaches the user payload to req.user

import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return sendError(res, 'Access denied. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, role, iat, exp }
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token.', 403);
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, `Access denied. Requires one of: ${allowedRoles.join(', ')}`, 403);
    }
    next();
  };
}
