// services/user.service.js
import api from './api';

export const userService = {
  async getProfile(userId) {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  async updateProfile(userId, data) {
    const res = await api.put(`/users/${userId}`, data);
    return res.data;
  },

  async uploadProfileImage(userId, file) {
    const formData = new FormData();
    formData.append('profile_image', file);
    const res = await api.post(`/users/${userId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async addSkill(userId, skillName, isInterest = false) {
    const res = await api.post(`/users/${userId}/skills`, {
      skill_name: skillName,
      is_interest: isInterest
    });
    return res.data;
  },

  async removeSkill(userId, skillId) {
    const res = await api.delete(`/users/${userId}/skills/${skillId}`);
    return res.data;
  }
};

export default userService;
