// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { Camera, Plus, X } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  
  // If no :id is provided in the URL, default to current user's profile
  const profileId = id || currentUser?.user_id;
  const isOwner = currentUser?.user_id === parseInt(profileId) || currentUser?.role === 'ADMIN';

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', institution: '' });
  const [saving, setSaving] = useState(false);

  // Skill management states
  const [skillInput, setSkillInput] = useState('');
  const [isInterest, setIsInterest] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${profileId}`);
      setProfile(res.data.data.user);
      setSkills(res.data.data.skills);
      setEditForm({
        name: res.data.data.user.name || '',
        bio: res.data.data.user.bio || '',
        institution: res.data.data.user.institution || ''
      });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${profileId}`, editForm);
      setProfile(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      addToast('Uploading image...', 'info');
      const res = await api.post(`/users/${profileId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Append a timestamp to bypass browser cache
      setProfile(prev => ({ ...prev, profile_image: `${res.data.data.profile_image}?t=${Date.now()}` }));
      addToast('Profile image updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload image', 'error');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;

    setAddingSkill(true);
    try {
      const res = await api.post(`/users/${profileId}/skills`, {
        skill_name: skillInput.trim(),
        is_interest: isInterest
      });
      setSkills(res.data.data.skills);
      setSkillInput('');
      addToast('Skill added', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add skill', 'error');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete(`/users/${profileId}/skills/${skillId}`);
      setSkills(prev => prev.filter(s => s.skill_id !== skillId));
      addToast('Skill removed', 'success');
    } catch (err) {
      addToast('Failed to remove skill', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2 rounded-xl" />
          <Skeleton className="h-64 col-span-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Profile Header Card */}
      <Card>
        <CardBody className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            {profile.profile_image ? (
              <img 
                src={`/api/users/${profileId}/image`}
                alt={profile.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm"
              />
            ) : (
              <Avatar fallback={profile.name} size="lg" className="w-24 h-24 text-2xl" />
            )}
            
            {isOwner && (
              <>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />
              </>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
              <Badge variant="primary">{profile.role}</Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
            {profile.institution && (
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2">{profile.institution}</p>
            )}
          </div>

          {isOwner && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Bio / Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-900 dark:text-white">About</h2>
            </CardHeader>
            <CardBody>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Institution</label>
                    <Input value={editForm.institution} onChange={e => setEditForm({...editForm, institution: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                    <Textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                  </div>
                </form>
              ) : (
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {profile.bio || 'No bio provided yet.'}
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Skills & Interests */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-900 dark:text-white">Skills & Interests</h2>
            </CardHeader>
            <CardBody>
              
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => !s.is_interest).length === 0 && <span className="text-sm text-slate-400">None added</span>}
                  {skills.filter(s => !s.is_interest).map(skill => (
                    <Badge key={skill.skill_id} variant="neutral" className="pr-1 flex items-center gap-1">
                      {skill.skill_name}
                      {isOwner && (
                        <button onClick={() => handleRemoveSkill(skill.skill_id)} className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">Research Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s.is_interest).length === 0 && <span className="text-sm text-slate-400">None added</span>}
                  {skills.filter(s => s.is_interest).map(skill => (
                    <Badge key={skill.skill_id} variant="primary" className="pr-1 flex items-center gap-1">
                      {skill.skill_name}
                      {isOwner && (
                        <button onClick={() => handleRemoveSkill(skill.skill_id)} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {isOwner && (
                <form onSubmit={handleAddSkill} className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                  <div className="flex gap-2 mb-2">
                    <Input 
                      placeholder="e.g., Data Analysis" 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      required
                    />
                    <Button type="submit" disabled={addingSkill} className="px-3">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isInterest} 
                      onChange={(e) => setIsInterest(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Tag as Research Interest
                  </label>
                </form>
              )}

            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}
