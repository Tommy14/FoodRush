import express from 'express';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/email', sendEmailNotification); // POST /notify/email
router.post('/sms', sendSMSNotification);// notworking due contriy regualtion we have setup it suing A BR
router.post('/whatsapp', sendWhatsAppNotification);

export default router;
