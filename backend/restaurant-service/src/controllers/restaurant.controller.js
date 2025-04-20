import * as restaurantService from '../services/restaurant.service.js';
import * as imageService from '../services/image.service.js';
import Restaurant from '../models/Restaurant.js';
import axios from 'axios';
import mongoose from 'mongoose';

// Update the createRestaurant function

export const createRestaurant = async (req, res) => {
  console.log('Auth User Object:', req.user);
  const userId = req.user.id || req.user.userId; // Handle both formats  
  try {
    console.log('Restaurant Service - Create Restaurant Request');
    
    // Log received data for debugging
    console.log('Body fields:', Object.keys(req.body));
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
    
    // Extract and process data
    let imageData = {};
    
    // Handle logo upload
    if (req.files && req.files.logo && req.files.logo[0]) {
      console.log('Processing logo file path:', req.files.logo[0].path);
      try {
        const logoResult = await imageService.uploadImage(
          req.files.logo[0].path,
          'restaurants/logos'
        );
        // Store both URL and publicId
        imageData.logo = logoResult.url;
        console.log('Logo uploaded successfully:', imageData.logo);
      } catch (uploadErr) {
        console.error('Logo upload error:', uploadErr);
      }
    }
    
    // Handle cover image upload
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      try {
        const coverResult = await imageService.uploadImage(
          req.files.coverImage[0].path,
          'restaurants/covers'
        );
        imageData.coverImage = coverResult.url;
      } catch (uploadErr) {
        console.error('Cover image upload error:', uploadErr);
      }
    }
    
    // Handle multiple restaurant images
    if (req.files && req.files.images && req.files.images.length > 0) {
      try {
        const uploadPromises = req.files.images.map(file => 
          imageService.uploadImage(file.path, 'restaurants/gallery')
        );
        
        const results = await Promise.all(uploadPromises);
        imageData.images = results.map(result => result.url);
      } catch (uploadErr) {
        console.error('Gallery images upload error:', uploadErr);
      }
    }
    
    // Parse JSON string fields if they're strings
    let parsedData = { ...req.body };
    
    // Handle cuisineTypes - ensure it's an array
    if (req.body.cuisineTypes) {
      console.log('Processing cuisine types:', req.body.cuisineTypes);
      if (typeof req.body.cuisineTypes === 'string') {
        try {
          // Try to parse it as JSON first (if it's a stringified array)
          parsedData.cuisineTypes = JSON.parse(req.body.cuisineTypes);
        } catch (e) {
          // If parsing fails, treat it as a single string value
          parsedData.cuisineTypes = [req.body.cuisineTypes];
        }
      }
      // Make sure cuisineTypes is always an array
      if (!Array.isArray(parsedData.cuisineTypes)) {
        parsedData.cuisineTypes = [parsedData.cuisineTypes];
      }
    }

    // Parse address if it's a string
    if (req.body.address && typeof req.body.address === 'string') {
      console.log('Parsing address...');
      parsedData.address = JSON.parse(req.body.address);
    }
    
    // Parse openingHours if it's a string
    if (req.body.openingHours && typeof req.body.openingHours === 'string') {
      console.log('Parsing opening hours...');
      parsedData.openingHours = JSON.parse(req.body.openingHours);
    }
    
    // Combine the form data with the image data
    const restaurantData = { ...parsedData, ...imageData };
    
    console.log('Creating restaurant in database...');
    // 1. First create the restaurant
    const restaurant = await restaurantService.createRestaurant(restaurantData, userId);
    
    console.log('Restaurant created in database, now handling location...');
    // 2. Then create location in the location service if we have an address
    if (restaurant && restaurant.address) {
      try {
        console.log('Creating location for restaurant...');
        const locationResponse = await axios.post(
          process.env.LOCATION_SERVICE_URL || 'http://localhost:4002/api/locations',
          {
            restaurantId: restaurant._id,
            address: restaurant.address
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        if (locationResponse.data && locationResponse.data.locationId) {
          // Update restaurant with location ID reference
          await restaurantService.updateRestaurantLocation(
            restaurant._id,
            locationResponse.data.locationId
          );
          console.log('Location created and linked to restaurant');
        }
      } catch (locationErr) {
        console.error('Location service error:', locationErr);
        // Continue even if location service fails
      }
    }
    
    console.log('Restaurant creation complete.');
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Create restaurant error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    let imageData = {};

    // Handle logo upload
    if (req.files && req.files.logo && req.files.logo[0]) {
      console.log("Processing logo:", req.files.logo[0]);
      try {
        const logoResult = await imageService.uploadImage(
          req.files.logo[0].path,
          "restaurants/logos"
        );
        imageData.logo = logoResult.url;
        console.log("Logo uploaded successfully:", imageData.logo);
      } catch (uploadErr) {
        console.error("Logo upload error:", uploadErr);
      }
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      // Get the current restaurant to check if we need to delete an existing cover image
      const currentRestaurant = await restaurantService.getRestaurantById(
        req.params.id
      );
      if (
        currentRestaurant &&
        currentRestaurant.coverImage &&
        currentRestaurant.coverImage.publicId
      ) {
        await imageService.deleteImage(currentRestaurant.coverImage.publicId);
      }
      imageData.coverImage = await imageService.uploadImage(
        req.files.coverImage[0],
        "restaurants/covers"
      );
    }

    // Handle multiple restaurant images
    if (req.files && req.files.images) {
      // Add new images to the restaurant
      const newImages = await imageService.uploadMultipleImages(
        req.files.images,
        "restaurants/gallery"
      );

      // Get the current restaurant
      const currentRestaurant = await restaurantService.getRestaurantById(
        req.params.id
      );

      // Combine existing and new images
      if (currentRestaurant && currentRestaurant.images) {
        imageData.images = [...currentRestaurant.images, ...newImages];
      } else {
        imageData.images = newImages;
      }
    }

    // Combine the form data with the image data
    const restaurantData = { ...req.body, ...imageData };

    const updated = await restaurantService.updateRestaurant(
      req.params.id,
      req.user.userId,
      restaurantData
    );
    if (!updated)
      return res.status(403).json({ message: "Update not allowed" });
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

export const getOwnerRestaurants = async (req, res) => {
  try {
    console.log('Authenticated User:', req.user);

    const userId = req.user.userId || req.user.id;
    const ownerId = new mongoose.Types.ObjectId(userId); 

    const restaurants = await Restaurant.find({ owner: ownerId });

    res.json(restaurants);
  } catch (error) {
    console.error('Get owner restaurants error:', error);
    res.status(500).json({ message: error.message });
  }
};