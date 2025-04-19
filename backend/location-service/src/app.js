import express from 'express';
import connectDB from './config/location.db.js';
import cors from 'cors';
import winston from 'winston';
import locationRoutes from './routes/location.routes.js';

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/location', locationRoutes);


// Error Handler when route is not found
// Error in app.js
app.use((req, res, next) => {
  logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

export default app;