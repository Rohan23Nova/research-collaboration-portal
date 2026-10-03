// controllers/dashboard.controller.js
import DashboardModel from '../models/dashboard.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getDashboard(req, res, next) {
  try {
    const { role, user_id } = req.user;
    let data = {};

    if (role === 'ADMIN') {
      data = await DashboardModel.getAdminStats();
    } else if (role === 'FACULTY') {
      data = await DashboardModel.getFacultyStats(user_id);
    } else {
      // STUDENT and EXTERNAL share similar dashboard logic
      data = await DashboardModel.getStudentStats(user_id);
    }

    return sendSuccess(res, 'Dashboard data fetched', { ...data, role });
  } catch (err) {
    next(err);
  }
}
