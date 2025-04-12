import express from 'express';
import connectDB from './config/user.db.js';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route registration
app.use("/api/users", userRoutes);


// Error Handler when route is not found
app.use((req, res, next) => {
  logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default app;