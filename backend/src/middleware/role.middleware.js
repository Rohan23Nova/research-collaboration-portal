// middleware/role.middleware.js
// Ensures the authenticated user has one of the required roles.
// MUST be used AFTER authenticateToken middleware.

import { sendError } from '../utils/response.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'User identity not found in request.', 500);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action.', 403);
    }

    next();
  };
}
