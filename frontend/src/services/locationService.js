import { apiPrivate } from "../config/api";

/**
 * Service for handling location-related operations
 */
const LocationService = {
  /**
   * Get location autocomplete suggestions
   * @param {string} input - User input to search for
   * @returns {Promise<Array>} List of location predictions
   */
  getAutocompletePredictions: async (input) => {
    try {
      const response = await apiPrivate.get(
        `/location/autocomplete?input=${encodeURIComponent(input)}`
      );
      return response.data.predictions || [];
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      return [];
    }
  },

  /**
   * Get coordinates for a specific address/place
   * @param {Object} params - Parameters for geocoding
   * @param {string} params.address - Address text
   * @param {string} params.placeId - Google Place ID
   * @returns {Promise<Object>} Location object with coordinates
   */
  geocodeAddress: async ({ address, placeId }) => {
    try {
      const response = await apiPrivate.post("/location/geocode", {
        address,
        placeId,
      });
      return {
        address,
        coordinates: response.data.coordinates,
        placeId,
      };
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  },

  /**
   * Get address from coordinates (reverse geocoding)
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Location object with address and coordinates
   */
  reverseGeocode: async (lat, lng) => {
    try {
      const response = await apiPrivate.get(
        `/location/reverse-geocode?lat=${lat}&lng=${lng}`
      );
      
      return {
        coordinates: [lng, lat], // Order matches GeoJSON format [lng, lat]
        address: response.data.formattedAddress,
        formattedAddress: response.data.formattedAddress,
      };
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      throw error;
    }
  },

  /**
   * Get current device location using browser geolocation API
   * @returns {Promise<Object>} Location object with coordinates and address
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationData = await LocationService.reverseGeocode(
              latitude,
              longitude
            );
            resolve(locationData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  },

  /**
   * Find nearby restaurants based on coordinates
   * @param {Array} coordinates - [lng, lat] coordinates
   * @param {number} distance - Search radius in meters
   * @returns {Promise<Array>} List of nearby restaurants
   */
  findNearbyRestaurants: async (coordinates, distance = 10000) => {
    try {
      const endpoint = `/location/nearby?lat=${coordinates[1]}&lng=${coordinates[0]}&distance=${distance}`;
      const response = await apiPrivate.get(endpoint);
      return response.data || [];
    } catch (error) {
      console.error("Error finding nearby restaurants:", error);
      throw error;
    }
  },
};

export default LocationService;