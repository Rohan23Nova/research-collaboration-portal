// routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// Validation schemas
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['STUDENT', 'FACULTY', 'EXTERNAL', 'ADMIN']).withMessage('Invalid role'),
  body('institution').optional().trim().isLength({ max: 200 })
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', authenticateToken, authController.getMe);

// Dummy route to test Role middleware restriction (Admins only)
router.get('/admin-only', authenticateToken, requireRole('ADMIN'), (req, res) => {
  sendSuccess(res, 'You have access to this admin-only route!');
});

export default router;
