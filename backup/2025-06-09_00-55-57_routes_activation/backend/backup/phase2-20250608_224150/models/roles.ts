/**
 * Roles Models and Types
 * مدل‌ها و انواع نقش‌ها
 * 
 * این فایل شامل تعاریف TypeScript برای سیستم نقش‌ها است
 */

export enum UserRole {
  ADMIN = 'admin',
  DESIGNER = 'designer', 
  STUDENT = 'student',
  EXPERT = 'expert',
  SUPPORT = 'support'
}

export enum Permission {
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs',
  MANAGE_PAYMENTS = 'manage_payments',
  
  // Designer permissions
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  PUBLISH_CONTENT = 'publish_content',
  REQUEST_PAYMENT = 'request_payment',
  
  // Expert permissions
  REVIEW_CONTENT = 'review_content',
  APPROVE_CONTENT = 'approve_content',
  CREATE_QUESTIONS = 'create_questions',
  MANAGE_EXAMS = 'manage_exams',
  
  // Support permissions
  VIEW_TICKETS = 'view_tickets',
  RESPOND_TICKETS = 'respond_tickets',
  MANAGE_KNOWLEDGE_BASE = 'manage_knowledge_base',
  LIVE_CHAT = 'live_chat',
  
  // Student permissions
  TAKE_EXAMS = 'take_exams',
  VIEW_RESULTS = 'view_results',
  PURCHASE_CONTENT = 'purchase_content',
  CREATE_TICKETS = 'create_tickets'
}

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  APPROVE = 'approve',
  REJECT = 'reject',
  PAYMENT_REQUEST = 'payment_request',
  TICKET_CREATED = 'ticket_created',
  TICKET_RESOLVED = 'ticket_resolved'
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum PaymentRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
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
  resourceType: string; // 'question', 'exam', 'user', etc.
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

// Role-based dashboard data
export type DashboardStats = 
  | AdminDashboardStats
  | DesignerDashboardStats
  | ExpertDashboardStats
  | SupportDashboardStats
  | StudentDashboardStats;

// Validation schemas
export const ROLE_VALIDATION = {
  displayName: {
    minLength: 2,
    maxLength: 50
  },
  description: {
    maxLength: 200
  },
  ticketTitle: {
    minLength: 5,
    maxLength: 100
  },
  ticketDescription: {
    minLength: 10,
    maxLength: 1000
  },
  paymentAmount: {
    min: 1000,
    max: 10000000
  }
};

// Default role definitions
export const DEFAULT_ROLES: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: UserRole.ADMIN,
    displayName: 'مدیر سیستم',
    description: 'دسترسی کامل به تمام بخش‌های سیستم',
    permissions: [
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_SYSTEM,
      Permission.VIEW_LOGS,
      Permission.MANAGE_PAYMENTS
    ],
    isActive: true
  },
  {
    name: UserRole.DESIGNER,
    displayName: 'طراح محتوا',
    description: 'ایجاد و ویرایش محتوای آموزشی',
    permissions: [
      Permission.CREATE_CONTENT,
      Permission.EDIT_CONTENT,
      Permission.PUBLISH_CONTENT,
      Permission.REQUEST_PAYMENT
    ],
    isActive: true
  },
  {
    name: UserRole.EXPERT,
    displayName: 'کارشناس',
    description: 'بررسی و تایید محتوای آموزشی',
    permissions: [
      Permission.REVIEW_CONTENT,
      Permission.APPROVE_CONTENT,
      Permission.CREATE_QUESTIONS,
      Permission.MANAGE_EXAMS,
      Permission.VIEW_LOGS
    ],
    isActive: true
  },
  {
    name: UserRole.SUPPORT,
    displayName: 'پشتیبانی',
    description: 'پاسخگویی به کاربران و مدیریت تیکت‌ها',
    permissions: [
      Permission.VIEW_TICKETS,
      Permission.RESPOND_TICKETS,
      Permission.MANAGE_KNOWLEDGE_BASE,
      Permission.LIVE_CHAT
    ],
    isActive: true
  },
  {
    name: UserRole.STUDENT,
    displayName: 'دانشجو',
    description: 'شرکت در آزمون‌ها و استفاده از محتوای آموزشی',
    permissions: [
      Permission.TAKE_EXAMS,
      Permission.VIEW_RESULTS,
      Permission.PURCHASE_CONTENT,
      Permission.CREATE_TICKETS
    ],
    isActive: true
  }
];

// Utility functions
export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'مدیر سیستم',
    [UserRole.DESIGNER]: 'طراح محتوا',
    [UserRole.EXPERT]: 'کارشناس',
    [UserRole.SUPPORT]: 'پشتیبانی',
    [UserRole.STUDENT]: 'دانشجو'
  };
  return roleMap[role] || 'نامشخص';
};

export const getPermissionDisplayName = (permission: Permission): string => {
  const permissionMap: Record<Permission, string> = {
    [Permission.MANAGE_USERS]: 'مدیریت کاربران',
    [Permission.MANAGE_ROLES]: 'مدیریت نقش‌ها',
    [Permission.VIEW_ANALYTICS]: 'مشاهده آمار',
    [Permission.MANAGE_SYSTEM]: 'مدیریت سیستم',
    [Permission.VIEW_LOGS]: 'مشاهده لاگ‌ها',
    [Permission.MANAGE_PAYMENTS]: 'مدیریت پرداخت‌ها',
    [Permission.CREATE_CONTENT]: 'ایجاد محتوا',
    [Permission.EDIT_CONTENT]: 'ویرایش محتوا',
    [Permission.PUBLISH_CONTENT]: 'انتشار محتوا',
    [Permission.REQUEST_PAYMENT]: 'درخواست وجه',
    [Permission.REVIEW_CONTENT]: 'بررسی محتوا',
    [Permission.APPROVE_CONTENT]: 'تایید محتوا',
    [Permission.CREATE_QUESTIONS]: 'ایجاد سوال',
    [Permission.MANAGE_EXAMS]: 'مدیریت آزمون‌ها',
    [Permission.VIEW_TICKETS]: 'مشاهده تیکت‌ها',
    [Permission.RESPOND_TICKETS]: 'پاسخ به تیکت‌ها',
    [Permission.MANAGE_KNOWLEDGE_BASE]: 'مدیریت پایگاه دانش',
    [Permission.LIVE_CHAT]: 'چت زنده',
    [Permission.TAKE_EXAMS]: 'شرکت در آزمون',
    [Permission.VIEW_RESULTS]: 'مشاهده نتایج',
    [Permission.PURCHASE_CONTENT]: 'خرید محتوا',
    [Permission.CREATE_TICKETS]: 'ایجاد تیکت'
  };
  return permissionMap[permission] || 'نامشخص';
};

export const getActivityTypeDisplayName = (activityType: ActivityType): string => {
  const activityMap: Record<ActivityType, string> = {
    [ActivityType.LOGIN]: 'ورود',
    [ActivityType.LOGOUT]: 'خروج',
    [ActivityType.CREATE]: 'ایجاد',
    [ActivityType.UPDATE]: 'ویرایش',
    [ActivityType.DELETE]: 'حذف',
    [ActivityType.VIEW]: 'مشاهده',
    [ActivityType.APPROVE]: 'تایید',
    [ActivityType.REJECT]: 'رد',
    [ActivityType.PAYMENT_REQUEST]: 'درخواست وجه',
    [ActivityType.TICKET_CREATED]: 'ایجاد تیکت',
    [ActivityType.TICKET_RESOLVED]: 'حل تیکت'
  };
  return activityMap[activityType] || 'نامشخص';
};

export const getTicketStatusDisplayName = (status: TicketStatus): string => {
  const statusMap: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: 'باز',
    [TicketStatus.IN_PROGRESS]: 'در حال بررسی',
    [TicketStatus.RESOLVED]: 'حل شده',
    [TicketStatus.CLOSED]: 'بسته شده'
  };
  return statusMap[status] || 'نامشخص';
};

export const getTicketPriorityDisplayName = (priority: TicketPriority): string => {
  const priorityMap: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: 'کم',
    [TicketPriority.MEDIUM]: 'متوسط',
    [TicketPriority.HIGH]: 'بالا',
    [TicketPriority.URGENT]: 'فوری'
  };
  return priorityMap[priority] || 'نامشخص';
};

export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}; 