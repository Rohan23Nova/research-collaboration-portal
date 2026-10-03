// models/dashboard.model.js
import pool from '../config/db.js';

export default {
  async getStudentStats(userId) {
    const [projectCount] = await pool.query(
      'SELECT COUNT(*) as count FROM ProjectMember WHERE user_id = ?', 
      [userId]
    );
    const [pendingRequests] = await pool.query(
      'SELECT COUNT(*) as count FROM CollaborationRequest WHERE applicant_id = ? AND status = "Pending"',
      [userId]
    );
    const [upcomingTasks] = await pool.query(`
      SELECT t.task_id, t.title, t.due_date, t.status, p.title as project_title, p.project_id
      FROM Task t
      JOIN Milestone m ON t.milestone_id = m.milestone_id
      JOIN ResearchProject p ON m.project_id = p.project_id
      WHERE t.assigned_to = ? AND t.status != 'Completed'
      ORDER BY t.due_date ASC LIMIT 5
    `, [userId]);

    return {
      activeProjects: projectCount[0].count,
      pendingRequests: pendingRequests[0].count,
      upcomingTasks
    };
  },

  async getFacultyStats(userId) {
    const [ledProjects] = await pool.query(
      'SELECT COUNT(*) as count FROM ResearchProject WHERE leader_id = ? AND status != "Archived"', 
      [userId]
    );
    const [pendingIncoming] = await pool.query(`
      SELECT r.request_id, r.applicant_id, u.name as applicant_name, p.title as project_title, r.created_at
      FROM CollaborationRequest r
      JOIN ResearchProject p ON r.project_id = p.project_id
      JOIN User u ON r.applicant_id = u.user_id
      WHERE p.leader_id = ? AND r.status = 'Pending'
      ORDER BY r.created_at ASC LIMIT 5
    `, [userId]);

    const [recentReports] = await pool.query(`
      SELECT rep.report_id, rep.content, u.name as submitter_name, p.title as project_title, rep.submitted_at
      FROM ProgressReport rep
      JOIN ResearchProject p ON rep.project_id = p.project_id
      JOIN User u ON rep.submitted_by = u.user_id
      WHERE p.leader_id = ?
      ORDER BY rep.submitted_at DESC LIMIT 5
    `, [userId]);

    return {
      ledProjects: ledProjects[0].count,
      pendingRequests: pendingIncoming.length,
      pendingIncoming,
      recentReports
    };
  },

  async getAdminStats() {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM User');
    const [projects] = await pool.query('SELECT COUNT(*) as count FROM ResearchProject');
    const [skills] = await pool.query('SELECT COUNT(*) as count FROM Skill');
    
    // Union to create an activity feed
    const [activity] = await pool.query(`
      (SELECT 'New User' as type, name as detail, created_at FROM User)
      UNION ALL
      (SELECT 'New Project' as type, title as detail, created_at FROM ResearchProject)
      ORDER BY created_at DESC LIMIT 10
    `);

    return {
      totalUsers: users[0].count,
      totalProjects: projects[0].count,
      totalSkills: skills[0].count,
      recentActivity: activity
    };
  }
};
