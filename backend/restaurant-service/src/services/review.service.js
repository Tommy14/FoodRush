import Review from '../models/Review.js';
import mongoose from 'mongoose';

export const addReview = async (restaurantId, userId, { rating, comment }) => {
  const existing = await Review.findOne({ restaurantId, userId });
  if (existing) throw new Error('You have already reviewed this restaurant.');
  return await Review.create({ restaurantId, userId, rating, comment });
};

export const getRestaurantReviews = async (restaurantId, page = 1, limit = 10, sort = 'latest') => {
  const skip = (page - 1) * limit;
  const sortOption = sort === 'highest' ? { rating: -1 } : sort === 'lowest' ? { rating: 1 } : { createdAt: -1 };

  const [reviews, count, avg] = await Promise.all([
    Review.find({ restaurantId })
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ restaurantId }),
    Review.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ])
  ]);

  const averageRating = avg[0]?.avgRating || 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: count,
    reviews
  };
};

export const updateReview = async (reviewId, userId, { rating, comment }) => {
  return await Review.findOneAndUpdate(
    { _id: reviewId, userId },
    { rating, comment },
    { new: true }
  );
};

export const deleteReview = async (reviewId, userId) => {
  return await Review.findOneAndDelete({ _id: reviewId, userId });
};

export const toggleReaction = async (reviewId, userId, type) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');

  // Defensive fallback
  if (!review.reactions) {
    review.reactions = { likes: [], dislikes: [] };
  }

  if (!review.reactions[type]) {
    review.reactions[type] = [];
  }

  const opposite = type === 'like' ? 'dislikes' : 'likes';
  review.reactions[opposite] = (review.reactions[opposite] || []).filter(
    id => id.toString() !== userId
  );

  const alreadyReacted = review.reactions[type].some(
    id => id.toString() === userId
  );

  if (alreadyReacted) {
    review.reactions[type] = review.reactions[type].filter(
      id => id.toString() !== userId
    );
  } else {
    review.reactions[type].push(userId);
  }

  return await review.save();
};

export const getRestaurantReviewSummary = async (restaurantId) => {
  const reviews = await Review.find({ restaurantId });

  if (reviews.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

  return {
    averageRating,
    totalReviews
  };
};