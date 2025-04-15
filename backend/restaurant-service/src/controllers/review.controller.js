import * as reviewService from '../services/review.service.js';

export const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.params.restaurantId, req.user.userId, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const data = await reviewService.getRestaurantReviews(req.params.restaurantId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(req.params.restaurantId, req.user.userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Review not found or not yours' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deleted = await reviewService.deleteReview(req.params.restaurantId, req.user.userId);
    if (!deleted) return res.status(404).json({ message: 'Review not found or not yours' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
