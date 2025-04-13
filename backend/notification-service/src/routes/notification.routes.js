import express from 'express';
import { sendEmailNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.post('/email', sendEmailNotification); // POST /notify/email

export default router;
