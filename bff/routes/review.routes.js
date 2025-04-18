import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;

// Helper function to construct the correct base URL
const getServiceBaseUrl = () => {
  const baseUrl = RESTAURANT_SERVICE.endsWith("/")
    ? RESTAURANT_SERVICE.slice(0, -1)
    : RESTAURANT_SERVICE;
  return baseUrl.replace("/api/restaurants", "");
};

// Helper to build full API URL
const buildUrl = (path) => {
  return `${getServiceBaseUrl()}/api/reviews/${path}`;
};

// PUBLIC: Get all reviews for a restaurant with pagination and sorting
router.get("/restaurants/:restaurantId/reviews", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page, limit, sort } = req.query;

    const url = buildUrl(`restaurants/${restaurantId}/reviews`);
    const response = await axios.get(url, { params: { page, limit, sort } });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// PUBLIC: Get review summary (average rating, total count)
router.get("/restaurants/:restaurantId/reviews/summary", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const url = buildUrl(`restaurants/${restaurantId}/reviews/summary`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching review summary:", err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// CUSTOMER: Add review for a restaurant
router.post(
  "/restaurants/:restaurantId/reviews",
  authenticate,
  async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const url = buildUrl(`restaurants/${restaurantId}/reviews`);
      
      const response = await axios.post(
        url,
        req.body,
        { headers: { Authorization: req.headers.authorization } }
      );
      res.status(201).json(response.data);
    } catch (err) {
      console.error('Error adding review:', err.message);
      res.status(err.response?.status || 403).json({ message: err.message });
    }
  }
);

// CUSTOMER: Update an existing review
router.put(
  "/restaurants/:restaurantId/reviews/:reviewId",
  authenticate,
  async (req, res) => {
    try {
      const { restaurantId, reviewId } = req.params;
      const url = buildUrl(`restaurants/${restaurantId}/reviews/${reviewId}`);
      
      const response = await axios.put(
        url,
        req.body,
        { headers: { Authorization: req.headers.authorization } }
      );
      res.json(response.data);
    } catch (err) {
      console.error('Error updating review:', err.message);
      res.status(err.response?.status || 403).json({ message: err.message });
    }
  }
);

// CUSTOMER: Delete a review
router.delete(
  "/restaurants/:restaurantId/reviews/:reviewId",
  authenticate,
  async (req, res) => {
    try {
      const { restaurantId, reviewId } = req.params;
      const url = buildUrl(`restaurants/${restaurantId}/reviews/${reviewId}`);
      
      const response = await axios.delete(
        url,
        { headers: { Authorization: req.headers.authorization } }
      );
      res.json(response.data);
    } catch (err) {
      console.error('Error deleting review:', err.message);
      res.status(err.response?.status || 403).json({ message: err.message });
    }
  }
);

// 🔐 CUSTOMER: Toggle reaction (like/dislike) on a review
router.patch(
  "/restaurants/:restaurantId/reviews/:reviewId/react",
  authenticate,
  async (req, res) => {
    try {
      const { restaurantId, reviewId } = req.params;
      const url = buildUrl(`restaurants/${restaurantId}/reviews/${reviewId}/react`);
      
      const response = await axios.patch(
        url,
        req.body,
        { headers: { Authorization: req.headers.authorization } }
      );
      res.json(response.data);
    } catch (err) {
      console.error('Error toggling reaction:', err.message);
      res.status(err.response?.status || 403).json({ message: err.message });
    }
  }
);

export default router;