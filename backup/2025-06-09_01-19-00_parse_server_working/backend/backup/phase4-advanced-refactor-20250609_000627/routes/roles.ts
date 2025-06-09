/**
 * Roles Routes
 * مسیرهای API برای سیستم نقش‌ها
 */

import express from 'express';
import { body } from 'express-validator';
import { RolesController } from '../controllers/roles';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * Get user roles and permissions
 * GET /api/roles/user-roles
 */
router.get('/user-roles', RolesController.getUserRoles);

/**
 * Get dashboard stats based on user role
 * GET /api/roles/dashboard-stats
 */
router.get('/dashboard-stats', RolesController.getDashboardStats);

/**
 * Log user activity
 * POST /api/roles/log-activity
 */
router.post('/log-activity', [
  body('activityType').notEmpty().withMessage('نوع فعالیت الزامی است'),
  body('resourceType').notEmpty().withMessage('نوع منبع الزامی است'),
  body('description').notEmpty().withMessage('توضیحات الزامی است')
], RolesController.logActivity);

/**
 * Get activity logs
 * GET /api/roles/activity-logs
 */
router.get('/activity-logs', RolesController.getActivityLogs);

/**
 * Create support ticket
 * POST /api/roles/tickets
 */
router.post('/tickets', [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('عنوان تیکت باید بین 5 تا 100 کاراکتر باشد'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('توضیحات تیکت باید بین 10 تا 1000 کاراکتر باشد'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('اولویت تیکت معتبر نیست'),
  body('category')
    .notEmpty()
    .withMessage('دسته‌بندی تیکت الزامی است')
], RolesController.createTicket);

/**
 * Get support tickets
 * GET /api/roles/tickets
 */
router.get('/tickets', RolesController.getTickets);

/**
 * Create payment request (for designers)
 * POST /api/roles/payment-requests
 */
router.post('/payment-requests', [
  body('amount')
    .isInt({ min: 1000, max: 10000000 })
    .withMessage('مبلغ باید بین 1000 تا 10000000 تومان باشد'),
  body('description')
    .isLength({ min: 10, max: 500 })
    .withMessage('توضیحات باید بین 10 تا 500 کاراکتر باشد')
], RolesController.createPaymentRequest);

/**
 * Get knowledge base articles
 * GET /api/roles/knowledge-base
 */
router.get('/knowledge-base', RolesController.getKnowledgeBase);

export default router; 