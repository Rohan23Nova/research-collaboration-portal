// frontend/src/pages/requests/IncomingRequestsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Inbox, Check, X } from 'lucide-react';

export default function IncomingRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // Applicant Profile Modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/incoming');
      setRequests(res.data.data.requests);
    } catch (err) {
      addToast('Failed to fetch incoming requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openApplicantModal = async (applicantId) => {
    setSelectedApplicant(applicantId);
    setLoadingProfile(true);
    try {
      const res = await api.get(\`/users/\${applicantId}\`);
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
      await api.put(\`/requests/\${requestId}/\${action}\`);
      addToast(\`Request \${action}ed successfully\`, 'success');
      setRequests(prev => prev.filter(r => r.request_id !== requestId));
      setSelectedApplicant(null); // Close modal if open
    } catch (err) {
      addToast(err.response?.data?.message || \`Failed to \${action} request\`, 'error');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Requests</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage incoming collaboration requests for your projects.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={Inbox} title="No pending requests" description="You're all caught up!" />
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.request_id} className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4 flex-1">
                  {req.applicant_image ? (
                    <img src={\`/api/users/\${req.applicant_id}/image\`} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <Avatar fallback={req.applicant_name} size="lg" />
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <button 
                        onClick={() => openApplicantModal(req.applicant_id)}
                        className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors text-left"
                      >
                        {req.applicant_name}
                      </button>
                      <span className="text-sm text-slate-500">requested to join</span>
                      <Link to={\`/projects/\${req.project_id}\`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        {req.project_title}
                      </Link>
                    </div>
                    {req.message ? (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                        "{req.message}"
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic mt-2">No message provided.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button 
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                    disabled={processing === req.request_id}
                    onClick={() => handleAction(req.request_id, 'reject')}
                  >
                    <X size={16} className="mr-2" /> Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={processing === req.request_id}
                    onClick={() => handleAction(req.request_id, 'accept')}
                  >
                    <Check size={16} className="mr-2" /> Accept
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
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {applicantProfile.user.profile_image ? (
                <img src={\`/api/users/\${applicantProfile.user.user_id}/image\`} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <Avatar fallback={applicantProfile.user.name} size="lg" className="w-16 h-16 text-xl" />
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{applicantProfile.user.name}</h3>
                <p className="text-sm text-slate-500">{applicantProfile.user.email} • {applicantProfile.user.role}</p>
                {applicantProfile.user.institution && <p className="text-sm text-slate-600 mt-1">{applicantProfile.user.institution}</p>}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Bio</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {applicantProfile.user.bio || 'No bio provided.'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Skills & Interests</h4>
              <div className="flex flex-wrap gap-2">
                {applicantProfile.skills.length === 0 && <span className="text-sm text-slate-400">No skills added.</span>}
                {applicantProfile.skills.map(skill => (
                  <Badge key={skill.skill_id} variant={skill.is_interest ? 'primary' : 'neutral'}>
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Find the specific request for this applicant in the current view to allow inline accept/reject */}
            {(() => {
              const req = requests.find(r => r.applicant_id === selectedApplicant);
              if (!req) return null;
              return (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="ghost" className="text-red-600" onClick={() => handleAction(req.request_id, 'reject')}>Reject</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(req.request_id, 'accept')}>Accept into {req.project_title}</Button>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>

    </div>
  );
}
