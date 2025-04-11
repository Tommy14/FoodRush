import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'picked_up', 'delivered'],
    default: 'assigned'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
