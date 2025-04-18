import express from 'express';
import {
  addReview,
  getRestaurantReviews,
  getRestaurantReviewSummary,
  updateReview,
  deleteReview,
  toggleReaction
} from '../controllers/review.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Public
router.get('/restaurants/:restaurantId/reviews', getRestaurantReviews);
router.get('/restaurants/:restaurantId/reviews/summary', getRestaurantReviewSummary);

// Customer protected
router.post('/restaurants/:restaurantId/reviews', authMiddleware, requireRole('customer'), addReview);
router.put('/restaurants/:restaurantId/reviews/:reviewId', authMiddleware, requireRole('customer'), updateReview);
router.delete('/restaurants/:restaurantId/reviews/:reviewId', authMiddleware, requireRole('customer'), deleteReview);
router.patch('/restaurants/:restaurantId/reviews/:reviewId/react', authMiddleware, requireRole('customer'), toggleReaction);
export default router;
