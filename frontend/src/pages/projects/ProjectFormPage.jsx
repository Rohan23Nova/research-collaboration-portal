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
      const res = await api.get(`/skills?q=${skillQuery}`);
      setSkillResults(res.data.data.skills);
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
        addToast('Project updated', 'success');
        navigate(`/projects/${id}`);
      } else {
        const res = await api.post('/projects', payload);
        addToast('Project created', 'success');
        navigate(`/projects/${res.data.data.project_id}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save project', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null; // Or a skeleton

  // Only faculty/admin can create
  if (!isEdit && user?.role !== 'FACULTY' && user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-600">You don't have permission to create projects.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link to={isEdit ? `/projects/${id}` : '/projects'} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Research Project' : 'Create New Research Project'}
          </h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Research Domain</label>
                <Input required value={form.research_domain} onChange={e => setForm({...form, research_domain: e.target.value})} placeholder="e.g. Artificial Intelligence" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <Select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description</label>
                <Textarea rows={6} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Deadline (Optional)</label>
                <Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Required Skills</label>
                
                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.map(skill => (
                    <Badge key={skill.skill_id} variant="neutral" className="pr-1 flex items-center gap-1">
                      {skill.skill_name}
                      <button type="button" onClick={() => removeSkill(skill.skill_id)} className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                  {selectedSkills.length === 0 && <span className="text-sm text-slate-500">No skills selected</span>}
                </div>

                {/* Skill Search */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search and add skills..." 
                      className="pl-9"
                      value={skillQuery}
                      onChange={e => setSkillQuery(e.target.value)}
                    />
                  </div>
                  {skillResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {skillResults.map(skill => (
                        <div 
                          key={skill.skill_id}
                          className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200"
                          onClick={() => addSkill(skill)}
                        >
                          {skill.skill_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">To create a new skill, a user must add it to their profile first.</p>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
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
