import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userEmail: { type: String, required: true },
  referenceId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  provider: { type: String, default: 'Stripe' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);
