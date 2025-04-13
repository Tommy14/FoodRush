import { sendEmail } from './email.service.js';

export async function processEmail({ recipient, subject, type, data }) {
  return await sendEmail(recipient.email, subject, type, data);
}
