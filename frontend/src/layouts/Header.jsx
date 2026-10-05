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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-muted dark:border-[#4A443D] bg-surface/95 dark:bg-[#24211E]/95 px-4 backdrop-blur-md sm:px-6 transition-colors duration-200">
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="p-1 rounded-md text-foreground-muted hover:text-foreground dark:text-[#B8B0A5] dark:hover:text-[#F4EFE6] hover:bg-surface-muted dark:hover:bg-[#34302B] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-150 lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex text-sm font-medium text-foreground-muted min-w-0" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 truncate">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center space-x-2 shrink-0">
                {index > 0 && <span className="text-border-muted dark:text-[#575048]" aria-hidden="true">/</span>}
                <span className={index === breadcrumbs.length - 1 ? "text-foreground dark:text-[#F4EFE6] font-semibold" : "dark:text-[#B8B0A5]"}>
                  {crumb.name}
                </span>
              </li>
            ))}
            {breadcrumbs.length === 0 && <li className="text-foreground dark:text-[#F4EFE6] font-semibold shrink-0">Home</li>}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Search UX */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted dark:text-[#B8B0A5] pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search portal"
            placeholder="Search..."
            className="h-8 w-36 md:w-48 lg:w-56 xl:w-64 rounded-md border-[1.5px] border-border-muted dark:border-[#575048] bg-surface dark:bg-[#211F1C] pl-8 pr-3 text-sm text-foreground dark:text-[#F4EFE6] placeholder:text-foreground-muted/70 dark:placeholder-[#8F887E] hover:border-foreground-muted dark:hover:border-[#8F887E] focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-1 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#24211E] transition-all duration-200"
          />
        </div>

        {/* Theme Toggle */}
        <button 
          type="button"
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 rounded-lg text-foreground-muted dark:text-[#B8B0A5] hover:text-foreground dark:hover:text-[#F4EFE6] hover:bg-surface-muted dark:hover:bg-[#34302B] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#24211E] transition-colors duration-150"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-primary" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
        </button>

        {/* Notifications */}
        <Dropdown
          align="right"
          className="w-80 max-w-[calc(100vw-2rem)] sm:w-96"
          closeOnClick={false}
          trigger={
            <button
              type="button"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              className="relative p-1.5 rounded-lg text-foreground-muted hover:text-foreground dark:text-[#B8B0A5] dark:hover:text-[#F4EFE6] hover:bg-surface-muted dark:hover:bg-[#34302B] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#24211E] transition-colors duration-150 cursor-pointer"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-surface ring-2 ring-surface dark:ring-[#24211E]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          }
        >
          <div className="w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-muted dark:border-[#3D3934] bg-surface-muted/50 dark:bg-[#211F1C]/50">
              <h3 className="font-semibold text-sm text-foreground dark:text-[#F4EFE6]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded transition-colors"
                >
                  <CheckCheck size={14}/> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border-muted/50 dark:divide-[#3D3934]/50">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-foreground-muted dark:text-[#B8B0A5]">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.notification_id}
                    className={`p-4 hover:bg-surface-muted dark:hover:bg-[#34302B] transition-colors duration-150 ${
                      !n.is_read ? 'bg-primary-soft/25 dark:bg-[#6E4634]/20' : ''
                    }`}
                  >
                    <p className={`text-xs sm:text-sm leading-relaxed break-words ${!n.is_read ? 'font-medium text-foreground dark:text-[#F4EFE6]' : 'text-foreground-muted dark:text-[#B8B0A5]'}`}>
                      {n.message}
                    </p>
                    <p className="text-[11px] text-foreground-muted/70 dark:text-[#8F887E] mt-1.5 flex items-center gap-1">
                      {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-border-muted dark:border-[#3D3934] p-2.5 text-center bg-surface-muted/30 dark:bg-[#211F1C]/30">
              <Link to="/notifications" className="text-xs sm:text-sm text-primary font-medium hover:underline inline-block py-0.5">
                View all notifications
              </Link>
            </div>
          </div>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button 
              type="button"
              aria-label={`User account options: ${user?.name || 'User'}`}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#24211E] transition-all duration-150 cursor-pointer"
            >
              {user?.profile_image ? (
                <img src={`/api/users/${user.user_id}/image`} alt={user?.name || ''} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <Avatar size="sm" fallback={user?.name || 'U'} />
              )}
            </button>
          }
        >
          <div className="px-4 py-3 border-b border-border-muted dark:border-[#3D3934]">
            <p className="text-sm font-medium text-foreground dark:text-[#F4EFE6]">{user?.name}</p>
            <p className="text-xs text-foreground-muted dark:text-[#B8B0A5] truncate">{user?.email}</p>
          </div>
          <div className="py-1 border-b border-border-muted dark:border-[#3D3934]">
            <Link to="/profile" className="block px-4 py-2 text-sm text-foreground-muted dark:text-[#B8B0A5] hover:bg-surface-muted dark:hover:bg-[#34302B] hover:text-foreground dark:hover:text-[#F4EFE6] transition-colors duration-150">
              My Profile
            </Link>
          </div>
          <div className="py-1">
            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors duration-150">
              Sign out
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
