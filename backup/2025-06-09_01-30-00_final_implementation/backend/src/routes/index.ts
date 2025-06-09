import express from 'express';
import authRoutes from './auth.routes';
import rolesRoutes from './roles';
import walletRoutes from './wallet';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/wallet', walletRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 