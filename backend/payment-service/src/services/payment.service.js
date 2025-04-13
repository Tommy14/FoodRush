import { stripe } from '../config/stripe.config.js';
import dotenv from 'dotenv';
dotenv.config();

export async function createPaymentSession({ orderId, email, amount, currency = 'LKR', items = [] }) {

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!orderId || !email || !amount || items.length === 0) {
    throw new Error('Missing required fields for payment session');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: items.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100, // Stripe expects cents
      },
      quantity: item.qty,
    })),
    metadata: {
      orderId,
      email
    },
    success_url: `${frontendUrl}/payment/success`,
    cancel_url: `${frontendUrl}/payment/cancel`
  });

  console.log('Stripe session created:', session.id);
  return { url: session.url };
}
