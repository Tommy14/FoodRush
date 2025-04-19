import Delivery from '../models/Delivery.js';
import axios from 'axios';
import { NOTIFICATION_SERVICE_URL, INTERNAL_SERVICE_API_KEY, ORDER_SERVICE_URL, SYSTEM_JWT, USER_SERVICE_URL, RESTAURANT_SERVICE_URL} from '../config/index.js';

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

  await delivery.save();

  // 🛰️ Notify Order Service about status change
  if (['picked_up', 'delivered'].includes(status)) {
    try {
      await axios.put(`${ORDER_SERVICE_URL}/api/orders/${delivery.orderId}/status`, {
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${SYSTEM_JWT}`
        }
      });
    } catch (err) {
      console.error('❌ Failed to update order status in Order Service:', err.message);
    }
  }

  // 📧 Send notification email if delivered
  if (status === 'delivered') {
    await sendDeliveryUpdateEmail(delivery);
  }

  return delivery;
};

export const getDeliveriesByPersonService = async (deliveryPersonId) => {
  const deliveries = await Delivery.find({
    deliveryPersonId,
    status: { $ne: 'delivered' } // $ne = "not equal"
  }).sort({ createdAt: -1 });

  return deliveries;
};

export const getCompletedDeliveriesByPersonService = async (deliveryPersonId) => {
  return await Delivery.find({ deliveryPersonId, status: 'delivered' }).sort({ deliveredAt: -1 });
};

async function sendDeliveryUpdateEmail(delivery) {
  const order = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${delivery.orderId}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });

  const customer = await axios.get(`${USER_SERVICE_URL}/api/users/by/${order.data.data.customerId}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });

  const deliveryPerson = await axios.get(`${USER_SERVICE_URL}/api/users/by/${delivery.deliveryPersonId}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });
  const restaurant = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${order.data.data.restaurantId}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });

  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, {
      recipient: {
        email: customer.data.email,
      },
      subject: 'Your order has been delivered! 🎉',
      type: 'orderDelivered', // Must match a key in `templateMap.js` in notification service
      data: {
        customerName: customer.data.name,
        restaurantName: restaurant.data.name,
        orderId: delivery.orderId,
        total: order.data.data.totalAmount,
        paymentMethod: order.data.data.paymentMethod,
        orderDateTime: new Date(order.data.data.createdAt).toLocaleString('en-US', {
          timeZone: 'Asia/Colombo',
          dateStyle: 'long',
          timeStyle: 'short'
        }),
        deliveryAddress: order.data.data.deliveryAddress,
        deliveryPerson: [
            {name: deliveryPerson.data.name},
        ],
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
