import express from 'express';
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// Public menu viewing
router.get('/:id/menu', getMenuItems);

// Protected for restaurant_admin
router.post('/:id/menu', authMiddleware, requireRole('restaurant_admin'), addMenuItem);
router.put('/:id/menu/:itemId', authMiddleware, requireRole('restaurant_admin'), updateMenuItem);
router.delete('/:id/menu/:itemId', authMiddleware, requireRole('restaurant_admin'), deleteMenuItem);

export default router;
