/**
 * Database Indexes Configuration
 * تنظیمات Index های بهینه برای عملکرد بالا در MongoDB
 *
 * این فایل شامل تمام index های مورد نیاز برای بهینه‌سازی query ها می‌باشد
 */
/**
 * User Model Indexes - بهینه‌سازی پرس‌وجوهای کاربری
 */
export declare const userIndexes: ({
    key: {
        email: number;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        unique: boolean;
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        nationalCode: number;
        email?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        unique: boolean;
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        phoneNumber: number;
        email?: undefined;
        nationalCode?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        unique: boolean;
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        role: number;
        isActive: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        institutionId: number;
        role: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        createdAt: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        firstName: string;
        lastName: string;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        lastLoginAt: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        isActive: number;
        isEmailVerified: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        gradeLevel: number;
        isActive: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        institutionId?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        profileCompleted: number;
        createdAt: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        role?: undefined;
        isActive?: undefined;
        institutionId?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        institutionId: number;
        role: number;
        isActive: number;
        email?: undefined;
        nationalCode?: undefined;
        phoneNumber?: undefined;
        createdAt?: undefined;
        firstName?: undefined;
        lastName?: undefined;
        lastLoginAt?: undefined;
        isEmailVerified?: undefined;
        gradeLevel?: undefined;
        profileCompleted?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * Question Model Indexes - بهینه‌سازی پرس‌وجوهای سوال
 */
export declare const questionIndexes: ({
    key: {
        category: number;
        difficulty: number;
        isActive: number;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        lesson: number;
        difficulty: number;
        category?: undefined;
        isActive?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        createdBy: number;
        createdAt: number;
        category?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        lesson?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        type: number;
        difficulty: number;
        category?: undefined;
        isActive?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        difficulty: number;
        isActive: number;
        createdAt: number;
        category?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        status: number;
        isActive: number;
        category?: undefined;
        difficulty?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        title: string;
        content: string;
        category?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        tags: number;
        isActive: number;
        category?: undefined;
        difficulty?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        createdAt: number;
        isActive: number;
        category?: undefined;
        difficulty?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        usageCount: number;
        isActive: number;
        category?: undefined;
        difficulty?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        reviewStatus: number;
        createdAt: number;
        category?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        averageScore?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        category: number;
        lesson: number;
        difficulty: number;
        isActive: number;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        usageCount?: undefined;
        reviewStatus?: undefined;
        averageScore?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        averageScore: number;
        usageCount: number;
        category?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        lesson?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        type?: undefined;
        status?: undefined;
        title?: undefined;
        content?: undefined;
        tags?: undefined;
        reviewStatus?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
})[];
/**
 * Exam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون
 */
export declare const examIndexes: ({
    key: {
        creator: number;
        status: number;
        createdAt: number;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        user: number;
        status: number;
        startedAt: number;
        creator?: undefined;
        createdAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        status: number;
        isPublic: number;
        createdAt: number;
        creator?: undefined;
        user?: undefined;
        startedAt?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        category: number;
        status: number;
        isPublic: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        lesson: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        difficulty: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        scheduledAt: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        duration: number;
        isPublic: number;
        creator?: undefined;
        status?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        maxScore: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        completedAt?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        completedAt: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        examType?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        examType: number;
        isPublic: number;
        creator?: undefined;
        status?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        institutionId: number;
        status: number;
        creator?: undefined;
        createdAt?: undefined;
        user?: undefined;
        startedAt?: undefined;
        isPublic?: undefined;
        category?: undefined;
        lesson?: undefined;
        difficulty?: undefined;
        scheduledAt?: undefined;
        duration?: undefined;
        maxScore?: undefined;
        completedAt?: undefined;
        examType?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
})[];
/**
 * Category Model Indexes - بهینه‌سازی پرس‌وجوهای دسته‌بندی
 */
export declare const categoryIndexes: ({
    key: {
        name: number;
        slug?: undefined;
        parentId?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        order?: undefined;
        description?: undefined;
        level?: undefined;
    };
    options: {
        unique: boolean;
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        slug: number;
        name?: undefined;
        parentId?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        order?: undefined;
        description?: undefined;
        level?: undefined;
    };
    options: {
        unique: boolean;
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        parentId: number;
        isActive: number;
        name?: undefined;
        slug?: undefined;
        createdAt?: undefined;
        order?: undefined;
        description?: undefined;
        level?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        isActive: number;
        createdAt: number;
        name?: undefined;
        slug?: undefined;
        parentId?: undefined;
        order?: undefined;
        description?: undefined;
        level?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        order: number;
        isActive: number;
        name?: undefined;
        slug?: undefined;
        parentId?: undefined;
        createdAt?: undefined;
        description?: undefined;
        level?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        name: string;
        description: string;
        slug?: undefined;
        parentId?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        order?: undefined;
        level?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        level: number;
        isActive: number;
        name?: undefined;
        slug?: undefined;
        parentId?: undefined;
        createdAt?: undefined;
        order?: undefined;
        description?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * Transaction Model Indexes - بهینه‌سازی پرس‌وجوهای تراکنش مالی
 */
export declare const transactionIndexes: ({
    key: {
        userId: number;
        createdAt: number;
        status?: undefined;
        paymentMethod?: undefined;
        amount?: undefined;
        referenceNumber?: undefined;
        type?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        status: number;
        createdAt: number;
        userId?: undefined;
        paymentMethod?: undefined;
        amount?: undefined;
        referenceNumber?: undefined;
        type?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        paymentMethod: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        amount?: undefined;
        referenceNumber?: undefined;
        type?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        amount: number;
        createdAt: number;
        userId?: undefined;
        status?: undefined;
        paymentMethod?: undefined;
        referenceNumber?: undefined;
        type?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        referenceNumber: number;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        paymentMethod?: undefined;
        amount?: undefined;
        type?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        unique: boolean;
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        type: number;
        status: number;
        createdAt: number;
        userId?: undefined;
        paymentMethod?: undefined;
        amount?: undefined;
        referenceNumber?: undefined;
        gatewayTransactionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        gatewayTransactionId: number;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        paymentMethod?: undefined;
        amount?: undefined;
        referenceNumber?: undefined;
        type?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * DiscountCode Model Indexes - بهینه‌سازی پرس‌وجوهای کد تخفیف
 */
export declare const discountCodeIndexes: ({
    key: {
        code: number;
        isActive?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        createdBy?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        type?: undefined;
        institutionId?: undefined;
    };
    options: {
        unique: boolean;
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        isActive: number;
        validFrom: number;
        validTo: number;
        code?: undefined;
        createdBy?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        type?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        createdBy: number;
        isActive: number;
        code?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        type?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        usageCount: number;
        maxUsage: number;
        code?: undefined;
        isActive?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        createdBy?: undefined;
        type?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        validTo: number;
        isActive: number;
        code?: undefined;
        validFrom?: undefined;
        createdBy?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        type?: undefined;
        institutionId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        type: number;
        isActive: number;
        code?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        createdBy?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        institutionId: number;
        isActive: number;
        code?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        createdBy?: undefined;
        usageCount?: undefined;
        maxUsage?: undefined;
        type?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * Institution Model Indexes - بهینه‌سازی پرس‌وجوهای سازمان
 */
export declare const institutionIndexes: ({
    key: {
        name: number;
        domain?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        type?: undefined;
        city?: undefined;
        province?: undefined;
        description?: undefined;
        adminUserId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        domain: number;
        name?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        type?: undefined;
        city?: undefined;
        province?: undefined;
        description?: undefined;
        adminUserId?: undefined;
    };
    options: {
        unique: boolean;
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        isActive: number;
        createdAt: number;
        name?: undefined;
        domain?: undefined;
        type?: undefined;
        city?: undefined;
        province?: undefined;
        description?: undefined;
        adminUserId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        type: number;
        isActive: number;
        name?: undefined;
        domain?: undefined;
        createdAt?: undefined;
        city?: undefined;
        province?: undefined;
        description?: undefined;
        adminUserId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        city: number;
        province: number;
        name?: undefined;
        domain?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        type?: undefined;
        description?: undefined;
        adminUserId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        name: string;
        description: string;
        domain?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        type?: undefined;
        city?: undefined;
        province?: undefined;
        adminUserId?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        adminUserId: number;
        name?: undefined;
        domain?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        type?: undefined;
        city?: undefined;
        province?: undefined;
        description?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * Wallet Model Indexes - بهینه‌سازی پرس‌وجوهای کیف پول
 */
export declare const walletIndexes: ({
    key: {
        userId: number;
        balance?: undefined;
        isActive?: undefined;
        updatedAt?: undefined;
        currency?: undefined;
        lastTransactionAt?: undefined;
    };
    options: {
        unique: boolean;
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        balance: number;
        isActive: number;
        userId?: undefined;
        updatedAt?: undefined;
        currency?: undefined;
        lastTransactionAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        isActive: number;
        updatedAt: number;
        userId?: undefined;
        balance?: undefined;
        currency?: undefined;
        lastTransactionAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        currency: number;
        isActive: number;
        userId?: undefined;
        balance?: undefined;
        updatedAt?: undefined;
        lastTransactionAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        lastTransactionAt: number;
        userId?: undefined;
        balance?: undefined;
        isActive?: undefined;
        updatedAt?: undefined;
        currency?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * CourseExam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون دوره‌ای
 */
export declare const courseExamIndexes: ({
    key: {
        courseId: number;
        isActive: number;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        isPublic?: undefined;
        difficulty?: undefined;
        category?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        duration?: undefined;
        price?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        createdBy: number;
        createdAt: number;
        courseId?: undefined;
        isActive?: undefined;
        status?: undefined;
        isPublic?: undefined;
        difficulty?: undefined;
        category?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        duration?: undefined;
        price?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        status: number;
        isPublic: number;
        courseId?: undefined;
        isActive?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        difficulty?: undefined;
        category?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        duration?: undefined;
        price?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        difficulty: number;
        category: number;
        courseId?: undefined;
        isActive?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        isPublic?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        duration?: undefined;
        price?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        startDate: number;
        endDate: number;
        courseId?: undefined;
        isActive?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        isPublic?: undefined;
        difficulty?: undefined;
        category?: undefined;
        duration?: undefined;
        price?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        duration: number;
        isActive: number;
        courseId?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        isPublic?: undefined;
        difficulty?: undefined;
        category?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        price?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        price: number;
        isPublic: number;
        courseId?: undefined;
        isActive?: undefined;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        difficulty?: undefined;
        category?: undefined;
        startDate?: undefined;
        endDate?: undefined;
        duration?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
})[];
/**
 * TestExam Model Indexes - بهینه‌سازی پرس‌وجوهای آزمون تستی
 */
export declare const testExamIndexes: ({
    key: {
        createdBy: number;
        createdAt: number;
        status?: undefined;
        examType?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        isPublic?: undefined;
        questionCount?: undefined;
        duration?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        status: number;
        examType: number;
        createdBy?: undefined;
        createdAt?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        isPublic?: undefined;
        questionCount?: undefined;
        duration?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        subject: number;
        gradeLevel: number;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        examType?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        isPublic?: undefined;
        questionCount?: undefined;
        duration?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        difficulty: number;
        isActive: number;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        examType?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        isPublic?: undefined;
        questionCount?: undefined;
        duration?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        isPublic: number;
        status: number;
        createdAt: number;
        createdBy?: undefined;
        examType?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        questionCount?: undefined;
        duration?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        questionCount: number;
        duration: number;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        examType?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        difficulty?: undefined;
        isActive?: undefined;
        isPublic?: undefined;
        institutionId?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        institutionId: number;
        isActive: number;
        createdBy?: undefined;
        createdAt?: undefined;
        status?: undefined;
        examType?: undefined;
        subject?: undefined;
        gradeLevel?: undefined;
        difficulty?: undefined;
        isPublic?: undefined;
        questionCount?: undefined;
        duration?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
})[];
/**
 * Contact Model Indexes - بهینه‌سازی پرس‌وجوهای تماس
 */
export declare const contactIndexes: ({
    key: {
        userId: number;
        createdAt: number;
        status?: undefined;
        type?: undefined;
        priority?: undefined;
        email?: undefined;
        phone?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        status: number;
        createdAt: number;
        userId?: undefined;
        type?: undefined;
        priority?: undefined;
        email?: undefined;
        phone?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        type: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        priority?: undefined;
        email?: undefined;
        phone?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        priority: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        type?: undefined;
        email?: undefined;
        phone?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        email: number;
        createdAt: number;
        userId?: undefined;
        status?: undefined;
        type?: undefined;
        priority?: undefined;
        phone?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
} | {
    key: {
        phone: number;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        type?: undefined;
        priority?: undefined;
        email?: undefined;
        subject?: undefined;
        message?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        subject: string;
        message: string;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        type?: undefined;
        priority?: undefined;
        email?: undefined;
        phone?: undefined;
    };
    options: {
        background: boolean;
        sparse?: undefined;
    };
})[];
/**
 * Payment Model Indexes - بهینه‌سازی پرس‌وجوهای پرداخت
 */
export declare const paymentIndexes: ({
    key: {
        userId: number;
        createdAt: number;
        status?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        status: number;
        createdAt: number;
        userId?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        gateway: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        transactionId: number;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        gateway?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        unique: boolean;
        sparse: boolean;
        background: boolean;
    };
} | {
    key: {
        amount: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        background: boolean;
        unique?: undefined;
        sparse?: undefined;
    };
} | {
    key: {
        gatewayTransactionId: number;
        userId?: undefined;
        createdAt?: undefined;
        status?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        orderId?: undefined;
        paidAt?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        orderId: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        paidAt?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
} | {
    key: {
        paidAt: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        gateway?: undefined;
        transactionId?: undefined;
        amount?: undefined;
        gatewayTransactionId?: undefined;
        orderId?: undefined;
    };
    options: {
        sparse: boolean;
        background: boolean;
        unique?: undefined;
    };
})[];
/**
 * اعمال تمام index ها
 */
export declare function applyAllIndexes(): Promise<void>;
/**
 * دریافت آمار index ها برای collection مشخص
 */
export declare function getIndexStats(collectionName: string): Promise<any>;
/**
 * حذف index های غیرضروری
 */
export declare function dropUnusedIndexes(collectionName: string): Promise<void>;
/**
 * Database Indexes Management
 *
 * این فایل شامل توابع مدیریت ایندکس‌های پایگاه داده است
 */
/**
 * ایجاد ایندکس‌های بهینه‌سازی شده برای تمام models
 */
export declare function createOptimizedIndexes(): Promise<void>;
/**
 * تحلیل عملکرد ایندکس‌های موجود
 */
export declare function getIndexAnalysis(): Promise<any>;
/**
 * بررسی سلامت ایندکس‌ها
 */
export declare function checkIndexHealth(): Promise<any>;
declare const _default: {
    createOptimizedIndexes: typeof createOptimizedIndexes;
    getIndexAnalysis: typeof getIndexAnalysis;
    checkIndexHealth: typeof checkIndexHealth;
    userIndexes: ({
        key: {
            email: number;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            unique: boolean;
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            nationalCode: number;
            email?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            unique: boolean;
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            phoneNumber: number;
            email?: undefined;
            nationalCode?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            unique: boolean;
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            role: number;
            isActive: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            institutionId: number;
            role: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            createdAt: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            firstName: string;
            lastName: string;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            lastLoginAt: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            isActive: number;
            isEmailVerified: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            gradeLevel: number;
            isActive: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            institutionId?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            profileCompleted: number;
            createdAt: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            role?: undefined;
            isActive?: undefined;
            institutionId?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            institutionId: number;
            role: number;
            isActive: number;
            email?: undefined;
            nationalCode?: undefined;
            phoneNumber?: undefined;
            createdAt?: undefined;
            firstName?: undefined;
            lastName?: undefined;
            lastLoginAt?: undefined;
            isEmailVerified?: undefined;
            gradeLevel?: undefined;
            profileCompleted?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    questionIndexes: ({
        key: {
            category: number;
            difficulty: number;
            isActive: number;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            lesson: number;
            difficulty: number;
            category?: undefined;
            isActive?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            createdBy: number;
            createdAt: number;
            category?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            lesson?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            type: number;
            difficulty: number;
            category?: undefined;
            isActive?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            difficulty: number;
            isActive: number;
            createdAt: number;
            category?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            status: number;
            isActive: number;
            category?: undefined;
            difficulty?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            title: string;
            content: string;
            category?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            tags: number;
            isActive: number;
            category?: undefined;
            difficulty?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            createdAt: number;
            isActive: number;
            category?: undefined;
            difficulty?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            usageCount: number;
            isActive: number;
            category?: undefined;
            difficulty?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            reviewStatus: number;
            createdAt: number;
            category?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            averageScore?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            category: number;
            lesson: number;
            difficulty: number;
            isActive: number;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            usageCount?: undefined;
            reviewStatus?: undefined;
            averageScore?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            averageScore: number;
            usageCount: number;
            category?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            lesson?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            type?: undefined;
            status?: undefined;
            title?: undefined;
            content?: undefined;
            tags?: undefined;
            reviewStatus?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    })[];
    examIndexes: ({
        key: {
            creator: number;
            status: number;
            createdAt: number;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            user: number;
            status: number;
            startedAt: number;
            creator?: undefined;
            createdAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            status: number;
            isPublic: number;
            createdAt: number;
            creator?: undefined;
            user?: undefined;
            startedAt?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            category: number;
            status: number;
            isPublic: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            lesson: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            difficulty: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            scheduledAt: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            duration: number;
            isPublic: number;
            creator?: undefined;
            status?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            maxScore: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            completedAt?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            completedAt: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            examType?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            examType: number;
            isPublic: number;
            creator?: undefined;
            status?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            institutionId: number;
            status: number;
            creator?: undefined;
            createdAt?: undefined;
            user?: undefined;
            startedAt?: undefined;
            isPublic?: undefined;
            category?: undefined;
            lesson?: undefined;
            difficulty?: undefined;
            scheduledAt?: undefined;
            duration?: undefined;
            maxScore?: undefined;
            completedAt?: undefined;
            examType?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    })[];
    categoryIndexes: ({
        key: {
            name: number;
            slug?: undefined;
            parentId?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            order?: undefined;
            description?: undefined;
            level?: undefined;
        };
        options: {
            unique: boolean;
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            slug: number;
            name?: undefined;
            parentId?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            order?: undefined;
            description?: undefined;
            level?: undefined;
        };
        options: {
            unique: boolean;
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            parentId: number;
            isActive: number;
            name?: undefined;
            slug?: undefined;
            createdAt?: undefined;
            order?: undefined;
            description?: undefined;
            level?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            isActive: number;
            createdAt: number;
            name?: undefined;
            slug?: undefined;
            parentId?: undefined;
            order?: undefined;
            description?: undefined;
            level?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            order: number;
            isActive: number;
            name?: undefined;
            slug?: undefined;
            parentId?: undefined;
            createdAt?: undefined;
            description?: undefined;
            level?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            name: string;
            description: string;
            slug?: undefined;
            parentId?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            order?: undefined;
            level?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            level: number;
            isActive: number;
            name?: undefined;
            slug?: undefined;
            parentId?: undefined;
            createdAt?: undefined;
            order?: undefined;
            description?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    transactionIndexes: ({
        key: {
            userId: number;
            createdAt: number;
            status?: undefined;
            paymentMethod?: undefined;
            amount?: undefined;
            referenceNumber?: undefined;
            type?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            status: number;
            createdAt: number;
            userId?: undefined;
            paymentMethod?: undefined;
            amount?: undefined;
            referenceNumber?: undefined;
            type?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            paymentMethod: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            amount?: undefined;
            referenceNumber?: undefined;
            type?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            amount: number;
            createdAt: number;
            userId?: undefined;
            status?: undefined;
            paymentMethod?: undefined;
            referenceNumber?: undefined;
            type?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            referenceNumber: number;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            paymentMethod?: undefined;
            amount?: undefined;
            type?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            unique: boolean;
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            type: number;
            status: number;
            createdAt: number;
            userId?: undefined;
            paymentMethod?: undefined;
            amount?: undefined;
            referenceNumber?: undefined;
            gatewayTransactionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            gatewayTransactionId: number;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            paymentMethod?: undefined;
            amount?: undefined;
            referenceNumber?: undefined;
            type?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    discountCodeIndexes: ({
        key: {
            code: number;
            isActive?: undefined;
            validFrom?: undefined;
            validTo?: undefined;
            createdBy?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            type?: undefined;
            institutionId?: undefined;
        };
        options: {
            unique: boolean;
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            isActive: number;
            validFrom: number;
            validTo: number;
            code?: undefined;
            createdBy?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            type?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            createdBy: number;
            isActive: number;
            code?: undefined;
            validFrom?: undefined;
            validTo?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            type?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            usageCount: number;
            maxUsage: number;
            code?: undefined;
            isActive?: undefined;
            validFrom?: undefined;
            validTo?: undefined;
            createdBy?: undefined;
            type?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            validTo: number;
            isActive: number;
            code?: undefined;
            validFrom?: undefined;
            createdBy?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            type?: undefined;
            institutionId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            type: number;
            isActive: number;
            code?: undefined;
            validFrom?: undefined;
            validTo?: undefined;
            createdBy?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            institutionId: number;
            isActive: number;
            code?: undefined;
            validFrom?: undefined;
            validTo?: undefined;
            createdBy?: undefined;
            usageCount?: undefined;
            maxUsage?: undefined;
            type?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    institutionIndexes: ({
        key: {
            name: number;
            domain?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            type?: undefined;
            city?: undefined;
            province?: undefined;
            description?: undefined;
            adminUserId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            domain: number;
            name?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            type?: undefined;
            city?: undefined;
            province?: undefined;
            description?: undefined;
            adminUserId?: undefined;
        };
        options: {
            unique: boolean;
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            isActive: number;
            createdAt: number;
            name?: undefined;
            domain?: undefined;
            type?: undefined;
            city?: undefined;
            province?: undefined;
            description?: undefined;
            adminUserId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            type: number;
            isActive: number;
            name?: undefined;
            domain?: undefined;
            createdAt?: undefined;
            city?: undefined;
            province?: undefined;
            description?: undefined;
            adminUserId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            city: number;
            province: number;
            name?: undefined;
            domain?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            type?: undefined;
            description?: undefined;
            adminUserId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            name: string;
            description: string;
            domain?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            type?: undefined;
            city?: undefined;
            province?: undefined;
            adminUserId?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            adminUserId: number;
            name?: undefined;
            domain?: undefined;
            isActive?: undefined;
            createdAt?: undefined;
            type?: undefined;
            city?: undefined;
            province?: undefined;
            description?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    walletIndexes: ({
        key: {
            userId: number;
            balance?: undefined;
            isActive?: undefined;
            updatedAt?: undefined;
            currency?: undefined;
            lastTransactionAt?: undefined;
        };
        options: {
            unique: boolean;
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            balance: number;
            isActive: number;
            userId?: undefined;
            updatedAt?: undefined;
            currency?: undefined;
            lastTransactionAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            isActive: number;
            updatedAt: number;
            userId?: undefined;
            balance?: undefined;
            currency?: undefined;
            lastTransactionAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            currency: number;
            isActive: number;
            userId?: undefined;
            balance?: undefined;
            updatedAt?: undefined;
            lastTransactionAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            lastTransactionAt: number;
            userId?: undefined;
            balance?: undefined;
            isActive?: undefined;
            updatedAt?: undefined;
            currency?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
    courseExamIndexes: ({
        key: {
            courseId: number;
            isActive: number;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            isPublic?: undefined;
            difficulty?: undefined;
            category?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            duration?: undefined;
            price?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            createdBy: number;
            createdAt: number;
            courseId?: undefined;
            isActive?: undefined;
            status?: undefined;
            isPublic?: undefined;
            difficulty?: undefined;
            category?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            duration?: undefined;
            price?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            status: number;
            isPublic: number;
            courseId?: undefined;
            isActive?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            difficulty?: undefined;
            category?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            duration?: undefined;
            price?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            difficulty: number;
            category: number;
            courseId?: undefined;
            isActive?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            isPublic?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            duration?: undefined;
            price?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            startDate: number;
            endDate: number;
            courseId?: undefined;
            isActive?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            isPublic?: undefined;
            difficulty?: undefined;
            category?: undefined;
            duration?: undefined;
            price?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            duration: number;
            isActive: number;
            courseId?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            isPublic?: undefined;
            difficulty?: undefined;
            category?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            price?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            price: number;
            isPublic: number;
            courseId?: undefined;
            isActive?: undefined;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            difficulty?: undefined;
            category?: undefined;
            startDate?: undefined;
            endDate?: undefined;
            duration?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    })[];
    testExamIndexes: ({
        key: {
            createdBy: number;
            createdAt: number;
            status?: undefined;
            examType?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            isPublic?: undefined;
            questionCount?: undefined;
            duration?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            status: number;
            examType: number;
            createdBy?: undefined;
            createdAt?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            isPublic?: undefined;
            questionCount?: undefined;
            duration?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            subject: number;
            gradeLevel: number;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            examType?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            isPublic?: undefined;
            questionCount?: undefined;
            duration?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            difficulty: number;
            isActive: number;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            examType?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            isPublic?: undefined;
            questionCount?: undefined;
            duration?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            isPublic: number;
            status: number;
            createdAt: number;
            createdBy?: undefined;
            examType?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            questionCount?: undefined;
            duration?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            questionCount: number;
            duration: number;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            examType?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            difficulty?: undefined;
            isActive?: undefined;
            isPublic?: undefined;
            institutionId?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            institutionId: number;
            isActive: number;
            createdBy?: undefined;
            createdAt?: undefined;
            status?: undefined;
            examType?: undefined;
            subject?: undefined;
            gradeLevel?: undefined;
            difficulty?: undefined;
            isPublic?: undefined;
            questionCount?: undefined;
            duration?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    })[];
    contactIndexes: ({
        key: {
            userId: number;
            createdAt: number;
            status?: undefined;
            type?: undefined;
            priority?: undefined;
            email?: undefined;
            phone?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            status: number;
            createdAt: number;
            userId?: undefined;
            type?: undefined;
            priority?: undefined;
            email?: undefined;
            phone?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            type: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            priority?: undefined;
            email?: undefined;
            phone?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            priority: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            type?: undefined;
            email?: undefined;
            phone?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            email: number;
            createdAt: number;
            userId?: undefined;
            status?: undefined;
            type?: undefined;
            priority?: undefined;
            phone?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    } | {
        key: {
            phone: number;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            type?: undefined;
            priority?: undefined;
            email?: undefined;
            subject?: undefined;
            message?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            subject: string;
            message: string;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            type?: undefined;
            priority?: undefined;
            email?: undefined;
            phone?: undefined;
        };
        options: {
            background: boolean;
            sparse?: undefined;
        };
    })[];
    paymentIndexes: ({
        key: {
            userId: number;
            createdAt: number;
            status?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            status: number;
            createdAt: number;
            userId?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            gateway: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            transactionId: number;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            gateway?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            unique: boolean;
            sparse: boolean;
            background: boolean;
        };
    } | {
        key: {
            amount: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            background: boolean;
            unique?: undefined;
            sparse?: undefined;
        };
    } | {
        key: {
            gatewayTransactionId: number;
            userId?: undefined;
            createdAt?: undefined;
            status?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            orderId?: undefined;
            paidAt?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            orderId: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            paidAt?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    } | {
        key: {
            paidAt: number;
            status: number;
            userId?: undefined;
            createdAt?: undefined;
            gateway?: undefined;
            transactionId?: undefined;
            amount?: undefined;
            gatewayTransactionId?: undefined;
            orderId?: undefined;
        };
        options: {
            sparse: boolean;
            background: boolean;
            unique?: undefined;
        };
    })[];
};
export default _default;
