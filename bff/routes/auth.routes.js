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
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Server error";

      console.error("BFF Login Error:", message);
      res.status(status).json({ message });
    }
  });

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_API}/register`, req.body);
    res.json(response.data);
  } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Server error";

      console.error("BFF Login Error:", message);
      res.status(status).json({ message });
  }
});

router.get('/by/:id', async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_API}/by/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Server error";

      console.error("BFF Login Error:", message);
      res.status(status).json({ message });
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
      const status = err.response?.status || 500;
      const message = err.response?.data?.message || "Server error";

      console.error("BFF Login Error:", message);
      res.status(status).json({ message });
  }
}
);

router.get('/availability', async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_API}/availability`, {
      headers: {
        Authorization: req.headers.authorization,
      },
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
