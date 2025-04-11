import Order from '../models/Order.js';

// @desc    Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const customerId = req.user.userId;

    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

// @desc    Get all orders (customer or restaurant)
export const getOrders = async (req, res) => {
  try {
    const { role, userId } = req.user;

    const filter = role === 'restaurant_admin'
      ? { restaurantId: userId }
      : { customerId: userId };

    const orders = await Order.find(filter); // no .populate()

    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// @desc    Get one order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('restaurantId');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// @desc    Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', data: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// @desc    Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error });
  }
};
