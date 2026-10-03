// services/api.js — Axios instance
// All backend calls go through this single axios instance.
// Benefits:
//   - One place to set baseURL, timeout, headers
//   - One place to attach the JWT token from localStorage
//   - One place to handle 401 → auto logout in future phases

import axios from 'axios';

const api = axios.create({
  // In dev, Vite proxies /api → http://localhost:5000
  // In production you'd set this to the real API domain.
  baseURL: '/api',
  timeout: 10000, // fail fast after 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT if present (used from Phase 2 onward)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rcp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
