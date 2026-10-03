// controllers/skill.controller.js
import SkillModel from '../models/skill.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function searchSkills(req, res, next) {
  try {
    const query = req.query.q || '';
    if (query.length < 2) {
      return sendSuccess(res, 'Search requires at least 2 characters', { skills: [] });
    }

    const skills = await SkillModel.search(query);
    return sendSuccess(res, 'Skills fetched', { skills });
  } catch (err) {
    next(err);
  }
}

// Global skill creation (usually by Admin, but we let anyone create a skill via profile edit implicitly)
// This explicit endpoint is useful if Admin wants to seed skills manually.
export async function createSkill(req, res, next) {
  try {
    const { skill_name } = req.body;
    
    const existing = await SkillModel.findByName(skill_name);
    if (existing) {
      return sendError(res, 'Skill already exists', 409);
    }

    const skillId = await SkillModel.create(skill_name);
    return sendSuccess(res, 'Skill created successfully', { skill_id: skillId, skill_name }, 201);
  } catch (err) {
    next(err);
  }
}
