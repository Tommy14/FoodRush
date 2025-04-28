// services/order.service.js
import Order from '../models/Order.js';
import axios from 'axios';
import { DELIVERY_SERVICE_URL, NOTIFICATION_SERVICE_URL, SYSTEM_JWT, INTERNAL_SERVICE_API_KEY, USER_SERVICE_URL } from '../config/index.js';


const updateOrderStatusService = async (orderId, status) => {
  const validStatuses = ['placed', 'preparing', 'ready_for_delivery', 'picked_up', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status value');
    error.status = 400;
    throw error;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  order.status = status;
  await order.save();

  // Trigger other services externally
  if (status === 'placed') {
    notifyOrderPlaced(order); // 🚀 Notification Logic
  }
  if (status === 'preparing') {
    autoAssignDelivery(order); // 🚚 Delivery Logic
  }

  return order;
};

const createOrder = async (orderData, user) => {
  const {
    restaurantId,
    restaurantName,
    items,
    totalAmount,
    deliveryAddress,
    paymentMethod
  } = orderData;

  const order = new Order({
    customerId: user.userId,
    customerName: user.name,
    customerEmail: user.email,
    contactNumber: user.phone,
    restaurantId,
    restaurantName,
    items,
    totalAmount,
    deliveryAddress,
    paymentMethod,
    status: 'pending',
    paymentStatus: 'not_paid',
    editable: true
  });

  await order.save();
  return order;
};

const cancelOrder = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  // Only allow cancelling if editable and owned by the user
  if (!order.editable || !['pending', 'awaiting_payment'].includes(order.status)) {
    const err = new Error('Order cannot be cancelled');
    err.status = 400;
    throw err;
  }

  // (Optional) Only allow customer to cancel their own order
  if (order.customerId.toString() !== user.userId) {
    const err = new Error('You are not authorized to cancel this order');
    err.status = 403;
    throw err;
  }

  order.status = 'cancelled';
  order.editable = false;
  await order.save();

  return order;
};

const getActiveOrders = async (userId) => {
  const activeStatuses = [
    'pending',
    'placed',
    'preparing',
    'ready_for_delivery',
    'picked_up',
    'delivered'
  ];

  const orders = await Order.find({
    customerId: userId,
    status: { $in: activeStatuses }
  }).sort({ createdAt: -1 });

  return orders;
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  return order;
};

const getOrdersByRestaurant = async (restaurantId) => {
  const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

  return orders;
};

const getOrdersByCustomer = async (customerId) => {
  const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
  return orders;
};

// Notify Order Placed
const notifyOrderPlaced = async (order) => {

  // Fetch user details from User Service
  const userDetails = await getUserDetails(order.customerId);
  const payload = {
    recipient: { email: order.customerEmail },
    subject: "We’ve received your order!",
    type: "orderPlaced",
    data: {
      customerName: userDetails.name,
      orderId: order._id.toString(),
      total: order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      paymentMethod: order.paymentMethod,
      orderDateTime: new Date(order.createdAt).toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Colombo'
      }),
      deliveryAddress: order.deliveryAddress
    }
  };

  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, payload, {
      headers: { 'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY }
    });
  } catch (err) {
    console.error('Notification failed:', err.message);
  }
};

// Auto-Assign Delivery
const autoAssignDelivery = async (order) => {
  console.log('Auto-assigning delivery for order:', order);
  console.log('Delivery Address:', order.deliveryAddress);
  try {
    await axios.post(`${DELIVERY_SERVICE_URL}/api/delivery/auto-assign`, {
      orderId: order._id,
      address: order.deliveryAddress
    }, {
      headers: { Authorization: `Bearer ${SYSTEM_JWT}` }
    });
  } catch (err) {
    console.error('Auto-assign delivery failed:', err.message);
  }
};

const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/by/${userId}`, {
      headers: {
        Authorization: `Bearer ${SYSTEM_JWT}`
      }
    });
    return response.data; // Adjust if your User Service wraps the response in { user: {...} }
  } catch (err) {
    console.error('Failed to fetch user details:', err.message);
    throw new Error('Could not retrieve user details');
  }
};

export {
  updateOrderStatusService,
  createOrder,
  cancelOrder,
  getActiveOrders,
  getOrderById,
  getOrdersByRestaurant,
  getOrdersByCustomer,
  getUserDetails
};




// import Order from '../models/Order.js';


// export const placeOrderService = async ({ customerId, restaurantId, items, totalAmount, deliveryAddress }) => {
//   const newOrder = new Order({
//     customerId,
//     restaurantId,
//     items,
//     totalAmount,
//     deliveryAddress
//   });

//   await newOrder.save();
//   return newOrder;
// };

// export const getOrdersService = async (role, userId) => {
//   const filter = role === 'restaurant_admin'
//     ? { restaurantId: userId }
//     : { customerId: userId };

//   const orders = await Order.find(filter);
//   return orders;
// };

// export const getOrderByIdService = async (orderId) => {
//   const order = await Order.findById(orderId);
//   return order;
// };

// export const getActiveCustomerOrdersService = async (customerId) => {
//   const activeStatuses = ['placed', 'preparing', 'ready_for_delivery', 'picked_up', 'delivered']; //  Add all "active" statuses relevant to your app

//   const orders = await Order.find({
//     customerId,
//     status: { $in: activeStatuses }
//   }).sort({ createdAt: -1 }); // Optional: recent orders first

//   return orders;
// };

// export const updateOrderStatusService = async (orderId, status) => {
//   const updatedOrder = await Order.findByIdAndUpdate(
//     orderId,
//     { status },
//     { new: true }
//   );

//   return updatedOrder;
// };

// export const cancelOrderService = async (orderId) => {
//   const order = await Order.findById(orderId);

//   if (!order) {
//     throw new Error('Order not found');
//   }

//   if (order.status !== 'pending') {
//     const error = new Error('Only pending orders can be cancelled');
//     error.statusCode = 400;
//     throw error;
//   }

//   order.status = 'cancelled';
//   await order.save();

//   return order;
// };
// const updateOrderStatusService = async (orderId, status) => {
//   const validStatuses = [
//     'placed', 'preparing', 'ready_for_delivery',
//     'picked_up', 'delivered', 'cancelled'
//   ];

//   if (!validStatuses.includes(status)) {
//     const error = new Error('Invalid status value');
//     error.status = 400;
//     throw error;
//   }

//   const order = await Order.findById(orderId);
//   if (!order) {
//     const error = new Error('Order not found');
//     error.status = 404;
//     throw error;
//   }

//   order.status = status;
//   await order.save();

  // Notify on placed
  // if (status === 'placed') {
  //   try {
  //     await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/order-placed`, {
  //       user: {
  //         name: order.customerName,
  //         phone: order.contactNumber,
  //         email: order.customerEmail
  //       },
  //       orderDetails: {
  //         id: order._id,
  //         totalAmount: order.totalAmount,
  //         items: order.items,
  //         address: order.deliveryAddress
  //       }
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${SYSTEM_JWT}`
  //       }
  //     });
  //   } catch (err) {
  //     console.error(' Notification failed:', err.message);
  //   }
  // }

  // if (status === 'placed') {
  //   console.log('Sending notification payload:', {
  //     recipient: { email: order.customerEmail },
  //     subject: "We’ve received your order!",
  //     type: "orderPlaced",
  //     data: {
  //       customerName: "order.customerName", 
  //       restaurantName: order.restaurantName,
  //       orderId: order._id.toString(),
  //       total: order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
  //       paymentMethod: order.paymentMethod,
  //       orderDateTime: new Date(order.createdAt).toLocaleString('en-US', {
  //         dateStyle: 'long',
  //         timeStyle: 'short',
  //         timeZone: 'Asia/Colombo'
  //       }),
  //       deliveryAddress: order.deliveryAddress
  //     }
  //   });
    
  //   try {
  //     await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/email`, {
  //       recipient: {
  //         email: order.customerEmail
  //       },
  //       subject: "We’ve received your order!",
  //       type: "orderPlaced",
  //       data: {
  //         customerName: "order.customerName", // remove this
  //         restaurantName: order.restaurantName, // Assuming you have this in order
  //         orderId: order._id.toString(),
  //         total: order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
  //         paymentMethod: order.paymentMethod,
  //         orderDateTime: new Date(order.createdAt).toLocaleString('en-US', {
  //           dateStyle: 'long',
  //           timeStyle: 'short',
  //           timeZone: 'Asia/Colombo'
  //         }),
  //         deliveryAddress: order.deliveryAddress
  //       }
  //     }, {
  //       headers: {
  //         'X-Internal-API-Key': INTERNAL_SERVICE_API_KEY,
  //       }
  //     });
  //   } catch (err) {
  //     console.error('Notification failed:', err.message);
  //   }
  // }
  

  // Notify Delivery Service on preparing only
//   if (status === 'preparing') {
//     try {
//       await axios.post(`${DELIVERY_SERVICE_URL}/api/delivery/auto-assign`, {
//         orderId: order._id
//       }, {
//         headers: {
//           Authorization: `Bearer ${SYSTEM_JWT}`
//         }
//       });
//     } catch (err) {
//       console.error(' Auto-assign delivery failed:', err.message);
//     }
//   }

//   return order;
// };
