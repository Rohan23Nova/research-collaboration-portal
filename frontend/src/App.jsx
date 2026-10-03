// App.jsx — Root component + router
// React Router v6: <Routes> matches the URL path and renders the right page.
// All context providers wrap the router so every page can access them.

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
                  
                  {/* Projects */}
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/new" element={<ProjectFormPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                  <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
                  <Route path="/projects/:id/workspace" element={<WorkspacePage />} />
                  {/* Requests */}
                  <Route path="/requests/my-requests" element={<MyRequestsPage />} />
                  <Route path="/requests/incoming" element={<IncomingRequestsPage />} />
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
