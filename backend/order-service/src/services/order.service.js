import Order from '../models/Order.js';


export const placeOrderService = async ({ customerId, restaurantId, items, totalAmount, deliveryAddress }) => {
  const newOrder = new Order({
    customerId,
    restaurantId,
    items,
    totalAmount,
    deliveryAddress
  });

  await newOrder.save();
  return newOrder;
};

export const getOrdersService = async (role, userId) => {
  const filter = role === 'restaurant_admin'
    ? { restaurantId: userId }
    : { customerId: userId };

  const orders = await Order.find(filter);
  return orders;
};

export const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId);
  return order;
};

export const getActiveCustomerOrdersService = async (customerId) => {
  const activeStatuses = ['placed', 'preparing', 'ready_for_delivery', 'picked_up', 'delivered']; // ✅ Add all "active" statuses relevant to your app

  const orders = await Order.find({
    customerId,
    status: { $in: activeStatuses }
  }).sort({ createdAt: -1 }); // Optional: recent orders first

  return orders;
};

export const updateOrderStatusService = async (orderId, status) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return updatedOrder;
};

export const cancelOrderService = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    const error = new Error('Only pending orders can be cancelled');
    error.statusCode = 400;
    throw error;
  }

  order.status = 'cancelled';
  await order.save();

  return order;
};
