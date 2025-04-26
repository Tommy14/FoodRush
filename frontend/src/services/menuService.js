import { apiPrivate } from "../config/api";

/**
 * Fetch all menu items for a restaurant
 * @param {string} restaurantId - The ID of the restaurant
 * @returns {Promise<Array>} - List of menu items
 */
export const getMenuItems = async (restaurantId) => {
  try {
    // Update endpoint to match BFF structure
    const response = await apiPrivate.get(`/menu/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

/**
 * Fetch a single menu item by ID
 * @param {string} restaurantId - The ID of the restaurant
 * @param {string} menuItemId - The ID of the menu item
 * @returns {Promise<Object>} - Menu item details
 */
export const getMenuItemById = async (restaurantId, menuItemId) => {
  try {
    // Update endpoint to match BFF structure
    const response = await apiPrivate.get(
      `/menu/${restaurantId}/menu/${menuItemId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    throw error;
  }
};

/**
 * Create a new menu item
 * @param {string} restaurantId - The ID of the restaurant
 * @param {FormData} formData - Form data containing menu item details and image
 * @returns {Promise<Object>} - Created menu item
 */
export const createMenuItem = async (restaurantId, formData) => {
  try {
    // Update endpoint to match BFF structure
    const response = await apiPrivate.post(
      `/menu/${restaurantId}/menu`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
};

/**
 * Update an existing menu item
 * @param {string} restaurantId - The ID of the restaurant
 * @param {string} menuItemId - The ID of the menu item
 * @param {FormData} formData - Form data containing updated menu item details and image
 * @returns {Promise<Object>} - Updated menu item
 */
export const updateMenuItem = async (restaurantId, menuItemId, formData) => {
  try {
    // Add token explicitly to ensure authorization
    const token = localStorage.getItem("token");

    const response = await apiPrivate.put(
      `/menu/${restaurantId}/menu/${menuItemId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error("Error updating menu item:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

/**
 * Delete a menu item
 * @param {string} restaurantId - The ID of the restaurant
 * @param {string} menuItemId - The ID of the menu item
 * @returns {Promise<Object>} - Response message
 */
export const deleteMenuItem = async (restaurantId, menuItemId) => {
  try {
    // Update endpoint to match BFF structure
    const response = await apiPrivate.delete(
      `/menu/${restaurantId}/menu/${menuItemId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
