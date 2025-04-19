import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'null'],  
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Create temp uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Import Routes
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import orderRoutes from './routes/order.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import menuRoutes from './routes/menu.route.js';
import reviewRoutes from './routes/review.routes.js';
// import locationRoutes from './routes/location.routes.js';

app.use('/bff/auth', authRoutes);
app.use('/bff/restaurants', restaurantRoutes);
app.use('/bff/orders', orderRoutes);
app.use('/bff/delivery', deliveryRoutes);
app.use('/bff/pay', paymentRoutes);
app.use('/bff/menu', menuRoutes);
app.use('/bff/reviews', reviewRoutes);
// app.use('/bff/location', locationRoutes);

app.listen(process.env.PORT, () => {
  console.log(`BFF running on port ${process.env.PORT}`);
});

export default app;

