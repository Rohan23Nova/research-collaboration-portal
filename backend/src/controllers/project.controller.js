// controllers/project.controller.js
import ProjectModel from '../models/project.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getProjects(req, res, next) {
  try {
    const { search, domain, status, skill_id, page, limit } = req.query;
    
    const result = await ProjectModel.findAll({
      search,
      domain,
      status,
      skillId: skill_id ? parseInt(skill_id) : null,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    });
    
    return sendSuccess(res, 'Projects fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

export async function getProjectDetails(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await ProjectModel.findById(projectId);
    
    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    // Determine the user's connection to this project for UI button state
    const connection = await ProjectModel.getUserConnection(projectId, req.user.user_id);

    return sendSuccess(res, 'Project details fetched', {
      project,
      userConnection: connection
    });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    // Only Faculty and Admin can create
    if (req.user.role !== 'FACULTY' && req.user.role !== 'ADMIN') {
      return sendError(res, 'Only faculty can create projects', 403);
    }

    const { title, description, research_domain, status, deadline, skill_ids } = req.body;
    
    // Admin can theoretically assign a leader, but for now we default to the request user
    const leaderId = req.user.user_id;

    const projectId = await ProjectModel.create(
      { title, description, research_domain, status, deadline }, 
      skill_ids || [], 
      leaderId
    );

    return sendSuccess(res, 'Project created successfully', { project_id: projectId }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await ProjectModel.findById(projectId);
    
    if (!project) return sendError(res, 'Project not found', 404);

    // Authorization: Must be leader or Admin
    if (project.leader_id !== req.user.user_id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You do not have permission to edit this project', 403);
    }

    const { title, description, research_domain, status, deadline, skill_ids } = req.body;
    
    await ProjectModel.update(
      projectId, 
      { title, description, research_domain, status, deadline }, 
      skill_ids || []
    );

    return sendSuccess(res, 'Project updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const projectId = req.params.id;
    const project = await ProjectModel.findById(projectId);
    
    if (!project) return sendError(res, 'Project not found', 404);

    if (project.leader_id !== req.user.user_id && req.user.role !== 'ADMIN') {
      return sendError(res, 'You do not have permission to delete this project', 403);
    }

    await ProjectModel.delete(projectId);
    return sendSuccess(res, 'Project deleted successfully');
  } catch (err) {
    next(err);
  }
}

// Request to join
export async function requestToJoin(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.user.user_id;
    const { message } = req.body;

    const connection = await ProjectModel.getUserConnection(projectId, userId);
    
    if (connection.isLeader) return sendError(res, 'You are already the leader', 400);
    if (connection.isMember) return sendError(res, 'You are already a member', 400);
    if (connection.hasPendingRequest) return sendError(res, 'You already have a pending request', 400);

    const requestId = await ProjectModel.submitRequest(projectId, userId, message);
    
    // In Phase 8 we will trigger a notification here. For now just return success.
    return sendSuccess(res, 'Collaboration request sent successfully', { request_id: requestId }, 201);
  } catch (err) {
    // Catch unique constraint violation (duplicate pending request)
    if (err.code === 'ER_DUP_ENTRY') {
      return sendError(res, 'You already have a pending request for this project', 409);
    }
    next(err);
  }
}

// Utility for filtering UI
export async function getDomains(req, res, next) {
  try {
    const domains = await ProjectModel.getUniqueDomains();
    return sendSuccess(res, 'Domains fetched', { domains });
  } catch (err) {
    next(err);
  }
}
