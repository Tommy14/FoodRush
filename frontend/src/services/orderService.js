// src/services/orderService.js

import { apiPrivate } from '../config/api';

/**
 * Fetch all active orders for the currently logged-in customer.
 * Enriches the order with delivery status if relevant.
 * @returns {Promise<Object[]>} Enriched list of customer orders
 */
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
