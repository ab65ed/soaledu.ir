/**
 * Roles Controller
 * کنترلر نقش‌ها
 *
 * مدیریت نقش‌ها، مجوزها، لاگ فعالیت‌ها، تیکت‌ها و درخواست‌های پرداخت
 */
import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: any;
}
export declare class RolesController {
    /**
     * Get user roles and permissions
     * GET /api/roles/user-roles
     */
    static getUserRoles(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get dashboard stats based on user role
     * GET /api/roles/dashboard-stats
     */
    static getDashboardStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Log user activity
     * POST /api/roles/log-activity
     */
    static logActivity(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get activity logs
     * GET /api/roles/activity-logs
     */
    static getActivityLogs(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Create support ticket
     * POST /api/roles/tickets
     */
    static createTicket(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get support tickets
     * GET /api/roles/tickets
     */
    static getTickets(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Create payment request (for designers)
     * POST /api/roles/payment-requests
     */
    static createPaymentRequest(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get knowledge base articles
     * GET /api/roles/knowledge-base
     */
    static getKnowledgeBase(req: AuthenticatedRequest, res: Response): Promise<void>;
    private static getAdminDashboardStats;
    private static getDesignerDashboardStats;
    private static getExpertDashboardStats;
    private static getSupportDashboardStats;
    private static getStudentDashboardStats;
    private static logUserActivity;
}
export {};
