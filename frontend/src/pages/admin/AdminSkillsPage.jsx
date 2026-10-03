// frontend/src/pages/admin/AdminSkillsPage.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

export default function AdminSkillsPage() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/admin/skills');
      setSkills(res.data.data.skills);
    } catch (err) {
      addToast('Failed to fetch skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await api.post('/admin/skills', { skill_name: newSkill });
      addToast('Skill created', 'success');
      setNewSkill('');
      fetchSkills();
    } catch (err) {
      addToast('Failed to create skill', 'error');
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.skill_id);
    setEditVal(skill.skill_name);
  };

  const saveEdit = async (id) => {
    if (!editVal.trim()) return cancelEdit();
    try {
      await api.put(`/admin/skills/${id}`, { skill_name: editVal });
      addToast('Skill updated', 'success');
      setSkills(prev => prev.map(s => s.skill_id === id ? { ...s, skill_name: editVal } : s));
      cancelEdit();
    } catch (err) {
      addToast('Failed to update skill', 'error');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditVal('');
  };

  const confirmDelete = (id) => {
    setSkillToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/skills/${skillToDelete}`);
      addToast('Skill deleted', 'success');
      setSkills(prev => prev.filter(s => s.skill_id !== skillToDelete));
      setConfirmOpen(false);
    } catch (err) {
      addToast('Failed to delete skill', 'error');
    } finally {
      setDeleting(false);
      setSkillToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-20">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Management</h1>
        <p className="text-sm text-slate-500">Manage the global dictionary of skills and research domains.</p>
      </div>

      <Card>
        <CardBody className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
              placeholder="E.g., Quantum Computing" 
              value={newSkill} 
              onChange={e => setNewSkill(e.target.value)} 
              className="flex-1"
            />
            <Button type="submit" className="gap-2 shrink-0"><Plus size={18} /> Add Skill</Button>
          </form>
        </CardBody>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {skills.map(s => (
            <div key={s.skill_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                {editingId === s.skill_id ? (
                  <Input 
                    autoFocus
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') saveEdit(s.skill_id); if(e.key === 'Escape') cancelEdit(); }}
                  />
                ) : (
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="font-medium text-slate-900 dark:text-white">{s.skill_name}</span>
                    <Badge variant="neutral" className="text-xs">Used by {s.user_count} users</Badge>
                    <Badge variant="neutral" className="text-xs">Used in {s.project_count} projects</Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {editingId === s.skill_id ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-emerald-600 focus:ring-emerald-500" onClick={() => saveEdit(s.skill_id)} aria-label="Save Edit"><Check size={18} /></Button>
                    <Button variant="ghost" size="sm" className="text-slate-500 focus:ring-slate-500" onClick={cancelEdit} aria-label="Cancel Edit"><X size={18} /></Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(s)} aria-label="Edit Skill"><Edit2 size={16} /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600 focus:ring-red-500" onClick={() => confirmDelete(s.skill_id)} aria-label="Delete Skill"><Trash2 size={16} /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-center text-slate-500 py-8">No skills available.</p>}
        </div>
      </Card>

      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Global Skill"
        message="Are you sure you want to delete this skill globally? This will remove the skill tag from all associated users and projects."
        confirmText="Delete Skill"
        loading={deleting}
      />
    </div>
  );
}
