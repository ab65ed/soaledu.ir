import { Request, Response } from 'express';
import ExamPurchaseCacheService from '../services/ExamPurchaseCacheService';

interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * کنترلر مدیریت خرید آزمون‌ها
 * مدیریت کش هوشمند برای خرید و تکرار آزمون‌ها
 */
export class ExamPurchaseManagementController {
  
  /**
   * دریافت آمار کش خرید آزمون‌ها
   * GET /api/exam-purchase/cache-stats
   */
  static async getCacheStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cacheService = ExamPurchaseCacheService.getInstance();
      const stats = cacheService.getCacheStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          sharedCaches: {
            ...stats.sharedCaches,
            memoryUsageMB: (stats.sharedCaches.memoryUsage / 1024 / 1024).toFixed(2)
          },
          systemInfo: {
            cacheType: 'Purchase-based Smart Cache',
            sharedCacheTTL: '6 hours',
            maxRepetitions: 2,
            uniqueQuestionPercentage: '70%+'
          }
        }
      });
    } catch (error) {
      console.error('Error getting purchase cache stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار کش خرید',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * دریافت آمار خرید کاربر برای درس خاص
   * GET /api/exam-purchase/user-stats/:userId/:subjectId
   */
  static async getUserPurchaseStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, subjectId } = req.params;
      
      if (!userId || !subjectId) {
        res.status(400).json({
          success: false,
          message: 'userId و subjectId الزامی هستند'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      const userStats = cacheService.getUserPurchaseStats(userId, subjectId);
      
      res.json({
        success: true,
        data: userStats
      });
    } catch (error) {
      console.error('Error getting user purchase stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار خرید کاربر',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * دریافت آمار تکرار آزمون
   * GET /api/exam-purchase/repetition-stats/:userId/:examId
   */
  static async getExamRepetitionStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, examId } = req.params;
      
      if (!userId || !examId) {
        res.status(400).json({
          success: false,
          message: 'userId و examId الزامی هستند'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      const repetitionStats = cacheService.getExamRepetitionStats(userId, examId);
      
      if (!repetitionStats) {
        res.json({
          success: true,
          data: {
            repetitionCount: 0,
            maxRepetitions: 2,
            remainingRepetitions: 2,
            lastRepetitionAt: null,
            canRepeat: false,
            message: 'آزمون خریداری نشده'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: repetitionStats
      });
    } catch (error) {
      console.error('Error getting exam repetition stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار تکرار آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * تولید سوالات آزمون (خرید جدید یا تکرار)
   * POST /api/exam-purchase/generate-questions
   */
  static async generateExamQuestions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        subjectId,
        categories,
        difficulty,
        tags,
        totalQuestions,
        examId,
        isRepetition
      } = req.body;

      if (!subjectId || !difficulty || !totalQuestions) {
        res.status(400).json({
          success: false,
          message: 'subjectId، difficulty و totalQuestions الزامی هستند'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      
      const config = {
        subjectId,
        categories: categories || [],
        difficulty,
        tags: tags || [],
        totalQuestions,
        userId: req.user?.id,
        examId,
        isRepetition: isRepetition || false
      };

      const result = await cacheService.getExamQuestions(config);

      res.json({
        success: true,
        message: isRepetition ? 'سوالات تکرار آزمون دریافت شد' : 'سوالات آزمون جدید تولید شد',
        data: {
          questions: result.questions,
          cacheInfo: result.cacheInfo,
          totalQuestions: result.questions.length,
          examType: result.cacheInfo.type,
          performance: {
            hitRate: result.cacheInfo.hitRate,
            cacheType: result.cacheInfo.type === 'shared' ? 'کش مشترک 6 ساعته' :
                      result.cacheInfo.type === 'unique' ? 'سوالات منحصر به فرد' :
                      'تکرار آزمون خریداری شده'
          }
        }
      });

    } catch (error) {
      console.error('Error generating exam questions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تولید سوالات آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * ثبت خرید جدید آزمون
   * POST /api/exam-purchase/record-purchase
   */
  static async recordExamPurchase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { examId, subjectId, questions } = req.body;

      if (!examId || !subjectId || !questions || !Array.isArray(questions)) {
        res.status(400).json({
          success: false,
          message: 'examId، subjectId و questions الزامی هستند'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      
      await cacheService.recordExamPurchase(
        req.user?.id,
        examId,
        subjectId,
        questions
      );

      res.json({
        success: true,
        message: 'خرید آزمون با موفقیت ثبت شد',
        data: {
          examId,
          subjectId,
          questionsCount: questions.length,
          maxRepetitions: 2
        }
      });

    } catch (error) {
      console.error('Error recording exam purchase:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ثبت خرید آزمون',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پاک کردن کل کش (فقط ادمین)
   * DELETE /api/exam-purchase/clear-cache
   */
  static async clearAllCaches(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // بررسی دسترسی ادمین
      if (!req.user?.isAdmin) {
        res.status(403).json({
          success: false,
          message: 'فقط ادمین‌ها می‌توانند کش را پاک کنند'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      cacheService.clearAllCaches();
      
      res.json({
        success: true,
        message: 'تمام کش‌های خرید آزمون پاک شد'
      });
    } catch (error) {
      console.error('Error clearing all caches:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پاک کردن کش‌ها',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پاک کردن کش مربوط به درس خاص
   * DELETE /api/exam-purchase/clear-cache/:subjectId
   */
  static async clearSubjectCache(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;
      
      if (!subjectId) {
        res.status(400).json({
          success: false,
          message: 'subjectId مشخص نشده'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      cacheService.clearSubjectCache(subjectId);
      
      res.json({
        success: true,
        message: `کش درس ${subjectId} پاک شد`
      });
    } catch (error) {
      console.error('Error clearing subject cache:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پاک کردن کش درس',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پیش‌گرم کردن کش برای دروس پرطرفدار
   * POST /api/exam-purchase/warmup-cache
   */
  static async warmupCache(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { subjects, difficulties } = req.body;
      
      if (!subjects || !Array.isArray(subjects)) {
        res.status(400).json({
          success: false,
          message: 'لیست دروس مشخص نشده'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      const warmupResults = [];

      // پیش‌گرم کردن برای هر ترکیب درس و سختی
      for (const subjectId of subjects) {
        for (const difficulty of difficulties || ['EASY', 'MEDIUM', 'HARD']) {
          try {
            const config = {
              subjectId,
              categories: [], // خالی برای عمومی
              difficulty,
              tags: [],
              totalQuestions: 20, // تعداد پیش‌فرض برای warmup
              userId: 'warmup_user' // کاربر مجازی برای warmup
            };

            const result = await cacheService.getExamQuestions(config);
            warmupResults.push({
              subjectId,
              difficulty,
              questionsLoaded: result.questions.length,
              cacheType: result.cacheInfo.type,
              status: 'success'
            });
          } catch (error) {
            warmupResults.push({
              subjectId,
              difficulty,
              questionsLoaded: 0,
              status: 'error',
              error: error instanceof Error ? error.message : 'خطای ناشناخته'
            });
          }
        }
      }

      res.json({
        success: true,
        message: 'پیش‌گرم کردن کش تکمیل شد',
        data: {
          results: warmupResults,
          totalCachesWarmed: warmupResults.filter(r => r.status === 'success').length,
          cacheStats: cacheService.getCacheStats()
        }
      });
    } catch (error) {
      console.error('Error warming up cache:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پیش‌گرم کردن کش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * دریافت لیست آزمون‌های خریداری شده کاربر
   * GET /api/exam-purchase/user-exams/:userId
   */
  static async getUserPurchasedExams(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'userId مشخص نشده'
        });
        return;
      }

      // بررسی دسترسی (کاربر فقط آزمون‌های خودش را ببیند)
      if (req.user?.id !== userId && !req.user?.isAdmin) {
        res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
        return;
      }

      const cacheService = ExamPurchaseCacheService.getInstance();
      
      // دریافت آمار خرید برای همه دروس (این باید از دیتابیس باشد)
      // فعلاً از کش استفاده می‌کنیم
      const userExams = [];
      
      // این بخش باید با دیتابیس واقعی پیاده‌سازی شود
      // فعلاً نمونه‌ای برمی‌گردانیم
      
      res.json({
        success: true,
        data: {
          userId,
          purchasedExams: userExams,
          totalPurchases: userExams.length,
          message: 'این API باید با دیتابیس واقعی پیاده‌سازی شود'
        }
      });

    } catch (error) {
      console.error('Error getting user purchased exams:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آزمون‌های خریداری شده',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * تست عملکرد کش
   * POST /api/exam-purchase/test-performance
   */
  static async testCachePerformance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { iterations = 10, subjectId = 'ریاضی' } = req.body;
      
      const cacheService = ExamPurchaseCacheService.getInstance();
      const results = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        
        const config = {
          subjectId,
          categories: ['جبر'],
          difficulty: 'MEDIUM',
          tags: [],
          totalQuestions: 20,
          userId: `test_user_${i % 3}` // 3 کاربر مختلف برای تست
        };

        const result = await cacheService.getExamQuestions(config);
        const endTime = Date.now();
        
        results.push({
          iteration: i + 1,
          responseTime: endTime - startTime,
          cacheType: result.cacheInfo.type,
          hitRate: result.cacheInfo.hitRate,
          questionsCount: result.questions.length
        });
      }

      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      const cacheHits = results.filter(r => r.cacheType === 'shared').length;
      const hitRate = (cacheHits / results.length) * 100;

      res.json({
        success: true,
        data: {
          testResults: results,
          summary: {
            totalIterations: iterations,
            averageResponseTime: Math.round(avgResponseTime),
            overallHitRate: Math.round(hitRate),
            cacheHits,
            cacheMisses: results.length - cacheHits
          },
          cacheStats: cacheService.getCacheStats()
        }
      });

    } catch (error) {
      console.error('Error testing cache performance:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تست عملکرد کش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }
}

export default ExamPurchaseManagementController; 