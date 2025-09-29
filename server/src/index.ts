import express from 'express';
import dotenv from 'dotenv';
import {
  limiter,
  authLimiter,
  cookieParserMiddleware,
  sanitize,
  securityHeaders,
  preventHPP,
  corsMiddleware,
  errorHandler
} from './middleware/security';
import connectDB from './db';
import authRoutes from './routes/auth';
import billingRoutes from './routes/billing';
import productRoutes from './routes/products';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Security Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParserMiddleware);
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(sanitize);
app.use(preventHPP);
app.use(limiter);

// Routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/billing', billingRoutes);

// Error handler must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB before starting server
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`✓ MongoDB Connected`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();