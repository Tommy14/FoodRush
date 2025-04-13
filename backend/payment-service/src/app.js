import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/payment.db.js';
import paymentRoutes from './routes/payment.routes.js';


dotenv.config(); // Load environment variables

// Connect to DB
connectDB();

const app = express();

// Only for /api/pay/webhook route — raw parser required
app.post('/api/pay/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body; // Save raw body for Stripe
  next();
});

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
app.use('/api/pay', paymentRoutes);

// Error Handler when route is not found
app.use((req, res, next) => {
    // logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
    console.error(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Route not found" });
  });
  

export default app;
