/**
 * Roles Models and Types
 * مدل‌ها و انواع نقش‌ها
 *
 * این فایل شامل تعاریف TypeScript برای سیستم نقش‌ها است
 */
export declare enum UserRole {
    ADMIN = "admin",
    DESIGNER = "designer",
    STUDENT = "student",
    EXPERT = "expert",
    SUPPORT = "support"
}
export declare enum Permission {
    MANAGE_USERS = "manage_users",
    MANAGE_ROLES = "manage_roles",
    VIEW_ANALYTICS = "view_analytics",
    MANAGE_SYSTEM = "manage_system",
    VIEW_LOGS = "view_logs",
    MANAGE_PAYMENTS = "manage_payments",
    CREATE_CONTENT = "create_content",
    EDIT_CONTENT = "edit_content",
    PUBLISH_CONTENT = "publish_content",
    REQUEST_PAYMENT = "request_payment",
    REVIEW_CONTENT = "review_content",
    APPROVE_CONTENT = "approve_content",
    CREATE_QUESTIONS = "create_questions",
    MANAGE_EXAMS = "manage_exams",
    VIEW_TICKETS = "view_tickets",
    RESPOND_TICKETS = "respond_tickets",
    MANAGE_KNOWLEDGE_BASE = "manage_knowledge_base",
    LIVE_CHAT = "live_chat",
    TAKE_EXAMS = "take_exams",
    VIEW_RESULTS = "view_results",
    PURCHASE_CONTENT = "purchase_content",
    CREATE_TICKETS = "create_tickets"
}
export declare enum ActivityType {
    LOGIN = "login",
    LOGOUT = "logout",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    VIEW = "view",
    APPROVE = "approve",
    REJECT = "reject",
    PAYMENT_REQUEST = "payment_request",
    TICKET_CREATED = "ticket_created",
    TICKET_RESOLVED = "ticket_resolved"
}
export declare enum TicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare enum TicketPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare enum PaymentRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid"
}
export interface RoleDefinition {
    id: string;
    name: UserRole;
    displayName: string;
    description: string;
    permissions: Permission[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserRoleAssignment {
    id: string;
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: Date;
    isActive: boolean;
    expiresAt?: Date;
}
export interface ActivityLog {
    id: string;
    userId: string;
    userRole: UserRole;
    activityType: ActivityType;
    resourceType: string;
    resourceId?: string;
    description: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
export interface SupportTicket {
    id: string;
    ticketNumber: string;
    userId: string;
    assignedTo?: string;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: string;
    tags: string[];
    attachments?: string[];
    responses: TicketResponse[];
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
}
export interface TicketResponse {
    id: string;
    ticketId: string;
    userId: string;
    userRole: UserRole;
    message: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: Date;
}
export interface PaymentRequest {
    id: string;
    designerId: string;
    amount: number;
    description: string;
    status: PaymentRequestStatus;
    requestedAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
    paidAt?: Date;
    rejectionReason?: string;
    metadata?: Record<string, any>;
}
export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    authorId: string;
    isPublished: boolean;
    viewCount: number;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface AdminDashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalExams: number;
    totalQuestions: number;
    totalFlashcards: number;
    totalRevenue: number;
    pendingTickets: number;
    pendingPaymentRequests: number;
    recentActivities: ActivityLog[];
}
export interface DesignerDashboardStats {
    totalContent: number;
    publishedContent: number;
    pendingReview: number;
    totalEarnings: number;
    pendingPayments: number;
    recentActivities: ActivityLog[];
}
export interface ExpertDashboardStats {
    totalReviews: number;
    pendingReviews: number;
    approvedContent: number;
    rejectedContent: number;
    recentActivities: ActivityLog[];
}
export interface SupportDashboardStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    averageResponseTime: number;
    knowledgeBaseArticles: number;
    recentTickets: SupportTicket[];
    recentActivities: ActivityLog[];
}
export interface StudentDashboardStats {
    totalExams: number;
    totalExamsTaken: number;
    completedExams: number;
    averageScore: number;
    totalFlashcards: number;
    totalFlashcardsPurchased: number;
    studyTime: number;
    totalStudyHours: number;
    recentActivities: ActivityLog[];
}
export type DashboardStats = AdminDashboardStats | DesignerDashboardStats | ExpertDashboardStats | SupportDashboardStats | StudentDashboardStats;
export declare const ROLE_VALIDATION: {
    displayName: {
        minLength: number;
        maxLength: number;
    };
    description: {
        maxLength: number;
    };
    ticketTitle: {
        minLength: number;
        maxLength: number;
    };
    ticketDescription: {
        minLength: number;
        maxLength: number;
    };
    paymentAmount: {
        min: number;
        max: number;
    };
};
export declare const DEFAULT_ROLES: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>[];
export declare const getRoleDisplayName: (role: UserRole) => string;
export declare const getPermissionDisplayName: (permission: Permission) => string;
export declare const getActivityTypeDisplayName: (activityType: ActivityType) => string;
export declare const getTicketStatusDisplayName: (status: TicketStatus) => string;
export declare const getTicketPriorityDisplayName: (priority: TicketPriority) => string;
export declare const hasPermission: (userPermissions: Permission[], requiredPermission: Permission) => boolean;
export declare const hasAnyPermission: (userPermissions: Permission[], requiredPermissions: Permission[]) => boolean;
export declare const hasAllPermissions: (userPermissions: Permission[], requiredPermissions: Permission[]) => boolean;
