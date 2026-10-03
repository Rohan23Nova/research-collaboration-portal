// frontend/src/layouts/Header.jsx
import { Menu, Bell, Search, Sun, Moon, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Dropdown from '../components/ui/Dropdown';
import Avatar from '../components/ui/Avatar';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, location.pathname]); // Refresh when navigating

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  // Simple breadcrumb generator from URL
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbs = pathnames.map((value, index) => {
    return {
      name: value.charAt(0).toUpperCase() + value.slice(1),
      path: '/' + pathnames.slice(0, index + 1).join('/')
    };
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex text-sm font-medium text-slate-500 dark:text-slate-400">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center space-x-2">
                {index > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                <span className={index === breadcrumbs.length - 1 ? "text-slate-900 dark:text-slate-100" : ""}>
                  {crumb.name}
                </span>
              </li>
            ))}
            {breadcrumbs.length === 0 && <li className="text-slate-900 dark:text-slate-100">Home</li>}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-64 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
          />
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <Dropdown
          align="right"
          trigger={
            <div className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer pt-1">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          }
        >
          <div className="w-80">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  <CheckCheck size={14}/> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.notification_id} className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.is_read ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                    <p className={`text-sm ${!n.is_read ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 p-2 text-center">
              <Link to="/notifications" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                View all notifications
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer pl-2">
              {user?.profile_image ? (
                <img src={\`/api/users/\${user.user_id}/image\`} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <Avatar size="sm" fallback={user?.name || 'U'} />
              )}
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
          <div className="py-1 border-b border-slate-100 dark:border-slate-800">
            <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              My Profile
            </Link>
          </div>
          <div className="py-1">
            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              Sign out
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
