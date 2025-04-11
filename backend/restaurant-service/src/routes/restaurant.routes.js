import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurant.controller.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ✅ Public route
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// ✅ Protected routes
router.post('/', authMiddleware, createRestaurant);
router.put('/:id', authMiddleware, updateRestaurant);
router.delete('/:id', authMiddleware, deleteRestaurant);

export default router;
