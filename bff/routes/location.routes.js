import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();
const router = express.Router();
const LOCATION_SERVICE = process.env.LOCATION_SERVICE;

// Helper function to construct the correct base URL
const getServiceBaseUrl = () => {
  const baseUrl = LOCATION_SERVICE.endsWith("/")
    ? LOCATION_SERVICE.slice(0, -1)
    : LOCATION_SERVICE;
  return baseUrl;
};

// Helper to build full API URL
const buildUrl = (path) => {
  return `${getServiceBaseUrl()}${path}`;
};

// PUBLIC: Geocode an address to coordinates
router.post("/geocode", async (req, res) => {
  try {
    const url = buildUrl("/geocode");
    const response = await axios.post(url, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("Geocoding error:", err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// PUBLIC: Reverse geocode coordinates to address
router.get("/reverse-geocode", async (req, res) => {
  try {
    const url = buildUrl("/reverse-geocode");
    const response = await axios.get(url, {
      params: req.query,
      timeout: 5000, // 5 second timeout
    });
    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocoding error:", err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Address autocomplete for location suggestions
router.get("/autocomplete", async (req, res) => {
  try {
    const url = buildUrl("/autocomplete");
    const response = await axios.get(url, {
      params: req.query,
      timeout: 5000, // 5 second timeout
    });
    res.json(response.data);
  } catch (err) {
    console.error("Address autocomplete error:", err.message);
    res.status(err.response?.status || 500).json({
      message: err.message,
      predictions: [],
    });
  }
});

// PUBLIC: Find nearby restaurants
router.get("/nearby", async (req, res) => {
  try {
    const url = buildUrl("/nearby");
    const response = await axios.get(url, {
      params: req.query,
      timeout: 5000, // 5 second timeout
    });

    // If no locations found, return empty array
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      return res.json([]);
    }

    // Calculate estimated delivery time based on distance
    const calculateEstimatedDeliveryTime = (distanceInMeters) => {
      const basePreparationTime = 10; // 10 minutes for food preparation
      const deliverySpeedKmPerHour = 18; // 18 km/h average delivery speed

      // Convert distance from meters to kilometers
      const distanceInKm = distanceInMeters / 1000;

      // Calculate travel time in minutes
      const travelTimeMinutes = (distanceInKm / deliverySpeedKmPerHour) * 60;

      // Total time rounded to nearest 5 minutes
      const totalTime = basePreparationTime + travelTimeMinutes;
      return Math.ceil(totalTime / 2) * 2; // Round up to nearest 2 minutes
    };

    // Enrich with restaurant details from restaurant service
    const RESTAURANT_API = process.env.RESTAURANT_SERVICE;

    const enrichedResults = await Promise.all(
      response.data.map(async (location) => {
        try {
          const restaurantResponse = await axios.get(
            `${RESTAURANT_API}/${location.entityId}`
          );

          if (restaurantResponse.data) {
            console.log(
              `User coordinates: [${req.query.lng}, ${req.query.lat}]`
            );
            console.log(
              `Restaurant coordinates: ${location.location?.coordinates}`
            );
            console.log(`Raw distance: ${location.distance} meters`);

            // Update the returned restaurant data to include both addresses
            return {
              ...restaurantResponse.data,
              distance: location.distance,
              estimatedDeliveryTime: calculateEstimatedDeliveryTime(
                location.distance
              ),
              geocodedAddress: location.address?.formattedAddress, // Google maps standardized version
              originalAddress: restaurantResponse.data.address, // Include original address
              coordinates: location.location?.coordinates,
            };
          }
          return null;
        } catch (err) {
          console.error(
            `Failed to fetch restaurant ${location.entityId}:`,
            err.message
          );
          return null;
        }
      })
    );

    // Filter out any null results from failed restaurant fetches
    const validResults = enrichedResults.filter((r) => r !== null);
    res.json(validResults);
  } catch (err) {
    console.error("Nearby search error:", err.message);
    res.json([]);
  }
});

// PROTECTED: Save location (requires authentication)
router.post("/", authenticate, async (req, res) => {
  try {
    const url = buildUrl("");
    const response = await axios.post(url, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(201).json(response.data);
  } catch (err) {
    console.error("Save location error:", err.message);
    res.status(err.response?.status || 403).json({ message: err.message });
  }
});

// PUBLIC: Get location by entity
router.get("/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const url = buildUrl(`/${entityType}/${entityId}`);
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Get location error:", err.message);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;
