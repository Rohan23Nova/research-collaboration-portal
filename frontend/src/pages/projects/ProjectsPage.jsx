// frontend/src/pages/projects/ProjectsPage.jsx
import { useState, useEffect, useCallback } from 'react';
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
import ErrorState from '../../components/ui/ErrorState';
import { Search, Plus, FolderSearch, Calendar, User as UserIcon } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const canCreate = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchDomains = async () => {
    try {
      const res = await api.get('/projects/domains');
      setDomainsList(res.data.data.domains || []);
    } catch (err) {
      console.error('Failed to fetch domains', err);
    }
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search.trim()) params.append('search', search.trim());
      if (domain) params.append('domain', domain);
      if (status) params.append('status', status);

      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.data.projects || []);
      setTotal(res.data.data.totalPages || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      addToast('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, domain, status, page, addToast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProjects]);

  const getStatusColor = (s) => {
    switch (s) {
      case 'Active': return 'success';
      case 'Planning': return 'neutral';
      case 'On Hold': return 'primary';
      case 'Completed': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 sm:pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="relative">
          <div className="absolute -left-4 top-1.5 bottom-1.5 w-1 bg-primary rounded-full hidden sm:block opacity-80" />
          <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Projects</h1>
          <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Discover and join ongoing academic research initiatives.</p>
        </div>
        {canCreate && (
          <Link to="/projects/new">
            <Button className="gap-2 shadow-doodle-sm">
              <Plus size={16} aria-hidden="true" /> New Project
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" aria-hidden="true" />
              <Input 
                type="search"
                aria-label="Filter projects by title or keyword"
                placeholder="Search projects..." 
                className="pl-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select 
              aria-label="Filter by research domain"
              value={domain} 
              onChange={e => { setDomain(e.target.value); setPage(1); }}
            >
              <option value="">All Domains</option>
              {domainsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Select 
              aria-label="Filter by project status"
              value={status} 
              onChange={e => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </Select>
            <div className="flex items-center">
              {(search || domain || status) ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => { setSearch(''); setDomain(''); setStatus(''); setPage(1); }}
                  className="text-foreground-muted hover:text-foreground text-xs w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              ) : <div className="hidden lg:block" />}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-64 flex flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border-muted dark:border-[#3D3934]">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <ErrorState 
          title="Could not load projects"
          message={error}
          onRetry={fetchProjects}
        />
      ) : projects.length === 0 ? (
        <EmptyState 
          icon={FolderSearch}
          title="No projects found" 
          description={search || domain || status ? "Try adjusting your filters or search terms." : "Projects you create or join will appear here."}
          action={
            (search || domain || status) ? (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => { setSearch(''); setDomain(''); setStatus(''); setPage(1); }}
              >
                Reset Filters
              </Button>
            ) : canCreate ? (
              <Link to="/projects/new">
                <Button size="sm">
                  <Plus size={14} className="mr-1" /> Create First Project
                </Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(proj => (
            <Link 
              to={`/projects/${proj.project_id}`} 
              key={proj.project_id} 
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full flex flex-col transition-all duration-200 ease-in-out hover:border-primary/60 hover:shadow-doodle-sm hover:-translate-y-0.5">
                <CardBody className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <Badge variant={getStatusColor(proj.status)} className="shrink-0">{proj.status}</Badge>
                    <span className="text-xs font-medium bg-surface-muted dark:bg-[#34302B] text-foreground-muted dark:text-[#D0C8BD] border border-border-muted dark:border-[#3D3934] px-2 py-0.5 rounded-md truncate max-w-[140px] shrink-0">
                      {proj.research_domain}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-150 line-clamp-2">
                    {proj.title}
                  </h3>
                  
                  <p className="text-sm text-foreground-muted dark:text-[#B8B0A5] line-clamp-3 mb-4 flex-1">
                    {proj.description || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-auto">
                    {proj.skills?.slice(0, 3).map(skill => (
                      <span key={skill.skill_id} className="text-xs bg-surface-muted dark:bg-[#34302B] text-foreground-muted dark:text-[#D0C8BD] border border-border-muted dark:border-[#3D3934] px-2 py-0.5 rounded-md">
                        {skill.skill_name}
                      </span>
                    ))}
                    {proj.skills?.length > 3 && (
                      <span className="text-xs bg-surface-muted dark:bg-[#34302B] text-foreground-muted dark:text-[#D0C8BD] border border-border-muted dark:border-[#3D3934] px-1.5 py-0.5 rounded-md">
                        +{proj.skills.length - 3}
                      </span>
                    )}
                  </div>
                </CardBody>
                
                <CardFooter className="py-3 flex items-center justify-between text-xs text-foreground-muted dark:text-[#B8B0A5]">
                  <div className="flex items-center gap-1.5">
                    <UserIcon size={14} aria-hidden="true" />
                    <span className="truncate max-w-[110px]">{proj.leader_name}</span>
                  </div>
                  {proj.deadline && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} aria-hidden="true" />
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
      {total > 1 && (
        <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />
      )}
      
    </div>
  );
}
