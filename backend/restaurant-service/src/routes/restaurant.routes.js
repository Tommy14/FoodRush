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
  toggleRestaurantOpenStatus,
  deleteRestaurantImage
} from '../controllers/restaurant.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a multer upload configuration for restaurant images
const restaurantUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// 🔓 Public
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// 🔐 Restaurant Owner
router.post('/', authMiddleware, requireRole('restaurant_admin'), restaurantUpload, createRestaurant);
router.put('/:id', authMiddleware, requireRole('restaurant_admin'), restaurantUpload, updateRestaurant);
router.delete('/:id', authMiddleware, requireRole('restaurant_admin'), deleteRestaurant);
router.patch('/:id/toggle', authMiddleware, requireRole('restaurant_admin'), toggleRestaurantOpenStatus);
router.delete('/:restaurantId/images/:imageId', authMiddleware, requireRole('restaurant_admin'), deleteRestaurantImage);

// 🔐 Admin
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllRestaurantsForAdmin);
router.get('/admin/pending', authMiddleware, requireRole('admin'), getPendingRestaurants);
router.patch('/:id/approve', authMiddleware, requireRole('admin'), approveRestaurant);

export default router;