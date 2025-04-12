import {
  createRestaurantService,
  getAllRestaurantsService,
  getRestaurantByIdService,
  updateRestaurantService,
  deleteRestaurantService
} from '../services/restaurant.service.js';

// @desc    Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, phone, ownerId } = req.body;
    const newRestaurant = await createRestaurantService({ name, address, phone, ownerId });

    res.status(201).json({ message: 'Restaurant created', data: newRestaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error: error.message });
  }
};

// @desc    Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurantsService();
    res.status(200).json({ data: restaurants });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
};

// @desc    Get single restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await getRestaurantByIdService(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    res.status(200).json({ data: restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
};

// @desc    Update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const updated = await updateRestaurantService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Restaurant not found' });

    res.status(200).json({ message: 'Restaurant updated', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

// @desc    Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await deleteRestaurantService(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Restaurant not found' });

    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
  }
};
