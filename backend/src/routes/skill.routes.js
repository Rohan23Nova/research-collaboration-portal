// routes/skill.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as skillController from '../controllers/skill.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

const createSkillValidation = [
  body('skill_name').trim().notEmpty().withMessage('Skill name is required').isLength({ max: 100 })
];

router.use(authenticateToken);

// GET /api/skills?q=search
router.get('/', skillController.searchSkills);

// Explicit skill creation (Admin only)
router.post('/', requireRole('ADMIN'), createSkillValidation, validateRequest, skillController.createSkill);

export default router;
