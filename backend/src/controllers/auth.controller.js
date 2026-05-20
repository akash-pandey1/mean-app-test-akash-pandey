/**
 * Auth Controller
 * Handles user registration and login with bcrypt password hashing
 * and JWT token generation.
 */

import User from '../models/user.js';
import { hashPassword, comparePassword, generateToken } from '../services/auth.service.js';

/**
 * POST /api/auth/register
 * Registers a new user account.
 */
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ── Validation ───────────────────────────────────────────────
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists.',
      });
    }

    // ── Hash password & create user ──────────────────────────────
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    // Return user info (without password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user credentials and returns a JWT token.
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ── Validation ───────────────────────────────────────────────
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    // ── Find user by username ────────────────────────────────────
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // ── Compare password ─────────────────────────────────────────
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // ── Generate JWT ─────────────────────────────────────────────
    const token = generateToken({ id: user.id, username: user.username });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        id: user.id,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};
