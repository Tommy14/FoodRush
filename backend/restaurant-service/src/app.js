import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/restaurant.db.js';

import restaurantRoutes from './routes/restaurant.routes.js';
import menuRoutes from './routes/menu.routes.js';
import reviewRoutes from './routes/review.routes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants', menuRoutes);
app.use('/api/reviews', reviewRoutes);


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Optional global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
