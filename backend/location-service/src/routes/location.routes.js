import express from 'express';
import * as locationController from '../controllers/location.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/geocode', locationController.geocodeAddress); // Changed to POST
router.get('/reverse-geocode', locationController.reverseGeocode);
router.get('/nearby', locationController.findNearbyRestaurants);
router.get('/:entityType/:entityId', locationController.getLocation);

// Protected routes
router.post('/', authMiddleware, locationController.saveLocation);

export default router;