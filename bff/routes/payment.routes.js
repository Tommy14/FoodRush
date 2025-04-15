import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const PAYMENT_API = process.env.PAYMENT_SERVICE;

// router.use(authenticate);

// checkout payment
router.post('/checkout', async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_API}/initiate`, req.body, {
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
