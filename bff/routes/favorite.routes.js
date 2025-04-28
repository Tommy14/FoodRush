import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:9100';

// Get user favorites
router.get('/', authenticate, async (req, res) => {
  try {
    const response = await axios.get(
      `${RESTAURANT_SERVICE_URL}/api/favorites`,
      {
        headers: { Authorization: req.headers.authorization }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching favorites'
    });
  }
});

// Toggle favorite status
router.post('/:restaurantId', authenticate, async (req, res) => {
  try {
    const response = await axios.post(
      `${RESTAURANT_SERVICE_URL}/api/favorites/${req.params.restaurantId}`,
      {},
      {
        headers: { Authorization: req.headers.authorization }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error updating favorite'
    });
  }
});

// Check favorite status
router.get('/:restaurantId/status', authenticate, async (req, res) => {
  try {
    const response = await axios.get(
      `${RESTAURANT_SERVICE_URL}/api/favorites/${req.params.restaurantId}/status`,
      {
        headers: { Authorization: req.headers.authorization }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error checking favorite status'
    });
  }
});

export default router;