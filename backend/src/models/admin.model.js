// models/admin.model.js
import pool from '../config/db.js';

export default {
  async getAllUsers() {
    const [rows] = await pool.query('SELECT user_id, name, email, role, institution, created_at FROM User ORDER BY created_at DESC');
    return rows;
  },

  async updateUserRole(userId, newRole) {
    await pool.query('UPDATE User SET role = ? WHERE user_id = ?', [newRole, userId]);
  },

  async deleteUser(userId) {
    // MySQL ON DELETE CASCADE handles most relations if properly set up, 
    // but some manual cleanup might be needed if foreign keys lack cascades.
    // For this B.Tech scope, we assume cascading.
    await pool.query('DELETE FROM User WHERE user_id = ?', [userId]);
  },

  async getAllSkills() {
    const [rows] = await pool.query(`
      SELECT s.*, 
        (SELECT COUNT(*) FROM UserSkill us WHERE us.skill_id = s.skill_id) as user_count,
        (SELECT COUNT(*) FROM ProjectSkill ps WHERE ps.skill_id = s.skill_id) as project_count
      FROM Skill s
      ORDER BY s.skill_name ASC
    `);
    return rows;
  },

  async createSkill(name) {
    const [res] = await pool.query('INSERT IGNORE INTO Skill (skill_name) VALUES (?)', [name]);
    return res.insertId;
  },

  async updateSkill(skillId, newName) {
    await pool.query('UPDATE Skill SET skill_name = ? WHERE skill_id = ?', [newName, skillId]);
  },

  async deleteSkill(skillId) {
    await pool.query('DELETE FROM Skill WHERE skill_id = ?', [skillId]);
  }
};
