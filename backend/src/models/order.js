/**
 * Order Model (MongoDB / Mongoose)
 * Represents a customer order.
 * - userId: References the MySQL user id (stored as an integer).
 * - productIds: Array of MongoDB Product ObjectIds.
 * - totalAmount: Calculated total for the order.
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: [true, 'User ID is required'],
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be a positive number'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to provide a clean orderId alias
orderSchema.virtual('orderId').get(function () {
  return this._id.toHexString();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
