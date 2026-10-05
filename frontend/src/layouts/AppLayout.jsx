import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import EditorialBackground from '../components/ui/EditorialBackground';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  let variant = 'dashboard';
  if (location.pathname.includes('/projects/')) {
    if (location.pathname.includes('/workspace')) variant = 'workspace';
    else variant = 'details';
  } else if (location.pathname.startsWith('/projects')) {
    variant = 'projects';
  } else if (location.pathname.startsWith('/requests/incoming')) {
    variant = 'review-requests';
  } else if (location.pathname.startsWith('/requests')) {
    variant = 'my-requests';
  } else if (location.pathname.startsWith('/profile')) {
    variant = 'profile';
  } else if (location.pathname.startsWith('/documents')) {
    variant = 'documents';
  } else if (location.pathname.startsWith('/admin')) {
    variant = 'admin';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background relative z-0">
      <EditorialBackground variant={variant} />
      
      {/* Sidebar (left) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area (right) */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden relative z-10">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-6 xl:p-8">
          <div className="mx-auto max-w-[1400px] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
