// routes/admin.routes.js
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Apply requireRole middleware universally
router.use(requireRole(['ADMIN']));

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Skill Management
router.get('/skills', adminController.getSkills);
router.post('/skills', adminController.createSkill);
router.put('/skills/:id', adminController.updateSkill);
router.delete('/skills/:id', adminController.deleteSkill);

export default router;
