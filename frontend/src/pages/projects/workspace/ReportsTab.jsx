// frontend/src/pages/projects/workspace/ReportsTab.jsx
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Skeleton from '../../../components/ui/Skeleton';

export default function ReportsTab({ projectId }) {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newReport, setNewReport] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [projectId]);

  const fetchReports = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/workspace/reports`);
      setReports(res.data.data.reports);
    } catch (err) {
      addToast('Failed to fetch reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReport.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/projects/${projectId}/workspace/reports`, { content: newReport });
      addToast('Report submitted successfully', 'success');
      setNewReport('');
      fetchReports();
    } catch (err) {
      addToast('Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader><h3 className="font-semibold text-slate-900 dark:text-white">Submit Progress Report</h3></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea 
              placeholder="What did you work on? Any blockers?" 
              rows={4}
              value={newReport}
              onChange={e => setNewReport(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.report_id}>
            <CardBody>
              <div className="flex items-start gap-4">
                {report.profile_image ? (
                  <img src={`/api/users/${report.submitted_by}/image`} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <Avatar fallback={report.submitter_name} size="md" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{report.submitter_name}</h4>
                    <span className="text-xs text-slate-500">
                      {new Date(report.submitted_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {report.content}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        {reports.length === 0 && (
          <div className="text-center text-slate-500 py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            No progress reports submitted yet.
          </div>
        )}
      </div>

    </div>
  );
}
