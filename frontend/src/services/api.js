// services/api.js — Axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rcp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid/expired
    if (error.response && error.response.status === 401) {
      // Don't auto-logout if we're explicitly trying to login/register (they return 401 for bad creds)
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('rcp_token');
        // Dispatch a custom event that AuthContext will listen to
        window.dispatchEvent(new Event('rcp_unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
