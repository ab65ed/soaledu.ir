"use strict";
/**
 * Roles Controller
 * کنترلر نقش‌ها
 *
 * مدیریت نقش‌ها، مجوزها، لاگ فعالیت‌ها، تیکت‌ها و درخواست‌های پرداخت
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const express_validator_1 = require("express-validator");
const node_1 = __importDefault(require("parse/node"));
const roles_1 = require("../models/roles");
class RolesController {
    /**
     * Get user roles and permissions
     * GET /api/roles/user-roles
     */
    static async getUserRoles(req, res) {
        try {
            const userId = req.user?.id;
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role') || roles_1.UserRole.STUDENT;
            const permissions = user.get('permissions') || [];
            res.json({
                success: true,
                data: {
                    userId,
                    role: userRole,
                    permissions,
                    displayName: user.get('name') || user.get('username')
                }
            });
        }
        catch (error) {
            console.error('Error getting user roles:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت نقش کاربر',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get dashboard stats based on user role
     * GET /api/roles/dashboard-stats
     */
    static async getDashboardStats(req, res) {
        try {
            const userId = req.user?.id;
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role') || roles_1.UserRole.STUDENT;
            let stats;
            switch (userRole) {
                case roles_1.UserRole.ADMIN:
                    stats = await RolesController.getAdminDashboardStats();
                    break;
                case roles_1.UserRole.DESIGNER:
                    stats = await RolesController.getDesignerDashboardStats(userId);
                    break;
                case roles_1.UserRole.EXPERT:
                    stats = await RolesController.getExpertDashboardStats(userId);
                    break;
                case roles_1.UserRole.SUPPORT:
                    stats = await RolesController.getSupportDashboardStats();
                    break;
                case roles_1.UserRole.STUDENT:
                default:
                    stats = await RolesController.getStudentDashboardStats(userId);
                    break;
            }
            res.json({
                success: true,
                data: {
                    role: userRole,
                    stats
                }
            });
        }
        catch (error) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت آمار داشبورد',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Log user activity
     * POST /api/roles/log-activity
     */
    static async logActivity(req, res) {
        try {
            const userId = req.user?.id;
            const { activityType, resourceType, resourceId, description, metadata } = req.body;
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role') || roles_1.UserRole.STUDENT;
            const ActivityLogClass = node_1.default.Object.extend('ActivityLog');
            const activityLog = new ActivityLogClass();
            activityLog.set('userId', userId);
            activityLog.set('userRole', userRole);
            activityLog.set('activityType', activityType);
            activityLog.set('resourceType', resourceType);
            if (resourceId)
                activityLog.set('resourceId', resourceId);
            activityLog.set('description', description);
            if (metadata)
                activityLog.set('metadata', metadata);
            activityLog.set('ipAddress', req.ip);
            activityLog.set('userAgent', req.get('User-Agent'));
            await activityLog.save();
            res.status(201).json({
                success: true,
                message: 'فعالیت ثبت شد',
                data: activityLog.toJSON()
            });
        }
        catch (error) {
            console.error('Error logging activity:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در ثبت فعالیت',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get activity logs
     * GET /api/roles/activity-logs
     */
    static async getActivityLogs(req, res) {
        try {
            const userId = req.user?.id;
            const { page = 1, limit = 20, userRole, activityType, resourceType } = req.query;
            // Check permission
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const currentUserRole = user.get('role');
            const permissions = user.get('permissions') || [];
            if (!(0, roles_1.hasPermission)(permissions, roles_1.Permission.VIEW_LOGS)) {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به مشاهده لاگ‌ها نیستید'
                });
                return;
            }
            const ActivityLogClass = node_1.default.Object.extend('ActivityLog');
            const query = new node_1.default.Query(ActivityLogClass);
            // Apply filters
            if (userRole)
                query.equalTo('userRole', userRole);
            if (activityType)
                query.equalTo('activityType', activityType);
            if (resourceType)
                query.equalTo('resourceType', resourceType);
            // If not admin, only show own logs
            if (currentUserRole !== roles_1.UserRole.ADMIN) {
                query.equalTo('userId', userId);
            }
            query.descending('createdAt');
            query.limit(Number(limit));
            query.skip((Number(page) - 1) * Number(limit));
            const [logs, total] = await Promise.all([
                query.find(),
                query.count()
            ]);
            const totalPages = Math.ceil(total / Number(limit));
            res.json({
                success: true,
                data: {
                    logs: logs.map(log => log.toJSON()),
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages,
                        hasNext: Number(page) < totalPages,
                        hasPrev: Number(page) > 1
                    }
                }
            });
        }
        catch (error) {
            console.error('Error getting activity logs:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت لاگ فعالیت‌ها',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Create support ticket
     * POST /api/roles/tickets
     */
    static async createTicket(req, res) {
        try {
            const userId = req.user?.id;
            const { title, description, priority, category, tags } = req.body;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'خطاهای اعتبارسنجی',
                    errors: errors.array()
                });
                return;
            }
            const TicketClass = node_1.default.Object.extend('SupportTicket');
            const ticket = new TicketClass();
            const ticketNumber = `TK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            ticket.set('ticketNumber', ticketNumber);
            ticket.set('userId', userId);
            ticket.set('title', title);
            ticket.set('description', description);
            ticket.set('status', roles_1.TicketStatus.OPEN);
            ticket.set('priority', priority || roles_1.TicketPriority.MEDIUM);
            ticket.set('category', category || 'عمومی');
            ticket.set('tags', tags || []);
            ticket.set('responses', []);
            const savedTicket = await ticket.save();
            // Log activity
            await RolesController.logUserActivity(userId, roles_1.ActivityType.TICKET_CREATED, 'ticket', savedTicket.id, `ایجاد تیکت: ${title}`);
            res.status(201).json({
                success: true,
                message: 'تیکت با موفقیت ایجاد شد',
                data: {
                    ...savedTicket.toJSON(),
                    ticketNumber
                }
            });
        }
        catch (error) {
            console.error('Error creating ticket:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در ایجاد تیکت',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get support tickets
     * GET /api/roles/tickets
     */
    static async getTickets(req, res) {
        try {
            const userId = req.user?.id;
            const { page = 1, limit = 10, status, priority, assignedTo } = req.query;
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role');
            const permissions = user.get('permissions') || [];
            const TicketClass = node_1.default.Object.extend('SupportTicket');
            const query = new node_1.default.Query(TicketClass);
            // Apply role-based filtering
            if (userRole === roles_1.UserRole.STUDENT) {
                query.equalTo('userId', userId);
            }
            else if (userRole === roles_1.UserRole.SUPPORT && !(0, roles_1.hasPermission)(permissions, roles_1.Permission.VIEW_TICKETS)) {
                query.equalTo('assignedTo', userId);
            }
            // Apply filters
            if (status)
                query.equalTo('status', status);
            if (priority)
                query.equalTo('priority', priority);
            if (assignedTo)
                query.equalTo('assignedTo', assignedTo);
            query.descending('createdAt');
            query.limit(Number(limit));
            query.skip((Number(page) - 1) * Number(limit));
            const [tickets, total] = await Promise.all([
                query.find(),
                query.count()
            ]);
            const totalPages = Math.ceil(total / Number(limit));
            res.json({
                success: true,
                data: {
                    tickets: tickets.map(ticket => ticket.toJSON()),
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages,
                        hasNext: Number(page) < totalPages,
                        hasPrev: Number(page) > 1
                    }
                }
            });
        }
        catch (error) {
            console.error('Error getting tickets:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت تیکت‌ها',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Create payment request (for designers)
     * POST /api/roles/payment-requests
     */
    static async createPaymentRequest(req, res) {
        try {
            const userId = req.user?.id;
            const { amount, description } = req.body;
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role');
            const permissions = user.get('permissions') || [];
            if (!(0, roles_1.hasPermission)(permissions, roles_1.Permission.REQUEST_PAYMENT)) {
                res.status(403).json({
                    success: false,
                    message: 'شما مجاز به درخواست وجه نیستید'
                });
                return;
            }
            const PaymentRequestClass = node_1.default.Object.extend('PaymentRequest');
            const paymentRequest = new PaymentRequestClass();
            paymentRequest.set('designerId', userId);
            paymentRequest.set('amount', amount);
            paymentRequest.set('description', description);
            paymentRequest.set('status', roles_1.PaymentRequestStatus.PENDING);
            const savedRequest = await paymentRequest.save();
            // Log activity
            await RolesController.logUserActivity(userId, roles_1.ActivityType.PAYMENT_REQUEST, 'payment_request', savedRequest.id, `درخواست وجه: ${amount} تومان`);
            res.status(201).json({
                success: true,
                message: 'درخواست وجه با موفقیت ایجاد شد',
                data: savedRequest.toJSON()
            });
        }
        catch (error) {
            console.error('Error creating payment request:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در ایجاد درخواست وجه',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get knowledge base articles
     * GET /api/roles/knowledge-base
     */
    static async getKnowledgeBase(req, res) {
        try {
            const { page = 1, limit = 10, category, search } = req.query;
            const KnowledgeBaseClass = node_1.default.Object.extend('KnowledgeBaseArticle');
            const query = new node_1.default.Query(KnowledgeBaseClass);
            query.equalTo('isPublished', true);
            if (category)
                query.equalTo('category', category);
            if (search) {
                const titleQuery = new node_1.default.Query(KnowledgeBaseClass);
                titleQuery.contains('title', search);
                const contentQuery = new node_1.default.Query(KnowledgeBaseClass);
                contentQuery.contains('content', search);
                query._orQuery([titleQuery, contentQuery]);
            }
            query.descending('createdAt');
            query.limit(Number(limit));
            query.skip((Number(page) - 1) * Number(limit));
            const [articles, total] = await Promise.all([
                query.find(),
                query.count()
            ]);
            const totalPages = Math.ceil(total / Number(limit));
            res.json({
                success: true,
                data: {
                    articles: articles.map(article => article.toJSON()),
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages,
                        hasNext: Number(page) < totalPages,
                        hasPrev: Number(page) > 1
                    }
                }
            });
        }
        catch (error) {
            console.error('Error getting knowledge base:', error);
            res.status(500).json({
                success: false,
                message: 'خطا در دریافت پایگاه دانش',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Helper methods for dashboard stats
    static async getAdminDashboardStats() {
        const [totalUsers, totalExams, totalQuestions, totalFlashcards, pendingTickets, pendingPaymentRequests, recentActivities] = await Promise.all([
            new node_1.default.Query('User').count(),
            new node_1.default.Query('TestExam').count(),
            new node_1.default.Query('Question').count(),
            new node_1.default.Query('Flashcard').count(),
            new node_1.default.Query('SupportTicket').equalTo('status', roles_1.TicketStatus.OPEN).count(),
            new node_1.default.Query('PaymentRequest').equalTo('status', roles_1.PaymentRequestStatus.PENDING).count(),
            new node_1.default.Query('ActivityLog').descending('createdAt').limit(10).find()
        ]);
        return {
            totalUsers,
            activeUsers: Math.floor(totalUsers * 0.7), // Simulated
            totalExams,
            totalQuestions,
            totalFlashcards,
            totalRevenue: 0, // Would be calculated from actual payments
            pendingTickets,
            pendingPaymentRequests,
            recentActivities: recentActivities.map(activity => activity.toJSON())
        };
    }
    static async getDesignerDashboardStats(userId) {
        const [totalContent, publishedContent, pendingPayments, recentActivities] = await Promise.all([
            new node_1.default.Query('Question').equalTo('createdBy', userId).count(),
            new node_1.default.Query('Question').equalTo('createdBy', userId).equalTo('isPublishedForTestExam', true).count(),
            new node_1.default.Query('PaymentRequest').equalTo('designerId', userId).equalTo('status', roles_1.PaymentRequestStatus.PENDING).count(),
            new node_1.default.Query('ActivityLog').equalTo('userId', userId).descending('createdAt').limit(10).find()
        ]);
        return {
            totalContent,
            publishedContent,
            pendingReview: totalContent - publishedContent,
            totalEarnings: 0, // Would be calculated from actual payments
            pendingPayments,
            recentActivities: recentActivities.map(activity => activity.toJSON())
        };
    }
    static async getExpertDashboardStats(userId) {
        const [totalReviews, approvedContent, recentActivities] = await Promise.all([
            new node_1.default.Query('ActivityLog').equalTo('userId', userId).equalTo('activityType', roles_1.ActivityType.APPROVE).count(),
            new node_1.default.Query('Question').equalTo('reviewedBy', userId).equalTo('isPublishedForTestExam', true).count(),
            new node_1.default.Query('ActivityLog').equalTo('userId', userId).descending('createdAt').limit(10).find()
        ]);
        return {
            totalReviews,
            pendingReviews: 0, // Would need a review queue system
            approvedContent,
            rejectedContent: totalReviews - approvedContent,
            recentActivities: recentActivities.map(activity => activity.toJSON())
        };
    }
    static async getSupportDashboardStats() {
        const [totalTickets, openTickets, inProgressTickets, resolvedTickets, knowledgeBaseArticles, recentTickets, recentActivities] = await Promise.all([
            new node_1.default.Query('SupportTicket').count(),
            new node_1.default.Query('SupportTicket').equalTo('status', roles_1.TicketStatus.OPEN).count(),
            new node_1.default.Query('SupportTicket').equalTo('status', roles_1.TicketStatus.IN_PROGRESS).count(),
            new node_1.default.Query('SupportTicket').equalTo('status', roles_1.TicketStatus.RESOLVED).count(),
            new node_1.default.Query('KnowledgeBaseArticle').equalTo('isPublished', true).count(),
            new node_1.default.Query('SupportTicket').descending('createdAt').limit(5).find(),
            new node_1.default.Query('ActivityLog').equalTo('activityType', roles_1.ActivityType.TICKET_CREATED).descending('createdAt').limit(10).find()
        ]);
        return {
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            averageResponseTime: 24, // Simulated - would be calculated from actual response times
            knowledgeBaseArticles,
            recentTickets: recentTickets.map(ticket => ticket.toJSON()),
            recentActivities: recentActivities.map(activity => activity.toJSON())
        };
    }
    static async getStudentDashboardStats(userId) {
        const [totalExams, totalExamsTaken, completedExams, totalFlashcards, totalFlashcardsPurchased, recentActivities] = await Promise.all([
            new node_1.default.Query('TestExam').count(),
            new node_1.default.Query('UserExamAccess').equalTo('userId', userId).count(),
            new node_1.default.Query('ExamSession').equalTo('userId', userId).equalTo('isCompleted', true).count(),
            new node_1.default.Query('Flashcard').count(),
            new node_1.default.Query('UserFlashcardAccess').equalTo('userId', userId).count(),
            new node_1.default.Query('ActivityLog').equalTo('userId', userId).descending('createdAt').limit(10).find()
        ]);
        return {
            totalExams,
            totalExamsTaken,
            completedExams,
            averageScore: 85, // Would be calculated from actual exam results
            totalFlashcards,
            totalFlashcardsPurchased,
            studyTime: 120, // Would be calculated from actual study sessions
            totalStudyHours: 120,
            recentActivities: recentActivities.map(activity => activity.toJSON())
        };
    }
    static async logUserActivity(userId, activityType, resourceType, resourceId, description, metadata) {
        try {
            const ActivityLogClass = node_1.default.Object.extend('ActivityLog');
            const activityLog = new ActivityLogClass();
            const User = node_1.default.Object.extend('User');
            const userQuery = new node_1.default.Query(User);
            const user = await userQuery.get(userId);
            const userRole = user.get('role') || roles_1.UserRole.STUDENT;
            activityLog.set('userId', userId);
            activityLog.set('userRole', userRole);
            activityLog.set('activityType', activityType);
            activityLog.set('resourceType', resourceType);
            activityLog.set('resourceId', resourceId);
            activityLog.set('description', description);
            if (metadata)
                activityLog.set('metadata', metadata);
            await activityLog.save();
        }
        catch (error) {
            console.error('Error logging user activity:', error);
        }
    }
}
exports.RolesController = RolesController;
//# sourceMappingURL=roles.js.map