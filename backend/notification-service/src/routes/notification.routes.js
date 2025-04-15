import express from 'express';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from '../controllers/notification.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Middleware to check authentication for all routes
router.use(authMiddleware.verifyInternalKey);

router.post('/email', sendEmailNotification); // POST /notify/email
router.post('/sms', sendSMSNotification);// notworking due contriy regualtion we have setup it suing A BR
router.post('/whatsapp', sendWhatsAppNotification); // POST /notify/whatsapp

export default router;
