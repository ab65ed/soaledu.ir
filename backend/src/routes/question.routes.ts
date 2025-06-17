import { Router } from 'express';
import { bulkUploadQuestions, uploadMiddleware, getBulkUploadStatus, downloadTemplate } from '../controllers/question/bulk-import';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Mock authentication middleware برای تست (موقت)
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'test-user-id', role: 'designer' };
  next();
};

// Bulk Upload Routes - بارگزاری انبوه سوالات
router.post('/bulk-upload', 
  authenticateToken,
  uploadMiddleware.single('file'), 
  bulkUploadQuestions
);

router.get('/bulk-upload/status', authenticateToken, getBulkUploadStatus);

router.get('/bulk-upload/template', authenticateToken, downloadTemplate);

// Route موقت برای تست بدون auth
router.get('/bulk-upload/template-test', mockAuth, downloadTemplate);

export default router; 