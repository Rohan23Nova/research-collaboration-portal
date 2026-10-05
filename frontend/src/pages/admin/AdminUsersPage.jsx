// frontend/src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { Trash2, Users } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      addToast('Role updated successfully', 'success');
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  const confirmDelete = (u) => {
    setUserToDelete(u);
    setConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${userToDelete.user_id}`);
      addToast('User deleted successfully', 'success');
      setUsers(prev => prev.filter(u => u.user_id !== userToDelete.user_id));
      setConfirmOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 pb-12 sm:pb-16">
        <div>
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto pb-12 sm:pb-16 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">User Management</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">View and manage user roles across the platform.</p>
        </div>
        <ErrorState 
          title="Could not load users"
          message={error}
          onRetry={fetchUsers}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 sm:pb-16">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">User Management</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">View and manage user roles across the platform.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-surface-muted dark:bg-[#24211E] border-b border-border-muted dark:border-[#3D3934] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 font-semibold text-foreground">Institution</th>
                <th className="px-6 py-4 font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted dark:divide-[#3D3934]">
              {users.map(u => (
                <tr key={u.user_id} className="hover:bg-surface-muted/60 dark:hover:bg-[#34302B]/50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-foreground">{u.name}</td>
                  <td className="px-6 py-4 text-foreground-muted">{u.email}</td>
                  <td className="px-6 py-4 text-foreground-muted">{u.institution || '—'}</td>
                  <td className="px-6 py-4">
                    <Select 
                      aria-label={`Change role for ${u.name}`}
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                      disabled={u.user_id === user.user_id}
                      className="py-1 min-w-[120px] text-xs"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="EXTERNAL">External</option>
                      <option value="ADMIN">Admin</option>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      className="text-red-600 dark:text-red-400 hover:bg-red-500/10 focus-visible:ring-red-500" 
                      onClick={() => confirmDelete(u)}
                      disabled={u.user_id === user.user_id}
                      aria-label={`Delete user ${u.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12">
                    <EmptyState 
                      icon={Users}
                      title="No users found"
                      description="No user records exist in the database."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={userToDelete ? `Are you sure you want to delete ${userToDelete.name} (${userToDelete.email})? This action cannot be undone and will cascade to their data.` : ''}
        confirmText="Delete User"
        confirmVariant="destructive"
        loading={deleting}
      />
    </div>
  );
}
