import { Router } from 'express';
import { bulkUploadQuestions, uploadMiddleware, getBulkUploadStatus, downloadTemplate } from '../controllers/question/bulk-import';

const router = Router();

// Mock authentication middleware (موقت)
const mockAuth = (req: any, res: any, next: any) => {
  // TODO: پیاده‌سازی middleware احراز هویت واقعی
  req.user = { id: 'mock-user-id', role: 'designer' };
  next();
};

// Bulk Upload Routes - بارگزاری انبوه سوالات
router.post('/bulk-upload', 
  mockAuth,
  uploadMiddleware.single('file'), 
  bulkUploadQuestions
);

router.get('/bulk-upload/status', mockAuth, getBulkUploadStatus);

router.get('/bulk-upload/template', mockAuth, downloadTemplate);

export default router; 