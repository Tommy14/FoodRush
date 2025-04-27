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

// Get all orders for a customer
router.get('/customer/:customerId', async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const response = await axios.get(`${ORDER_API}/customer/${customerId}`, {
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

//get order by restaurant id
router.get('/restaurant/:restaurantId', async (req, res) => {
  const restaurantId = req.params.restaurantId;
  try {
    const response = await axios.get(`${ORDER_API}/restaurant/${restaurantId}`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

//update order status
router.put('/:orderId/status', async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const response = await axios.put(`${ORDER_API}/${orderId}/status`, req.body, {
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
