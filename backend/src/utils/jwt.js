// utils/jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
