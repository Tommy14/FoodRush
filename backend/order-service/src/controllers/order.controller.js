// controllers/order.controller.js
import 
{ updateOrderStatusService, 
  createOrder, 
  cancelOrder,
  getActiveOrders,
  getOrderById,
  getOrdersByRestaurant, 
  getOrdersByCustomer } from '../services/order.service.js';

const updateOrderStatusController = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const result = await updateOrderStatusService(orderId, status);
    return res.status(200).json({ message: 'Order status updated', order: result });
  } catch (err) {
    console.error('Status update error:', err.message);
    return res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  }
};

const createOrderConroller = async (req, res) => {
  try {
    const orderData = req.body;
    const user = req.user; // From JWT middleware

    const newOrder = await createOrder(orderData, user);
    res.status(201).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

const cancelOrderController = async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;

  try {
    const cancelled = await cancelOrder(orderId, user);
    res.status(200).json({ message: 'Order cancelled', order: cancelled });
  } catch (err) {
    console.error('Cancel order error:', err.message);
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getActiveOrdersController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await getActiveOrders(userId);
    res.status(200).json({ data: orders });
  } catch (err) {
    console.error('Get active orders error:', err.message);
    res.status(500).json({ message: 'Failed to fetch active orders' });
  }
};

const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderById(orderId);
    res.status(200).json({ order });
  } catch (err) {
    console.error('Get order by ID error:', err.message);
    res.status(err.status || 500).json({ message: err.message });
  }
};

const getOrdersByRestaurantController = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const orders = await getOrdersByRestaurant(restaurantId);
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Get orders by restaurant error:', err.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const getOrdersByCustomerController = async (req, res) => {
  const { customerId } = req.params;

  try {
    const orders = await getOrdersByCustomer(customerId);
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Get orders by customer error:', err.message);
    res.status(500).json({ message: 'Failed to fetch customer orders' });
  }
};

export {
  createOrderConroller,
  updateOrderStatusController,
  cancelOrderController,
  getActiveOrdersController,
  getOrderByIdController,
  getOrdersByRestaurantController,
  getOrdersByCustomerController
};



// import {
//   placeOrderService,
//   getOrdersService,
//   getOrderByIdService,
//   updateOrderStatusService,
//   cancelOrderService,
//   getActiveCustomerOrdersService
// } from '../services/order.service.js';

// // @desc    Place a new order
// export const placeOrder = async (req, res) => {
//   try {
//     const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
//     const customerId = req.user.userId;

//     const newOrder = await placeOrderService({
//       customerId,
//       restaurantId,
//       items,
//       totalAmount,
//       deliveryAddress
//     });

//     res.status(201).json({ message: 'Order placed', data: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: 'Error placing order', error: error.message });
//   }
// };

// // @desc    Get all orders (customer or restaurant)
// export const getOrders = async (req, res) => {
//   try {
//     const { role, userId } = req.user;
//     const orders = await getOrdersService(role, userId);

//     res.status(200).json({ data: orders });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error: error.message });
//   }
// };

// // @desc    Get one order by ID
// export const getOrderById = async (req, res) => {
//   try {
//     const order = await getOrderByIdService(req.params.id);

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     res.status(200).json({ data: order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching order', error: error.message });
//   }
// };

// // @desc    Get active orders for a customer
// export const getActiveCustomerOrders = async (req, res) => {
//   try {
//     const customerId = req.user.userId;
//     const activeOrders = await getActiveCustomerOrdersService(customerId);

//     res.status(200).json({ data: activeOrders });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching active orders', error: error.message });
//   }
// };

// // @desc    Update order status
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const updatedOrder = await updateOrderStatusService(req.params.id, status);

//     if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

//     res.status(200).json({ message: 'Order status updated', data: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating order', error: error.message });
//   }
// };

// // @desc    Cancel order
// export const cancelOrder = async (req, res) => {
//   try {
//     const order = await cancelOrderService(req.params.id);
//     res.status(200).json({ message: 'Order cancelled', data: order });
//   } catch (error) {
//     const status = error.statusCode || 500;
//     res.status(status).json({ message: 'Error cancelling order', error: error.message });
//   }
// };
