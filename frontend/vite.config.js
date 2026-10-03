// vite.config.js — Vite + React + Tailwind CSS v4 configuration
// @tailwindcss/vite is the official Tailwind v4 plugin for Vite.
// It replaces the old postcss setup — no tailwind.config.js needed.
// We also proxy /api calls to the backend so we avoid CORS in dev.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind CSS v4 — handles all CSS processing
  ],
  server: {
    port: 5173,
    // Proxy: any request from the browser starting with /api
    // gets forwarded to the Express backend at port 5000.
    // This means in dev we call fetch('/api/health') — no CORS issues.
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
