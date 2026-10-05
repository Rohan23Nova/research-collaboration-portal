// frontend/src/pages/requests/IncomingRequestsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Badge from '../../components/ui/Badge';
import { Inbox, Check, X } from 'lucide-react';

export default function IncomingRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  // Applicant Profile Modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Reject Confirmation Modal
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/requests/incoming');
      setRequests(res.data.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch incoming requests');
      addToast('Failed to fetch incoming requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const openApplicantModal = async (applicantId) => {
    setSelectedApplicant(applicantId);
    setLoadingProfile(true);
    try {
      const res = await api.get(`/users/${applicantId}`);
      setApplicantProfile(res.data.data);
    } catch (err) {
      addToast('Failed to load applicant profile', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setProcessing(requestId);
    try {
      await api.put(`/requests/${requestId}/${action}`);
      addToast(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`, 'success');
      setRequests(prev => prev.filter(r => r.request_id !== requestId));
      setSelectedApplicant(null); // Close modal if open
      setRejectConfirmOpen(false);
      setRequestToReject(null);
    } catch (err) {
      addToast(err.response?.data?.message || `Failed to ${action} request`, 'error');
    } finally {
      setProcessing(null);
    }
  };

  const promptReject = (requestId, applicantName, projectTitle) => {
    setRequestToReject({ requestId, applicantName, projectTitle });
    setRejectConfirmOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 pb-12 sm:pb-16">
        <div className="mb-6">
          <Skeleton className="h-8 w-52 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-36 rounded" />
                    <Skeleton className="h-4 w-44 rounded" />
                  </div>
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center">
                <Skeleton className="h-9 w-20 rounded" />
                <Skeleton className="h-9 w-24 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto pb-12 sm:pb-16 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Review Requests</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Manage incoming collaboration requests for your projects.</p>
        </div>
        <ErrorState 
          title="Could not load incoming requests"
          message={error}
          onRetry={fetchRequests}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 sm:pb-16">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Review Requests</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Manage incoming collaboration requests for your projects.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState 
          icon={Inbox} 
          title="No pending requests" 
          description="You don't have any collaboration requests waiting for action." 
        />
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.request_id} className="transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-doodle-sm">
              <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <Avatar 
                    src={req.applicant_image ? `/api/users/${req.applicant_id}/image` : null} 
                    fallback={req.applicant_name} 
                    size="lg" 
                    className="shrink-0" 
                  />
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <button 
                        type="button"
                        onClick={() => openApplicantModal(req.applicant_id)}
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-150 text-left focus:outline-none focus-visible:underline"
                      >
                        {req.applicant_name}
                      </button>
                      <span className="text-sm text-foreground-muted">requested to join</span>
                      <Link to={`/projects/${req.project_id}`} className="text-sm font-medium text-primary hover:underline break-words">
                        {req.project_title}
                      </Link>
                    </div>
                    {req.message ? (
                      <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] mt-2 italic border-l-2 border-border-muted dark:border-[#3D3934] pl-3 py-0.5 break-words">
                        "{req.message}"
                      </p>
                    ) : (
                      <p className="text-sm text-foreground-muted italic mt-1">No message provided.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Button 
                    variant="ghost"
                    className="text-red-600 dark:text-red-400 hover:bg-red-500/10 focus-visible:ring-red-500"
                    disabled={processing === req.request_id}
                    onClick={() => promptReject(req.request_id, req.applicant_name, req.project_title)}
                  >
                    <X size={16} className="mr-1.5" aria-hidden="true" /> Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500"
                    disabled={processing === req.request_id}
                    onClick={() => handleAction(req.request_id, 'accept')}
                  >
                    <Check size={16} className="mr-1.5" aria-hidden="true" /> Accept
                  </Button>
                </div>

              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Applicant Profile Modal */}
      <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)} title="Applicant Profile">
        {loadingProfile || !applicantProfile ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border-muted dark:border-[#3D3934] pb-4">
              <Avatar 
                src={applicantProfile.user.profile_image ? `/api/users/${applicantProfile.user.user_id}/image` : null} 
                fallback={applicantProfile.user.name} 
                size="lg" 
                className="w-16 h-16 text-xl shrink-0" 
              />
              <div>
                <h3 className="text-lg font-bold text-foreground">{applicantProfile.user.name}</h3>
                <p className="text-sm text-foreground-muted">{applicantProfile.user.email} • {applicantProfile.user.role}</p>
                {applicantProfile.user.institution && <p className="text-sm text-foreground-muted mt-0.5">{applicantProfile.user.institution}</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1.5">Bio</h4>
              <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] whitespace-pre-wrap leading-relaxed">
                {applicantProfile.user.bio || 'No bio provided.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Skills & Interests</h4>
              <div className="flex flex-wrap gap-2">
                {applicantProfile.skills?.length === 0 && <span className="text-sm text-foreground-muted">No skills listed.</span>}
                {applicantProfile.skills?.map(skill => (
                  <Badge key={skill.skill_id} variant={skill.is_interest ? 'primary' : 'neutral'}>
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Inline Action for Selected Applicant */}
            {(() => {
              const req = requests.find(r => r.applicant_id === selectedApplicant);
              if (!req) return null;
              return (
                <div className="flex justify-end gap-3 pt-4 border-t border-border-muted dark:border-[#3D3934]">
                  <Button 
                    variant="ghost" 
                    className="text-red-600 dark:text-red-400 hover:bg-red-500/10" 
                    disabled={processing === req.request_id}
                    onClick={() => promptReject(req.request_id, req.applicant_name, req.project_title)}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                    disabled={processing === req.request_id}
                    onClick={() => handleAction(req.request_id, 'accept')}
                  >
                    Accept into {req.project_title}
                  </Button>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Reject Confirmation Dialog */}
      <ConfirmModal
        isOpen={rejectConfirmOpen}
        onClose={() => setRejectConfirmOpen(false)}
        onConfirm={() => requestToReject && handleAction(requestToReject.requestId, 'reject')}
        title="Reject Collaboration Request"
        message={requestToReject ? `Are you sure you want to reject the application from ${requestToReject.applicantName} for "${requestToReject.projectTitle}"? The applicant will be notified.` : ''}
        confirmText="Reject Request"
        confirmVariant="destructive"
        loading={processing === requestToReject?.requestId}
      />

    </div>
  );
}
