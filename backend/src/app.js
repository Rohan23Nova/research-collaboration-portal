// app.js — Express application factory
// We separate the app setup (app.js) from the server startup (server.js).
// This makes it easier to test the app without actually starting the server.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import healthRouter from './routes/health.js';

import authRouter from './routes/auth.routes.js';

dotenv.config();

const app = express();

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // allow cookies/auth headers
}));

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Central error handler ─────────────────────────────────────────────────
// Express identifies this as an error handler because it has 4 parameters.
// Any route that calls next(err) lands here. One place to handle all errors.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
