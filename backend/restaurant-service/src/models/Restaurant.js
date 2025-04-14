import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  restaurantId: {
    type: String,
    required: true,
    unique: true,
    default: () => `rest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
  },  
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  isOpen: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
