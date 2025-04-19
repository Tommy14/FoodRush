import * as locationService from '../services/location.service.js';
import * as mapsService from '../services/maps.service.js';

// Geocode an address
export const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }
    
    const geocodeResult = await mapsService.geocodeAddress(address);
    res.json(geocodeResult);
  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reverse geocode coordinates
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const result = await mapsService.reverseGeocode(lat, lng);
    res.json(result);
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Save location for an entity (restaurant or customer)
export const saveLocation = async (req, res) => {
  try {
    const { entityId, entityType, address, coordinates, placeId } = req.body;
    
    if (!entityId || !entityType || !coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const location = await locationService.upsertLocation(
      entityId, 
      entityType, 
      address, 
      coordinates, 
      placeId
    );
    
    res.status(201).json(location);
  } catch (error) {
    console.error('Save location error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get location by entity
export const getLocation = async (req, res) => {
  try {
    const { entityId, entityType } = req.params;
    
    if (!entityId || !entityType) {
      return res.status(400).json({ message: 'Entity ID and type are required' });
    }
    
    const location = await locationService.getLocationByEntity(entityId, entityType);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Find nearby restaurants
export const findNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const maxDistance = distance ? parseInt(distance) : 10000; // Default 10km
    const nearbyLocations = await locationService.findNearbyRestaurants(lat, lng, maxDistance);
    
    res.json(nearbyLocations);
  } catch (error) {
    console.error('Find nearby restaurants error:', error);
    res.status(500).json({ message: error.message });
  }
};