import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import deliveryRoutes from './routes/delivery.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected to delivery-service'))
.catch(err => console.error('MongoDB error:', err));

// Server start
const PORT = process.env.PORT || 9300;
app.listen(PORT, () => {
  console.log(`Delivery Service running on port ${PORT}`);
});
