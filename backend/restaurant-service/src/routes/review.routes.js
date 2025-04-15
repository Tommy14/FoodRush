import express from 'express';
import {
  addReview,
  getRestaurantReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// 🔓 Public
router.get('/:restaurantId', getRestaurantReviews);

// 🔐 Customers only
router.post('/:restaurantId', authMiddleware, requireRole('customer'), addReview);
router.put('/:restaurantId', authMiddleware, requireRole('customer'), updateReview);
router.delete('/:restaurantId', authMiddleware, requireRole('customer'), deleteReview);

export default router;
