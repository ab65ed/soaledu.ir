"use strict";
/**
 * Roles Routes
 * مسیرهای API برای سیستم نقش‌ها
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const roles_1 = require("../controllers/roles");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
/**
 * Get user roles and permissions
 * GET /api/roles/user-roles
 */
router.get('/user-roles', roles_1.RolesController.getUserRoles);
/**
 * Get dashboard stats based on user role
 * GET /api/roles/dashboard-stats
 */
router.get('/dashboard-stats', roles_1.RolesController.getDashboardStats);
/**
 * Log user activity
 * POST /api/roles/log-activity
 */
router.post('/log-activity', [
    (0, express_validator_1.body)('activityType').notEmpty().withMessage('نوع فعالیت الزامی است'),
    (0, express_validator_1.body)('resourceType').notEmpty().withMessage('نوع منبع الزامی است'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('توضیحات الزامی است')
], roles_1.RolesController.logActivity);
/**
 * Get activity logs
 * GET /api/roles/activity-logs
 */
router.get('/activity-logs', roles_1.RolesController.getActivityLogs);
/**
 * Create support ticket
 * POST /api/roles/tickets
 */
router.post('/tickets', [
    (0, express_validator_1.body)('title')
        .isLength({ min: 5, max: 100 })
        .withMessage('عنوان تیکت باید بین 5 تا 100 کاراکتر باشد'),
    (0, express_validator_1.body)('description')
        .isLength({ min: 10, max: 1000 })
        .withMessage('توضیحات تیکت باید بین 10 تا 1000 کاراکتر باشد'),
    (0, express_validator_1.body)('priority')
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('اولویت تیکت معتبر نیست'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('دسته‌بندی تیکت الزامی است')
], roles_1.RolesController.createTicket);
/**
 * Get support tickets
 * GET /api/roles/tickets
 */
router.get('/tickets', roles_1.RolesController.getTickets);
/**
 * Create payment request (for designers)
 * POST /api/roles/payment-requests
 */
router.post('/payment-requests', [
    (0, express_validator_1.body)('amount')
        .isInt({ min: 1000, max: 10000000 })
        .withMessage('مبلغ باید بین 1000 تا 10000000 تومان باشد'),
    (0, express_validator_1.body)('description')
        .isLength({ min: 10, max: 500 })
        .withMessage('توضیحات باید بین 10 تا 500 کاراکتر باشد')
], roles_1.RolesController.createPaymentRequest);
/**
 * Get knowledge base articles
 * GET /api/roles/knowledge-base
 */
router.get('/knowledge-base', roles_1.RolesController.getKnowledgeBase);
exports.default = router;
//# sourceMappingURL=roles.js.map