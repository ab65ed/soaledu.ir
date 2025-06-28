"use strict";
/**
 * Performance Monitoring Controller
 *
 * کنترلر مانیتورینگ عملکرد برای course-exam، question و A/B testing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexUsageStats = exports.applyOptimization = exports.getOptimizationSuggestions = exports.getABTestPerformance = exports.getSystemPerformance = void 0;
// Mock data برای مانیتورینگ
let performanceMetrics = [];
let optimizationSuggestions = [];
/**
 * دریافت آمار عملکرد کلی سیستم
 */
const getSystemPerformance = async (req, res) => {
    try {
        const { timeRange = '24h' } = req.query;
        // محاسبه آمار عملکرد
        const stats = {
            totalQueries: 15420,
            avgResponseTime: 145, // milliseconds
            slowQueries: 23,
            indexHitRate: 94.2, // percentage
            memoryUsage: 68.5, // percentage
            cpuUsage: 42.1, // percentage
            activeConnections: 156,
            collections: {
                CourseExam: {
                    totalDocuments: 1250,
                    avgQueryTime: 85,
                    indexEfficiency: 96.8,
                    mostUsedQueries: [
                        'find by grade',
                        'text search in title',
                        'filter by creator'
                    ]
                },
                Question: {
                    totalDocuments: 8940,
                    avgQueryTime: 120,
                    indexEfficiency: 92.4,
                    mostUsedQueries: [
                        'find by courseExamId and difficulty',
                        'text search in content',
                        'filter published for test exam'
                    ]
                },
                TestExam: {
                    totalDocuments: 3420,
                    avgQueryTime: 95,
                    indexEfficiency: 89.6,
                    mostUsedQueries: [
                        'find by userId and status',
                        'aggregate score statistics',
                        'session management'
                    ]
                },
                ABTest: {
                    totalDocuments: 12,
                    avgQueryTime: 45,
                    indexEfficiency: 98.1,
                    mostUsedQueries: [
                        'find active tests by target',
                        'participant assignment',
                        'conversion tracking'
                    ]
                }
            },
            timeRange
        };
        res.json({
            success: true,
            data: stats,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('Error getting system performance:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار عملکرد سیستم',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
};
exports.getSystemPerformance = getSystemPerformance;
/**
 * دریافت آمار عملکرد A/B Testing
 */
const getABTestPerformance = async (req, res) => {
    try {
        const { testId } = req.params;
        // آمار عملکرد A/B test
        const performance = {
            testId,
            metrics: {
                totalParticipants: 1250,
                conversionRate: 12.4, // percentage
                statisticalSignificance: 95.2,
                testDuration: 14, // days
                variantPerformance: [
                    {
                        variantId: 'control',
                        participants: 625,
                        conversions: 72,
                        conversionRate: 11.5,
                        avgEngagementTime: 145, // seconds
                        bounceRate: 23.4
                    },
                    {
                        variantId: 'variant-a',
                        participants: 625,
                        conversions: 82,
                        conversionRate: 13.1,
                        avgEngagementTime: 168, // seconds
                        bounceRate: 19.8
                    }
                ],
                timeline: [
                    { date: '2025-01-20', participants: 45, conversions: 5 },
                    { date: '2025-01-21', participants: 89, conversions: 11 },
                    { date: '2025-01-22', participants: 123, conversions: 15 },
                    { date: '2025-01-23', participants: 156, conversions: 19 },
                    { date: '2025-01-24', participants: 198, conversions: 24 }
                ]
            },
            recommendations: [
                {
                    type: 'winner_selection',
                    message: 'Variant A نشان‌دهنده بهبود 13.9% در نرخ تبدیل است',
                    confidence: 95.2,
                    action: 'پیشنهاد اعمال Variant A به عنوان نسخه اصلی'
                },
                {
                    type: 'sample_size',
                    message: 'حجم نمونه کافی برای نتیجه‌گیری معتبر',
                    confidence: 98.1,
                    action: 'می‌توانید تست را متوقف کنید'
                }
            ]
        };
        res.json({
            success: true,
            data: performance
        });
    }
    catch (error) {
        console.error('Error getting A/B test performance:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار عملکرد A/B test',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
};
exports.getABTestPerformance = getABTestPerformance;
/**
 * دریافت پیشنهادات بهینه‌سازی
 */
const getOptimizationSuggestions = async (req, res) => {
    try {
        const suggestions = [
            {
                id: 'course_exam_index_opt',
                type: 'index',
                priority: 'high',
                collection: 'CourseExam',
                title: 'بهینه‌سازی ایندکس جستجوی دروس',
                description: 'اضافه کردن ایندکس ترکیبی برای بهبود جستجوی دروس بر اساس grade',
                impact: {
                    performanceGain: 65,
                    resourceSavings: 30,
                    estimatedTime: 5
                },
                implementation: {
                    command: 'db.CourseExam.createIndex({ grade: 1, isPublished: 1 })',
                    riskLevel: 'low'
                },
                status: 'pending'
            },
            {
                id: 'question_cache_opt',
                type: 'cache',
                priority: 'medium',
                collection: 'Question',
                title: 'کش کردن سوالات پرتکرار',
                description: 'کش کردن سوالات منتشر شده برای آزمون‌های تستی',
                impact: {
                    performanceGain: 80,
                    resourceSavings: 45,
                    estimatedTime: 20
                },
                implementation: {
                    command: 'پیاده‌سازی Redis cache برای published questions',
                    riskLevel: 'medium'
                },
                status: 'pending'
            },
            {
                id: 'ab_test_analytics_opt',
                type: 'query',
                priority: 'medium',
                collection: 'ABTest',
                title: 'بهینه‌سازی کوئری‌های آنالیتیکس A/B test',
                description: 'استفاده از aggregation pipeline بهینه‌سازی شده برای محاسبه آمار',
                impact: {
                    performanceGain: 55,
                    resourceSavings: 25,
                    estimatedTime: 15
                },
                implementation: {
                    command: 'بازنویسی aggregation queries با استفاده از $lookup و $group',
                    riskLevel: 'low'
                },
                status: 'pending'
            }
        ];
        res.json({
            success: true,
            data: {
                suggestions,
                summary: {
                    total: suggestions.length,
                    high: suggestions.filter(s => s.priority === 'high').length,
                    medium: suggestions.filter(s => s.priority === 'medium').length,
                    low: suggestions.filter(s => s.priority === 'low').length,
                    estimatedTotalGain: suggestions.reduce((sum, s) => sum + s.impact.performanceGain, 0) / suggestions.length
                }
            }
        });
    }
    catch (error) {
        console.error('Error getting optimization suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت پیشنهادات بهینه‌سازی',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
};
exports.getOptimizationSuggestions = getOptimizationSuggestions;
/**
 * اعمال پیشنهاد بهینه‌سازی
 */
const applyOptimization = async (req, res) => {
    try {
        const { suggestionId } = req.params;
        const { confirm } = req.body;
        if (!confirm) {
            res.status(400).json({
                success: false,
                message: 'تایید اعمال بهینه‌سازی الزامی است'
            });
            return;
        }
        // شبیه‌سازی اعمال بهینه‌سازی
        await new Promise(resolve => setTimeout(resolve, 2000));
        res.json({
            success: true,
            message: 'بهینه‌سازی با موفقیت اعمال شد',
            data: {
                suggestionId,
                appliedAt: new Date(),
                estimatedImpact: {
                    performanceImprovement: '65%',
                    resourceSavings: '30%',
                    implementationTime: '5 دقیقه'
                }
            }
        });
    }
    catch (error) {
        console.error('Error applying optimization:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در اعمال بهینه‌سازی',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
};
exports.applyOptimization = applyOptimization;
/**
 * دریافت آمار استفاده از ایندکس‌ها
 */
const getIndexUsageStats = async (req, res) => {
    try {
        const stats = {
            totalIndexes: 24,
            activeIndexes: 22,
            unusedIndexes: 2,
            indexEfficiency: 94.2,
            collections: {
                CourseExam: {
                    indexes: [
                        {
                            name: 'title_description_text',
                            usage: 89.5,
                            hitRate: 96.2,
                            size: '2.4 MB',
                            lastUsed: new Date()
                        },
                        {
                            name: 'grade_published',
                            usage: 76.3,
                            hitRate: 94.8,
                            size: '1.8 MB',
                            lastUsed: new Date()
                        }
                    ]
                },
                Question: {
                    indexes: [
                        {
                            name: 'course_difficulty_published',
                            usage: 92.1,
                            hitRate: 97.5,
                            size: '5.2 MB',
                            lastUsed: new Date()
                        },
                        {
                            name: 'question_content_search',
                            usage: 68.4,
                            hitRate: 89.3,
                            size: '8.7 MB',
                            lastUsed: new Date()
                        }
                    ]
                }
            }
        };
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error getting index usage stats:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار استفاده از ایندکس‌ها',
            error: error instanceof Error ? error.message : 'خطای نامشخص'
        });
    }
};
exports.getIndexUsageStats = getIndexUsageStats;
//# sourceMappingURL=performance-monitoring.js.map