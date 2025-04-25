import axios from 'axios';

const API_BASE = 'http://localhost:5001/bff/restaurants';
const REVIEWS_BASE = 'http://localhost:5001/bff/reviews';


export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch restaurants');
  }
};

export const getRestaurantById = async (id, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${API_BASE}/${id}`, { headers });
    return response.data;
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch restaurant details');
  }
};

// Use the correct BFF endpoint structure for review summary
export const getRestaurantReviewSummary = async (restaurantId, token = null) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await axios.get(`${REVIEWS_BASE}/restaurants/${restaurantId}/reviews/summary`, { headers });
    return response.data;
  } catch (err) {
    console.error('Error fetching restaurant review summary:', err);
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} }; // Return default data on error
  }
};

/**
 * Fetch all restaurants owned by the current user
 * @param {string} token - Auth token
 * @returns {Promise<Array>} List of restaurants owned by the user
 */
export const getRestaurantsByOwnerId = async (token) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // Update this endpoint to match your API structure
    const response = await axios.get(`${API_BASE}/owner`, { headers });
    return response.data;
  } catch (err) {
    console.error('Error fetching owner restaurants:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch your restaurants');
  }
};

/**
 * Get all restaurants for admin dashboard
 * @param {string} token - Auth token
 * @returns {Promise<Array>} List of all restaurants
 */
export const getAllRestaurantsForAdmin = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    const response = await axios.get(`${API_BASE}/admin/all`, { headers });
    return response.data;
  } catch (err) {
    console.error('Error fetching all restaurants for admin:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch restaurants');
  }
};

/**
 * Get pending restaurants
 * @param {string} token - Auth token
 * @returns {Promise<Array>} List of pending restaurants
 */
export const getPendingRestaurants = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    const response = await axios.get(`${API_BASE}/admin/pending`, { headers });
    return response.data;
  } catch (err) {
    console.error('Error fetching pending restaurants:', err);
    throw new Error(err.response?.data?.message || 'Failed to fetch pending restaurants');
  }
};

/**
 * Update restaurant status
 * @param {string} id - Restaurant ID
 * @param {string} status - New status (PENDING, APPROVED, or REJECTED)
 * @param {string} token - Auth token
 * @returns {Promise<Object>} Updated restaurant
 */
export const updateRestaurantStatus = async (id, status, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    const response = await axios.patch(
      `${API_BASE}/${id}/status`, 
      { status }, 
      { headers }
    );
    return response.data;
  } catch (err) {
    console.error('Error updating restaurant status:', err);
    throw new Error(err.response?.data?.message || 'Failed to update restaurant status');
  }
};
