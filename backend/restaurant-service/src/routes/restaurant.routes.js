import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getAllRestaurantsForAdmin,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  toggleRestaurantOpenStatus
} from '../controllers/restaurant.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// 🔓 Public
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// 🔐 Restaurant Owner
router.post('/', authMiddleware, requireRole('restaurant_admin'), createRestaurant);
router.put('/:id', authMiddleware, requireRole('restaurant_admin'), updateRestaurant);
router.delete('/:id', authMiddleware, requireRole('restaurant_admin'), deleteRestaurant);
router.patch('/:id/toggle', authMiddleware, requireRole('restaurant_admin'), toggleRestaurantOpenStatus);

// 🔐 Admin
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllRestaurantsForAdmin);
router.get('/admin/pending', authMiddleware, requireRole('admin'), getPendingRestaurants);
router.patch('/:id/approve', authMiddleware, requireRole('admin'), approveRestaurant);

export default router;
