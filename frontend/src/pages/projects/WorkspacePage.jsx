// frontend/src/pages/projects/WorkspacePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, LayoutDashboard, Users, FileText, CheckSquare, Activity } from 'lucide-react';

import OverviewTab from './workspace/OverviewTab';
import TeamTab from './workspace/TeamTab';
import DocumentsTab from './workspace/DocumentsTab';
import MilestonesTab from './workspace/MilestonesTab';
import ReportsTab from './workspace/ReportsTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'milestones', label: 'Milestones & Tasks', icon: CheckSquare },
  { id: 'reports', label: 'Progress Reports', icon: Activity },
];

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [userRole, setUserRole] = useState(null); // The user's role IN the project
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectContext();
  }, [id]);

  const fetchProjectContext = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      const data = res.data.data;
      
      // Enforce membership on frontend (backend enforces it via API anyway)
      if (!data.userConnection.isLeader && !data.userConnection.isMember && user.role !== 'ADMIN') {
        addToast('You are not a member of this project.', 'error');
        navigate(`/projects/${id}`);
        return;
      }

      setProject(data.project);
      if (data.userConnection.isLeader) setUserRole('Leader');
      else if (data.userConnection.isMember) setUserRole('Member');
      else setUserRole('Admin'); // If they got past the block but aren't member/leader, they are ADMIN
      
    } catch (err) {
      addToast('Failed to load workspace context', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header Context */}
      <div className="mb-6">
        <Link to={`/projects/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors">
          <ArrowLeft size={16} /> Project Details
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {project.title} <span className="text-sm font-normal text-slate-500">Workspace</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You are participating as <Badge variant="primary">{userRole}</Badge>
            </p>
          </div>
          <Badge variant={project.status === 'Active' ? 'success' : 'neutral'}>{project.status}</Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'}
              `}
            >
              <tab.icon className={`mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Rendering */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'team' && <TeamTab project={project} />}
        {activeTab === 'documents' && <DocumentsTab projectId={id} isLeader={userRole === 'Leader'} />}
        {activeTab === 'milestones' && <MilestonesTab projectId={id} isLeader={userRole === 'Leader'} />}
        {activeTab === 'reports' && <ReportsTab projectId={id} isLeader={userRole === 'Leader'} />}
      </div>

    </div>
  );
}
