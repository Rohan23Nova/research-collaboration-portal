// services/notification.service.js
import api from './api';

export const notificationService = {
  async getNotifications() {
    const res = await api.get('/notifications');
    return res.data;
  },

  async markAsRead(notificationId) {
    const res = await api.put(`/notifications/${notificationId}/read`);
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.put('/notifications/mark-all-read');
    return res.data;
  }
};

export default notificationService;
