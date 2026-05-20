/**
 * Auth Routes
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Authenticate and receive JWT
 */

import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
