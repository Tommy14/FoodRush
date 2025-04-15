import Delivery from '../models/Delivery.js';
import axios from 'axios';
import { NOTIFICATION_SERVICE_URL, INTERNAL_SERVICE_API_KEY} from '../config/index.js';

export const assignDeliveryService = async ({ orderId, deliveryPersonId }) => {
  const delivery = new Delivery({
    orderId,
    deliveryPersonId,
    status: 'assigned',
    assignedAt: new Date()
  });
  await delivery.save();
  return delivery;
};

export const updateDeliveryStatusService = async (id, status) => {
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    throw new Error('Delivery not found');
  }
  delivery.status = status;

  if (status === 'picked_up') {
    delivery.pickedUpAt = new Date();
  } else if (status === 'delivered') {
    delivery.deliveredAt = new Date();
  }

  await delivery.save(); // ✅ Save first

  // 📨 Then send email if status is 'delivered'
  if (status === 'delivered') {
    await sendDeliveryUpdateEmail(delivery);
  }

  return delivery;
};

export const getDeliveriesByPersonService = async (deliveryPersonId) => {
  const deliveries = await Delivery.find({ deliveryPersonId }).sort({ createdAt: -1 });
  return deliveries;
};



async function sendDeliveryUpdateEmail(delivery) {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, {
      recipient: {
        email: "thihansig@gmail.com",
      },
      subject: 'Your order has been delivered! 🎉',
      type: 'orderDelivered', // Must match a key in `templateMap.js` in notification service
      data: {
        customerName: "John Doe",
        restaurantName: "ABC Restaurant",
        orderId: delivery.orderId,
        total: "4500.00 LKR",
        paymentMethod: "Cash on Delivery",
        orderDateTime: "April 13, 2025, 10:15 PM",
        deliveryAddress: "123, Galle Road, Colombo",
        deliveryPerson: "Dinesh Perera",
        updatedAt: new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Colombo',
          dateStyle: 'long',
          timeStyle: 'short'
        })
      }
    }, {
      headers: {
        'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY
      }
    });
  } catch (err) {
    console.error('Delivery updated, but failed to send email:', err.message);
  }
}
