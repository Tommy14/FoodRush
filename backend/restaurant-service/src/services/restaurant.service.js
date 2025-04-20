import Restaurant from '../models/Restaurant.js';

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

export const deleteRestaurant = async (id, ownerId) => {
  return await Restaurant.findOneAndDelete({ _id: id, owner: ownerId });
};

export const getPendingRestaurants = async () => {
  return await Restaurant.find({ status: 'PENDING' });
};

export const approveRestaurant = async (id) => {
  return await Restaurant.findByIdAndUpdate(id, { status: 'APPROVED' }, { new: true });
};

export const toggleRestaurantStatus = async (id, ownerId) => {
  const restaurant = await Restaurant.findOne({ _id: id, owner: ownerId, status: 'APPROVED' });
  if (!restaurant) throw new Error('Unauthorized or restaurant not approved');
  restaurant.isOpen = !restaurant.isOpen;
  return await restaurant.save();
};


export const updateRestaurantLocation = async (restaurantId, locationId) => {
  try {
    return await Restaurant.findByIdAndUpdate(
      restaurantId,
      { locationId },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating restaurant location:', error);
    throw error;
  }
};

// Add to restaurant.service.js
export const getRestaurantsByOwnerId = async (ownerId) => {
  return await Restaurant.find({ owner: ownerId })
    .sort({ createdAt: -1 });
};

