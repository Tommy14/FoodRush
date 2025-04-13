import express from 'express';
import { initiatePayment } from '../controllers/payment.controller.js';
import { handlePaymentWebhook } from '../webhooks/payment.webhook.js';

const router = express.Router();

router.post('/initiate', initiatePayment);   // POST /api/pay/initiate
router.post('/webhook', handlePaymentWebhook); // POST /api/pay/webhook (callback from Stripe/PayHere)

export default router;
