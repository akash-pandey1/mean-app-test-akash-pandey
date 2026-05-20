/**
 * Auth Service
 * Encapsulates password hashing and JWT creation/verification logic.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '24h';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in the environment.');
}

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (plaintext, hashed) => {
  return bcrypt.compare(plaintext, hashed);
};

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
