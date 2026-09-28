import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';


dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', // React default Vite port
    credentials: true, // Cookies (Refresh Token) accept karne ke liye
  })
);

// Base Route Test
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});