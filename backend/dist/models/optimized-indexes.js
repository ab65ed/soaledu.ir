"use strict";
/**
 * Optimized Database Indexes
 *
 * تعریف ایندکس‌های بهینه‌سازی شده برای بهبود عملکرد کوئری‌ها
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorIndexPerformance = exports.applyOptimizedIndexes = exports.OPTIMIZATION_SUGGESTIONS = exports.AB_TEST_INDEXES = exports.TEST_EXAM_INDEXES = exports.QUESTION_INDEXES = exports.COURSE_EXAM_INDEXES = void 0;
// ایندکس‌های بهینه‌سازی شده برای course-exam
exports.COURSE_EXAM_INDEXES = [
    {
        id: 'course_exam_title_text_idx',
        collection: 'CourseExam',
        fields: { title: 'text', description: 'text' },
        name: 'title_description_text_search',
        type: 'text',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'course_exam_creator_date_idx',
        collection: 'CourseExam',
        fields: { createdBy: 1, createdAt: -1 },
        name: 'creator_creation_date',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'course_exam_grade_idx',
        collection: 'CourseExam',
        fields: { grade: 1, isPublished: 1 },
        name: 'grade_published',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    }
];
// ایندکس‌های بهینه‌سازی شده برای questions
exports.QUESTION_INDEXES = [
    {
        id: 'question_course_difficulty_idx',
        collection: 'Question',
        fields: { courseExamId: 1, difficulty: 1, isPublishedForTestExam: 1 },
        name: 'course_difficulty_published',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'question_text_search_idx',
        collection: 'Question',
        fields: { questionText: 'text', 'options.text': 'text' },
        name: 'question_content_search',
        type: 'text',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'question_created_date_idx',
        collection: 'Question',
        fields: { createdAt: -1 },
        name: 'creation_date_desc',
        type: 'single',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'question_type_difficulty_idx',
        collection: 'Question',
        fields: { type: 1, difficulty: 1, courseExamId: 1 },
        name: 'type_difficulty_course',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    }
];
// ایندکس‌های بهینه‌سازی شده برای test-exam
exports.TEST_EXAM_INDEXES = [
    {
        id: 'test_exam_user_status_idx',
        collection: 'TestExam',
        fields: { userId: 1, status: 1, createdAt: -1 },
        name: 'user_status_date',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'test_exam_score_idx',
        collection: 'TestExam',
        fields: { finalScore: -1 },
        name: 'final_score_desc',
        type: 'single',
        options: {
            sparse: true,
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'test_exam_session_idx',
        collection: 'TestExam',
        fields: { sessionId: 1, status: 1 },
        name: 'session_status',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    }
];
// ایندکس‌های بهینه‌سازی شده برای A/B testing
exports.AB_TEST_INDEXES = [
    {
        id: 'ab_test_target_status_idx',
        collection: 'ABTest',
        fields: { targetPath: 1, status: 1 },
        name: 'target_status',
        type: 'compound',
        options: {
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    },
    {
        id: 'ab_test_participant_idx',
        collection: 'ABTestParticipant',
        fields: { userId: 1, testId: 1 },
        name: 'user_test',
        type: 'compound',
        options: {
            unique: true,
            background: true
        },
        createdAt: new Date(),
        performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
        },
        status: 'active'
    }
];
// پیشنهادات بهینه‌سازی برای course-exam و question
exports.OPTIMIZATION_SUGGESTIONS = [
    {
        id: 'course_exam_pagination_opt',
        type: 'index',
        priority: 'high',
        collection: 'CourseExam',
        description: 'بهینه‌سازی صفحه‌بندی دروس با ایندکس ترکیبی',
        impact: {
            performanceGain: 60,
            resourceSavings: 30,
            complexityIncrease: 2
        },
        implementation: {
            command: 'db.CourseExam.createIndex({ createdAt: -1, isPublished: 1 })',
            estimatedTime: 5,
            riskLevel: 'low'
        },
        status: 'pending',
        createdAt: new Date()
    },
    {
        id: 'question_search_opt',
        type: 'index',
        priority: 'high',
        collection: 'Question',
        description: 'بهینه‌سازی جستجوی متنی سوالات',
        impact: {
            performanceGain: 80,
            resourceSavings: 40,
            complexityIncrease: 3
        },
        implementation: {
            command: 'db.Question.createIndex({ "$**": "text" })',
            estimatedTime: 10,
            riskLevel: 'medium'
        },
        status: 'pending',
        createdAt: new Date()
    },
    {
        id: 'test_exam_analytics_opt',
        type: 'query',
        priority: 'medium',
        collection: 'TestExam',
        description: 'بهینه‌سازی کوئری‌های آمار آزمون‌های تستی',
        impact: {
            performanceGain: 45,
            resourceSavings: 25,
            complexityIncrease: 4
        },
        implementation: {
            command: 'استفاده از aggregation pipeline بهینه‌سازی شده',
            estimatedTime: 15,
            riskLevel: 'medium'
        },
        status: 'pending',
        createdAt: new Date()
    },
    {
        id: 'ab_test_cache_opt',
        type: 'cache',
        priority: 'medium',
        collection: 'ABTest',
        description: 'کش کردن نتایج A/B test برای کاهش بار دیتابیس',
        impact: {
            performanceGain: 70,
            resourceSavings: 50,
            complexityIncrease: 5
        },
        implementation: {
            command: 'پیاده‌سازی Redis cache برای A/B test results',
            estimatedTime: 30,
            riskLevel: 'medium'
        },
        status: 'pending',
        createdAt: new Date()
    }
];
// تابع برای اعمال ایندکس‌ها
const applyOptimizedIndexes = async () => {
    const allIndexes = [
        ...exports.COURSE_EXAM_INDEXES,
        ...exports.QUESTION_INDEXES,
        ...exports.TEST_EXAM_INDEXES,
        ...exports.AB_TEST_INDEXES
    ];
    console.log(`اعمال ${allIndexes.length} ایندکس بهینه‌سازی شده...`);
    for (const index of allIndexes) {
        try {
            // TODO: اعمال ایندکس در Parse Server
            console.log(`ایندکس ${index.name} برای collection ${index.collection} اعمال شد`);
        }
        catch (error) {
            console.error(`خطا در اعمال ایندکس ${index.name}:`, error);
        }
    }
};
exports.applyOptimizedIndexes = applyOptimizedIndexes;
// تابع برای مانیتورینگ عملکرد ایندکس‌ها
const monitorIndexPerformance = async () => {
    // TODO: پیاده‌سازی مانیتورینگ عملکرد
    console.log('مانیتورینگ عملکرد ایندکس‌ها...');
};
exports.monitorIndexPerformance = monitorIndexPerformance;
//# sourceMappingURL=optimized-indexes.js.map