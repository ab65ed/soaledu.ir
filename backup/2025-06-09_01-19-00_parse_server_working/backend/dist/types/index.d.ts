import { Document } from 'mongoose';
import mongoose from 'mongoose';
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin' | 'support' | 'question_designer';
    avatar?: string;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Exam {
    id: string;
    title: string;
    description?: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    negativeMarking: boolean;
    negativeMarkingValue?: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isActive: boolean;
    questions: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    marks: number;
    negativeMarks?: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation?: string;
    isActive: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Answer {
    questionId: mongoose.Types.ObjectId;
    questionNumber: number;
    selectedAnswer: string | number | string[];
    correctAnswer: string | number | string[];
    isCorrect: boolean;
    timeSpent: number;
    points: number;
}
export interface CategoryPerformance {
    category: string;
    correct: number;
    total: number;
    percentage: number;
}
export interface DifficultyPerformance {
    difficulty: 'easy' | 'medium' | 'hard';
    correct: number;
    total: number;
    percentage: number;
}
export interface QuestionAnalytics {
    questionId: mongoose.Types.ObjectId;
    timeSpent: number;
}
export interface ResultAnalytics {
    averageTimePerQuestion: number;
    fastestQuestion: QuestionAnalytics;
    slowestQuestion: QuestionAnalytics;
    categoryPerformance: CategoryPerformance[];
    difficultyPerformance: DifficultyPerformance[];
}
export interface BrowserInfo {
    name: string;
    version: string;
}
export interface ResultMetadata {
    userAgent: string;
    ipAddress: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    browserInfo: BrowserInfo;
}
export interface SuspiciousActivity {
    tabSwitches: number;
    copyPasteAttempts: number;
    rightClickAttempts: number;
    unusualPatterns: string[];
}
export interface ExamResult {
    id: string;
    user: string;
    exam: string;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    percentage: number;
    answers: Answer[];
    status: 'completed' | 'abandoned' | 'timeout';
    isPassed: boolean;
    passingScore: number;
    analytics: ResultAnalytics;
    metadata: ResultMetadata;
    isReviewed: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
    suspiciousActivity: SuspiciousActivity;
    createdAt: Date;
    updatedAt: Date;
}
export interface IExamResult extends Document {
    user: mongoose.Types.ObjectId;
    exam: mongoose.Types.ObjectId;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unansweredQuestions: number;
    percentage: number;
    answers: Answer[];
    status: 'completed' | 'abandoned' | 'timeout';
    isPassed: boolean;
    passingScore: number;
    analytics: ResultAnalytics;
    metadata: ResultMetadata;
    isReviewed: boolean;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    suspiciousActivity: SuspiciousActivity;
    grade: string;
    performanceLevel: string;
    calculateAnalytics(): void;
}
export interface Category {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Lesson {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isPublished: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = string;
export interface TicketAttachment {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
}
export interface Ticket {
    id: string;
    userId: string;
    subject: string;
    message: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    assignedTo?: string;
    responses: TicketResponse[];
    attachments: TicketAttachment[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ITicket extends Document {
    user: string;
    subject: string;
    message: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    assignedTo?: string;
    responses: TicketResponse[];
    attachments: TicketAttachment[];
    addResponse(userId: string, message: string): Promise<void>;
    updateStatus(status: TicketStatus): Promise<void>;
    assignTo(userId: string): Promise<void>;
    escalate(): Promise<void>;
    findTicketsForEscalation(): Promise<ITicket[]>;
}
export interface TicketResponse {
    id: string;
    ticketId: string;
    userId: string;
    message: string;
    isStaff: boolean;
    createdAt: Date;
}
export interface Payment {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    type: 'credit_purchase' | 'exam_fee' | 'subscription';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface WalletTransaction {
    id: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    relatedId?: string;
    relatedType?: string;
    createdAt: Date;
}
export interface BlogComment {
    id?: string;
    author: mongoose.Types.ObjectId;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    parentComment?: mongoose.Types.ObjectId;
    moderatedBy?: mongoose.Types.ObjectId;
    moderatedAt?: Date;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface BlogImage {
    url: string;
    alt?: string;
    caption?: string;
    uploadedAt?: Date;
    size?: number;
    dimensions?: {
        width: number;
        height: number;
    };
}
export interface BlogFeaturedImage {
    url?: string;
    alt?: string;
    caption?: string;
    uploadedAt?: Date;
    size?: number;
    dimensions?: {
        width: number;
        height: number;
    };
}
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    contentType: 'html' | 'markdown';
    categories: string[];
    tags: string[];
    featuredImage?: BlogFeaturedImage;
    images?: BlogImage[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    author: string;
    lastEditedBy?: string;
    comments: BlogComment[];
    allowComments: boolean;
    isFeatured: boolean;
    isSticky: boolean;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    readingTime: number;
    relatedPosts: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IBlogPost extends Document {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    contentType: 'html' | 'markdown';
    categories: mongoose.Types.ObjectId[];
    tags: string[];
    featuredImage?: BlogFeaturedImage;
    images?: BlogImage[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    author: mongoose.Types.ObjectId;
    lastEditedBy?: mongoose.Types.ObjectId;
    comments: BlogComment[];
    allowComments: boolean;
    isFeatured: boolean;
    isSticky: boolean;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    readingTime: number;
    relatedPosts: mongoose.Types.ObjectId[];
    approvedComments: BlogComment[];
    commentCount: number;
    incrementViewCount(): Promise<IBlogPost>;
    addComment(commentData: Partial<BlogComment>): Promise<IBlogPost>;
    moderateComment(commentId: string, status: 'pending' | 'approved' | 'rejected', moderatorId: string): Promise<IBlogPost>;
}
export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent?: string;
    path: string;
    level: number;
    order: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    image?: {
        url?: string;
        alt?: string;
    };
    color: string;
    isActive: boolean;
    postCount: number;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBlogCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    parent?: mongoose.Types.ObjectId;
    path: string;
    level: number;
    order: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    image?: {
        url?: string;
        alt?: string;
    };
    color: string;
    isActive: boolean;
    postCount: number;
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    children?: IBlogCategory[];
    posts?: IBlogPost[];
    updatePostCount(): Promise<void>;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface AuthRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface QueryOptions {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    filter?: Record<string, any>;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}
export interface LogEntry {
    level: 'error' | 'warn' | 'info' | 'debug';
    message: string;
    timestamp: Date;
    userId?: string;
    action?: string;
    metadata?: Record<string, any>;
}
import { Request as ExpressRequest, Response, NextFunction } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
export interface RequestWithUser<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query, LocalsObj extends Record<string, any> = Record<string, any>> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, LocalsObj> {
    user?: {
        id: string;
        _id?: string;
        role: string;
        email: string;
        name?: string;
    };
    token?: string;
}
export type RouteHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query, LocalsObj extends Record<string, any> = Record<string, any>> = (req: RequestWithUser<P, ResBody, ReqBody, ReqQuery, LocalsObj>, res: Response<ResBody, LocalsObj>, next?: NextFunction) => Promise<void> | void;
export declare const asyncHandler: <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query, LocalsObj extends Record<string, any> = Record<string, any>>(fn: (req: RequestWithUser<P, ResBody, ReqBody, ReqQuery, LocalsObj>, res: Response<ResBody, LocalsObj>, next?: NextFunction) => Promise<any>) => (req: RequestWithUser<P, ResBody, ReqBody, ReqQuery, LocalsObj>, res: Response<ResBody, LocalsObj>, next?: NextFunction) => void;
