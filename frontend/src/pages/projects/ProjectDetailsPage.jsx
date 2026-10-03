// frontend/src/pages/projects/ProjectDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Textarea from '../../components/ui/Textarea';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { Calendar, User, Users, Tags, ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Request Modal
  const [isRequestModalOpen, setRequestModalOpen] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Delete Confirm
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setData(res.data.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load project', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setSubmittingRequest(true);
    try {
      await api.post(`/projects/${id}/requests`, { message: requestMsg });
      addToast('Request sent successfully!', 'success');
      setRequestModalOpen(false);
      fetchProject(); // Refetch to update button state
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      addToast('Project deleted', 'success');
      navigate('/projects');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete project', 'error');
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'Active': return 'success';
      case 'Planning': return 'primary';
      case 'On Hold': return 'warning';
      case 'Completed': return 'neutral';
      default: return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 lg:col-span-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { project, userConnection } = data;
  const canEdit = userConnection.isLeader || currentUser?.role === 'ADMIN';

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Back Link */}
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
              {project.research_domain}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link to={`/profile/${project.leader_id}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              {project.leader_image ? (
                <img src={`/api/users/${project.leader_id}/image`} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <Avatar fallback={project.leader_name} size="sm" className="w-6 h-6 text-xs" />
              )}
              <span className="font-medium">Led by {project.leader_name}</span>
            </Link>
            {project.deadline && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{project.members?.length || 1} Members</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {canEdit && (
            <>
              <Link to={`/projects/${id}/edit`}>
                <Button variant="secondary" className="gap-2"><Edit size={16}/> Edit</Button>
              </Link>
              <Button variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}><Trash2 size={16}/></Button>
            </>
          )}

          {/* Conditional Action Button based on UserConnection */}
          {userConnection.isLeader ? (
            <Link to={`/projects/${id}/workspace`}>
              <Button>Manage Workspace</Button>
            </Link>
          ) : userConnection.isMember ? (
            <Link to={`/projects/${id}/workspace`}>
              <Button>View Workspace</Button>
            </Link>
          ) : userConnection.hasPendingRequest ? (
            <Button disabled variant="secondary">Request Pending</Button>
          ) : (
            <Button onClick={() => setRequestModalOpen(true)}>Request to Join</Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (Description) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="text-lg font-semibold text-slate-900 dark:text-white">About the Project</h2></CardHeader>
            <CardBody>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {project.description || 'No detailed description provided for this project.'}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col (Meta, Skills, Members) */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card>
            <CardHeader><h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Tags size={18}/> Required Skills</h3></CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {project.skills?.length > 0 ? (
                  project.skills.map(skill => (
                    <Badge key={skill.skill_id} variant="neutral">{skill.skill_name}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No specific skills required.</span>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Users size={18}/> Team Members</h3></CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {project.members?.map(member => (
                  <Link key={member.user_id} to={`/profile/${member.user_id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {member.profile_image ? (
                        <img src={`/api/users/${member.user_id}/image`} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <Avatar fallback={member.name} size="sm" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>

        </div>
      </div>

      {/* Request Modal */}
      <Modal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} title="Request to Join Project">
        <form onSubmit={submitRequest} className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Send a message to the project leader explaining why you'd be a good fit. They will review your profile and skills.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message (Optional)</label>
            <Textarea 
              value={requestMsg} 
              onChange={e => setRequestMsg(e.target.value)} 
              placeholder="Hi, I am interested in this project because..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setRequestModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submittingRequest}>
              {submittingRequest ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated tasks, members, and documents will be permanently lost."
        destructive
        confirmText="Delete Project"
      />

    </div>
  );
}
