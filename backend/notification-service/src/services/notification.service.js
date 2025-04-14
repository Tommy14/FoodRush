import { sendEmail } from './email.service.js';
import { sendSMS } from './sms.service.js';
import { sendWhatsApp } from './whatsapp.service.js';

export async function processEmail({ recipient, subject, type, data }) {
  return await sendEmail(recipient.email, subject, type, data);
}

export async function processSMS({ phone, message }) {
  return await sendSMS(phone, message);
}

export async function processWhatsApp({ phone, template, params }) {
  return await sendWhatsApp(phone, template, params);
}