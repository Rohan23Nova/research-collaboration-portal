// models/notification.model.js
import pool from '../config/db.js';

export default {
  async create(connection, userId, type, message) {
    const db = connection || pool;
    const [result] = await db.query(
      'INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, ?, ?, false)',
      [userId, type, message]
    );
    return result.insertId;
  },

  async getUserNotifications(userId, limit = 20) {
    const [rows] = await pool.query(
      'SELECT * FROM Notification WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return rows;
  },

  async getUnreadCount(userId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as unread_count FROM Notification WHERE user_id = ? AND is_read = false',
      [userId]
    );
    return rows[0].unread_count;
  },

  async markAsRead(notificationId, userId) {
    await pool.query(
      'UPDATE Notification SET is_read = true WHERE notification_id = ? AND user_id = ?',
      [notificationId, userId]
    );
  },

  async markAllAsRead(userId) {
    await pool.query(
      'UPDATE Notification SET is_read = true WHERE user_id = ? AND is_read = false',
      [userId]
    );
  }
};
