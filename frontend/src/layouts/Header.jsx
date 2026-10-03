// frontend/src/layouts/Header.jsx
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Dropdown from '../components/ui/Dropdown';
import Avatar from '../components/ui/Avatar';
import { useLocation } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

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
        <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"></span>
        </button>

        {/* User Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer pl-2">
              <Avatar size="sm" fallback={user?.name || 'U'} />
            </div>
          }
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
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
