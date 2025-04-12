import Restaurant from '../models/Restaurant.js';

export const createRestaurantService = async ({ name, address, phone, ownerId }) => {
  const newRestaurant = new Restaurant({ name, address, phone, ownerId });
  await newRestaurant.save();
  return newRestaurant;
};

export const getAllRestaurantsService = async () => {
  return await Restaurant.find();
};

export const getRestaurantByIdService = async (restaurantId) => {
  return await Restaurant.findById(restaurantId);
};

export const updateRestaurantService = async (restaurantId, updateData) => {
  return await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true });
};

export const deleteRestaurantService = async (restaurantId) => {
  return await Restaurant.findByIdAndDelete(restaurantId);
};
