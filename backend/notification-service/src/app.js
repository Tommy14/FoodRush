import express from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*', // Or use ['http://localhost:5173'] for specific frontend
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JSON parsing
app.use(express.json());

// Routes
app.use('/notify', notificationRoutes);

// Error Handler when route is not found
app.use((req, res, next) => {
    // logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
    console.log(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Route not found" });
  });

export default app;