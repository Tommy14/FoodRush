import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const AUTH_API = process.env.AUTH_SERVICE;

router.post('/login', async (req, res) => {
    try {
      const response = await axios.post(`${AUTH_API}/login`, req.body);
      res.json(response.data);
    } catch (err) {
      console.error(err.message); // 🔍 Print error for debugging
      res.status(err.response?.status || 500).json({ message: err.message });
    }
  });

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_API}/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || err.message });
  }
});

router.patch('/toggle-availability', async (req, res) => {
  try {
    const response = await axios.patch(`${AUTH_API}/toggle-availability`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.response?.data?.message || err.message });
  }
}
);

export default router;
