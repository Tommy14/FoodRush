import axios from 'axios';

const API_BASE = 'http://localhost:5001/bff/restaurants';

export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to fetch restaurants');
  }
};