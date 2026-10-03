// models/user.model.js
// Database abstraction for the User table.

import pool from '../config/db.js';

export default {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(userId) {
    const [rows] = await pool.query(
      // Exclude password_hash from general selections
      'SELECT user_id, name, email, role, institution, bio, profile_image, created_at, updated_at FROM User WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  },

  async create(name, email, passwordHash, role, institution = null) {
    const [result] = await pool.query(
      'INSERT INTO User (name, email, password_hash, role, institution) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, role, institution]
    );
    return result.insertId;
  }
};
