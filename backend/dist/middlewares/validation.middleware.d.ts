/**
 * Validation Middleware with Zod
 * میدل‌ویر اعتبارسنجی با پشتیبانی از ورودی‌های فارسی
 *
 * این فایل شامل تمام schema های اعتبارسنجی و middleware های مربوطه می‌باشد
 */
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
/**
 * Persian/Farsi Input Validation Schemas
 * Schema های اعتبارسنجی برای ورودی‌های فارسی
 */
export declare const iranianNationalCodeSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const iranianMobileSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const persianNameSchema: z.ZodString;
export declare const persianTextSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const strongPasswordSchema: z.ZodString;
/**
 * User Validation Schemas
 * Schema های اعتبارسنجی کاربر
 */
export declare const userRegistrationSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    nationalCode: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    phoneNumber: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    role: z.ZodDefault<z.ZodEnum<["student", "instructor", "admin", "designer"]>>;
    gradeLevel: z.ZodOptional<z.ZodNumber>;
    institutionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    role?: "admin" | "student" | "designer" | "instructor";
    email?: string;
    institutionId?: string;
    password?: string;
    nationalCode?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    gradeLevel?: number;
}, {
    role?: "admin" | "student" | "designer" | "instructor";
    email?: string;
    institutionId?: string;
    password?: string;
    nationalCode?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    gradeLevel?: number;
}>;
export declare const userLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phoneNumber: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    gradeLevel: z.ZodOptional<z.ZodNumber>;
    bio: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    gradeLevel?: number;
    bio?: string;
}, {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    gradeLevel?: number;
    bio?: string;
}>;
/**
 * Question Validation Schemas
 * Schema های اعتبارسنجی سوال
 */
export declare const questionSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["multiple_choice", "true_false", "short_answer", "essay"]>;
    difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
    category: z.ZodString;
    lesson: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        isCorrect: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        text?: string;
        isCorrect?: boolean;
    }, {
        text?: string;
        isCorrect?: boolean;
    }>, "many">>;
    correctAnswer: z.ZodOptional<z.ZodString>;
    explanation: z.ZodOptional<z.ZodString>;
    points: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type?: "essay" | "multiple_choice" | "true_false" | "short_answer";
    options?: {
        text?: string;
        isCorrect?: boolean;
    }[];
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    tags?: string[];
    title?: string;
    content?: string;
}, {
    type?: "essay" | "multiple_choice" | "true_false" | "short_answer";
    options?: {
        text?: string;
        isCorrect?: boolean;
    }[];
    correctAnswer?: string;
    difficulty?: "easy" | "medium" | "hard";
    points?: number;
    explanation?: string;
    category?: string;
    lesson?: string;
    tags?: string[];
    title?: string;
    content?: string;
}>;
/**
 * Exam Validation Schemas
 * Schema های اعتبارسنجی آزمون
 */
export declare const examSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration: z.ZodNumber;
    difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
    category: z.ZodString;
    lesson: z.ZodOptional<z.ZodString>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    maxAttempts: z.ZodDefault<z.ZodNumber>;
    passingScore: z.ZodDefault<z.ZodNumber>;
    scheduledAt: z.ZodOptional<z.ZodString>;
    questions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    institutionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    institutionId?: string;
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
    lesson?: string;
    title?: string;
    duration?: number;
    questions?: string[];
    description?: string;
    passingScore?: number;
    isPublic?: boolean;
    maxAttempts?: number;
    scheduledAt?: string;
}, {
    institutionId?: string;
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
    lesson?: string;
    title?: string;
    duration?: number;
    questions?: string[];
    description?: string;
    passingScore?: number;
    isPublic?: boolean;
    maxAttempts?: number;
    scheduledAt?: string;
}>;
/**
 * Contact Validation Schema
 * Schema اعتبارسنجی تماس
 */
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    subject: z.ZodString;
    message: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["support", "complaint", "suggestion", "other"]>>;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    message?: string;
    email?: string;
    name?: string;
    type?: "support" | "other" | "complaint" | "suggestion";
    priority?: "medium" | "low" | "high";
    phone?: string;
    subject?: string;
}, {
    message?: string;
    email?: string;
    name?: string;
    type?: "support" | "other" | "complaint" | "suggestion";
    priority?: "medium" | "low" | "high";
    phone?: string;
    subject?: string;
}>;
/**
 * Payment Validation Schema
 * Schema اعتبارسنجی پرداخت
 */
export declare const paymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    gateway: z.ZodEnum<["zarinpal", "mellat", "parsian", "pasargad"]>;
    description: z.ZodOptional<z.ZodString>;
    callbackUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    amount?: number;
    gateway?: "zarinpal" | "mellat" | "parsian" | "pasargad";
    callbackUrl?: string;
}, {
    description?: string;
    amount?: number;
    gateway?: "zarinpal" | "mellat" | "parsian" | "pasargad";
    callbackUrl?: string;
}>;
/**
 * File Upload Validation Schema
 * Schema اعتبارسنجی آپلود فایل
 */
export declare const fileUploadSchema: z.ZodObject<{
    filename: z.ZodString;
    mimetype: z.ZodEnum<["image/jpeg", "image/jpg", "image/png"]>;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filename?: string;
    mimetype?: "image/jpeg" | "image/jpg" | "image/png";
    size?: number;
}, {
    filename?: string;
    mimetype?: "image/jpeg" | "image/jpg" | "image/png";
    size?: number;
}>;
/**
 * Generic Validation Middleware
 * میدل‌ویر عمومی اعتبارسنجی
 */
export declare const validateSchema: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Query Parameters Validation Middleware
 * میدل‌ویر اعتبارسنجی پارامترهای کوئری
 */
export declare const validateQuery: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * File Upload Validation Middleware
 * میدل‌ویر اعتبارسنجی آپلود فایل
 */
export declare const validateFileUpload: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
/**
 * Common Query Schemas
 * Schema های رایج برای کوئری
 */
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit?: number;
    sort?: string;
    page?: number;
    order?: "asc" | "desc";
}, {
    limit?: string;
    sort?: string;
    page?: string;
    order?: "asc" | "desc";
}>;
export declare const searchSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
    status?: string;
    q?: string;
}, {
    difficulty?: "easy" | "medium" | "hard";
    category?: string;
    status?: string;
    q?: string;
}>;
/**
 * Validation Helper Functions
 * توابع کمکی اعتبارسنجی
 */
export declare const sanitizeInput: (input: string) => string;
export declare const normalizePhoneNumber: (phone: string) => string;
export declare const validateObjectId: (id: string) => boolean;
declare const _default: {
    validateSchema: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    validateQuery: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    validateFileUpload: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
    userRegistrationSchema: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        nationalCode: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        phoneNumber: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        role: z.ZodDefault<z.ZodEnum<["student", "instructor", "admin", "designer"]>>;
        gradeLevel: z.ZodOptional<z.ZodNumber>;
        institutionId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        role?: "admin" | "student" | "designer" | "instructor";
        email?: string;
        institutionId?: string;
        password?: string;
        nationalCode?: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        gradeLevel?: number;
    }, {
        role?: "admin" | "student" | "designer" | "instructor";
        email?: string;
        institutionId?: string;
        password?: string;
        nationalCode?: string;
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        gradeLevel?: number;
    }>;
    userLoginSchema: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email?: string;
        password?: string;
    }, {
        email?: string;
        password?: string;
    }>;
    userUpdateSchema: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        phoneNumber: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        gradeLevel: z.ZodOptional<z.ZodNumber>;
        bio: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        gradeLevel?: number;
        bio?: string;
    }, {
        phoneNumber?: string;
        firstName?: string;
        lastName?: string;
        gradeLevel?: number;
        bio?: string;
    }>;
    questionSchema: z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        type: z.ZodEnum<["multiple_choice", "true_false", "short_answer", "essay"]>;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        category: z.ZodString;
        lesson: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            text?: string;
            isCorrect?: boolean;
        }, {
            text?: string;
            isCorrect?: boolean;
        }>, "many">>;
        correctAnswer: z.ZodOptional<z.ZodString>;
        explanation: z.ZodOptional<z.ZodString>;
        points: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type?: "essay" | "multiple_choice" | "true_false" | "short_answer";
        options?: {
            text?: string;
            isCorrect?: boolean;
        }[];
        correctAnswer?: string;
        difficulty?: "easy" | "medium" | "hard";
        points?: number;
        explanation?: string;
        category?: string;
        lesson?: string;
        tags?: string[];
        title?: string;
        content?: string;
    }, {
        type?: "essay" | "multiple_choice" | "true_false" | "short_answer";
        options?: {
            text?: string;
            isCorrect?: boolean;
        }[];
        correctAnswer?: string;
        difficulty?: "easy" | "medium" | "hard";
        points?: number;
        explanation?: string;
        category?: string;
        lesson?: string;
        tags?: string[];
        title?: string;
        content?: string;
    }>;
    examSchema: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        duration: z.ZodNumber;
        difficulty: z.ZodEnum<["easy", "medium", "hard"]>;
        category: z.ZodString;
        lesson: z.ZodOptional<z.ZodString>;
        isPublic: z.ZodDefault<z.ZodBoolean>;
        maxAttempts: z.ZodDefault<z.ZodNumber>;
        passingScore: z.ZodDefault<z.ZodNumber>;
        scheduledAt: z.ZodOptional<z.ZodString>;
        questions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institutionId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        institutionId?: string;
        difficulty?: "easy" | "medium" | "hard";
        category?: string;
        lesson?: string;
        title?: string;
        duration?: number;
        questions?: string[];
        description?: string;
        passingScore?: number;
        isPublic?: boolean;
        maxAttempts?: number;
        scheduledAt?: string;
    }, {
        institutionId?: string;
        difficulty?: "easy" | "medium" | "hard";
        category?: string;
        lesson?: string;
        title?: string;
        duration?: number;
        questions?: string[];
        description?: string;
        passingScore?: number;
        isPublic?: boolean;
        maxAttempts?: number;
        scheduledAt?: string;
    }>;
    contactSchema: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        subject: z.ZodString;
        message: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["support", "complaint", "suggestion", "other"]>>;
        priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    }, "strip", z.ZodTypeAny, {
        message?: string;
        email?: string;
        name?: string;
        type?: "support" | "other" | "complaint" | "suggestion";
        priority?: "medium" | "low" | "high";
        phone?: string;
        subject?: string;
    }, {
        message?: string;
        email?: string;
        name?: string;
        type?: "support" | "other" | "complaint" | "suggestion";
        priority?: "medium" | "low" | "high";
        phone?: string;
        subject?: string;
    }>;
    paymentSchema: z.ZodObject<{
        amount: z.ZodNumber;
        gateway: z.ZodEnum<["zarinpal", "mellat", "parsian", "pasargad"]>;
        description: z.ZodOptional<z.ZodString>;
        callbackUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string;
        amount?: number;
        gateway?: "zarinpal" | "mellat" | "parsian" | "pasargad";
        callbackUrl?: string;
    }, {
        description?: string;
        amount?: number;
        gateway?: "zarinpal" | "mellat" | "parsian" | "pasargad";
        callbackUrl?: string;
    }>;
    paginationSchema: z.ZodObject<{
        page: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
        limit: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
        sort: z.ZodOptional<z.ZodString>;
        order: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number;
        sort?: string;
        page?: number;
        order?: "asc" | "desc";
    }, {
        limit?: string;
        sort?: string;
        page?: string;
        order?: "asc" | "desc";
    }>;
    searchSchema: z.ZodObject<{
        q: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        status: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        difficulty?: "easy" | "medium" | "hard";
        category?: string;
        status?: string;
        q?: string;
    }, {
        difficulty?: "easy" | "medium" | "hard";
        category?: string;
        status?: string;
        q?: string;
    }>;
    iranianNationalCodeSchema: z.ZodEffects<z.ZodString, string, string>;
    iranianMobileSchema: z.ZodEffects<z.ZodString, string, string>;
    persianNameSchema: z.ZodString;
    persianTextSchema: z.ZodString;
    emailSchema: z.ZodString;
    strongPasswordSchema: z.ZodString;
};
export default _default;
