/**
 * Order Controller
 * Handles creation, retrieval, update, and deletion of Orders (MongoDB).
 * All routes are protected by JWT middleware.
 */

import Order from '../models/order.js';
import { getProductsByIds, calculateTotalAmount, isValidProductIdsArray } from '../services/order.service.js';

/**
 * POST /api/orders
 * Creates a new order for the authenticated user.
 */
export const createOrder = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.user.id; // Extracted from JWT by auth middleware

    // ── Validation ───────────────────────────────────────────────
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'productIds array is required and cannot be empty.',
      });
    }

    // ── Verify all products exist and calculate total ─────────────
    const products = await getProductsByIds(productIds);

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more product IDs are invalid.',
      });
    }

    const totalAmount = calculateTotalAmount(products);

    // ── Create order ─────────────────────────────────────────────
    const order = await Order.create({
      userId,
      productIds,
      totalAmount,
    });

    // Populate product details in the response
    const populatedOrder = await Order.findById(order._id).populate('productIds');

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: populatedOrder,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * GET /api/orders
 * Retrieves all orders for the authenticated user.
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate('productIds')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get User Orders Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * GET /api/orders/:id
 * Retrieves a single order by ID (must belong to authenticated user).
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productIds');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This order does not belong to you.',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get Order Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * PUT /api/orders/:id
 * Updates an existing order (e.g., change products).
 */
export const updateOrder = async (req, res) => {
  try {
    const { productIds } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This order does not belong to you.',
      });
    }

    // Validate new product IDs if provided
    if (productIds && isValidProductIdsArray(productIds)) {
      const products = await getProductsByIds(productIds);
      if (products.length !== productIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more product IDs are invalid.',
        });
      }
      order.productIds = productIds;
      order.totalAmount = calculateTotalAmount(products);
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id).populate('productIds');

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * DELETE /api/orders/:id
 * Deletes an order (must belong to authenticated user).
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Ensure the order belongs to the authenticated user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This order does not belong to you.',
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Order Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
