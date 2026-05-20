/**
 * Product Routes
 * Full CRUD endpoints for Product resource.
 * POST   /api/products     - Create product
 * GET    /api/products     - Get all products
 * GET    /api/products/:id - Get product by ID
 * PUT    /api/products/:id - Update product
 * DELETE /api/products/:id - Delete product
 */

import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
