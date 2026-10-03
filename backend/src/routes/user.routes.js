// routes/user.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadProfileImage } from '../middleware/upload.middleware.js';

const router = Router();

const updateProfileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 120 }),
  body('bio').optional().trim(),
  body('institution').optional().trim().isLength({ max: 200 })
];

const addSkillValidation = [
  body('skill_name').trim().notEmpty().withMessage('Skill name is required').isLength({ max: 100 }),
  body('is_interest').isBoolean().withMessage('is_interest must be boolean')
];

// All user routes require authentication
router.use(authenticateToken);

// Profile
router.get('/:id', userController.getProfile);
router.put('/:id', updateProfileValidation, validateRequest, userController.updateProfile);

// Image
router.post('/:id/image', uploadProfileImage, userController.uploadImage);
router.get('/:id/image', userController.serveImage); // Serves the binary file

// Skills
router.post('/:id/skills', addSkillValidation, validateRequest, userController.addSkill);
router.delete('/:id/skills/:skillId', userController.removeSkill);

export default router;
