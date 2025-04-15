import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const RESTAURANT_API = process.env.RESTAURANT_SERVICE;

router.use(authenticate);

// Public: Get all approved restaurants
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Public: Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Create restaurant
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${RESTAURANT_API}/`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Update restaurant
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${RESTAURANT_API}/${req.params.id}`, req.body, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Delete restaurant
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${RESTAURANT_API}/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Get all restaurants
router.get('/admin/all', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/admin/all`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Get pending restaurants
router.get('/admin/pending', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/admin/pending`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Approve restaurant
router.patch('/:id/approve', async (req, res) => {
  try {
    const response = await axios.patch(`${RESTAURANT_API}/${req.params.id}/approve`, {}, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Toggle open status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const response = await axios.patch(`${RESTAURANT_API}/${req.params.id}/toggle`, {}, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;