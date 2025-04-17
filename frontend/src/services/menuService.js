import axios from 'axios';

const API_BASE = 'http://localhost:5001/bff/menu';

export const getMenuItems = async (restaurantId) => {
  try {
    const res = await axios.get(`${API_BASE}/${restaurantId}/menu`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch menu:', err);
    return [];
  }
};