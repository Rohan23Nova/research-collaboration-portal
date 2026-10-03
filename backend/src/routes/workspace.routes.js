// routes/workspace.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import * as workspaceController from '../controllers/workspace.controller.js';
import { requireLeader } from '../middleware/project.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { uploadDocument } from '../middleware/upload.middleware.js';

// Note: mergeParams: true allows access to :projectId from the parent router
const router = Router({ mergeParams: true });

// Validations
const milestoneVal = [
  body('title').trim().notEmpty(),
  body('due_date').isISO8601()
];

const taskVal = [
  body('title').trim().notEmpty(),
  body('due_date').isISO8601(),
  body('assigned_to').optional({ nullable: true }).isInt()
];

const statusVal = [
  body('status').isIn(['To Do', 'In Progress', 'Completed'])
];

const reportVal = [
  body('content').trim().notEmpty()
];

// ── Documents ──────────────────────────────────────────────
router.get('/documents', workspaceController.getDocuments);
router.post('/documents', uploadDocument, workspaceController.uploadDocument);
router.get('/documents/:docId/download', workspaceController.downloadDocument);
router.delete('/documents/:docId', workspaceController.deleteDocument);

// ── Milestones & Tasks ─────────────────────────────────────
router.get('/milestones', workspaceController.getMilestones);
router.post('/milestones', requireLeader, milestoneVal, validateRequest, workspaceController.createMilestone);

// Tasks are linked to milestones, but created within the project context
router.post('/milestones/:milestoneId/tasks', requireLeader, taskVal, validateRequest, workspaceController.createTask);
router.put('/tasks/:taskId/status', statusVal, validateRequest, workspaceController.updateTaskStatus);

// ── Progress Reports ───────────────────────────────────────
router.get('/reports', workspaceController.getReports);
router.post('/reports', reportVal, validateRequest, workspaceController.createReport);

// ── Messages (Chat) ────────────────────────────────────────
const msgVal = [body('message').trim().notEmpty()];
router.get('/messages', workspaceController.getMessages);
router.post('/messages', msgVal, validateRequest, workspaceController.sendMessage);

export default router;
