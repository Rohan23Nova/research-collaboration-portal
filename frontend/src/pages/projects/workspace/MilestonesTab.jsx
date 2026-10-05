// frontend/src/pages/projects/workspace/MilestonesTab.jsx
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import Modal from '../../../components/ui/Modal';
import { Card, CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

export default function MilestonesTab({ projectId, isLeader }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [milestones, setMilestones] = useState([]);
  const [members, setMembers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  // Milestone Modal
  const [showMModal, setShowMModal] = useState(false);
  const [mForm, setMForm] = useState({ title: '', description: '', due_date: '' });

  // Task Modal
  const [showTModal, setShowTModal] = useState(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState(null);
  const [tForm, setTForm] = useState({ title: '', description: '', due_date: '', assigned_to: '' });

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [mRes, pRes] = await Promise.all([
        api.get(`/projects/${projectId}/workspace/milestones`),
        api.get(`/projects/${projectId}`) // to get members for assignment dropdown
      ]);
      const ms = mRes.data.data.milestones;
      setMilestones(ms);
      setMembers(pRes.data.data.project.members);
      
      // Expand first milestone by default
      if (ms.length > 0) setExpanded({ [ms[0].milestone_id]: true });
    } catch (err) {
      addToast('Failed to fetch milestones', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const createMilestone = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/workspace/milestones`, mForm);
      addToast('Milestone created', 'success');
      setShowMModal(false);
      setMForm({ title: '', description: '', due_date: '' });
      fetchData();
    } catch (err) {
      addToast('Failed to create milestone', 'error');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...tForm };
      if (!payload.assigned_to) delete payload.assigned_to;
      await api.post(`/projects/${projectId}/workspace/milestones/${activeMilestoneId}/tasks`, payload);
      addToast('Task created', 'success');
      setShowTModal(false);
      setTForm({ title: '', description: '', due_date: '', assigned_to: '' });
      fetchData();
    } catch (err) {
      addToast('Failed to create task', 'error');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/projects/${projectId}/workspace/tasks/${taskId}/status`, { status: newStatus });
      addToast('Status updated', 'success');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const getStatusColor = (s) => {
    if (s === 'Completed') return 'success';
    if (s === 'In Progress') return 'primary';
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {isLeader && (
        <div className="flex justify-end">
          <Button onClick={() => setShowMModal(true)} className="gap-2"><Plus size={16}/> New Milestone</Button>
        </div>
      )}

      {milestones.length === 0 ? (
        <div className="text-center text-foreground-muted py-10 bg-surface dark:bg-[#292622] rounded-xl border-2 border-dashed border-border-muted dark:border-[#3D3934]">
          <p className="font-semibold text-foreground text-sm">No milestones defined yet</p>
          <p className="text-xs text-foreground-muted mt-1">Milestones and tasks will appear here as they are established.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map(m => (
            <Card key={m.milestone_id} className="overflow-hidden">
              <div 
                className="bg-surface-muted dark:bg-[#24211E] px-4 py-3 flex items-center justify-between cursor-pointer border-b border-transparent hover:border-border-muted transition-colors duration-150"
                onClick={() => toggleExpand(m.milestone_id)}
              >
                <div className="flex items-center gap-3">
                  {expanded[m.milestone_id] ? <ChevronDown size={20} className="text-foreground-muted" /> : <ChevronRight size={20} className="text-foreground-muted" />}
                  <div>
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                    <p className="text-xs text-foreground-muted">Due: {new Date(m.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={m.status === 'Completed' ? 'success' : 'neutral'}>{m.status}</Badge>
              </div>
              
              {expanded[m.milestone_id] && (
                <CardBody className="bg-surface dark:bg-[#292622] p-4 border-t border-border-muted dark:border-[#3D3934]">
                  <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] mb-6 leading-relaxed">{m.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Tasks</h4>
                    {isLeader && (
                      <Button variant="ghost" size="sm" onClick={() => { setActiveMilestoneId(m.milestone_id); setShowTModal(true); }}>
                        <Plus size={14} className="mr-1"/> Add Task
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {m.tasks?.map(t => {
                      const canEditStatus = isLeader || t.assigned_to === user.user_id || user.role === 'ADMIN';
                      return (
                        <div key={t.task_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-lg border border-border-muted dark:border-[#3D3934] hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-150 bg-surface-muted/30 dark:bg-[#24211E]/40">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground mb-1">{t.title}</h5>
                            <p className="text-xs text-foreground-muted line-clamp-1">{t.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            {t.assigned_to ? (
                              <div className="flex items-center gap-2" title={`Assigned to ${t.assignee_name}`}>
                                {t.profile_image ? (
                                  <img src={`/api/users/${t.assigned_to}/image`} className="w-6 h-6 rounded-full" />
                                ) : (
                                  <Avatar fallback={t.assignee_name} size="sm" className="w-6 h-6 text-[10px]" />
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-foreground-muted">Unassigned</span>
                            )}
                            
                            <div className="text-xs text-foreground-muted w-24 text-right">
                              Due {new Date(t.due_date).toLocaleDateString()}
                            </div>

                            {canEditStatus ? (
                              <Select 
                                value={t.status} 
                                onChange={(e) => updateTaskStatus(t.task_id, e.target.value)}
                                className="w-32 py-1 text-xs"
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </Select>
                            ) : (
                              <Badge variant={getStatusColor(t.status)} className="w-24 justify-center">{t.status}</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {(!m.tasks || m.tasks.length === 0) && <p className="text-xs text-foreground-muted">No tasks created yet.</p>}
                  </div>
                </CardBody>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Milestone Modal */}
      <Modal isOpen={showMModal} onClose={() => setShowMModal(false)} title="New Milestone">
        <form onSubmit={createMilestone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input required value={mForm.title} onChange={e => setMForm({...mForm, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea rows={3} value={mForm.description} onChange={e => setMForm({...mForm, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input type="date" required value={mForm.due_date} onChange={e => setMForm({...mForm, due_date: e.target.value})} />
          </div>
          <div className="flex justify-end pt-4"><Button type="submit">Create Milestone</Button></div>
        </form>
      </Modal>

      {/* Task Modal */}
      <Modal isOpen={showTModal} onClose={() => setShowTModal(false)} title="New Task">
        <form onSubmit={createTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input required value={tForm.title} onChange={e => setTForm({...tForm, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea rows={3} value={tForm.description} onChange={e => setTForm({...tForm, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <Select value={tForm.assigned_to} onChange={e => setTForm({...tForm, assigned_to: e.target.value})}>
                <option value="">Unassigned</option>
                {members.map(member => (
                  <option key={member.user_id} value={member.user_id}>{member.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input type="date" required value={tForm.due_date} onChange={e => setTForm({...tForm, due_date: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end pt-4"><Button type="submit">Create Task</Button></div>
        </form>
      </Modal>

    </div>
  );
}
