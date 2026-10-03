// middleware/project.middleware.js
import pool from '../config/db.js';
import { sendError } from '../utils/response.js';

export const requireMember = async (req, res, next) => {
  try {
    // Admin can bypass
    if (req.user.role === 'ADMIN') return next();

    // The project ID might be in req.params.projectId or req.params.id depending on the mount path
    const projectId = req.params.projectId || req.params.id;
    
    if (!projectId) {
      return sendError(res, 'Project ID missing in request', 400);
    }

    const [rows] = await pool.query(
      'SELECT role FROM ProjectMember WHERE project_id = ? AND user_id = ?',
      [projectId, req.user.user_id]
    );

    if (rows.length === 0) {
      return sendError(res, 'Access denied. You are not a member of this project.', 403);
    }

    // Attach membership role to request for downstream use (e.g. Leader-only actions)
    req.projectRole = rows[0].role;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireLeader = (req, res, next) => {
  if (req.user.role === 'ADMIN') return next();
  if (req.projectRole !== 'Leader') {
    return sendError(res, 'Access denied. Only the project leader can perform this action.', 403);
  }
  next();
};
