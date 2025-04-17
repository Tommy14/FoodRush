import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: {
    url: String,
    publicId: String
  },
  description: String,
  category: String,
  isAvailable: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
