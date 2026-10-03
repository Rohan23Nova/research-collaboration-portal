// frontend/src/pages/requests/MyRequestsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { FileClock } from 'lucide-react';

export default function MyRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/my-requests');
      setRequests(res.data.data.requests);
    } catch (err) {
      addToast('Failed to fetch your requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Accepted') return <Badge variant="success">Accepted</Badge>;
    if (status === 'Rejected') return <Badge variant="danger">Rejected</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Requests</h1>
        <p className="text-slate-500 dark:text-slate-400">Track the status of your project collaboration requests.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={FileClock} title="No requests found" description="You haven't requested to join any projects yet." />
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.request_id} className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
              <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Link to={\`/projects/\${req.project_id}\`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                      {req.project_title}
                    </Link>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-slate-500">Led by {req.leader_name}</p>
                  {req.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                      "{req.message}"
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Requested on</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
