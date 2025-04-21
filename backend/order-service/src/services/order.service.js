// services/order.service.js
import Order from '../models/Order.js';
import axios from 'axios';
import { DELIVERY_SERVICE_URL, NOTIFICATION_SERVICE_URL, SYSTEM_JWT } from '../config/index.js';

const updateOrderStatusService = async (orderId, status) => {
  const validStatuses = [
    'placed', 'preparing', 'ready_for_delivery',
    'picked_up', 'delivered', 'cancelled'
  ];

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

  // Notify on placed
  if (status === 'placed') {
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notify/order-placed`, {
        user: {
          name: order.customerName,
          phone: order.contactNumber,
          email: order.customerEmail
        },
        orderDetails: {
          id: order._id,
          totalAmount: order.totalAmount,
          items: order.items,
          address: order.deliveryAddress
        }
      }, {
        headers: {
          Authorization: `Bearer ${SYSTEM_JWT}`
        }
      });
    } catch (err) {
      console.error(' Notification failed:', err.message);
    }
  }

  // Notify Delivery Service on preparing only
  if (status === 'preparing') {
    try {
      await axios.post(`${DELIVERY_SERVICE_URL}/api/auto-assign`, {
        orderId: order._id
      }, {
        headers: {
          Authorization: `Bearer ${SYSTEM_JWT}`
        }
      });
    } catch (err) {
      console.error(' Auto-assign delivery failed:', err.message);
    }
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
    'awaiting_payment',
    'placed',
    'preparing',
    'ready_for_delivery',
    'picked_up'
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

export {
  updateOrderStatusService,
  createOrder,
  cancelOrder,
  getActiveOrders,
  getOrderById,
  getOrdersByRestaurant,
  getOrdersByCustomer
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
//   const activeStatuses = ['placed', 'preparing', 'ready_for_delivery', 'picked_up', 'delivered']; // ✅ Add all "active" statuses relevant to your app

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
