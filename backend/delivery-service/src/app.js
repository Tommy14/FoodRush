import express from 'express';
import connectDB from './config/delivery.db.js';
import cors from 'cors';

import deliveryRoutes from './routes/delivery.routes.js';

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);


// Error Handler when route is not found
app.use((req, res, next) => {
  console.error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default app;