import Delivery from '../models/Delivery.js';
import axios from 'axios';
import { NOTIFICATION_SERVICE_URL, INTERNAL_SERVICE_API_KEY, ORDER_SERVICE_URL, SYSTEM_JWT, USER_SERVICE_URL} from '../config/index.js';


export const autoAssignDeliveryService = async (orderId) => {
  try {
    // 1. Fetch delivery personnel from User Service
    const res = await axios.get(`${USER_SERVICE_URL}/api/users/role/delivery_person`, {
      headers: {
        Authorization: `Bearer ${SYSTEM_JWT}`
      }
    });
    console.log('Fetched delivery personnel:', res.data);
    const availableDrivers = res.data.filter(user => user.isAvailable);

    if (availableDrivers.length === 0) {
      throw new Error('No available delivery personnel at the moment');
    }
    console.log('Available delivery personnel:', availableDrivers);

    // 2. Pick one (you can randomize or use logic like load balancing)
    const selectedDriver = availableDrivers[0];
    console.log('Selected driver:', selectedDriver);

    // Update the selected driver to not available
    // await axios.put(`${USER_SERVICE_URL}/api/users/${selectedDriver.id}`, {
    //   isAvailable: false
    // }, {
    //   headers: {
    //     Authorization: `Bearer ${SYSTEM_JWT}`
    //   }
    // });

    // 3. Assign delivery
    const assignedDelivery = await assignDeliveryService({
      orderId,
      deliveryPersonId: selectedDriver.id
    });

    return assignedDelivery;

  } catch (error) {
    console.error('Failed to auto-assign delivery:', error.message);
    throw error;
  }
};

export const assignDeliveryService = async ({ orderId, deliveryPersonId }) => {
  console.log('Assigning delivery:', orderId, deliveryPersonId);
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
  const order = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${delivery.orderId.toString()}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });

  const customer = await axios.get(`${USER_SERVICE_URL}/api/users/by/${order.data.data.customerId}`, {
    headers: {
      Authorization: `Bearer ${SYSTEM_JWT}`
    }
  });

  const deliveryPerson = await axios.get(`${USER_SERVICE_URL}/api/users/by/${delivery.deliveryPersonId.toString()}`, {
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
      type: 'orderDelivered', 
      data: {
        customerName: customer.data.name,
        restaurantName: order.data.data.restaurantName,
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


// async function sendDeliveryUpdateEmail(delivery) {
//   const order = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${delivery.orderId.toString()}`, {
//     headers: {
//       Authorization: `Bearer ${SYSTEM_JWT}`
//     }
//   });
 
//   const customer = await axios.get(`${USER_SERVICE_URL}/api/users/by/${order.data.order.customerId}`, {
//     headers: {
//       Authorization: `Bearer ${SYSTEM_JWT}`
//     }
//   });
//   console.log('Customer data:', customer.data);
//   const deliveryPerson = await axios.get(`${USER_SERVICE_URL}/api/users/by/${delivery.deliveryPersonId}`, {
//     headers: {
//       Authorization: `Bearer ${SYSTEM_JWT}`
//     }
//   });
//   const emailPayload = {
//     recipient: {
//       email: order.data.order.customerEmail,
//     },
//     subject: 'Your order has been delivered! 🎉',
//     type: 'orderDelivered',
//     data: {
//       customerName: customer.data.name,
//       restaurantName: order.data.order.restaurantName,
//       orderId: delivery.orderId.toString(),
//       total: order.data.order.totalAmount,
//       paymentMethod: order.data.order.paymentMethod,
//       orderDateTime: new Date(order.data.order.createdAt).toLocaleString('en-US', {
//         timeZone: 'Asia/Colombo',
//         dateStyle: 'long',
//         timeStyle: 'short'
//       }),
//       deliveryAddress: order.data.order.deliveryAddress,
//       deliveryPerson: deliveryPerson.data.name, // ✅ FIXED from array
//       updatedAt: new Date().toLocaleString('en-US', {
//         timeZone: 'Asia/Colombo',
//         dateStyle: 'long',
//         timeStyle: 'short'
//       })
//     }
//   };
  
//   console.log('📨 Final email payload:\n', JSON.stringify(emailPayload, null, 2));
  
//   try {
//     await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, emailPayload, {
//       headers: {
//         'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY
//       }
//     });
//   } catch (err) {
//     console.error('❌ Email send failed:', err.response?.data || err.message);
//   }
  
// }