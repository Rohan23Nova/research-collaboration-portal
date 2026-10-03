// routes/notification.routes.js
import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/', notificationController.getMyNotifications);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

export default router;
