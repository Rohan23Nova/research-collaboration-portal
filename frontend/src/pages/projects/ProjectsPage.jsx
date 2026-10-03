// frontend/src/pages/projects/ProjectsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { Card, CardBody, CardFooter } from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Search, Plus, FolderSearch, Calendar, User as UserIcon } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const canCreate = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [domainsList, setDomainsList] = useState([]);

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, domain, status, page]);

  const fetchDomains = async () => {
    try {
      const res = await api.get('/projects/domains');
      setDomainsList(res.data.data.domains);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append('search', search);
      if (domain) params.append('domain', domain);
      if (status) params.append('status', status);

      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.data.projects);
      setTotal(res.data.data.totalPages);
    } catch (err) {
      addToast('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Research Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Discover and join ongoing research.</p>
        </div>
        {canCreate && (
          <Link to="/projects/new">
            <Button className="gap-2">
              <Plus size={16} /> New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={domain} onChange={e => { setDomain(e.target.value); setPage(1); }}>
              <option value="">All Domains</option>
              {domainsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState 
          icon={FolderSearch}
          title="No projects found" 
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(proj => (
            <Link to={`/projects/${proj.project_id}`} key={proj.project_id} className="group block h-full">
              <Card className="h-full flex flex-col transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
                <CardBody className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <Badge variant={getStatusColor(proj.status)}>{proj.status}</Badge>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md truncate max-w-[120px]">
                      {proj.research_domain}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {proj.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                    {proj.description || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-auto">
                    {proj.skills?.slice(0, 3).map(skill => (
                      <span key={skill.skill_id} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                        {skill.skill_name}
                      </span>
                    ))}
                    {proj.skills?.length > 3 && (
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                        +{proj.skills.length - 3}
                      </span>
                    )}
                  </div>
                </CardBody>
                
                <CardFooter className="py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <UserIcon size={14} />
                    <span className="truncate max-w-[100px]">{proj.leader_name}</span>
                  </div>
                  {proj.deadline && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(proj.deadline).toLocaleDateString()}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
      
    </div>
  );
}
