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
    message: 'Wine Catalog API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
