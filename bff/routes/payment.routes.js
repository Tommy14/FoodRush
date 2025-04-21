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
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Server error";

      console.error("BFF Login Error:", message);
      res.status(status).json({ message });
  }
});

export default router;
