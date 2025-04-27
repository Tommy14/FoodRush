import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getUserFavorites, toggleFavorite, checkFavoriteStatus } from '../controllers/favoriteController.js';

const router = express.Router();

// Get all favorites for the current user
router.get('/', authMiddleware, getUserFavorites);

// Toggle favorite status for a restaurant
router.post('/:restaurantId', authMiddleware, toggleFavorite);

// Check if a restaurant is favorited
router.get('/:restaurantId/status', authMiddleware, checkFavoriteStatus);

export default router;