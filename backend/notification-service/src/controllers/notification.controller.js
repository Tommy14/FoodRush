import { processEmail, processSMS, processWhatsApp } from '../services/notification.service.js';
import validateNotification from '../validations/notification.validator.js';

export async function sendEmailNotification(req, res) {
  const { errors, isValid } = validateNotification(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  

  try {
    const info = await processEmail(req.body);
    res.status(200).json({ message: 'Notification sent', info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
}

export async function sendSMSNotification(req, res) {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  try {
    const info = await processSMS({ phone, message });
    res.status(200).json({ message: 'SMS sent', info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send SMS', error: error.message });
  }
}

export async function sendWhatsAppNotification(req, res) {
  const { phone, template, params } = req.body;

  try {
    const info = await processWhatsApp({ phone, template, params  });
    res.status(200).json({ message: 'WhatsApp message sent', info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send WhatsApp message', error: error.message });
  }
}