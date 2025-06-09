"use strict";
/**
 * Scalability Models
 *
 * Models for database optimization, indexing, and sharding strategies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_OPTIMIZATIONS = void 0;
// پیشنهادات بهینه‌سازی برای collections اصلی
exports.COLLECTION_OPTIMIZATIONS = {
    questions: {
        indexes: [
            {
                name: 'course_difficulty_idx',
                fields: { courseExamId: 1, difficulty: 1 },
                type: 'compound',
                rationale: 'بهینه‌سازی کوئری‌های فیلتر سوالات بر اساس درس و سختی'
            },
            {
                name: 'text_search_idx',
                fields: { questionText: 'text', options: 'text' },
                type: 'text',
                rationale: 'جستجوی متنی سریع در محتوای سوالات'
            },
            {
                name: 'created_at_idx',
                fields: { createdAt: -1 },
                type: 'single',
                rationale: 'مرتب‌سازی سریع سوالات جدید'
            },
            {
                name: 'published_exam_idx',
                fields: { isPublishedForTestExam: 1, difficulty: 1 },
                type: 'compound',
                rationale: 'فیلتر سوالات منتشر شده برای آزمون‌های تستی'
            }
        ],
        sharding: {
            shardKey: { courseExamId: 1, _id: 1 },
            strategy: 'range',
            rationale: 'تقسیم بر اساس درس برای عملکرد بهتر کوئری‌ها'
        }
    },
    testExams: {
        indexes: [
            {
                name: 'user_status_idx',
                fields: { userId: 1, status: 1 },
                type: 'compound',
                rationale: 'فیلتر آزمون‌های کاربر بر اساس وضعیت'
            },
            {
                name: 'created_at_idx',
                fields: { createdAt: -1 },
                type: 'single',
                rationale: 'مرتب‌سازی زمانی آزمون‌ها'
            },
            {
                name: 'score_idx',
                fields: { finalScore: -1 },
                type: 'single',
                options: { sparse: true },
                rationale: 'رتبه‌بندی بر اساس نمره'
            }
        ],
        sharding: {
            shardKey: { userId: 1, _id: 1 },
            strategy: 'hash',
            rationale: 'توزیع یکنواخت آزمون‌ها بین کاربران'
        }
    },
    courseExams: {
        indexes: [
            {
                name: 'title_text_idx',
                fields: { title: 'text', description: 'text' },
                type: 'text',
                rationale: 'جستجوی متنی در عنوان و توضیحات دروس'
            },
            {
                name: 'creator_idx',
                fields: { createdBy: 1, createdAt: -1 },
                type: 'compound',
                rationale: 'فیلتر دروس بر اساس سازنده'
            }
        ]
    },
    flashcards: {
        indexes: [
            {
                name: 'user_difficulty_idx',
                fields: { userId: 1, difficulty: 1 },
                type: 'compound',
                rationale: 'فیلتر فلش‌کارت‌ها بر اساس کاربر و سختی'
            },
            {
                name: 'next_review_idx',
                fields: { nextReviewDate: 1 },
                type: 'single',
                rationale: 'یافتن فلش‌کارت‌های آماده مرور'
            }
        ],
        sharding: {
            shardKey: { userId: 1 },
            strategy: 'hash',
            rationale: 'تقسیم بر اساس کاربر'
        }
    }
};
//# sourceMappingURL=scalability.js.map