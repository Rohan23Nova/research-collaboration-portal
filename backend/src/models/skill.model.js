// models/skill.model.js
import pool from '../config/db.js';

export default {
  // Search skills by name (for autocomplete)
  async search(query) {
    const [rows] = await pool.query(
      'SELECT * FROM Skill WHERE skill_name LIKE ? LIMIT 10',
      [`%${query}%`]
    );
    return rows;
  },

  // Exact match
  async findByName(name) {
    const [rows] = await pool.query(
      'SELECT * FROM Skill WHERE LOWER(skill_name) = LOWER(?)',
      [name]
    );
    return rows[0];
  },

  // Create new skill
  async create(name) {
    const [result] = await pool.query(
      'INSERT INTO Skill (skill_name) VALUES (?)',
      [name]
    );
    return result.insertId;
  },

  // Get user's skills and interests
  async getUserSkills(userId) {
    const [rows] = await pool.query(
      `SELECT S.skill_id, S.skill_name, US.is_interest 
       FROM UserSkill US 
       JOIN Skill S ON US.skill_id = S.skill_id 
       WHERE US.user_id = ?`,
      [userId]
    );
    return rows;
  },

  // Add or update a skill for a user
  async addUserSkill(userId, skillId, isInterest) {
    await pool.query(
      `INSERT INTO UserSkill (user_id, skill_id, is_interest) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE is_interest = ?`,
      [userId, skillId, isInterest, isInterest]
    );
  },

  // Remove a skill from a user
  async removeUserSkill(userId, skillId) {
    await pool.query(
      'DELETE FROM UserSkill WHERE user_id = ? AND skill_id = ?',
      [userId, skillId]
    );
  }
};
