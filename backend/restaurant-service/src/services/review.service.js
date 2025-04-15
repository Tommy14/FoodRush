import Review from '../models/Review.js';

export const addReview = async (restaurantId, userId, { rating, comment }) => {
  const existing = await Review.findOne({ restaurantId, userId });
  if (existing) throw new Error('You have already reviewed this restaurant.');
  return await Review.create({ restaurantId, userId, rating, comment });
};

export const getRestaurantReviews = async (restaurantId) => {
  const reviews = await Review.find({ restaurantId });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  return { 
    averageRating: Math.round(avgRating * 10) / 10, 
    totalReviews: reviews.length, 
    reviews 
  };
};

export const updateReview = async (restaurantId, userId, { rating, comment }) => {
  return await Review.findOneAndUpdate(
    { restaurantId, userId },
    { rating, comment },
    { new: true }
  );
};

export const deleteReview = async (restaurantId, userId) => {
  return await Review.findOneAndDelete({ restaurantId, userId });
};
