import { apiPrivate } from "../config/api";

// Get all favorites for the current user
export const getUserFavorites = async () => {
  const response = await apiPrivate.get("/favorites");
  return response.data;
};

// Check if a restaurant is favorited
export const checkFavoriteStatus = async (restaurantId) => {
  const response = await apiPrivate.get(`/favorites/${restaurantId}/status`);
  return response.data;
};

// Toggle favorite status (add or remove from favorites)
export const toggleFavoriteStatus = async (restaurantId) => {
  const response = await apiPrivate.post(`/favorites/${restaurantId}`);
  return response.data;
};