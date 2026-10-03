// models/request.model.js
import pool from '../config/db.js';

export default {
  // Get requests made BY a user (My Requests)
  async getRequestsByUser(userId) {
    const [rows] = await pool.query(`
      SELECT r.*, p.title as project_title, p.status as project_status, u.name as leader_name
      FROM CollaborationRequest r
      JOIN ResearchProject p ON r.project_id = p.project_id
      JOIN User u ON p.leader_id = u.user_id
      WHERE r.applicant_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    return rows;
  },

  // Get requests made TO a user (Incoming Requests for Leader)
  async getIncomingRequests(leaderId) {
    const [rows] = await pool.query(`
      SELECT r.*, p.title as project_title, 
             u.name as applicant_name, u.email as applicant_email, u.profile_image as applicant_image
      FROM CollaborationRequest r
      JOIN ResearchProject p ON r.project_id = p.project_id
      JOIN User u ON r.applicant_id = u.user_id
      WHERE p.leader_id = ? AND r.status = 'Pending'
      ORDER BY r.created_at DESC
    `, [leaderId]);
    return rows;
  },

  // Accept request (Transaction)
  async acceptRequest(requestId, leaderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Validate request and get details
      const [requests] = await connection.query(`
        SELECT r.project_id, r.applicant_id, r.status, p.title as project_title, p.leader_id 
        FROM CollaborationRequest r
        JOIN ResearchProject p ON r.project_id = p.project_id
        WHERE r.request_id = ?
      `, [requestId]);
      
      if (requests.length === 0) throw new Error('Request not found');
      
      const req = requests[0];
      if (req.leader_id !== leaderId) throw new Error('Unauthorized');
      if (req.status !== 'Pending') throw new Error('Request is not pending');

      // 2. Update request status
      await connection.query(
        "UPDATE CollaborationRequest SET status = 'Accepted', reviewed_at = NOW() WHERE request_id = ?",
        [requestId]
      );

      // 3. Add to ProjectMember
      await connection.query(`
        INSERT IGNORE INTO ProjectMember (project_id, user_id, role) 
        VALUES (?, ?, 'Member')
      `, [req.project_id, req.applicant_id]);

      // 4. Send Notification to applicant
      await connection.query(
        "INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, ?, ?, false)",
        [req.applicant_id, 'REQUEST_ACCEPTED', `Your request to join "${req.project_title}" has been accepted!`]
      );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // Reject request
  async rejectRequest(requestId, leaderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [requests] = await connection.query(`
        SELECT r.applicant_id, r.status, p.title as project_title, p.leader_id 
        FROM CollaborationRequest r
        JOIN ResearchProject p ON r.project_id = p.project_id
        WHERE r.request_id = ?
      `, [requestId]);
      
      if (requests.length === 0) throw new Error('Request not found');
      
      const req = requests[0];
      if (req.leader_id !== leaderId) throw new Error('Unauthorized');
      if (req.status !== 'Pending') throw new Error('Request is not pending');

      await connection.query(
        "UPDATE CollaborationRequest SET status = 'Rejected', reviewed_at = NOW() WHERE request_id = ?",
        [requestId]
      );

      await connection.query(
        "INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, ?, ?, false)",
        [req.applicant_id, 'REQUEST_REJECTED', `Your request to join "${req.project_title}" was declined.`]
      );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
