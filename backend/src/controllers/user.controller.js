// controllers/user.controller.js
import fs from 'fs';
import path from 'path';
import UserModel from '../models/user.model.js';
import SkillModel from '../models/skill.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Authorization helper
const isSelfOrAdmin = (req, userId) => {
  return req.user.role === 'ADMIN' || req.user.user_id === parseInt(userId);
};

export async function getProfile(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);

    const skills = await SkillModel.getUserSkills(userId);
    return sendSuccess(res, 'Profile fetched', { user, skills });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.params.id;
    if (!isSelfOrAdmin(req, userId)) {
      return sendError(res, 'You can only edit your own profile', 403);
    }

    const { name, bio, institution } = req.body;
    await UserModel.updateProfile(userId, { name, bio, institution });
    
    const updatedUser = await UserModel.findById(userId);
    return sendSuccess(res, 'Profile updated successfully', { user: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(req, res, next) {
  try {
    const userId = req.params.id;
    if (!isSelfOrAdmin(req, userId)) {
      // Clean up uploaded file since user is unauthorized
      if (req.file) fs.unlinkSync(req.file.path);
      return sendError(res, 'You can only edit your own profile', 403);
    }

    if (!req.file) {
      return sendError(res, 'No image file provided', 400);
    }

    // Relative path to store in DB: uploads/profiles/filename.ext
    const relativePath = `uploads/profiles/${req.file.filename}`;
    
    // Check if user already had an image, to delete the old one
    const user = await UserModel.findById(userId);
    if (user && user.profile_image) {
      const oldPath = path.join(process.cwd(), user.profile_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await UserModel.updateProfileImage(userId, relativePath);
    return sendSuccess(res, 'Profile image updated', { profile_image: relativePath });
  } catch (err) {
    next(err);
  }
}

export async function serveImage(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user || !user.profile_image) {
      return res.status(404).send('Image not found');
    }

    const absolutePath = path.join(process.cwd(), user.profile_image);
    if (fs.existsSync(absolutePath)) {
      return res.sendFile(absolutePath);
    } else {
      return res.status(404).send('Image file missing on server');
    }
  } catch (err) {
    next(err);
  }
}

export async function addSkill(req, res, next) {
  try {
    const userId = req.params.id;
    if (!isSelfOrAdmin(req, userId)) {
      return sendError(res, 'You can only edit your own skills', 403);
    }

    const { skill_name, is_interest } = req.body;
    let skill = await SkillModel.findByName(skill_name);
    
    // Create skill if it doesn't exist
    let skillId;
    if (!skill) {
      skillId = await SkillModel.create(skill_name);
    } else {
      skillId = skill.skill_id;
    }

    await SkillModel.addUserSkill(userId, skillId, is_interest ? 1 : 0);
    
    const updatedSkills = await SkillModel.getUserSkills(userId);
    return sendSuccess(res, 'Skill added', { skills: updatedSkills });
  } catch (err) {
    next(err);
  }
}

export async function removeSkill(req, res, next) {
  try {
    const userId = req.params.id;
    const skillId = req.params.skillId;
    
    if (!isSelfOrAdmin(req, userId)) {
      return sendError(res, 'You can only edit your own skills', 403);
    }

    await SkillModel.removeUserSkill(userId, skillId);
    return sendSuccess(res, 'Skill removed successfully');
  } catch (err) {
    next(err);
  }
}
