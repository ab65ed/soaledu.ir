import express from 'express';
// import authRoutes from './auth.routes'; // موقتاً غیرفعال
// import rolesRoutes from './roles'; // موقتاً غیرفعال - فایل rename شده
// import walletRoutes from './wallet'; // موقتاً غیرفعال - فایل rename شده

const router = express.Router();

// Mount routes - موقتاً غیرفعال
// router.use('/auth', authRoutes);
// router.use('/roles', rolesRoutes);
// router.use('/wallet', walletRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router; 