import Restaurant from '../models/Restaurant.js';
import * as menuService from './menu.service.js';


export const createRestaurant = async (data, ownerId) => {
  return await Restaurant.create({
    ...data,
    owner: ownerId,
    status: 'PENDING',
    isOpen: false
  });
};

export const getAllApprovedRestaurants = async () => {
  return await Restaurant.find({ status: 'APPROVED' });
};

export const getAllRestaurantsForAdmin = async () => {
  return await Restaurant.find(); 
};

export const getRestaurantById = async (id) => {
  return await Restaurant.findById(id);
};

export const updateRestaurant = async (id, ownerId, data) => {
  return await Restaurant.findOneAndUpdate({ _id: id, owner: ownerId }, data, { new: true });
};

export const deleteRestaurant = async (restaurantId, userId) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: userId });
  if (!restaurant) {
    throw new Error('Restaurant not found or you do not have permission to delete it');
  }
  
  // Delete all menu items associated with this restaurant
  await menuService.deleteMenuItemsByRestaurantId(restaurantId);
  
  // Delete the restaurant
  await Restaurant.findByIdAndDelete(restaurantId);
  
  return true;
};

export const getPendingRestaurants = async () => {
  return await Restaurant.find({ status: 'PENDING' });
};


export const updateRestaurantStatus = async (id, newStatus) => {
  if (!["PENDING", "APPROVED", "REJECTED"].includes(newStatus)) {
    throw new Error("Invalid status value");
  }

  return await Restaurant.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );
};

export const toggleRestaurantStatus = async (id, ownerId) => {
  const restaurant = await Restaurant.findOne({
    _id: id,
    owner: ownerId,
    status: "APPROVED",
  });
  if (!restaurant) throw new Error("Unauthorized or restaurant not approved");
  restaurant.isOpen = !restaurant.isOpen;
  return await restaurant.save();
};

export const updateRestaurantLocation = async (restaurantId, locationId, coordinates) => {
  try {
    // Update both the locationId reference and the embedded coordinates
    return await Restaurant.findByIdAndUpdate(
      restaurantId,
      { 
        locationId: locationId,
        'location.coordinates': coordinates || [0, 0]
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating restaurant location:', error);
    throw error;
  }
};

// get all restaurants for a specific owner
export const getRestaurantsByOwnerId = async (ownerId) => {
  return await Restaurant.find({ owner: ownerId })
    .sort({ createdAt: -1 });
};

