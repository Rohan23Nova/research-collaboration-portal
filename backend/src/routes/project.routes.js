// routes/project.routes.js
import { Router } from 'express';
import { body, query } from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Validation Rules
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('skill_id').optional().isInt().toInt()
];

const projectFormValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('research_domain').trim().notEmpty().withMessage('Research domain is required').isLength({ max: 150 }),
  body('status').optional().isIn(['Planning', 'Active', 'On Hold', 'Completed', 'Archived']),
  body('deadline').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid date format'),
  body('skill_ids').optional().isArray().withMessage('skill_ids must be an array of integers')
];

const joinRequestValidation = [
  body('message').optional().trim().isLength({ max: 1000 })
];

// All project routes require authentication
router.use(authenticateToken);

// Domains utility for UI filters
router.get('/domains', projectController.getDomains);

// Standard CRUD
router.get('/', paginationValidation, validateRequest, projectController.getProjects);
router.get('/:id', projectController.getProjectDetails);
router.post('/', projectFormValidation, validateRequest, projectController.createProject);
router.put('/:id', projectFormValidation, validateRequest, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Collaboration Request
router.post('/:id/requests', joinRequestValidation, validateRequest, projectController.requestToJoin);

export default router;
