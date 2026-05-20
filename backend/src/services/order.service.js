/**
 * Order Service
 * Handles order validation and total amount calculation logic.
 */

import Product from '../models/product.js';

export const getProductsByIds = async (productIds) => {
  return Product.find({ _id: { $in: productIds } });
};

export const calculateTotalAmount = (products) => {
  return products.reduce((sum, product) => sum + product.price, 0);
};

export const isValidProductIdsArray = (productIds) => {
  return Array.isArray(productIds) && productIds.length > 0;
};
