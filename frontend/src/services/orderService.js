// src/services/orderService.js

import axios from './axiosInstance'; // ✅ Axios instance with base URL

// Fetch all orders placed by the logged-in customer
export const fetchCustomerOrders = async () => {
  const res = await axios.get('/bff/orders/active', {
    headers: {
      Authorization: 'Bearer <your-token>' // replace or dynamically inject
    }
  });

  const orders = res.data.data;

  // Fetch delivery status for orders that are ready_for_delivery or later
  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      if (['ready_for_delivery', 'assigned', 'picked_up', 'delivered'].includes(order.status)) {
        try {
          const deliveryRes = await axios.get(`/bff/delivery/order/${order._id}`, {
            headers: {
              Authorization: 'Bearer <your-token>'
            }
          });

          const deliveryStatus = deliveryRes.data.status;
          return { ...order, deliveryStatus };
        } catch (err) {
          console.warn('No delivery found for order:', order._id);
          return order; // fallback
        }
      }
      return order;
    })
  );

  return enrichedOrders;
};

// (Optional) Get a specific order by ID
export const fetchOrderById = async (orderId, token) => {
  return axios.get(`/bff/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// (Optional) Cancel an order
export const cancelOrder = async (orderId, token) => {
  return axios.patch(`/bff/orders/${orderId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
