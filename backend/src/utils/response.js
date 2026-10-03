// utils/response.js
// Standardizes API responses across the entire application.

export function sendSuccess(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res, message, statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors; // Useful for express-validator arrays
  return res.status(statusCode).json(response);
}
