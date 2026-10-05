// services/workspace.service.js
import api from './api';

export const workspaceService = {
  // Documents
  async getDocuments(projectId) {
    const res = await api.get(`/projects/${projectId}/workspace/documents`);
    return res.data;
  },

  async uploadDocument(projectId, file) {
    const formData = new FormData();
    formData.append('document', file);
    const res = await api.post(`/projects/${projectId}/workspace/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async downloadDocument(projectId, docId) {
    const res = await api.get(`/projects/${projectId}/workspace/documents/${docId}/download`, {
      responseType: 'blob'
    });
    return res.data;
  },

  async deleteDocument(projectId, docId) {
    const res = await api.delete(`/projects/${projectId}/workspace/documents/${docId}`);
    return res.data;
  },

  // Milestones & Tasks
  async getMilestones(projectId) {
    const res = await api.get(`/projects/${projectId}/workspace/milestones`);
    return res.data;
  },

  async createMilestone(projectId, data) {
    const res = await api.post(`/projects/${projectId}/workspace/milestones`, data);
    return res.data;
  },

  async createTask(projectId, milestoneId, data) {
    const res = await api.post(`/projects/${projectId}/workspace/milestones/${milestoneId}/tasks`, data);
    return res.data;
  },

  async updateTaskStatus(projectId, taskId, status) {
    const res = await api.put(`/projects/${projectId}/workspace/tasks/${taskId}/status`, { status });
    return res.data;
  },

  // Reports
  async getReports(projectId) {
    const res = await api.get(`/projects/${projectId}/workspace/reports`);
    return res.data;
  },

  async createReport(projectId, content) {
    const res = await api.post(`/projects/${projectId}/workspace/reports`, { content });
    return res.data;
  },

  // Messages / Chat
  async getMessages(projectId) {
    const res = await api.get(`/projects/${projectId}/workspace/messages`);
    return res.data;
  },

  async sendMessage(projectId, message) {
    const res = await api.post(`/projects/${projectId}/workspace/messages`, { message });
    return res.data;
  }
};

export default workspaceService;
