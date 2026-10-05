// services/project.service.js
import api from './api';

export const projectService = {
  async getDomains() {
    const res = await api.get('/projects/domains');
    return res.data;
  },

  async getProjects({ search = '', domain = '', status = '', skillId = null, page = 1, limit = 9 } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (domain) params.append('domain', domain);
    if (status) params.append('status', status);
    if (skillId) params.append('skill_id', skillId);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const res = await api.get(`/projects?${params.toString()}`);
    return res.data;
  },

  async getProjectDetails(projectId) {
    const res = await api.get(`/projects/${projectId}`);
    return res.data;
  },

  async createProject(data) {
    const res = await api.post('/projects', data);
    return res.data;
  },

  async updateProject(projectId, data) {
    const res = await api.put(`/projects/${projectId}`, data);
    return res.data;
  },

  async deleteProject(projectId) {
    const res = await api.delete(`/projects/${projectId}`);
    return res.data;
  },

  async requestToJoin(projectId, message = '') {
    const res = await api.post(`/projects/${projectId}/requests`, { message });
    return res.data;
  }
};

export default projectService;
