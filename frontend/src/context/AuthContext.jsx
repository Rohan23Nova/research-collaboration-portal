// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking token on load

  useEffect(() => {
    // 1. Check for token on mount
    const initAuth = async () => {
      const token = localStorage.getItem('rcp_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 2. Fetch fresh user profile
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data.user);
        }
      } catch (err) {
        // Token invalid or expired — api.js interceptor will have fired 'rcp_unauthorized'
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 3. Listen for unauthorized events from api.js
    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('rcp_token');
    };
    window.addEventListener('rcp_unauthorized', handleUnauthorized);

    return () => window.removeEventListener('rcp_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('rcp_token', res.data.data.token);
      setUser(res.data.data.user);
      return res.data.data.user;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('rcp_token', res.data.data.token);
      setUser(res.data.data.user);
      return res.data.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('rcp_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
