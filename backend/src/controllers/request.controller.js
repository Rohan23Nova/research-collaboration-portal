// controllers/request.controller.js
import RequestModel from '../models/request.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMyRequests(req, res, next) {
  try {
    const userId = req.user.user_id;
    const requests = await RequestModel.getRequestsByUser(userId);
    return sendSuccess(res, 'Sent requests fetched', { requests });
  } catch (err) {
    next(err);
  }
}

export async function getIncomingRequests(req, res, next) {
  try {
    const leaderId = req.user.user_id;
    const requests = await RequestModel.getIncomingRequests(leaderId);
    return sendSuccess(res, 'Incoming requests fetched', { requests });
  } catch (err) {
    next(err);
  }
}

export async function acceptRequest(req, res, next) {
  try {
    const requestId = req.params.id;
    const leaderId = req.user.user_id;
    
    await RequestModel.acceptRequest(requestId, leaderId);
    return sendSuccess(res, 'Request accepted successfully');
  } catch (err) {
    if (err.message === 'Unauthorized') return sendError(res, 'Unauthorized', 403);
    if (err.message === 'Request not found') return sendError(res, 'Request not found', 404);
    if (err.message === 'Request is not pending') return sendError(res, 'Request is already processed', 400);
    next(err);
  }
}

export async function rejectRequest(req, res, next) {
  try {
    const requestId = req.params.id;
    const leaderId = req.user.user_id;
    
    await RequestModel.rejectRequest(requestId, leaderId);
    return sendSuccess(res, 'Request rejected successfully');
  } catch (err) {
    if (err.message === 'Unauthorized') return sendError(res, 'Unauthorized', 403);
    if (err.message === 'Request not found') return sendError(res, 'Request not found', 404);
    if (err.message === 'Request is not pending') return sendError(res, 'Request is already processed', 400);
    next(err);
  }
}
