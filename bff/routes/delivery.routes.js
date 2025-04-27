import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const DELIVERY_API = process.env.DELIVERY_SERVICE;

router.use(authenticate);

// Assign delivery
router.post('/assign', async (req, res) => {
  try {
    const response = await axios.post(`${DELIVERY_API}/assign`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Update delivery status
router.put('/:id/status', async (req, res) => {
  const deliveryId = req.params.id;
  const { status } = req.body;

  try {
    const response = await axios.put(`${DELIVERY_API}/${deliveryId}/status`, { status }, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Get deliveries assigned to current user
router.get('/my-deliveries', async (req, res) => {
  try {
    const response = await axios.get(`${DELIVERY_API}/my-deliveries`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Get completed deliveries by current user
router.get('/my-deliveries/completed', async (req, res) => {
  try {
    const response = await axios.get(`${DELIVERY_API}/my-deliveries/completed`, {
      headers: {
        Authorization: req.headers.authorization,
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

//get delivery by delivery id
router.get('/by/:id', async (req, res) => {
  const deliveryId = req.params.id;

  try {
    const response = await axios.get(`${DELIVERY_API}/by/${deliveryId}`, {
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
