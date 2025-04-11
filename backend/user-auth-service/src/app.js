import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middlewares 
app.use(express.json());

// Route registration
app.use("/api/users", userRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`User Auth Service running on port ${PORT}`);
});
