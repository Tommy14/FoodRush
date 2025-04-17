import express from 'express';
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById
} from '../controllers/menu.controller.js';

import authMiddleware from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Configure multer for menu item images
const menuItemUpload = upload.fields([
  { name: 'image', maxCount: 1 }
]);

// Public menu viewing
router.get('/:id/menu', getMenuItems);
router.get('/:id/menu/:itemId', getMenuItemById);

// Protected for restaurant_admin
router.post('/:id/menu', authMiddleware, requireRole('restaurant_admin'), menuItemUpload, addMenuItem);
router.put('/:id/menu/:itemId', authMiddleware, requireRole('restaurant_admin'), menuItemUpload, updateMenuItem);
router.delete('/:id/menu/:itemId', authMiddleware, requireRole('restaurant_admin'), deleteMenuItem);

export default router;
