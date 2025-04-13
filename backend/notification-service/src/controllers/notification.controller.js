import { processEmail } from '../services/notification.service.js';
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
