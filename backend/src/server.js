// server.js — Entry point
// Starts the HTTP server only after we confirm the database is reachable.
// This "fail fast" approach means we never run a server that can't talk to its DB.

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // 1. Verify DB is reachable before accepting any traffic.
  await testConnection();

  // 2. Only then bind the HTTP server.
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
