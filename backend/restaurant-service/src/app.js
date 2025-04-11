import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import restaurantRoutes from './routes/restaurant.routes.js';
import menuRoutes from './routes/menu.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', menuRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 9100;
app.listen(PORT, () => console.log(`Restaurant Service running on port ${PORT}`));
