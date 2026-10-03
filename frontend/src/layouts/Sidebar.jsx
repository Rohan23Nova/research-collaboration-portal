// frontend/src/layouts/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, UserCircle, FileClock, Inbox } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'My Requests', path: '/requests/my-requests', icon: FileClock },
    { name: 'Review Requests', path: '/requests/incoming', icon: Inbox },
    { name: 'Design System', path: '/design-system', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={\`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 \${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }\`}
      >
        <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <span className="text-sm font-bold text-white">R</span>
            </div>
            <span className="font-semibold tracking-tight text-slate-900 dark:text-white">Research Portal</span>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                \`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors \${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                }\`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
