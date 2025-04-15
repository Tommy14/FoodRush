import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

export const addMenuItem = async (restaurantId, userId, itemData) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: userId, status: 'APPROVED' });
  if (!restaurant) throw new Error('Not allowed');
  return await MenuItem.create({ ...itemData, restaurantId });
};

export const getMenuItems = async (restaurantId) => {
  return await MenuItem.find({ restaurantId, isAvailable: true });
};

export const updateMenuItem = async (restaurantId, itemId, userId, updates) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: userId });
  if (!restaurant) throw new Error('Unauthorized');
  return await MenuItem.findOneAndUpdate({ _id: itemId, restaurantId }, updates, { new: true });
};

export const deleteMenuItem = async (restaurantId, itemId, userId) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: userId });
  if (!restaurant) throw new Error('Unauthorized');
  await MenuItem.findOneAndDelete({ _id: itemId, restaurantId });
};
