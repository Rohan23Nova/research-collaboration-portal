// controllers/notification.controller.js
import NotificationModel from '../models/notification.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMyNotifications(req, res, next) {
  try {
    const userId = req.user.user_id;
    const notifications = await NotificationModel.getUserNotifications(userId);
    const unreadCount = await NotificationModel.getUnreadCount(userId);
    
    return sendSuccess(res, 'Notifications fetched', { notifications, unreadCount });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notificationId = req.params.id;
    const userId = req.user.user_id;
    
    await NotificationModel.markAsRead(notificationId, userId);
    return sendSuccess(res, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.user_id;
    
    await NotificationModel.markAllAsRead(userId);
    return sendSuccess(res, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}
