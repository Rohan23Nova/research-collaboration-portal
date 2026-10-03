// models/workspace.model.js
import pool from '../config/db.js';

export default {
  // ── Documents ──────────────────────────────────────────────────────────
  async getDocuments(projectId) {
    const [rows] = await pool.query(`
      SELECT d.*, u.name as uploader_name
      FROM Document d
      JOIN User u ON d.uploaded_by = u.user_id
      WHERE d.project_id = ?
      ORDER BY d.uploaded_at DESC
    `, [projectId]);
    return rows;
  },

  async addDocument(projectId, uploaderId, originalName, filePath) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Find next version number for this filename
      const [vRows] = await connection.query(
        'SELECT IFNULL(MAX(version), 0) + 1 as next_version FROM Document WHERE project_id = ? AND file_name = ?',
        [projectId, originalName]
      );
      const version = vRows[0].next_version;

      const [result] = await connection.query(`
        INSERT INTO Document (project_id, uploaded_by, file_name, file_path, version)
        VALUES (?, ?, ?, ?, ?)
      `, [projectId, uploaderId, originalName, filePath, version]);

      // Notify leader (if uploader is not leader)
      const [proj] = await connection.query('SELECT leader_id, title FROM ResearchProject WHERE project_id = ?', [projectId]);
      if (proj[0].leader_id !== uploaderId) {
        const [uploader] = await connection.query('SELECT name FROM User WHERE user_id = ?', [uploaderId]);
        await connection.query(
          "INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, 'DOCUMENT_UPLOADED', ?, false)",
          [proj[0].leader_id, `${uploader[0].name} uploaded a document to "${proj[0].title}": ${originalName}`]
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async getDocumentPath(documentId) {
    const [rows] = await pool.query('SELECT file_path, file_name, uploaded_by FROM Document WHERE document_id = ?', [documentId]);
    return rows.length > 0 ? rows[0] : null;
  },

  async deleteDocument(documentId) {
    await pool.query('DELETE FROM Document WHERE document_id = ?', [documentId]);
  },

  // ── Milestones & Tasks ──────────────────────────────────────────────────
  async getMilestones(projectId) {
    // Fetch milestones
    const [milestones] = await pool.query(`
      SELECT * FROM Milestone WHERE project_id = ? ORDER BY due_date ASC
    `, [projectId]);

    if (milestones.length === 0) return [];

    // Fetch tasks for these milestones
    const milestoneIds = milestones.map(m => m.milestone_id);
    const [tasks] = await pool.query(`
      SELECT t.*, u.name as assignee_name, u.profile_image
      FROM Task t
      LEFT JOIN User u ON t.assigned_to = u.user_id
      WHERE t.milestone_id IN (?)
      ORDER BY t.due_date ASC
    `, [milestoneIds]);

    // Group tasks into milestones
    return milestones.map(m => ({
      ...m,
      tasks: tasks.filter(t => t.milestone_id === m.milestone_id)
    }));
  },

  async addMilestone(projectId, title, description, dueDate) {
    const [result] = await pool.query(`
      INSERT INTO Milestone (project_id, title, description, due_date, status)
      VALUES (?, ?, ?, ?, 'Pending')
    `, [projectId, title, description, dueDate]);
    return result.insertId;
  },

  async addTask(milestoneId, assignedTo, title, description, dueDate) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(`
        INSERT INTO Task (milestone_id, assigned_to, title, description, due_date, status)
        VALUES (?, ?, ?, ?, ?, 'To Do')
      `, [milestoneId, assignedTo || null, title, description, dueDate]);

      // Notify assignee if someone is assigned
      if (assignedTo) {
        const [proj] = await connection.query(`
          SELECT p.title FROM ResearchProject p 
          JOIN Milestone m ON p.project_id = m.project_id 
          WHERE m.milestone_id = ?`, [milestoneId]);
          
        await connection.query(
          "INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, 'TASK_ASSIGNED', ?, false)",
          [assignedTo, `You have been assigned a new task: "${title}" in "${proj[0].title}"`]
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async updateTaskStatus(taskId, status) {
    await pool.query('UPDATE Task SET status = ? WHERE task_id = ?', [status, taskId]);
  },

  async getTask(taskId) {
    const [rows] = await pool.query('SELECT * FROM Task WHERE task_id = ?', [taskId]);
    return rows[0];
  },

  // ── Progress Reports ────────────────────────────────────────────────────
  async getReports(projectId) {
    const [rows] = await pool.query(`
      SELECT r.*, u.name as submitter_name, u.profile_image
      FROM ProgressReport r
      JOIN User u ON r.submitted_by = u.user_id
      WHERE r.project_id = ?
      ORDER BY r.submitted_at DESC
    `, [projectId]);
    return rows;
  },

  async addReport(projectId, submitterId, content) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(`
        INSERT INTO ProgressReport (project_id, submitted_by, content)
        VALUES (?, ?, ?)
      `, [projectId, submitterId, content]);

      // Notify leader if submitter is not leader
      const [proj] = await connection.query('SELECT leader_id, title FROM ResearchProject WHERE project_id = ?', [projectId]);
      if (proj[0].leader_id !== submitterId) {
        const [submitter] = await connection.query('SELECT name FROM User WHERE user_id = ?', [submitterId]);
        await connection.query(
          "INSERT INTO Notification (user_id, type, message, is_read) VALUES (?, 'NEW_REPORT', ?, false)",
          [proj[0].leader_id, `${submitter[0].name} submitted a progress report for "${proj[0].title}"`]
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // ── Messages (Chat) ─────────────────────────────────────────────────────
  async getMessages(projectId) {
    const [rows] = await pool.query(`
      SELECT m.*, u.name as sender_name, u.profile_image
      FROM Message m
      JOIN User u ON m.sender_id = u.user_id
      WHERE m.project_id = ?
      ORDER BY m.sent_at ASC
    `, [projectId]);
    return rows;
  },

  async addMessage(projectId, senderId, messageText) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(`
        INSERT INTO Message (project_id, sender_id, message)
        VALUES (?, ?, ?)
      `, [projectId, senderId, messageText]);

      // Notify other members
      const [members] = await connection.query('SELECT user_id FROM ProjectMember WHERE project_id = ? AND user_id != ?', [projectId, senderId]);
      const [sender] = await connection.query('SELECT name FROM User WHERE user_id = ?', [senderId]);
      const [proj] = await connection.query('SELECT title FROM ResearchProject WHERE project_id = ?', [projectId]);

      if (members.length > 0) {
        const notifications = members.map(m => [
          m.user_id,
          'NEW_MESSAGE',
          `${sender[0].name} sent a message in "${proj[0].title}".`,
          false
        ]);
        await connection.query(
          "INSERT INTO Notification (user_id, type, message, is_read) VALUES ?",
          [notifications]
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
