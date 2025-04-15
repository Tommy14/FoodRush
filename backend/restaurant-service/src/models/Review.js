import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  sentiment: {
    type: String,
    enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
    default: 'NEUTRAL'
  },
  stars: {
    type: String 
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
