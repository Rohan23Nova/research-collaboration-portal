// frontend/src/pages/projects/ProjectFormPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { ArrowLeft, X, Search } from 'lucide-react';

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    research_domain: '',
    status: 'Planning',
    deadline: ''
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Skill search state
  const [skillQuery, setSkillQuery] = useState('');
  const [skillResults, setSkillResults] = useState([]);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      const proj = res.data.data.project;
      
      // Convert ISO date to YYYY-MM-DD for native input
      const deadline = proj.deadline ? new Date(proj.deadline).toISOString().split('T')[0] : '';
      
      setForm({
        title: proj.title,
        description: proj.description || '',
        research_domain: proj.research_domain,
        status: proj.status,
        deadline
      });
      setSelectedSkills(proj.skills || []);
    } catch (err) {
      addToast('Failed to load project details', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (skillQuery.length >= 2) searchSkills();
      else setSkillResults([]);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [skillQuery]);

  const searchSkills = async () => {
    try {
      const res = await api.get(`/skills?q=${encodeURIComponent(skillQuery)}`);
      setSkillResults(res.data.data.skills || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.find(s => s.skill_id === skill.skill_id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillQuery('');
    setSkillResults([]);
  };

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...form,
      skill_ids: selectedSkills.map(s => s.skill_id)
    };
    
    // Convert empty deadline to null
    if (!payload.deadline) delete payload.deadline;

    try {
      if (isEdit) {
        await api.put(`/projects/${id}`, payload);
        addToast('Project updated successfully', 'success');
        navigate(`/projects/${id}`);
      } else {
        const res = await api.post('/projects', payload);
        addToast('Project created successfully', 'success');
        navigate(`/projects/${res.data.data.project_id}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto pb-12 sm:pb-16 space-y-6">
        <Skeleton className="h-5 w-24 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-56" />
          </CardHeader>
          <CardBody className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end gap-3 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Only faculty/admin can create
  if (!isEdit && user?.role !== 'FACULTY' && user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        You don't have permission to create projects.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 sm:pb-16">
      <Link 
        to={isEdit ? `/projects/${id}` : '/projects'} 
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground dark:text-foreground-muted dark:hover:text-[#F4EFE6] mb-6 transition-colors duration-150 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </Link>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-foreground">
            {isEdit ? 'Edit Research Project' : 'Create New Research Project'}
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="project-title" className="block text-sm font-medium text-foreground mb-1.5">
                  Project Title <span className="text-primary">*</span>
                </label>
                <Input 
                  id="project-title"
                  required 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  placeholder="e.g. Autonomous Robotic Navigation in Unstructured Environments"
                />
              </div>

              <div>
                <label htmlFor="research-domain" className="block text-sm font-medium text-foreground mb-1.5">
                  Research Domain <span className="text-primary">*</span>
                </label>
                <Input 
                  id="research-domain"
                  required 
                  value={form.research_domain} 
                  onChange={e => setForm({...form, research_domain: e.target.value})} 
                  placeholder="e.g. Artificial Intelligence" 
                />
              </div>

              <div>
                <label htmlFor="project-status" className="block text-sm font-medium text-foreground mb-1.5">
                  Status
                </label>
                <Select 
                  id="project-status"
                  value={form.status} 
                  onChange={e => setForm({...form, status: e.target.value})}
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="project-description" className="block text-sm font-medium text-foreground mb-1.5">
                  Detailed Description
                </label>
                <Textarea 
                  id="project-description"
                  rows={5} 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Outline the project goals, methodology, and expected outcomes..."
                />
              </div>

              <div>
                <label htmlFor="project-deadline" className="block text-sm font-medium text-foreground mb-1.5">
                  Target Deadline (Optional)
                </label>
                <Input 
                  id="project-deadline"
                  type="date" 
                  value={form.deadline} 
                  onChange={e => setForm({...form, deadline: e.target.value})} 
                />
              </div>
            </div>

            {/* Skill Tags */}
            <div className="border-t border-border-muted dark:border-[#3D3934] pt-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Required Skills
              </label>
              <p className="text-xs text-foreground-muted mb-3">
                Specify competencies prospective collaborators should have.
              </p>

              {/* Selected skills pills */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                {selectedSkills.map(skill => (
                  <Badge key={skill.skill_id} variant="neutral" className="gap-1.5 pr-1 py-1">
                    <span>{skill.skill_name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill.skill_id)}
                      aria-label={`Remove ${skill.skill_name}`}
                      className="hover:text-red-600 rounded-full p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {selectedSkills.length === 0 && (
                  <span className="text-xs text-foreground-muted italic py-1">No skills added yet.</span>
                )}
              </div>

              {/* Search input with results popup */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none" aria-hidden="true" />
                  <Input 
                    type="search"
                    placeholder="Search platform skills (type at least 2 letters)..."
                    value={skillQuery}
                    onChange={e => setSkillQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {skillResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-surface dark:bg-[#292622] border-[1.5px] border-border-dark dark:border-[#575048] rounded-lg shadow-doodle max-h-48 overflow-y-auto">
                    {skillResults.map(s => (
                      <button
                        type="button"
                        key={s.skill_id}
                        onClick={() => addSkill(s)}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-muted dark:hover:bg-[#34302B] transition-colors duration-150 focus:outline-none focus:bg-surface-muted"
                      >
                        {s.skill_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-muted dark:border-[#3D3934]">
              <Link to={isEdit ? `/projects/${id}` : '/projects'}>
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Project')}
              </Button>
            </div>

          </form>
        </CardBody>
      </Card>
    </div>
  );
}
