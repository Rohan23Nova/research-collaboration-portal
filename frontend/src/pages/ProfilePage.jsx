// frontend/src/pages/ProfilePage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
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
import ErrorState from '../components/ui/ErrorState';
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
  const [error, setError] = useState(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', institution: '' });
  const [saving, setSaving] = useState(false);

  // Skill management states
  const [skillInput, setSkillInput] = useState('');
  const [isInterest, setIsInterest] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);

  const fileInputRef = useRef(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/users/${profileId}`);
      setProfile(res.data.data.user);
      setSkills(res.data.data.skills || []);
      setEditForm({
        name: res.data.data.user.name || '',
        bio: res.data.data.user.bio || '',
        institution: res.data.data.user.institution || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      addToast(err.response?.data?.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [profileId, addToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      setSkills(res.data.data.skills || []);
      setSkillInput('');
      addToast('Skill added successfully', 'success');
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
      <div className="max-w-4xl mx-auto space-y-6 pb-12 sm:pb-16">
        <Card>
          <CardBody className="flex flex-col md:flex-row items-center gap-6 p-6">
            <Skeleton className="w-24 h-24 rounded-full shrink-0" />
            <div className="space-y-3 flex-1 text-center md:text-left">
              <Skeleton className="h-7 w-48 mx-auto md:mx-0 rounded" />
              <Skeleton className="h-4 w-36 mx-auto md:mx-0 rounded" />
              <Skeleton className="h-4 w-56 mx-auto md:mx-0 rounded" />
            </div>
            <Skeleton className="h-10 w-28 rounded-md" />
          </CardBody>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2 rounded-xl" />
          <Skeleton className="h-64 md:col-span-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto pb-12 sm:pb-16 space-y-6">
        <ErrorState 
          title="Could not load profile"
          message={error || 'An error occurred while loading this profile.'}
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 sm:pb-16">
      
      {/* Page Heading */}
      <div className="mb-2">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif text-foreground tracking-tight leading-tight">Profile</h1>
        <p className="mt-1.5 text-sm sm:text-base text-foreground-muted">Academic credentials, research interests, and competencies.</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardBody className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative group shrink-0">
            <Avatar 
              src={profile.profile_image ? `/api/users/${profileId}/image?t=${profile.profile_image}` : null}
              fallback={profile.name} 
              size="lg" 
              className="w-24 h-24 text-2xl border-[3px] border-border-muted dark:border-[#575048] shadow-xs" 
            />
            
            {isOwner && (
              <>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile image"
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Camera className="text-white" size={24} aria-hidden="true" />
                </button>
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

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
              <h2 className="text-2xl font-bold text-foreground break-words">{profile.name}</h2>
              <Badge variant="primary">{profile.role}</Badge>
            </div>
            <p className="text-foreground-muted truncate">{profile.email}</p>
            {profile.institution && (
              <p className="text-sm font-medium text-foreground mt-1.5 break-words">{profile.institution}</p>
            )}
          </div>

          {isOwner && !isEditing && (
            <div className="shrink-0">
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Bio / Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-foreground">About</h2>
            </CardHeader>
            <CardBody>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <Input id="edit-name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
                  </div>
                  <div>
                    <label htmlFor="edit-institution" className="block text-sm font-medium text-foreground mb-1">Institution</label>
                    <Input id="edit-institution" value={editForm.institution} onChange={e => setEditForm({...editForm, institution: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="edit-bio" className="block text-sm font-medium text-foreground mb-1">Bio</label>
                    <Textarea id="edit-bio" rows={4} value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                  </div>
                </form>
              ) : (
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
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
              <h2 className="font-semibold text-foreground">Skills & Interests</h2>
            </CardHeader>
            <CardBody>
              
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-foreground-muted mb-3">Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => !s.is_interest).length === 0 && (
                    <span className="text-sm text-foreground-muted italic">None added yet</span>
                  )}
                  {skills.filter(s => !s.is_interest).map(skill => (
                    <Badge key={skill.skill_id} variant="neutral" className="pr-1.5 flex items-center gap-1.5">
                      <span>{skill.skill_name}</span>
                      {isOwner && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(skill.skill_id)} 
                          aria-label={`Remove skill ${skill.skill_name}`}
                          className="hover:text-primary rounded-full p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-foreground-muted mb-3">Research Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s.is_interest).length === 0 && (
                    <span className="text-sm text-foreground-muted italic">None added yet</span>
                  )}
                  {skills.filter(s => s.is_interest).map(skill => (
                    <Badge key={skill.skill_id} variant="primary" className="pr-1.5 flex items-center gap-1.5">
                      <span>{skill.skill_name}</span>
                      {isOwner && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveSkill(skill.skill_id)} 
                          aria-label={`Remove interest ${skill.skill_name}`}
                          className="hover:text-primary-hover rounded-full p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {isOwner && (
                <form onSubmit={handleAddSkill} className="border-t border-border-muted dark:border-[#3D3934] pt-4 mt-6">
                  <div className="flex gap-2 mb-2.5">
                    <Input 
                      placeholder="e.g., Data Analysis" 
                      value={skillInput} 
                      onChange={(e) => setSkillInput(e.target.value)} 
                      required
                    />
                    <Button type="submit" disabled={addingSkill} className="px-3" aria-label="Add Skill">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isInterest} 
                      onChange={(e) => setIsInterest(e.target.checked)}
                      className="rounded border-border-dark dark:border-[#575048] text-primary focus:ring-primary"
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
