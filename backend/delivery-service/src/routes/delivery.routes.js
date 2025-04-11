import express from 'express';
import {
  assignDelivery,
  updateDeliveryStatus,
  getDeliveriesByPerson
} from '../controllers/delivery.controller.js';

import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// 🔐 Protect all routes
router.use(authMiddleware);

// 📥 Assign a delivery person (admin/system)
router.post('/assign', assignDelivery);

// 🔁 Update delivery status (delivery person)
router.put('/:id/status', updateDeliveryStatus);

// 📄 Get deliveries assigned to logged-in delivery person
router.get('/my-deliveries', getDeliveriesByPerson);

export default router;
