import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();
const LOCATION_SERVICE = process.env.LOCATION_SERVICE;

// Helper function to construct the correct base URL
const getServiceBaseUrl = () => {
  const baseUrl = LOCATION_SERVICE.endsWith("/")
    ? LOCATION_SERVICE.slice(0, -1)
    : LOCATION_SERVICE;
  return baseUrl;
};

// Helper to build full API URL
const buildUrl = (path) => {
  return `${getServiceBaseUrl()}${path}`;
};

// 🟢 PUBLIC: Geocode an address to coordinates
router.post('/geocode', async (req, res) => {
  try {
    const url = buildUrl('/geocode');
    const response = await axios.post(url, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Geocoding error:', err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// 🟢 PUBLIC: Reverse geocode coordinates to address
router.get('/reverse-geocode', async (req, res) => {
  try {
    const url = buildUrl('/reverse-geocode');
    const response = await axios.get(url, { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error('Reverse geocoding error:', err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// 🟢 PUBLIC: Find nearby restaurants
router.get('/nearby', async (req, res) => {
  try {
    const url = buildUrl('/nearby');
    const response = await axios.get(url, { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error('Nearby search error:', err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// 🔐 PROTECTED: Save location (requires authentication)
router.post('/', authenticate, async (req, res) => {
  try {
    const url = buildUrl('');
    const response = await axios.post(
      url,
      req.body,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Save location error:', err.message);
    res.status(err.response?.status || 403).json({ message: err.message });
  }
});

// 🟢 PUBLIC: Get location by entity
router.get('/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const url = buildUrl(`/${entityType}/${entityId}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Get location error:', err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;