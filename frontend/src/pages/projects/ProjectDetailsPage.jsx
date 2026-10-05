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
import { Calendar, Users, Tags, ArrowLeft, Edit, Trash2 } from 'lucide-react';

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
  const [deleting, setDeleting] = useState(false);

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
      setRequestMsg('');
      fetchProject(); // Refetch to update button state
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send request', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const deleteProject = async () => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      addToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
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
      <div className="max-w-5xl mx-auto space-y-6 pb-12 sm:pb-16">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-3/4 rounded" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { project, userConnection } = data;
  const canEdit = userConnection.isLeader || currentUser?.role === 'ADMIN';

  return (
    <div className="max-w-5xl mx-auto pb-12 sm:pb-16">
      
      {/* Back Link */}
      <Link 
        to="/projects" 
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground dark:text-foreground-muted dark:hover:text-[#F4EFE6] mb-6 transition-colors duration-150 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Projects
      </Link>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant={getStatusColor(project.status)} className="shrink-0">{project.status}</Badge>
            <span className="text-sm font-semibold text-primary bg-primary-soft dark:bg-[#6E4634]/40 px-2.5 py-0.5 rounded-md truncate max-w-[200px]">
              {project.research_domain}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-serif text-foreground mb-4 leading-tight break-words">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
            <Link to={`/profile/${project.leader_id}`} className="flex items-center gap-2 hover:text-primary transition-colors duration-150 rounded focus:outline-none focus-visible:underline">
              <Avatar 
                src={project.leader_image ? `/api/users/${project.leader_id}/image` : null} 
                fallback={project.leader_name} 
                size="sm" 
                className="w-6 h-6 text-xs" 
              />
              <span className="font-medium text-foreground">Led by {project.leader_name}</span>
            </Link>
            {project.deadline && (
              <div className="flex items-center gap-2">
                <Calendar size={16} aria-hidden="true" />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users size={16} aria-hidden="true" />
              <span>{project.members?.length || 1} Members</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {canEdit && (
            <>
              <Link to={`/projects/${id}/edit`}>
                <Button variant="secondary" className="gap-2">
                  <Edit size={16} aria-hidden="true" /> Edit
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                className="gap-2" 
                onClick={() => setDeleteOpen(true)}
                aria-label="Delete project"
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
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
            <CardHeader><h2 className="text-lg font-semibold text-foreground">About the Project</h2></CardHeader>
            <CardBody>
              <div className="prose prose-slate dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                {project.description || 'No detailed description provided for this project.'}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col (Meta, Skills, Members) */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card>
            <CardHeader><h3 className="font-semibold text-foreground flex items-center gap-2"><Tags size={18} aria-hidden="true"/> Required Skills</h3></CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {project.skills?.length > 0 ? (
                  project.skills.map(skill => (
                    <Badge key={skill.skill_id} variant="neutral">{skill.skill_name}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-foreground-muted">No specific skills required.</span>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="font-semibold text-foreground flex items-center gap-2"><Users size={18} aria-hidden="true"/> Team Members</h3></CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-border-muted dark:divide-[#3D3934]">
                {project.members?.map(member => (
                  <Link 
                    key={member.user_id} 
                    to={`/profile/${member.user_id}`} 
                    className="flex items-center justify-between p-4 hover:bg-surface-muted dark:hover:bg-[#34302B] transition-colors duration-150 focus:outline-none focus-visible:bg-surface-muted"
                  >
                    <div className="flex items-center gap-3">
                      {member.profile_image ? (
                        <img src={`/api/users/${member.user_id}/image`} alt="" className="w-8 h-8 rounded-full object-cover border border-border-muted" />
                      ) : (
                        <Avatar fallback={member.name} size="sm" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-foreground-muted">{member.role}</p>
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
          <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] leading-relaxed">
            Send a message to the project leader explaining why you'd be a good fit. They will review your profile and skills.
          </p>
          <div>
            <label htmlFor="request-message" className="block text-sm font-medium text-foreground mb-1.5">Message (Optional)</label>
            <Textarea 
              id="request-message"
              value={requestMsg} 
              onChange={e => setRequestMsg(e.target.value)} 
              placeholder="Hi, I am interested in collaborating on this research because..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-muted dark:border-[#3D3934]">
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
        loading={deleting}
      />

    </div>
  );
}
