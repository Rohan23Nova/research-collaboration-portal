// models/project.model.js
import pool from '../config/db.js';

export default {
  // Discovery: Find all projects with filters and pagination
  async findAll({ search, domain, status, skillId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const params = [];
    
    let query = `
      SELECT p.*, u.name AS leader_name, u.profile_image AS leader_image
      FROM ResearchProject p
      JOIN User u ON p.leader_id = u.user_id
      WHERE 1=1
    `;
    
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM ResearchProject p
      WHERE 1=1
    `;
    const countParams = [];

    // Apply filters
    if (search) {
      const searchStr = `%${search}%`;
      query += ' AND p.title LIKE ?';
      countQuery += ' AND p.title LIKE ?';
      params.push(searchStr);
      countParams.push(searchStr);
    }
    
    if (domain) {
      query += ' AND p.research_domain = ?';
      countQuery += ' AND p.research_domain = ?';
      params.push(domain);
      countParams.push(domain);
    }
    
    if (status) {
      query += ' AND p.status = ?';
      countQuery += ' AND p.status = ?';
      params.push(status);
      countParams.push(status);
    }
    
    if (skillId) {
      const skillFilter = ' AND p.project_id IN (SELECT project_id FROM ProjectSkill WHERE skill_id = ?)';
      query += skillFilter;
      countQuery += skillFilter;
      params.push(skillId);
      countParams.push(skillId);
    }

    // Pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    // Fetch skills for these projects to display as badges
    if (rows.length > 0) {
      const projectIds = rows.map(r => r.project_id);
      const [skills] = await pool.query(`
        SELECT ps.project_id, s.skill_id, s.skill_name 
        FROM ProjectSkill ps 
        JOIN Skill s ON ps.skill_id = s.skill_id 
        WHERE ps.project_id IN (?)
      `, [projectIds]);
      
      // Attach skills to projects
      rows.forEach(proj => {
        proj.skills = skills.filter(s => s.project_id === proj.project_id);
      });
    }

    return {
      projects: rows,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    };
  },

  // Get single project details
  async findById(projectId) {
    const [rows] = await pool.query(`
      SELECT p.*, u.name AS leader_name, u.email AS leader_email, u.profile_image AS leader_image
      FROM ResearchProject p
      JOIN User u ON p.leader_id = u.user_id
      WHERE p.project_id = ?
    `, [projectId]);
    
    if (rows.length === 0) return null;
    const project = rows[0];

    // Fetch skills
    const [skills] = await pool.query(`
      SELECT s.skill_id, s.skill_name 
      FROM ProjectSkill ps 
      JOIN Skill s ON ps.skill_id = s.skill_id 
      WHERE ps.project_id = ?
    `, [projectId]);
    project.skills = skills;

    // Fetch active members (including leader implicitly via seeding/logic)
    const [members] = await pool.query(`
      SELECT m.user_id, m.role, m.joined_at, u.name, u.profile_image
      FROM ProjectMember m
      JOIN User u ON m.user_id = u.user_id
      WHERE m.project_id = ?
      ORDER BY m.joined_at ASC
    `, [projectId]);
    project.members = members;

    return project;
  },

  // Get user's relationship to the project (for button state)
  async getUserConnection(projectId, userId) {
    const [leaderCheck] = await pool.query('SELECT leader_id FROM ResearchProject WHERE project_id = ?', [projectId]);
    const isLeader = leaderCheck[0]?.leader_id === userId;

    const [memberCheck] = await pool.query('SELECT 1 FROM ProjectMember WHERE project_id = ? AND user_id = ?', [projectId, userId]);
    const isMember = memberCheck.length > 0;

    const [requestCheck] = await pool.query('SELECT status FROM CollaborationRequest WHERE project_id = ? AND applicant_id = ? ORDER BY created_at DESC LIMIT 1', [projectId, userId]);
    
    // If they have a request, what is its status?
    const requestStatus = requestCheck.length > 0 ? requestCheck[0].status : null;
    const hasPendingRequest = requestStatus === 'Pending';

    return {
      isLeader,
      isMember,
      hasPendingRequest,
      requestStatus
    };
  },

  // Create project within a transaction to handle skills
  async create(projectData, skillIds, leaderId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(`
        INSERT INTO ResearchProject (title, description, research_domain, status, deadline, leader_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        projectData.title,
        projectData.description || null,
        projectData.research_domain,
        projectData.status || 'Planning',
        projectData.deadline || null,
        leaderId
      ]);
      
      const projectId = result.insertId;

      // Also add leader to ProjectMember table
      await connection.query(`
        INSERT INTO ProjectMember (project_id, user_id, role) VALUES (?, ?, 'Leader')
      `, [projectId, leaderId]);

      // Add required skills
      if (skillIds && skillIds.length > 0) {
        const skillValues = skillIds.map(id => [projectId, id]);
        await connection.query(`
          INSERT INTO ProjectSkill (project_id, skill_id) VALUES ?
        `, [skillValues]);
      }

      await connection.commit();
      return projectId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // Update project
  async update(projectId, projectData, skillIds) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(`
        UPDATE ResearchProject 
        SET title = ?, description = ?, research_domain = ?, status = ?, deadline = ?
        WHERE project_id = ?
      `, [
        projectData.title,
        projectData.description || null,
        projectData.research_domain,
        projectData.status,
        projectData.deadline || null,
        projectId
      ]);
      
      // Update skills (delete old, insert new)
      await connection.query('DELETE FROM ProjectSkill WHERE project_id = ?', [projectId]);
      if (skillIds && skillIds.length > 0) {
        const skillValues = skillIds.map(id => [projectId, id]);
        await connection.query(`
          INSERT INTO ProjectSkill (project_id, skill_id) VALUES ?
        `, [skillValues]);
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // Delete project
  async delete(projectId) {
    // ON DELETE CASCADE will handle child records (ProjectMember, Document, Task, Message, etc.)
    await pool.query('DELETE FROM ResearchProject WHERE project_id = ?', [projectId]);
  },

  // Submit a collaboration request
  async submitRequest(projectId, userId, message) {
    const [result] = await pool.query(`
      INSERT INTO CollaborationRequest (project_id, applicant_id, message, status)
      VALUES (?, ?, ?, 'Pending')
    `, [projectId, userId, message || null]);
    return result.insertId;
  },

  // For frontend filter dropdowns
  async getUniqueDomains() {
    const [rows] = await pool.query('SELECT DISTINCT research_domain FROM ResearchProject ORDER BY research_domain');
    return rows.map(r => r.research_domain);
  }
};
