/**
 * A/B Test Routes
 * 
 * API routes for A/B testing functionality
 */

import express, { Router } from 'express';
import { 
  getABTests,
  createABTest,
  getABTestById,
  updateABTest,
  deleteABTest,
  startABTest,
  pauseABTest,
  stopABTest,
  getABTestResults,
  assignUserToVariant,
  recordConversion,
  getABTestAnalytics
} from '../controllers/ab-test';

const router: Router = express.Router();

// مسیرهای عمومی تست A/B
router.get('/', getABTests as any);
router.post('/', createABTest as any);
router.get('/:id', getABTestById as any);
router.put('/:id', updateABTest as any);
router.delete('/:id', deleteABTest as any);

// مسیرهای مدیریت تست
router.post('/:id/start', startABTest as any);
router.post('/:id/pause', pauseABTest as any);
router.post('/:id/stop', stopABTest as any);

// مسیرهای نتایج و تحلیل
router.get('/:id/results', getABTestResults as any);
router.get('/:id/analytics', getABTestAnalytics as any);

// مسیرهای تعامل کاربر
router.post('/:id/assign', assignUserToVariant as any);
router.post('/:id/convert', recordConversion as any);

export default router;
