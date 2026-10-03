// components/auth/RoleRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Example usage: <Route element={<RoleRoute allowedRoles={['ADMIN', 'FACULTY']} />}>
export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Ideally redirect to an unauthorized page, or just back to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
