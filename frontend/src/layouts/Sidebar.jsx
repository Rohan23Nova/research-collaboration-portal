// frontend/src/layouts/Sidebar.jsx
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, UserCircle, FileClock, Inbox, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'My Requests', path: '/requests/my-requests', icon: FileClock },
    { name: 'Review Requests', path: '/requests/incoming', icon: Inbox },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r-[1.5px] border-border-muted bg-surface dark:bg-[#211F1C] dark:border-[#4A443D] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar Navigation"
      >
        <div className="flex h-14 items-center border-b border-border-muted dark:border-[#4A443D] px-6">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2.5 group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#211F1C]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft shadow-xs group-hover:bg-primary group-hover:text-surface transition-colors duration-200">
              <span className="text-sm font-bold text-primary group-hover:text-surface transition-colors duration-200">R</span>
            </div>
            <span className="font-semibold tracking-tight text-foreground dark:text-[#F4EFE6] group-hover:text-primary transition-colors duration-200">
              Research Portal
            </span>
          </Link>
        </div>

        <nav className="space-y-2 p-4 flex flex-col justify-between h-[calc(100vh-3.5rem)] overflow-y-auto" aria-label="Main navigation">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#211F1C] ${
                    isActive
                      ? 'bg-primary-soft text-primary-hover border-[1.5px] border-primary-hover shadow-doodle-sm dark:bg-[#6E4634] dark:border-[#C96F3D] dark:text-[#F4EFE6]'
                      : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground border-[1.5px] border-transparent dark:text-[#B8B0A5] dark:hover:bg-[#34302B] dark:hover:text-[#F4EFE6]'
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            {user?.role === 'ADMIN' && (
              <div className="mt-6 pt-4 border-t border-border-muted dark:border-[#4A443D] space-y-1">
                <p className="px-3 text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 dark:text-[#8F887E]">
                  Administration
                </p>
                <NavLink
                  to="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#211F1C] ${isActive ? 'bg-primary-soft text-primary-hover border-[1.5px] border-primary-hover shadow-doodle-sm dark:bg-[#6E4634] dark:border-[#C96F3D] dark:text-[#F4EFE6]' : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground border-[1.5px] border-transparent dark:text-[#B8B0A5] dark:hover:bg-[#34302B] dark:hover:text-[#F4EFE6]'}`}
                >
                  <Users className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Manage Users</span>
                </NavLink>
                <NavLink
                  to="/admin/skills"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface dark:focus-visible:ring-offset-[#211F1C] ${isActive ? 'bg-primary-soft text-primary-hover border-[1.5px] border-primary-hover shadow-doodle-sm dark:bg-[#6E4634] dark:border-[#C96F3D] dark:text-[#F4EFE6]' : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground border-[1.5px] border-transparent dark:text-[#B8B0A5] dark:hover:bg-[#34302B] dark:hover:text-[#F4EFE6]'}`}
                >
                  <Award className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Manage Skills</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
