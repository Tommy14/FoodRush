import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['restaurant', 'customer'],
    index: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    formattedAddress: String
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  placeId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

locationSchema.index({ location: '2dsphere' });

export default mongoose.model('Location', locationSchema);