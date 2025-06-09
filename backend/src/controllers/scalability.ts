/**
 * Scalability Controller
 * 
 * Handles database optimization, indexing, and performance monitoring
 */

import { Request, Response } from 'express';
import { 
  DatabaseIndex, 
  ShardingStrategy, 
  PerformanceMetric, 
  OptimizationSuggestion,
  COLLECTION_OPTIMIZATIONS 
} from '../models/scalability';

// Mock data برای شروع (در پروژه واقعی از Parse Server استفاده می‌شود)
let indexes: DatabaseIndex[] = [
  {
    id: 'idx-1',
    collection: 'questions',
    fields: { courseExamId: 1, difficulty: 1 },
    name: 'course_difficulty_idx',
    type: 'compound',
    options: { background: true },
    createdAt: new Date('2025-01-15'),
    lastUsed: new Date('2025-01-20'),
    performance: {
      queryCount: 1250,
      avgExecutionTime: 12,
      hitRate: 94.5,
      sizeBytes: 2048576
    },
    status: 'active'
  },
  {
    id: 'idx-2',
    collection: 'questions',
    fields: { questionText: 1, options: 1 },
    name: 'text_search_idx',
    type: 'text',
    options: { background: true },
    createdAt: new Date('2025-01-10'),
    lastUsed: new Date('2025-01-20'),
    performance: {
      queryCount: 890,
      avgExecutionTime: 45,
      hitRate: 87.2,
      sizeBytes: 5242880
    },
    status: 'active'
  },
  {
    id: 'idx-3',
    collection: 'testExams',
    fields: { userId: 1, status: 1 },
    name: 'user_status_idx',
    type: 'compound',
    options: { background: true },
    createdAt: new Date('2025-01-12'),
    lastUsed: new Date('2025-01-20'),
    performance: {
      queryCount: 2100,
      avgExecutionTime: 8,
      hitRate: 96.8,
      sizeBytes: 1572864
    },
    status: 'active'
  }
];

let performanceMetrics: PerformanceMetric[] = [];
let optimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: 'sug-1',
    type: 'index',
    priority: 'high',
    collection: 'questions',
    description: 'ایجاد ایندکس ترکیبی برای فیلتر سوالات منتشر شده',
    impact: {
      performanceGain: 35,
      resourceSavings: 20,
      complexityIncrease: 3
    },
    implementation: {
      command: 'db.questions.createIndex({ isPublishedForTestExam: 1, difficulty: 1 }, { name: "published_exam_idx", background: true })',
      estimatedTime: 5,
      riskLevel: 'low'
    },
    status: 'pending',
    createdAt: new Date('2025-01-18')
  },
  {
    id: 'sug-2',
    type: 'sharding',
    priority: 'medium',
    collection: 'testExams',
    description: 'تقسیم collection آزمون‌ها بر اساس کاربر',
    impact: {
      performanceGain: 50,
      resourceSavings: 30,
      complexityIncrease: 7
    },
    implementation: {
      command: 'sh.enableSharding("exam-edu"); sh.shardCollection("exam-edu.testExams", { userId: 1 })',
      estimatedTime: 30,
      riskLevel: 'medium'
    },
    status: 'pending',
    createdAt: new Date('2025-01-17')
  }
];

/**
 * دریافت نمای کلی مقیاس‌پذیری
 */
export const getScalabilityOverview = async (req: Request, res: Response) => {
  try {
    const activeIndexes = indexes.filter(i => i.status === 'active').length;
    const avgExecutionTime = indexes.reduce((sum, i) => sum + i.performance.avgExecutionTime, 0) / indexes.length;
    const avgHitRate = indexes.reduce((sum, i) => sum + i.performance.hitRate, 0) / indexes.length;
    const pendingSuggestions = optimizationSuggestions.filter(s => s.status === 'pending').length;
    const criticalSuggestions = optimizationSuggestions.filter(s => s.priority === 'critical').length;

    // آمار collections
    const collectionStats = ['questions', 'testExams', 'courseExams', 'flashcards'].map(collection => {
      const collectionIndexes = indexes.filter(i => i.collection === collection);
      const collectionHitRate = collectionIndexes.reduce((sum, i) => sum + i.performance.hitRate, 0) / collectionIndexes.length || 0;
      const collectionExecutionTime = collectionIndexes.reduce((sum, i) => sum + i.performance.avgExecutionTime, 0) / collectionIndexes.length || 0;
      
      return {
        collection,
        indexCount: collectionIndexes.length,
        avgHitRate: collectionHitRate,
        avgExecutionTime: collectionExecutionTime,
        status: collectionHitRate > 90 ? 'excellent' : collectionHitRate > 80 ? 'good' : 'needs_improvement'
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          activeIndexes,
          avgExecutionTime: Math.round(avgExecutionTime),
          avgHitRate: Math.round(avgHitRate * 10) / 10,
          pendingSuggestions,
          criticalSuggestions
        },
        collections: collectionStats,
        trends: {
          indexesThisWeek: 2,
          performanceImprovement: -15, // منفی یعنی بهبود
          hitRateImprovement: 5.3
        }
      }
    });
  } catch (error) {
    console.error('Error getting scalability overview:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت نمای کلی مقیاس‌پذیری',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت لیست ایندکس‌ها
 */
export const getIndexes = async (req: Request, res: Response) => {
  try {
    const { collection, status, sortBy = 'performance.hitRate', sortOrder = 'desc' } = req.query;

    let filteredIndexes = [...indexes];

    // فیلتر بر اساس collection
    if (collection && collection !== 'all') {
      filteredIndexes = filteredIndexes.filter(i => i.collection === collection);
    }

    // فیلتر بر اساس status
    if (status && status !== 'all') {
      filteredIndexes = filteredIndexes.filter(i => i.status === status);
    }

    // مرتب‌سازی
    filteredIndexes.sort((a, b) => {
      const aValue = getNestedValue(a, sortBy as string);
      const bValue = getNestedValue(b, sortBy as string);
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    res.json({
      success: true,
      data: {
        indexes: filteredIndexes,
        total: filteredIndexes.length,
        summary: {
          active: indexes.filter(i => i.status === 'active').length,
          building: indexes.filter(i => i.status === 'building').length,
          failed: indexes.filter(i => i.status === 'failed').length
        }
      }
    });
  } catch (error) {
    console.error('Error getting indexes:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت ایندکس‌ها',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * ایجاد ایندکس جدید
 */
export const createIndex = async (req: Request, res: Response) => {
  try {
    const { collection, fields, name, type, options } = req.body;

    // اعتبارسنجی
    if (!collection || !fields || !name || !type) {
      res.status(400).json({
        success: false,
        message: 'فیلدهای collection، fields، name و type الزامی هستند'
      });
      return;
    }

    // بررسی تکراری نبودن نام
    if (indexes.some(i => i.name === name)) {
      res.status(400).json({
        success: false,
        message: 'ایندکسی با این نام قبلاً وجود دارد'
      });
      return;
    }

    const newIndex: DatabaseIndex = {
      id: `idx-${Date.now()}`,
      collection,
      fields,
      name,
      type,
      options: options || {},
      createdAt: new Date(),
      performance: {
        queryCount: 0,
        avgExecutionTime: 0,
        hitRate: 0,
        sizeBytes: 0
      },
      status: 'building'
    };

    indexes.push(newIndex);

    // شبیه‌سازی ساخت ایندکس
    setTimeout(() => {
      const index = indexes.find(i => i.id === newIndex.id);
      if (index) {
        index.status = 'active';
        index.performance = {
          queryCount: Math.floor(Math.random() * 1000),
          avgExecutionTime: Math.floor(Math.random() * 50) + 5,
          hitRate: Math.random() * 20 + 80,
          sizeBytes: Math.floor(Math.random() * 5000000) + 1000000
        };
      }
    }, 5000);

    res.json({
      success: true,
      message: 'ایندکس با موفقیت ایجاد شد',
      data: newIndex
    });
  } catch (error) {
    console.error('Error creating index:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد ایندکس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * حذف ایندکس
 */
export const deleteIndex = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const indexIndex = indexes.findIndex(i => i.id === id);
    if (indexIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'ایندکس یافت نشد'
      });
      return;
    }

    const deletedIndex = indexes.splice(indexIndex, 1)[0];

    res.json({
      success: true,
      message: 'ایندکس با موفقیت حذف شد',
      data: deletedIndex
    });
  } catch (error) {
    console.error('Error deleting index:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف ایندکس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت پیشنهادات بهینه‌سازی
 */
export const getOptimizationSuggestions = async (req: Request, res: Response) => {
  try {
    const { priority, type, status = 'pending' } = req.query;

    let filteredSuggestions = [...optimizationSuggestions];

    // فیلترها
    if (priority && priority !== 'all') {
      filteredSuggestions = filteredSuggestions.filter(s => s.priority === priority);
    }

    if (type && type !== 'all') {
      filteredSuggestions = filteredSuggestions.filter(s => s.type === type);
    }

    if (status && status !== 'all') {
      filteredSuggestions = filteredSuggestions.filter(s => s.status === status);
    }

    // مرتب‌سازی بر اساس اولویت
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    filteredSuggestions.sort((a, b) => 
      priorityOrder[b.priority as keyof typeof priorityOrder] - 
      priorityOrder[a.priority as keyof typeof priorityOrder]
    );

    res.json({
      success: true,
      data: {
        suggestions: filteredSuggestions,
        total: filteredSuggestions.length,
        summary: {
          critical: optimizationSuggestions.filter(s => s.priority === 'critical' && s.status === 'pending').length,
          high: optimizationSuggestions.filter(s => s.priority === 'high' && s.status === 'pending').length,
          medium: optimizationSuggestions.filter(s => s.priority === 'medium' && s.status === 'pending').length,
          low: optimizationSuggestions.filter(s => s.priority === 'low' && s.status === 'pending').length
        }
      }
    });
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیشنهادات بهینه‌سازی',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * اجرای پیشنهاد بهینه‌سازی
 */
export const implementSuggestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const suggestion = optimizationSuggestions.find(s => s.id === id);
    if (!suggestion) {
      res.status(404).json({
        success: false,
        message: 'پیشنهاد یافت نشد'
      });
      return;
    }

    if (suggestion.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'این پیشنهاد قبلاً پردازش شده است'
      });
      return;
    }

    // تغییر وضعیت به در حال اجرا
    suggestion.status = 'implementing';

    // شبیه‌سازی اجرای پیشنهاد
    setTimeout(() => {
      suggestion.status = 'completed';
      suggestion.implementedAt = new Date();

      // اگر پیشنهاد ایجاد ایندکس باشد، ایندکس جدید اضافه کن
      if (suggestion.type === 'index') {
        const newIndex: DatabaseIndex = {
          id: `idx-${Date.now()}`,
          collection: suggestion.collection,
          fields: { isPublishedForTestExam: 1, difficulty: 1 }, // مثال
          name: 'published_exam_idx',
          type: 'compound',
          options: { background: true },
          createdAt: new Date(),
          performance: {
            queryCount: 0,
            avgExecutionTime: 0,
            hitRate: 0,
            sizeBytes: 0
          },
          status: 'building'
        };
        indexes.push(newIndex);

        // شبیه‌سازی تکمیل ساخت ایندکس
        setTimeout(() => {
          newIndex.status = 'active';
          newIndex.performance = {
            queryCount: Math.floor(Math.random() * 500),
            avgExecutionTime: Math.floor(Math.random() * 20) + 5,
            hitRate: Math.random() * 15 + 85,
            sizeBytes: Math.floor(Math.random() * 2000000) + 500000
          };
        }, 3000);
      }
    }, suggestion.implementation.estimatedTime * 1000); // تبدیل دقیقه به میلی‌ثانیه

    res.json({
      success: true,
      message: 'اجرای پیشنهاد شروع شد',
      data: suggestion
    });
  } catch (error) {
    console.error('Error implementing suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در اجرای پیشنهاد',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * رد پیشنهاد بهینه‌سازی
 */
export const rejectSuggestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const suggestion = optimizationSuggestions.find(s => s.id === id);
    if (!suggestion) {
      res.status(404).json({
        success: false,
        message: 'پیشنهاد یافت نشد'
      });
      return;
    }

    suggestion.status = 'rejected';

    res.json({
      success: true,
      message: 'پیشنهاد رد شد',
      data: suggestion
    });
  } catch (error) {
    console.error('Error rejecting suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در رد پیشنهاد',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * تولید پیشنهادات جدید بر اساس الگوهای کوئری
 */
export const generateSuggestions = async (req: Request, res: Response) => {
  try {
    const newSuggestions: OptimizationSuggestion[] = [];

    // بررسی collections برای پیشنهادات جدید
    Object.entries(COLLECTION_OPTIMIZATIONS).forEach(([collection, config]) => {
      // پیشنهاد ایندکس‌های جدید
      config.indexes.forEach((indexConfig: any) => {
        const existingIndex = indexes.find(i => 
          i.collection === collection && i.name === indexConfig.name
        );

        if (!existingIndex) {
          const suggestion: OptimizationSuggestion = {
            id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'index',
            priority: 'medium',
            collection,
            description: `ایجاد ایندکس ${indexConfig.name}: ${indexConfig.rationale}`,
            impact: {
              performanceGain: Math.floor(Math.random() * 30) + 20,
              resourceSavings: Math.floor(Math.random() * 20) + 10,
              complexityIncrease: Math.floor(Math.random() * 3) + 2
            },
            implementation: {
              command: `db.${collection}.createIndex(${JSON.stringify(indexConfig.fields)}, { name: "${indexConfig.name}", background: true })`,
              estimatedTime: Math.floor(Math.random() * 10) + 5,
              riskLevel: 'low'
            },
            status: 'pending',
            createdAt: new Date()
          };
          newSuggestions.push(suggestion);
        }
      });

      // پیشنهاد sharding اگر وجود دارد
      const configWithSharding = config as any;
      if (configWithSharding.sharding) {
        const shardingConfig = configWithSharding.sharding;
        const suggestion: OptimizationSuggestion = {
          id: `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'sharding',
          priority: 'high',
          collection,
          description: `تقسیم collection ${collection}: ${shardingConfig.rationale}`,
          impact: {
            performanceGain: Math.floor(Math.random() * 40) + 40,
            resourceSavings: Math.floor(Math.random() * 30) + 25,
            complexityIncrease: Math.floor(Math.random() * 4) + 6
          },
          implementation: {
            command: `sh.enableSharding("exam-edu"); sh.shardCollection("exam-edu.${collection}", ${JSON.stringify(shardingConfig.shardKey)})`,
            estimatedTime: Math.floor(Math.random() * 30) + 20,
            riskLevel: 'medium'
          },
          status: 'pending',
          createdAt: new Date()
        };
        newSuggestions.push(suggestion);
      }
    });

    // اضافه کردن پیشنهادات جدید
    optimizationSuggestions.push(...newSuggestions);

    res.json({
      success: true,
      message: `${newSuggestions.length} پیشنهاد جدید تولید شد`,
      data: {
        newSuggestions: newSuggestions.length,
        totalSuggestions: optimizationSuggestions.length
      }
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تولید پیشنهادات',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت متریک‌های عملکرد
 */
export const getPerformanceMetrics = async (req: Request, res: Response) => {
  try {
    const { collection, operation, timeRange = '24h' } = req.query;

    // تولید داده‌های نمونه برای متریک‌ها
    const sampleMetrics: PerformanceMetric[] = [];
    const now = new Date();
    const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720; // 30d

    for (let i = 0; i < hoursBack; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      
      ['questions', 'testExams', 'courseExams', 'flashcards'].forEach(coll => {
        if (!collection || collection === 'all' || collection === coll) {
          ['find', 'insert', 'update', 'delete'].forEach(op => {
            if (!operation || operation === 'all' || operation === op) {
              sampleMetrics.push({
                id: `metric-${Date.now()}-${Math.random()}`,
                timestamp,
                collection: coll,
                operation: op as 'find' | 'insert' | 'update' | 'delete',
                executionTime: Math.floor(Math.random() * 100) + 5,
                docsExamined: Math.floor(Math.random() * 1000) + 10,
                docsReturned: Math.floor(Math.random() * 100) + 1,
                indexUsed: Math.random() > 0.3 ? `${coll}_idx_${Math.floor(Math.random() * 3)}` : undefined,
                queryPlan: {},
                cpu: Math.random() * 50 + 10,
                memory: Math.floor(Math.random() * 1000000000) + 100000000,
                diskIO: Math.floor(Math.random() * 1000) + 50
              });
            }
          });
        }
      });
    }

    // محاسبه آمار
    const avgExecutionTime = sampleMetrics.reduce((sum, m) => sum + m.executionTime, 0) / sampleMetrics.length;
    const slowQueries = sampleMetrics.filter(m => m.executionTime > 100);
    const indexedQueries = sampleMetrics.filter(m => m.indexUsed).length;
    const indexEfficiency = (indexedQueries / sampleMetrics.length) * 100;

    res.json({
      success: true,
      data: {
        metrics: sampleMetrics.slice(0, 100), // محدود کردن تعداد برای نمایش
        summary: {
          totalQueries: sampleMetrics.length,
          avgExecutionTime: Math.round(avgExecutionTime),
          slowQueries: slowQueries.length,
          indexEfficiency: Math.round(indexEfficiency * 10) / 10
        },
        recommendations: [
          ...(avgExecutionTime > 50 ? ['زمان اجرای میانگین کوئری‌ها بالاست - بررسی ایندکس‌ها'] : []),
          ...(indexEfficiency < 70 ? ['نرخ استفاده از ایندکس پایین است - ایجاد ایندکس‌های مناسب'] : []),
          ...(slowQueries.length > sampleMetrics.length * 0.1 ? ['تعداد کوئری‌های کند زیاد است - بهینه‌سازی کوئری‌ها'] : [])
        ]
      }
    });
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت متریک‌های عملکرد',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

// Helper function برای دسترسی به مقادیر nested
function getNestedValue(obj: any, path: string): number {
  return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
} 