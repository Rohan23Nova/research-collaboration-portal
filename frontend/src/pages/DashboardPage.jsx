// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { FolderGit2, CheckCircle2, Inbox, Users, Activity, ListTodo, FileText, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard');
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      addToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 pb-12 sm:pb-16">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Card>
          <CardBody className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="pb-12 sm:pb-16 space-y-6">
        <PageHeader 
          title={`Welcome back, ${user.name}!`} 
          description={`Here is your ${user.role.toLowerCase()} dashboard.`} 
        />
        <ErrorState 
          title="Could not load dashboard data"
          message={error || 'An error occurred while fetching your dashboard metrics.'}
          onRetry={fetchStats}
        />
      </div>
    );
  }

  // Common StatCard with subtle hover state
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-doodle-sm">
      <CardBody className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${colorClass} transition-colors duration-200 shrink-0`}>
          <Icon size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground-muted">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-0.5">{value}</p>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="pb-12 sm:pb-16 space-y-6 sm:space-y-8">
      <PageHeader 
        title={`Welcome back, ${user.name}!`} 
        description={`Here is your ${user.role.toLowerCase()} dashboard.`} 
      />

      {user.role === 'ADMIN' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-primary-soft text-primary" />
            <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderGit2} colorClass="bg-primary-soft text-primary" />
            <StatCard title="Platform Skills" value={stats.totalSkills} icon={Activity} colorClass="bg-primary-soft text-primary" />
          </div>
          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                <Activity size={20} className="text-primary" aria-hidden="true" /> Recent Platform Activity
              </h3>
              {stats.recentActivity?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((act, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-surface-muted dark:bg-[#24211E] rounded-lg transition-colors hover:bg-surface-muted/80 gap-3">
                      <div className="flex items-center min-w-0 flex-1">
                        <Badge variant={act.type === 'New User' ? 'primary' : 'success'} className="mr-3 shrink-0">{act.type}</Badge>
                        <span className="text-foreground text-sm truncate">{act.detail}</span>
                      </div>
                      <span className="text-xs text-foreground-muted shrink-0">{new Date(act.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Activity}
                  title="No platform activity"
                  description="Recent platform activity and user registrations will appear here."
                />
              )}
            </CardBody>
          </Card>
        </>
      )}

      {user.role === 'FACULTY' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Projects Led" value={stats.ledProjects} icon={FolderGit2} colorClass="bg-primary-soft text-primary" />
            <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Inbox} colorClass="bg-primary-soft text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Inbox size={20} className="text-primary" aria-hidden="true" /> Pending Join Requests
                  </h3>
                  {stats.pendingIncoming?.length > 0 && (
                    <Link to="/requests/incoming" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                      View all <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
                {stats.pendingIncoming?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.pendingIncoming.map(req => (
                      <div key={req.request_id} className="p-3 bg-surface-muted dark:bg-[#24211E] rounded-lg transition-all hover:bg-surface-muted/80 border border-transparent hover:border-border-muted">
                        <p className="font-medium text-foreground truncate">{req.applicant_name}</p>
                        <p className="text-sm text-foreground-muted mt-1 truncate">Wants to join <span className="font-medium text-primary">{req.project_title}</span></p>
                        <Link to="/requests/incoming" className="text-xs text-primary font-medium mt-2 inline-flex items-center gap-1 hover:underline">
                          Review Request <ArrowRight size={12} />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={Inbox}
                    title="No pending requests"
                    description="You don't have any collaboration requests waiting for review."
                  />
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                  <FileText size={20} className="text-primary" aria-hidden="true" /> Recent Progress Reports
                </h3>
                {stats.recentReports?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentReports.map(rep => (
                      <div key={rep.report_id} className="p-3 bg-surface-muted dark:bg-[#24211E] rounded-lg transition-all hover:bg-surface-muted/80 border border-transparent hover:border-border-muted">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <span className="font-medium text-foreground text-sm truncate">{rep.submitter_name}</span>
                          <span className="text-xs text-foreground-muted shrink-0">{new Date(rep.submitted_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-primary font-medium mb-1.5 truncate">{rep.project_title}</p>
                        <p className="text-sm text-foreground line-clamp-2">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={FileText}
                    title="No recent reports"
                    description="Progress reports submitted by team members will be displayed here."
                  />
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {(user.role === 'STUDENT' || user.role === 'EXTERNAL') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Active Projects" value={stats.activeProjects} icon={FolderGit2} colorClass="bg-primary-soft text-primary" />
            <StatCard title="Pending Applications" value={stats.pendingRequests} icon={CheckCircle2} colorClass="bg-primary-soft text-primary" />
          </div>

          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                <ListTodo size={20} className="text-primary" aria-hidden="true" /> Upcoming Tasks
              </h3>
              {stats.upcomingTasks?.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingTasks.map(task => (
                    <div key={task.task_id} className="flex justify-between items-center p-3 bg-surface-muted dark:bg-[#24211E] rounded-lg transition-all hover:bg-surface-muted/80 border border-transparent hover:border-border-muted gap-3">
                      <div className="min-w-0 flex-1">
                        <Link to={`/projects/${task.project_id}/workspace`} className="font-medium text-primary hover:underline truncate block">
                          {task.title}
                        </Link>
                        <p className="text-xs text-foreground-muted mt-1 truncate">{task.project_title}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={task.status === 'In Progress' ? 'primary' : 'neutral'} className="mb-1">{task.status}</Badge>
                        <p className="text-xs text-foreground-muted">Due {new Date(task.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={ListTodo}
                  title="No upcoming tasks"
                  description="Your active projects don't have any upcoming deadlines."
                />
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
