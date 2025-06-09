export interface QuestionOptions {
    limit?: number;
    skip?: number;
    sort?: string;
    sortBy?: string;
    publishedOnly?: boolean;
    authorId?: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    search?: string;
    tags?: string[];
    include?: string[];
    type?: string;
}
export interface TestExamOptions {
    limit?: number;
    skip?: number;
    status?: 'draft' | 'published' | 'archived';
    type?: 'practice' | 'final' | 'midterm' | 'quiz';
    search?: string;
    authorId?: string;
    grade?: string;
    subject?: string;
}
export interface CourseExamOptions {
    limit?: number;
    skip?: number;
    sort?: string;
    sortBy?: string;
    authorId?: string;
    grade?: string;
    group?: string;
    isPublished?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    search?: string;
    category?: string;
    include?: string[];
    courseType?: string;
    publishedOnly?: boolean;
    tags?: string[];
    priceRange?: {
        min?: number;
        max?: number;
    };
}
export interface SearchOptions {
    limit?: number;
    skip?: number;
    sort?: string;
    search?: string;
    publishedOnly?: boolean;
}
export interface AuthenticatedRequest {
    user?: any;
    userId?: string;
    userRole?: string;
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    method?: string;
    url?: string;
    path?: string;
}
export declare enum Permission {
    VIEW_PROFILE = "VIEW_PROFILE",
    EDIT_PROFILE = "EDIT_PROFILE",
    CREATE_QUESTION = "CREATE_QUESTION",
    EDIT_QUESTION = "EDIT_QUESTION",
    DELETE_QUESTION = "DELETE_QUESTION",
    VIEW_QUESTION = "VIEW_QUESTION",
    PUBLISH_QUESTION = "PUBLISH_QUESTION",
    CREATE_EXAM = "CREATE_EXAM",
    EDIT_EXAM = "EDIT_EXAM",
    DELETE_EXAM = "DELETE_EXAM",
    VIEW_EXAM = "VIEW_EXAM",
    CONDUCT_EXAM = "CONDUCT_EXAM",
    VIEW_FINANCIAL_REPORTS = "VIEW_FINANCIAL_REPORTS",
    MANAGE_PAYMENTS = "MANAGE_PAYMENTS",
    PROCESS_REFUNDS = "PROCESS_REFUNDS",
    VIEW_USER_PROFILES = "VIEW_USER_PROFILES",
    EXPORT_DATA = "EXPORT_DATA",
    ADMIN = "ADMIN",
    MANAGE_USERS = "MANAGE_USERS",
    MANAGE_SYSTEM = "MANAGE_SYSTEM",
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
}
export declare enum ActivityType {
    READ = "READ",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    DUPLICATE = "DUPLICATE",
    AUTO_SAVE = "AUTO_SAVE",
    READ_STATS = "READ_STATS",
    BULK_CREATE = "BULK_CREATE",
    BULK_UPDATE = "BULK_UPDATE",
    BULK_DELETE = "BULK_DELETE",
    SEARCH_TAGS = "SEARCH_TAGS",
    TOGGLE_ACTIVE = "TOGGLE_ACTIVE",
    PUBLISH_TO_TEST_EXAM = "PUBLISH_TO_TEST_EXAM",
    READ_PUBLISHED = "READ_PUBLISHED",
    LINK_COURSE_EXAM = "LINK_COURSE_EXAM"
}
export declare enum PermissionResource {
    QUESTION = "QUESTION",
    EXAM = "EXAM",
    USER = "USER",
    SYSTEM = "SYSTEM"
}
export declare enum PermissionAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    PUBLISH = "PUBLISH"
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: string[];
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export interface WalletTransaction {
    id: string;
    amount: number;
    type: 'debit' | 'credit';
    description: string;
    timestamp: Date;
    referenceId?: string;
}
export interface WithdrawalRequest {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: Date;
    processedDate?: Date;
    adminNotes?: string;
}
