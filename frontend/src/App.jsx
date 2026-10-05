// App.jsx — Root component + router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HealthPage from './pages/HealthPage';

// Layout & Protected components
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import DesignSystemPage from './pages/DesignSystemPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
import ProjectFormPage from './pages/projects/ProjectFormPage';
import WorkspacePage from './pages/projects/WorkspacePage';
import MyRequestsPage from './pages/requests/MyRequestsPage';
import IncomingRequestsPage from './pages/requests/IncomingRequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/health" element={<HealthPage />} />
              
              {/* Protected Routes (App Shell) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/design-system" element={<DesignSystemPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  
                  {/* Projects */}
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/new" element={<ProjectFormPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
                  <Route path="/projects/:id/workspace" element={<WorkspacePage />} />
                  
                  {/* Requests */}
                  <Route path="/requests" element={<Navigate to="/requests/my-requests" replace />} />
                  <Route path="/requests/my" element={<Navigate to="/requests/my-requests" replace />} />
                  <Route path="/requests/my-requests" element={<MyRequestsPage />} />
                  <Route path="/requests/incoming" element={<IncomingRequestsPage />} />
                  <Route path="/review-requests" element={<Navigate to="/requests/incoming" replace />} />

                  {/* Admin Only */}
                  <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/skills" element={<AdminSkillsPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
