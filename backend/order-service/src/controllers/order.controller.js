import {
  placeOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
  getActiveCustomerOrdersService
} from '../services/order.service.js';

// @desc    Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const customerId = req.user.userId;

    const newOrder = await placeOrderService({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress
    });

    res.status(201).json({ message: 'Order placed', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

// @desc    Get all orders (customer or restaurant)
export const getOrders = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const orders = await getOrdersService(role, userId);

    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// @desc    Get one order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// @desc    Get active orders for a customer
export const getActiveCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;
    const activeOrders = await getActiveCustomerOrdersService(customerId);

    res.status(200).json({ data: activeOrders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active orders', error: error.message });
  }
};

// @desc    Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await updateOrderStatusService(req.params.id, status);

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', data: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// @desc    Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await cancelOrderService(req.params.id);
    res.status(200).json({ message: 'Order cancelled', data: order });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: 'Error cancelling order', error: error.message });
  }
};
