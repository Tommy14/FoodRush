import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getAllRestaurantsForAdmin,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getPendingRestaurants,
  updateRestaurantStatus,
  toggleRestaurantOpenStatus,
  deleteRestaurantImage,
  getOwnerRestaurants
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

// Public Routes
router.get('/', getAllRestaurants);

// Restaurant Owner Routes - Specific routes first
router.get('/owner', authMiddleware, requireRole('restaurant_admin'), getOwnerRestaurants);
router.post('/', authMiddleware, requireRole('restaurant_admin'), restaurantUpload, createRestaurant);

// Admin Routes
router.get('/admin/all', authMiddleware, requireRole('admin'), getAllRestaurantsForAdmin);
router.get('/admin/pending', authMiddleware, requireRole('admin'), getPendingRestaurants);

// Parameterized routes last
router.get('/:id', getRestaurantById);
router.put('/:id', authMiddleware, requireRole('restaurant_admin'), restaurantUpload, updateRestaurant);
router.delete('/:id', authMiddleware, requireRole('restaurant_admin'), deleteRestaurant);
router.patch('/:id/toggle', authMiddleware, requireRole('restaurant_admin'), toggleRestaurantOpenStatus);
router.patch('/:id/approve', authMiddleware, requireRole('admin'), (req, res) => {req.body.status = 'APPROVED';updateRestaurantStatus(req, res)});
router.patch('/:id/status', authMiddleware, requireRole('admin'), updateRestaurantStatus);
router.delete('/:restaurantId/images/:imageId', authMiddleware, requireRole('restaurant_admin'), deleteRestaurantImage);

export default router;