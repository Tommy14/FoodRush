import express from 'express';
import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/order.controller.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 🔐 All routes require authentication
router.use(authMiddleware);

// 📦 Place a new order (Customer)
router.post('/', placeOrder);

// 📄 Get all orders (Customer or Restaurant Admin)
router.get('/', getOrders);

// 🧾 Get single order by ID
router.get('/:id', getOrderById);

// 🔁 Update order status (Restaurant or Delivery Personnel)
router.put('/:id/status', updateOrderStatus);

// ❌ Cancel order (Customer)
router.patch('/:id/cancel', cancelOrder);

export default router;
