// controllers/admin.controller.js
import AdminModel from '../models/admin.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getUsers(req, res, next) {
  try {
    const users = await AdminModel.getAllUsers();
    sendSuccess(res, 'Users fetched', { users });
  } catch (err) { next(err); }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['STUDENT', 'FACULTY', 'EXTERNAL', 'ADMIN'].includes(role)) {
      return sendError(res, 'Invalid role', 400);
    }
    
    // Prevent removing the last admin (basic safeguard)
    if (req.user.user_id === parseInt(req.params.id) && role !== 'ADMIN') {
      return sendError(res, 'You cannot change your own admin role', 400);
    }

    await AdminModel.updateUserRole(req.params.id, role);
    sendSuccess(res, 'Role updated successfully');
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    if (req.user.user_id === parseInt(req.params.id)) {
      return sendError(res, 'You cannot delete yourself', 400);
    }
    await AdminModel.deleteUser(req.params.id);
    sendSuccess(res, 'User deleted successfully');
  } catch (err) { next(err); }
}

export async function getSkills(req, res, next) {
  try {
    const skills = await AdminModel.getAllSkills();
    sendSuccess(res, 'Skills fetched', { skills });
  } catch (err) { next(err); }
}

export async function createSkill(req, res, next) {
  try {
    const { skill_name } = req.body;
    const id = await AdminModel.createSkill(skill_name);
    sendSuccess(res, 'Skill created', { skill_id: id }, 201);
  } catch (err) { next(err); }
}

export async function updateSkill(req, res, next) {
  try {
    const { skill_name } = req.body;
    await AdminModel.updateSkill(req.params.id, skill_name);
    sendSuccess(res, 'Skill updated');
  } catch (err) { next(err); }
}

export async function deleteSkill(req, res, next) {
  try {
    await AdminModel.deleteSkill(req.params.id);
    sendSuccess(res, 'Skill deleted');
  } catch (err) { next(err); }
}
