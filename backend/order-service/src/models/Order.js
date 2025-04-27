import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String } // optional for UI
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  customerName: { type: String },
  customerEmail: { type: String },
  contactNumber: { type: String },

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant'
  },
  restaurantName: { type: String },

  items: {
    type: [orderItemSchema],
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  deliveryAddress: {
    type: String,
    required: true
  },

  // deliveryCoordinates: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     default: 'Point'
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true
  //   }
  // },  

  paymentMethod: {
    type: String,
    enum: ['cash', 'card'],
    default: 'cash'
  },

  status: {
    type: String,
    enum: [
      'pending',
      'placed',
      'preparing',
      'ready_for_delivery',
      'picked_up',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },

  placedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
