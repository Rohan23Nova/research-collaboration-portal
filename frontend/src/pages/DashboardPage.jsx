// pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-10 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            Dashboard
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {user?.name} <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{user?.role}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Welcome, {user?.name}
          </h1>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <p className="text-slate-600 dark:text-slate-400">
              This is a protected route. You can only see this if you are logged in.
              Authentication flow (Phase 3) is working perfectly.
            </p>
            <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-950 rounded-lg text-sm text-slate-800 dark:text-slate-300 overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
