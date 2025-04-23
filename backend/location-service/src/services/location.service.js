import Location from '../models/location.model.js';
import * as mapsService from './maps.service.js';

// Create or update location
export const upsertLocation = async (entityId, entityType, address, coordinates, placeId) => {
  try {
    return await Location.findOneAndUpdate(
      { entityId, entityType },
      {
        address,
        location: {
          type: 'Point',
          coordinates
        },
        placeId,
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

// Find location by entity
export const getLocationByEntity = async (entityId, entityType) => {
  return await Location.findOne({ entityId, entityType });
};

// Find nearby restaurants
export const findNearbyRestaurants = async (latitude, longitude, maxDistance = 10000) => {
  try {
    // Use MongoDB aggregation for richer results with distance calculation
    return await Location.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance", 
          maxDistance: maxDistance,
          query: { entityType: "restaurant" },
          spherical: true
        }
      },
      {
        $project: {
          _id: 0,
          entityId: 1, 
          address: 1,
          location: 1,
          distance: 1,
          formattedAddress: "$address.formattedAddress"
        }
      }
    ]);
  } catch (error) {
    console.error('Error finding nearby restaurants:', error);
    throw error;
  }
};

// Calculate distance between coordinates (in meters)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Implementation using Haversine formula
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in meters
};