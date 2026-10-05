// frontend/src/pages/projects/WorkspacePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, LayoutDashboard, Users, FileText, CheckSquare, Activity, MessageSquare } from 'lucide-react';

import OverviewTab from './workspace/OverviewTab';
import TeamTab from './workspace/TeamTab';
import DocumentsTab from './workspace/DocumentsTab';
import MilestonesTab from './workspace/MilestonesTab';
import ReportsTab from './workspace/ReportsTab';
import ChatTab from './workspace/ChatTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'chat', label: 'Project Chat', icon: MessageSquare },
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
      else setUserRole('Admin');
      
    } catch (err) {
      addToast('Failed to load workspace context', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-12 sm:pb-16">
        <div>
          <Skeleton className="h-5 w-28 mb-3" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-4 border-b border-border-muted pb-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-9 w-28 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 sm:pb-16">
      
      {/* Header Context */}
      <div className="mb-6">
        <Link 
          to={`/projects/${id}`} 
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground dark:text-foreground-muted dark:hover:text-[#F4EFE6] mb-4 transition-colors duration-150 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Project Details
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-foreground flex flex-wrap items-center gap-3 break-words">
              <span>{project.title}</span> 
              <span className="text-sm font-sans font-normal text-foreground-muted">Workspace</span>
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              You are participating as <Badge variant="primary">{userRole}</Badge>
            </p>
          </div>
          <Badge variant={project.status === 'Active' ? 'success' : 'neutral'} className="shrink-0">{project.status}</Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border-muted dark:border-[#3D3934] mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-none" aria-label="Workspace tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-3.5 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-sm
                ${activeTab === tab.id 
                  ? 'border-primary text-primary font-semibold' 
                  : 'border-transparent text-foreground-muted hover:text-foreground hover:border-border-muted dark:hover:text-[#F4EFE6] dark:hover:border-[#575048]'}
              `}
            >
              <tab.icon className={`mr-2 h-4 w-4 transition-colors ${activeTab === tab.id ? 'text-primary' : 'text-foreground-muted group-hover:text-foreground dark:group-hover:text-[#F4EFE6]'}`} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Rendering */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'team' && <TeamTab project={project} />}
        {activeTab === 'chat' && <ChatTab projectId={id} />}
        {activeTab === 'documents' && <DocumentsTab projectId={id} isLeader={userRole === 'Leader'} />}
        {activeTab === 'milestones' && <MilestonesTab projectId={id} isLeader={userRole === 'Leader'} />}
        {activeTab === 'reports' && <ReportsTab projectId={id} isLeader={userRole === 'Leader'} />}
      </div>

    </div>
  );
}
