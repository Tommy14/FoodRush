import express from 'express';
import connectDB from './config/restaurant.db.js';
import cors from 'cors';

import restaurantRoutes from './routes/restaurant.routes.js';
import menuRoutes from './routes/menu.routes.js';

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', menuRoutes);


// Error Handler when route is not found
app.use((req, res, next) => {
  logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default app;