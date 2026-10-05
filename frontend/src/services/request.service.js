// services/request.service.js
import api from './api';

export const requestService = {
  async getMyRequests() {
    const res = await api.get('/requests/my-requests');
    return res.data;
  },

  async getIncomingRequests() {
    const res = await api.get('/requests/incoming');
    return res.data;
  },

  async acceptRequest(requestId) {
    const res = await api.put(`/requests/${requestId}/accept`);
    return res.data;
  },

  async rejectRequest(requestId) {
    const res = await api.put(`/requests/${requestId}/reject`);
    return res.data;
  }
};

export default requestService;
