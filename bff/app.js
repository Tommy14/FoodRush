import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const app = express();


dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173',     // ✅ allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());



// Import Routes
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import orderRoutes from './routes/order.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';

app.use('/bff/auth', authRoutes);
app.use('/bff/restaurants', restaurantRoutes);
app.use('/bff/orders', orderRoutes);
app.use('/bff/delivery', deliveryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`BFF running on port ${process.env.PORT}`);
});

export default app;