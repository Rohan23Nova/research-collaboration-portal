// routes/request.routes.js
import { Router } from 'express';
import * as requestController from '../controllers/request.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/my-requests', requestController.getMyRequests);
router.get('/incoming', requestController.getIncomingRequests);
router.put('/:id/accept', requestController.acceptRequest);
router.put('/:id/reject', requestController.rejectRequest);

export default router;
