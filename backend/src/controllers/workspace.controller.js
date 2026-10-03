// controllers/workspace.controller.js
import fs from 'fs';
import path from 'path';
import WorkspaceModel from '../models/workspace.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Documents ──────────────────────────────────────────────────────────
export async function getDocuments(req, res, next) {
  try {
    const docs = await WorkspaceModel.getDocuments(req.params.projectId);
    return sendSuccess(res, 'Documents fetched', { documents: docs });
  } catch (err) { next(err); }
}

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return sendError(res, 'No file provided', 400);
    const projectId = req.params.projectId;
    const uploaderId = req.user.user_id;
    const originalName = req.file.originalname;
    // Store relative path in DB
    const filePath = `uploads/documents/${req.file.filename}`;

    const docId = await WorkspaceModel.addDocument(projectId, uploaderId, originalName, filePath);
    return sendSuccess(res, 'Document uploaded', { document_id: docId }, 201);
  } catch (err) { next(err); }
}

export async function downloadDocument(req, res, next) {
  try {
    const doc = await WorkspaceModel.getDocumentPath(req.params.docId);
    if (!doc) return sendError(res, 'Document not found', 404);

    const absPath = path.join(process.cwd(), doc.file_path);
    if (!fs.existsSync(absPath)) return sendError(res, 'File missing on server', 404);

    res.download(absPath, doc.file_name);
  } catch (err) { next(err); }
}

export async function deleteDocument(req, res, next) {
  try {
    const doc = await WorkspaceModel.getDocumentPath(req.params.docId);
    if (!doc) return sendError(res, 'Document not found', 404);

    // Only leader or uploader can delete
    if (req.projectRole !== 'Leader' && doc.uploaded_by !== req.user.user_id && req.user.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized to delete this document', 403);
    }

    const absPath = path.join(process.cwd(), doc.file_path);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await WorkspaceModel.deleteDocument(req.params.docId);
    return sendSuccess(res, 'Document deleted');
  } catch (err) { next(err); }
}

// ── Milestones & Tasks ──────────────────────────────────────────────────
export async function getMilestones(req, res, next) {
  try {
    const milestones = await WorkspaceModel.getMilestones(req.params.projectId);
    return sendSuccess(res, 'Milestones fetched', { milestones });
  } catch (err) { next(err); }
}

export async function createMilestone(req, res, next) {
  try {
    const { title, description, due_date } = req.body;
    const id = await WorkspaceModel.addMilestone(req.params.projectId, title, description, due_date);
    return sendSuccess(res, 'Milestone created', { milestone_id: id }, 201);
  } catch (err) { next(err); }
}

export async function createTask(req, res, next) {
  try {
    const { assigned_to, title, description, due_date } = req.body;
    const id = await WorkspaceModel.addTask(req.params.milestoneId, assigned_to, title, description, due_date);
    return sendSuccess(res, 'Task created', { task_id: id }, 201);
  } catch (err) { next(err); }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const task = await WorkspaceModel.getTask(req.params.taskId);
    if (!task) return sendError(res, 'Task not found', 404);

    // Only assignee, leader, or admin can update status
    if (req.projectRole !== 'Leader' && task.assigned_to !== req.user.user_id && req.user.role !== 'ADMIN') {
      return sendError(res, 'Unauthorized to update this task', 403);
    }

    await WorkspaceModel.updateTaskStatus(req.params.taskId, req.body.status);
    return sendSuccess(res, 'Task status updated');
  } catch (err) { next(err); }
}

// ── Progress Reports ────────────────────────────────────────────────────
export async function getReports(req, res, next) {
  try {
    const reports = await WorkspaceModel.getReports(req.params.projectId);
    return sendSuccess(res, 'Reports fetched', { reports });
  } catch (err) { next(err); }
}

export async function createReport(req, res, next) {
  try {
    const { content } = req.body;
    const id = await WorkspaceModel.addReport(req.params.projectId, req.user.user_id, content);
    return sendSuccess(res, 'Report submitted', { report_id: id }, 201);
  } catch (err) { next(err); }
}
