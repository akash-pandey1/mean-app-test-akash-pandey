/**
 * Order Routes
 * All routes are protected by JWT authentication middleware.
 * POST   /api/orders     - Create order
 * GET    /api/orders     - Get user's orders
 * GET    /api/orders/:id - Get order by ID
 * PUT    /api/orders/:id - Update order
 * DELETE /api/orders/:id - Delete order
 */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/order.controller.js';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
