// services/api.js — Axios instance with error normalization
import axios from 'axios';

export function extractErrorMessage(error, fallback = 'An unexpected error occurred') {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map(e => e.message || e.msg).join(', ');
  }
  if (error.message) {
    return error.message;
  }
  return fallback;
}

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
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

// Handle unauthorized/expired token globally and normalize error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Attach normalized userMessage to error
    error.userMessage = extractErrorMessage(error);

    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    
    // Check for 401 or 403 token expiration
    const isTokenExpired = 
      error.response?.status === 401 || 
      (error.response?.status === 403 && typeof error.response?.data?.message === 'string' && error.response.data.message.toLowerCase().includes('token'));

    if (isTokenExpired && !isAuthEndpoint) {
      localStorage.removeItem('rcp_token');
      window.dispatchEvent(new Event('rcp_unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default api;
