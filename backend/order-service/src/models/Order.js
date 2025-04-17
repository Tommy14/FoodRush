import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant'
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready_for_delivery', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash'
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
