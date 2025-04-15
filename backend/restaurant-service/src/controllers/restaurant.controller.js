import * as restaurantService from '../services/restaurant.service.js';

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body, req.user.userId);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  const restaurants = await restaurantService.getAllApprovedRestaurants();
  res.json(restaurants);
};

export const getRestaurantById = async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.params.id);
  if (!restaurant || restaurant.status !== 'APPROVED') {
    return res.status(404).json({ message: 'Restaurant not found or not approved' });
  }
  res.json(restaurant);
};

export const updateRestaurant = async (req, res) => {
  const updated = await restaurantService.updateRestaurant(req.params.id, req.user.userId, req.body);
  if (!updated) return res.status(403).json({ message: 'Update not allowed' });
  res.json(updated);
};

export const deleteRestaurant = async (req, res) => {
  const deleted = await restaurantService.deleteRestaurant(req.params.id, req.user.userId);
  if (!deleted) return res.status(403).json({ message: 'Delete not allowed' });
  res.json({ message: 'Restaurant deleted' });
};

export const getPendingRestaurants = async (req, res) => {
  const pending = await restaurantService.getPendingRestaurants();
  res.json(pending);
};

export const getAllRestaurantsForAdmin = async (req, res) => {
  try {
    const allRestaurants = await restaurantService.getAllRestaurantsForAdmin();
    res.json(allRestaurants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load all restaurants' });
  }
};

export const approveRestaurant = async (req, res) => {
  const approved = await restaurantService.approveRestaurant(req.params.id);
  if (!approved) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(approved);
};

export const toggleRestaurantOpenStatus = async (req, res) => {
  try {
    const toggled = await restaurantService.toggleRestaurantStatus(req.params.id, req.user.userId);
    res.json(toggled);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};
