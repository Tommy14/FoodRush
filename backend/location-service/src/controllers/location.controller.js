import axios from "axios";
import * as locationService from "../services/location.service.js";
import * as mapsService from "../services/maps.service.js";

// Geocode an address
// In location.controller.js
export const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    console.log("Received address for geocoding:", address);

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // If address is an object, convert it to a string
    const addressToGeocode = typeof address === 'object' 
      ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.postalCode || ''}, ${address.country || ''}`
      : address;
      
    console.log("Geocoding this address:", addressToGeocode);

    const geocodeResult = await mapsService.geocodeAddress(addressToGeocode);
    res.json(geocodeResult);
  } catch (error) {
    console.error("Geocode error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reverse geocode coordinates
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const result = await mapsService.reverseGeocode(lat, lng);
    res.json(result);
  } catch (error) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Save location for an entity (restaurant or customer)
export const saveLocation = async (req, res) => {
  try {
    const { entityId, entityType, address, coordinates, placeId } = req.body;

    if (!entityId || !entityType || !coordinates) {
      return res.status(400).json({ message: "Missing required fields" });
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
    console.error("Save location error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get location by entity
export const getLocation = async (req, res) => {
  try {
    const { entityId, entityType } = req.params;

    if (!entityId || !entityType) {
      return res
        .status(400)
        .json({ message: "Entity ID and type are required" });
    }

    const location = await locationService.getLocationByEntity(
      entityId,
      entityType
    );

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get place suggestions
export const getPlaceSuggestions = async (req, res) => {
  try {
    const { input } = req.query;

    if (!input) {
      return res
        .status(400)
        .json({ message: "Input is required", predictions: [] });
    }

    // Use the service function instead of duplicating the API call logic
    const predictions = await mapsService.getPlacePredictions(input);

    return res.json({
      predictions: predictions,
    });
  } catch (error) {
    console.error("Place suggestions error:", error.message);
    res.status(500).json({
      message: "Failed to fetch address suggestions. Please try again later.",
      predictions: [],
    });
  }
};

// Get nearby restaurants
export const getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    
    // Use the service function to perform the search
    const locations = await locationService.findNearbyRestaurants(
      parseFloat(lat), 
      parseFloat(lng),
      distance ? parseInt(distance) : 10000
    );
    
    // Return the locations along with entityIds to the client
    res.json(locations);
  } catch (error) {
    console.error("Nearby restaurants error:", error);
    res.status(500).json({ message: error.message });
  }
};