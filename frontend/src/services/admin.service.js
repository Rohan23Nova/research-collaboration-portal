// services/admin.service.js
import api from './api';

export const adminService = {
  // Users
  async getUsers() {
    const res = await api.get('/admin/users');
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async deleteUser(userId) {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  // Skills
  async getSkills() {
    const res = await api.get('/admin/skills');
    return res.data;
  },

  async createSkill(skillName) {
    const res = await api.post('/admin/skills', { skill_name: skillName });
    return res.data;
  },

  async updateSkill(skillId, skillName) {
    const res = await api.put(`/admin/skills/${skillId}`, { skill_name: skillName });
    return res.data;
  },

  async deleteSkill(skillId) {
    const res = await api.delete(`/admin/skills/${skillId}`);
    return res.data;
  }
};

export default adminService;
