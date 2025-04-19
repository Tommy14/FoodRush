import * as reviewService from '../services/review.service.js';

export const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.params.restaurantId, req.user.userId, req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const { page, limit, sort } = req.query;
    const data = await reviewService.getRestaurantReviews(
      req.params.restaurantId,
      parseInt(page) || 1,
      parseInt(limit) || 10,
      sort || 'latest'
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(req.params.reviewId, req.user.userId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.reviewId, req.user.userId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const toggleReaction = async (req, res) => {
  try {
    const { type } = req.body; // like / dislike
    const updated = await reviewService.toggleReaction(req.params.reviewId, req.user.userId, type);
    res.json(updated);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

export const getRestaurantReviewSummary = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const summary = await reviewService.getRestaurantReviewSummary(restaurantId);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

