import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Geocode an address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        coordinates: [location.lng, location.lat], // GeoJSON format: [longitude, latitude]
        formattedAddress: response.data.results[0].formatted_address,
        placeId: response.data.results[0].place_id
      };
    }
    
    throw new Error(`Geocoding failed: ${response.data.status}`);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to convert address to coordinates');
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      return {
        formattedAddress: response.data.results[0].formatted_address,
        placeId: response.data.results[0].place_id
      };
    }
    
    throw new Error(`Reverse geocoding failed: ${response.data.status}`);
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    throw new Error('Failed to convert coordinates to address');
  }
};

// Get nearby places
export const getNearbyPlaces = async (lat, lng, radius = 5000, type = 'restaurant') => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        type: type,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      return response.data.results;
    }
    
    throw new Error(`Nearby search failed: ${response.data.status}`);
  } catch (error) {
    console.error('Nearby search error:', error.message);
    throw new Error('Failed to find nearby places');
  }
};