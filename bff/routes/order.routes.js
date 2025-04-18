import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const ORDER_API = process.env.ORDER_SERVICE;

router.use(authenticate);

// Place an order
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_API}`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Get all orders for user
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_API}`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Get acive orders for user
router.get('/active', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_API}/active`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});
export default router;

//get order by id
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_API}/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});
