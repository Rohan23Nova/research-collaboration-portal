// routes/health.js — GET /api/health
// Purpose: a quick liveness + readiness check.
//   - Liveness: is the server process running?  (you get a response at all)
//   - Readiness: can the server talk to its database?  (db_status field)
// The frontend health page polls this to show connection status visually.

import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    // Run a minimal query. If the pool is healthy, this returns [[{1:1}]].
    // We don't need the result — just confirming no error was thrown.
    await pool.query('SELECT 1');

    res.json({
      success: true,
      message: 'API is healthy',
      data: {
        server_status: 'ok',
        db_status: 'connected',
        db_name: process.env.DB_NAME || 'research_portal',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    // DB is down but server is up — still respond (don't crash), but signal the problem.
    res.status(503).json({
      success: false,
      message: 'Database unreachable',
      data: {
        server_status: 'ok',
        db_status: 'disconnected',
        error: err.message,
        timestamp: new Date().toISOString(),
      },
    });
    // Also forward to central error handler for logging.
    next(err);
  }
});

export default router;
