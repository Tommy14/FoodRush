// src/services/orderService.js

import { apiPrivate } from '../config/api';

/**
 * Fetch all active orders for the currently logged-in customer.
 * Enriches the order with delivery status if relevant.
 * @returns {Promise<Object[]>} Enriched list of customer orders
 */
// 1️⃣ Place an order
export const placeOrder = async (orderData) => {
  try {
    const res = await apiPrivate.post('/orders', orderData);
    return res.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error.response?.data || error;
  }
};

export const fetchCustomerOrders = async () => {
  try {
    const res = await apiPrivate.get('/orders/active');
    const orders = res.data.data;

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        if (['placed', 'preparing', 'ready_for_delivery', 'assigned', 'picked_up', 'delivered'].includes(order.status)) {
          try {
            const deliveryRes = await apiPrivate.get(`/delivery/order/${order._id}`);
            return { ...order, deliveryStatus: deliveryRes.data.status };
          } catch (err) {
            console.warn('No delivery found for order:', order._id);
            return order; // fallback
          }
        }
        return order;
      })
    );

    return enrichedOrders;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific order by ID.
 * @param {string} orderId - Order ID to fetch
 * @returns {Promise<Object>}
 */
export const fetchOrderById = async (orderId) => {
  try {
    const res = await apiPrivate.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel an order.
 * @param {string} orderId - Order ID to cancel
 * @returns {Promise<Object>}
 */
export const cancelOrder = async (orderId) => {
  try {
    const res = await apiPrivate.patch(`/orders/${orderId}/cancel`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const initiatePaymentSession = async (paymentPayload) => {
  try {
    const res = await apiPrivate.post('/pay/checkout', paymentPayload);
    return res.data;
  } catch (error) {
    console.error('Error initiating payment session:', error);
    throw error.response?.data || error;
  }
};

export const getOrdersByRestaurant = async (restaurantId) => {
  try {
    const res = await apiPrivate.get(`/orders/restaurant/${restaurantId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching orders by restaurant:', error);
    throw error.response?.data || error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await apiPrivate.put(`/orders/${orderId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || error;
  }
};
