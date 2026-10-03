// db.js — MySQL connection pool
// We use a pool (not a single connection) so the app can handle
// multiple concurrent requests without waiting for one query to finish.
// mysql2/promise gives us async/await support out of the box.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'research_portal',

  // Keep up to 10 connections alive — good for a single-machine dev setup.
  connectionLimit: 10,

  // Wait max 10 s for a free connection before throwing an error.
  waitForConnections: true,
  queueLimit: 0,

  // Automatically parse MySQL date/datetime columns into JS Date objects.
  dateStrings: false,
});

// Test the pool on startup and log clearly so we know the DB is reachable.
export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected — database:', process.env.DB_NAME);
    conn.release(); // Always release connections back to the pool!
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    // Exit so we don't silently run with no database.
    process.exit(1);
  }
}

export default pool;
