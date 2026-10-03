// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { FolderGit2, CheckCircle2, Inbox, Users, Activity, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (err) {
        addToast('Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Common wrapper
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`p-4 rounded-xl ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user.name}!</h1>
        <p className="text-slate-500">Here is your {user.role.toLowerCase()} dashboard.</p>
      </div>

      {user.role === 'ADMIN' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" />
            <StatCard title="Total Projects" value={stats.totalProjects} icon={FolderGit2} colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" />
            <StatCard title="Platform Skills" value={stats.totalSkills} icon={Activity} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" />
          </div>
          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Activity size={20}/> Recent Platform Activity</h3>
              <div className="space-y-3">
                {stats.recentActivity.map((act, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                      <Badge variant={act.type === 'New User' ? 'primary' : 'success'} className="mr-3">{act.type}</Badge>
                      <span className="text-slate-700 dark:text-slate-300">{act.detail}</span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(act.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {user.role === 'FACULTY' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Projects Led" value={stats.ledProjects} icon={FolderGit2} colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" />
            <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Inbox} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardBody>
                <h3 className="font-semibold text-lg mb-4">Pending Join Requests</h3>
                {stats.pendingIncoming?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.pendingIncoming.map(req => (
                      <div key={req.request_id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <p className="font-medium text-slate-900 dark:text-white">{req.applicant_name}</p>
                        <p className="text-sm text-slate-500 mt-1">Wants to join <span className="font-medium text-indigo-600">{req.project_title}</span></p>
                        <Link to="/requests/incoming" className="text-xs text-indigo-600 font-medium mt-2 inline-block hover:underline">Review Request &rarr;</Link>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500 text-sm">No pending requests.</p>}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-semibold text-lg mb-4">Recent Progress Reports</h3>
                {stats.recentReports?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentReports.map(rep => (
                      <div key={rep.report_id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-slate-900 dark:text-white text-sm">{rep.submitter_name}</span>
                          <span className="text-xs text-slate-400">{new Date(rep.submitted_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{rep.project_title}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500 text-sm">No recent reports.</p>}
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {(user.role === 'STUDENT' || user.role === 'EXTERNAL') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard title="Active Projects" value={stats.activeProjects} icon={FolderGit2} colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" />
            <StatCard title="Pending Applications" value={stats.pendingRequests} icon={CheckCircle2} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" />
          </div>

          <Card>
            <CardBody>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><ListTodo size={20}/> Upcoming Tasks</h3>
              {stats.upcomingTasks?.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingTasks.map(task => (
                    <div key={task.task_id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div>
                        <Link to={`/projects/${task.project_id}/workspace`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          {task.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">{task.project_title}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={task.status === 'In Progress' ? 'primary' : 'neutral'} className="mb-1">{task.status}</Badge>
                        <p className="text-xs text-slate-500">Due {new Date(task.due_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-slate-500 text-sm">You have no pending tasks.</p>}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
