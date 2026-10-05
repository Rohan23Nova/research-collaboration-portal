// frontend/src/pages/requests/MyRequestsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { FileClock, ArrowRight } from 'lucide-react';

export default function MyRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/requests/my-requests');
      setRequests(res.data.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your requests');
      addToast('Failed to fetch your requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusBadge = (status) => {
    if (status === 'Accepted') return <Badge variant="success">Accepted</Badge>;
    if (status === 'Rejected') return <Badge variant="danger">Rejected</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-12 sm:pb-16">
        <div className="mb-6">
          <Skeleton className="h-8 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-52 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
              <Skeleton className="h-10 w-24 rounded self-end sm:self-center" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto pb-12 sm:pb-16 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">My Requests</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Track the status of your project collaboration requests.</p>
        </div>
        <ErrorState 
          title="Could not load your requests"
          message={error}
          onRetry={fetchRequests}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 sm:pb-16">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">My Requests</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Track the status of your project collaboration requests.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState 
          icon={FileClock} 
          title="No pending requests" 
          description="You don't have any collaboration requests waiting for action." 
          action={
            <Link to="/projects">
              <Button size="sm" className="gap-2">
                Browse Projects <ArrowRight size={14} />
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.request_id} className="transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-doodle-sm">
              <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <Link to={`/projects/${req.project_id}`} className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-150 focus:outline-none focus-visible:underline break-words">
                      {req.project_title}
                    </Link>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-foreground-muted">Led by <span className="font-medium text-foreground">{req.leader_name}</span></p>
                  {req.message && (
                    <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] mt-2 italic border-l-2 border-border-muted dark:border-[#3D3934] pl-3 py-0.5 break-words">
                      "{req.message}"
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-muted/50">
                  <p className="text-xs text-foreground-muted">Requested on</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
