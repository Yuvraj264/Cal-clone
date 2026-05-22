import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan'; // Standard request logging

import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import slotRoutes from './routes/slotRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Standard Morgan Logger for Request Streams
app.use(morgan('dev'));

// Standard Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Basic API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});
app.use('/api/', limiter);

// Mount API Route Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/slots', slotRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Centralized Error Handler Interceptor
app.use(errorHandler);

export default app;
