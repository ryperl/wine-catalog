import { Router } from 'express';
import authRoutes from './auth';
import wineRoutes from './wines';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/wines', wineRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wine Catalog API is healthy and running',
    timestamp: new Date().toISOString(),
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    },
  });
});

export default router;
