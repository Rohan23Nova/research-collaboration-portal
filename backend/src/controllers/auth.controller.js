// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, role, institution } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return sendError(res, 'Email is already registered.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const insertId = await UserModel.create(name, email, passwordHash, role, institution);

    // Fetch the newly created user (without hash) to generate token and return profile
    const newUser = await UserModel.findById(insertId);
    const token = generateToken(newUser);

    return sendSuccess(res, 'Registration successful', {
      token,
      user: newUser
    }, 201);

  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    // Don't send the password hash back
    const { password_hash, ...userProfile } = user;
    const token = generateToken(userProfile);

    return sendSuccess(res, 'Login successful', {
      token,
      user: userProfile
    });

  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    // req.user is set by authenticateToken middleware
    const user = await UserModel.findById(req.user.user_id);
    
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    return sendSuccess(res, 'User profile fetched successfully', { user });
  } catch (err) {
    next(err);
  }
}
