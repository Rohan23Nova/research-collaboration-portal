// middleware/validate.middleware.js
// Wraps express-validator to automatically return 400 Bad Request
// if validation rules (defined in routes) fail.

import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors nicely: { field: "message" }
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return sendError(res, 'Validation failed', 400, formattedErrors);
  }
  next();
}
