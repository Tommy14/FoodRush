import express from 'express';
import { initiatePayment } from '../controllers/payment.controller.js';
import { handlePaymentWebhook } from '../webhooks/payment.webhook.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();



router.post('/initiate', authMiddleware.verifyToken ,initiatePayment);   // POST /api/pay/initiate
router.post('/webhook', handlePaymentWebhook); // POST /api/pay/webhook (callback from Stripe/PayHere)

export default router;
