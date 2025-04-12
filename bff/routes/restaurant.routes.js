import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const RESTAURANT_API = process.env.RESTAURANT_SERVICE;

router.use(authenticate);

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Create a restaurant
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${RESTAURANT_API}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;
