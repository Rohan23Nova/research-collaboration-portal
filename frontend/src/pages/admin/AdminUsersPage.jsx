// frontend/src/pages/admin/AdminUsersPage.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.users);
    } catch (err) {
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      addToast('Role updated successfully', 'success');
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      addToast('User deleted', 'success');
      setUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500">View and manage platform users and their roles.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Name</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Email</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Institution</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Role</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.institution || '-'}</td>
                  <td className="px-6 py-4">
                    <Select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                      disabled={u.user_id === user.user_id}
                      className="py-1 min-w-[120px]"
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
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
                      onClick={() => handleDeleteUser(u.user_id)}
                      disabled={u.user_id === user.user_id}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
