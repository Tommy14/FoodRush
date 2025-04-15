import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js'; // Optional: apply if needed later

dotenv.config();

const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;

// Public: View Menu Items of a Restaurant
router.get('/:id/menu', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE}/${req.params.id}/menu`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Protected: Add a Menu Item
router.post('/:id/menu', async (req, res) => {
  try {
    const response = await axios.post(`${RESTAURANT_SERVICE}/${req.params.id}/menu`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Protected: Update a Menu Item
router.put('/:id/menu/:itemId', async (req, res) => {
  try {
    const response = await axios.put(`${RESTAURANT_SERVICE}/${req.params.id}/menu/${req.params.itemId}`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Protected: Delete a Menu Item
router.delete('/:id/menu/:itemId', async (req, res) => {
  try {
    const response = await axios.delete(`${RESTAURANT_SERVICE}/${req.params.id}/menu/${req.params.itemId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;
