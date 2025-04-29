import { apiPrivate } from "../config/api";

/**
 * Get all reviews for a restaurant
 * @param {string} restaurantId - ID of the restaurant
 * @returns {Promise<Array>} List of reviews
 */
export const getRestaurantReviews = async (restaurantId) => {
  try {
    const response = await apiPrivate.get(
      `/reviews/restaurants/${restaurantId}/reviews`
    );
    // Handle different response formats
    return response.data.reviews || response.data || [];
  } catch (err) {
    console.error("Error fetching restaurant reviews:", err);
    return [];
  }
};

/**
 * Get review summary for a restaurant
 * @param {string} restaurantId - ID of the restaurant
 * @returns {Promise<Object>} Review summary data
 */
export const getRestaurantReviewSummary = async (restaurantId) => {
  try {
    const response = await apiPrivate.get(
      `/reviews/restaurants/${restaurantId}/reviews/summary`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching review summary:", err);
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
  }
};

/**
 * Find user's review in the list of reviews
 * @param {Array} reviews - List of reviews
 * @param {string} userId - Current user ID
 * @returns {Object|null} User's review or null
 */
export const findUserReview = (reviews, userId) => {
  if (!reviews || !userId) return null;
  return reviews.find((review) => review.userId === userId);
};

/**
 * Add a new review for a restaurant
 * @param {string} restaurantId - ID of the restaurant
 * @param {Object} reviewData - Review data (rating, comment)
 * @returns {Promise<Object>} Created review
 */
export const addReview = async (restaurantId, reviewData) => {
  try {
    const response = await apiPrivate.post(
      `/reviews/restaurants/${restaurantId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (err) {
    console.error("Error adding review:", err);
    throw err;
  }
};


/**
 * Delete a review
 * @param {string} restaurantId - ID of the restaurant
 * @param {string} reviewId - ID of the review
 * @returns {Promise<Object>} Response data
 */
export const deleteReview = async (restaurantId, reviewId) => {
  try {
    const response = await apiPrivate.delete(
      `/reviews/restaurants/${restaurantId}/reviews/${reviewId}`
    );
    return response.data;
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
};
