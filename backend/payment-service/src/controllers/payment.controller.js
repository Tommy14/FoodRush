import { createPaymentSession } from '../services/payment.service.js';

export async function initiatePayment(req, res) {
  try {
    const session = await createPaymentSession(req.body);
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error('Payment initiation failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
