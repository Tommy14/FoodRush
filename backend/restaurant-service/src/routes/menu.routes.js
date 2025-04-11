import express from 'express';
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.controller.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 🔐 All routes below are protected by JWT
router.post('/restaurants/:id/menu', authMiddleware, addMenuItem);
router.get('/restaurants/:id/menu', getMenuItems); // public (optional: protect later)
router.put('/restaurants/:id/menu/:itemId', authMiddleware, updateMenuItem);
router.delete('/restaurants/:id/menu/:itemId', authMiddleware, deleteMenuItem);

export default router;
