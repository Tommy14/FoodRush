import { stripe, STRIPE_WEBHOOK_SECRET } from '../config/stripe.config.js';
import Transaction from '../models/Transaction.js';
import axios from 'axios';

export async function handlePaymentWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe Webhook Signature Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const metadata = session.metadata || {};
    const orderId = metadata.orderId;
    const userEmail = metadata.email || session.customer_email;
    const stripeStatus = session.payment_status;

    let internalStatus = 'PENDING';
    if (stripeStatus === 'paid') {
      internalStatus = 'SUCCESS';
    } else {
      internalStatus = 'FAILED';
    }

    try {
      // Save transaction to DB
      const transaction = new Transaction({
        orderId,
        userEmail,
        referenceId: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
        status: internalStatus,
        provider: 'Stripe'
      });

      await transaction.save();
      console.log('Payment saved to DB:', transaction);

    //   // Notify Order Service if payment succeeded
    //   if (internalStatus === 'SUCCESS') {
    //     await axios.post('http://order-service:9200/api/orders/mark-paid', {
    //       orderId,
    //       paymentStatus: internalStatus,
    //       referenceId: session.id,
    //       amount: transaction.amount,
    //       currency: transaction.currency
    //     });

    //     console.log('Order Service notified about payment');
    //   }

    } catch (err) {
      console.error('Error during transaction or order update:', err.message);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.status(200).json({ received: true });
}
