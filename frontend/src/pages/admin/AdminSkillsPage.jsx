// frontend/src/pages/admin/AdminSkillsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { Trash2, Edit2, Check, X, Plus, Award } from 'lucide-react';

export default function AdminSkillsPage() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/skills');
      setSkills(res.data.data.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch skills');
      addToast('Failed to fetch skills', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSkill.trim() || creating) return;
    setCreating(true);
    try {
      await api.post('/admin/skills', { skill_name: newSkill.trim() });
      addToast('Skill created successfully', 'success');
      setNewSkill('');
      fetchSkills();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create skill', 'error');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.skill_id);
    setEditVal(skill.skill_name);
  };

  const saveEdit = async (id) => {
    if (!editVal.trim()) return cancelEdit();
    try {
      await api.put(`/admin/skills/${id}`, { skill_name: editVal.trim() });
      addToast('Skill updated successfully', 'success');
      setSkills(prev => prev.map(s => s.skill_id === id ? { ...s, skill_name: editVal.trim() } : s));
      cancelEdit();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update skill', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditVal('');
  };

  const confirmDelete = (skill) => {
    setSkillToDelete(skill);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/skills/${skillToDelete.skill_id}`);
      addToast('Skill deleted successfully', 'success');
      setSkills(prev => prev.filter(s => s.skill_id !== skillToDelete.skill_id));
      setConfirmOpen(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete skill', 'error');
    } finally {
      setDeleting(false);
      setSkillToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-12 sm:pb-16">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
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
      <div className="max-w-4xl mx-auto pb-12 sm:pb-16 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Skill Management</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Manage the global dictionary of skills and research domains.</p>
        </div>
        <ErrorState 
          title="Could not load skills"
          message={error}
          onRetry={fetchSkills}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 sm:pb-16 space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Skill Management</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Manage the global dictionary of skills and research domains.</p>
      </div>

      <Card className="overflow-hidden">
        <CardBody className="bg-surface-muted dark:bg-[#24211E] border-b border-border-muted dark:border-[#3D3934]">
          <form onSubmit={handleCreate} className="flex gap-3">
            <Input 
              aria-label="New skill name"
              placeholder="E.g., Quantum Computing" 
              value={newSkill} 
              onChange={e => setNewSkill(e.target.value)} 
              className="flex-1"
            />
            <Button type="submit" disabled={creating} className="gap-2 shrink-0">
              <Plus size={16} aria-hidden="true" /> {creating ? 'Adding...' : 'Add Skill'}
            </Button>
          </form>
        </CardBody>
        
        <div className="divide-y divide-border-muted dark:divide-[#3D3934]">
          {skills.map(s => (
            <div key={s.skill_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-muted/40 dark:hover:bg-[#34302B]/30 transition-colors duration-150">
              <div className="flex-1">
                {editingId === s.skill_id ? (
                  <Input 
                    autoFocus
                    aria-label={`Edit skill ${s.skill_name}`}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') saveEdit(s.skill_id); if(e.key === 'Escape') cancelEdit(); }}
                    className="max-w-md"
                  />
                ) : (
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="font-semibold text-foreground">{s.skill_name}</span>
                    <Badge variant="neutral" className="text-xs">Used by {s.user_count || 0} users</Badge>
                    <Badge variant="neutral" className="text-xs">Used in {s.project_count || 0} projects</Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-center">
                {editingId === s.skill_id ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-emerald-600 focus-visible:ring-emerald-500" onClick={() => saveEdit(s.skill_id)} aria-label="Save Edit"><Check size={18} /></Button>
                    <Button variant="ghost" size="sm" className="text-foreground-muted" onClick={cancelEdit} aria-label="Cancel Edit"><X size={18} /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(s)} aria-label={`Edit ${s.skill_name}`}><Edit2 size={16} /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 hover:bg-red-500/10 focus-visible:ring-red-500" onClick={() => confirmDelete(s)} aria-label={`Delete ${s.skill_name}`}><Trash2 size={16} /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="p-8">
              <EmptyState 
                icon={Award}
                title="No skills registered"
                description="Use the form above to add research competencies and skills to the platform."
              />
            </div>
          )}
        </div>
      </Card>

      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Global Skill"
        message={skillToDelete ? `Are you sure you want to delete "${skillToDelete.skill_name}" globally? This will remove the skill tag from all associated users and projects.` : ''}
        confirmText="Delete Skill"
        confirmVariant="destructive"
        loading={deleting}
      />
    </div>
  );
}
