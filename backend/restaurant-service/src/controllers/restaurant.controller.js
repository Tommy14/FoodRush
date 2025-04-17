import * as restaurantService from '../services/restaurant.service.js';
import * as imageService from '../services/image.service.js';

export const createRestaurant = async (req, res) => {
  try {
    let imageData = {};
    
    // Handle logo upload
    if (req.files && req.files.logo) {
      imageData.logo = await imageService.uploadImage(req.files.logo[0], 'restaurants/logos');
    }
    
    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      imageData.coverImage = await imageService.uploadImage(req.files.coverImage[0], 'restaurants/covers');
    }
    
    // Handle multiple restaurant images
    if (req.files && req.files.images) {
      imageData.images = await imageService.uploadMultipleImages(req.files.images, 'restaurants/gallery');
    }
    
    // Combine the form data with the image data
    const restaurantData = { ...req.body, ...imageData };
    
    const restaurant = await restaurantService.createRestaurant(restaurantData, req.user.userId);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    let imageData = {};
    
    // Handle logo upload
    if (req.files && req.files.logo) {
      // Get the current restaurant to check if we need to delete an existing logo
      const currentRestaurant = await restaurantService.getRestaurantById(req.params.id);
      if (currentRestaurant && currentRestaurant.logo && currentRestaurant.logo.publicId) {
        await imageService.deleteImage(currentRestaurant.logo.publicId);
      }
      imageData.logo = await imageService.uploadImage(req.files.logo[0], 'restaurants/logos');
    }
    
    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      // Get the current restaurant to check if we need to delete an existing cover image
      const currentRestaurant = await restaurantService.getRestaurantById(req.params.id);
      if (currentRestaurant && currentRestaurant.coverImage && currentRestaurant.coverImage.publicId) {
        await imageService.deleteImage(currentRestaurant.coverImage.publicId);
      }
      imageData.coverImage = await imageService.uploadImage(req.files.coverImage[0], 'restaurants/covers');
    }
    
    // Handle multiple restaurant images
    if (req.files && req.files.images) {
      // Add new images to the restaurant
      const newImages = await imageService.uploadMultipleImages(req.files.images, 'restaurants/gallery');
      
      // Get the current restaurant
      const currentRestaurant = await restaurantService.getRestaurantById(req.params.id);
      
      // Combine existing and new images
      if (currentRestaurant && currentRestaurant.images) {
        imageData.images = [...currentRestaurant.images, ...newImages];
      } else {
        imageData.images = newImages;
      }
    }
    
    // Combine the form data with the image data
    const restaurantData = { ...req.body, ...imageData };
    
    const updated = await restaurantService.updateRestaurant(req.params.id, req.user.userId, restaurantData);
    if (!updated) return res.status(403).json({ message: 'Update not allowed' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    // Get the restaurant to delete its images
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    
    if (restaurant) {
      // Delete logo if exists
      if (restaurant.logo && restaurant.logo.publicId) {
        await imageService.deleteImage(restaurant.logo.publicId);
      }
      
      // Delete cover image if exists
      if (restaurant.coverImage && restaurant.coverImage.publicId) {
        await imageService.deleteImage(restaurant.coverImage.publicId);
      }
      
      // Delete all restaurant images if exist
      if (restaurant.images && restaurant.images.length > 0) {
        const publicIds = restaurant.images.map(img => img.publicId);
        await imageService.deleteMultipleImages(publicIds);
      }
    }
    
    const deleted = await restaurantService.deleteRestaurant(req.params.id, req.user.userId);
    if (!deleted) return res.status(403).json({ message: 'Delete not allowed' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add endpoint to delete a specific image
export const deleteRestaurantImage = async (req, res) => {
  try {
    const { restaurantId, imageId } = req.params;
    
    // Get the restaurant
    const restaurant = await restaurantService.getRestaurantById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check ownership
    if (restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Find the image to delete
    const imageToDelete = restaurant.images.find(img => img._id.toString() === imageId);
    
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary
    await imageService.deleteImage(imageToDelete.publicId);
    
    // Remove from restaurant document
    restaurant.images = restaurant.images.filter(img => img._id.toString() !== imageId);
    await restaurant.save();
    
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Keep the other controller methods unchanged
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
