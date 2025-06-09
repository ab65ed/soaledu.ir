import { Request, Response } from 'express';
import QuestionCacheService from '../services/QuestionCacheService';

interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * کنترلر مدیریت کش
 * برای نظارت و کنترل کش سوالات
 */
export class CacheManagementController {
  
  /**
   * دریافت آمار کش
   * GET /api/cache/stats
   */
  static async getCacheStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cacheService = QuestionCacheService.getInstance();
      const stats = cacheService.getCacheStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          memoryUsageMB: (stats.memoryUsage / 1024 / 1024).toFixed(2),
          recommendations: CacheManagementController.generateRecommendations(stats),
          attemptStats: stats.attemptStats
        }
      });
    } catch (error) {
      console.error('Error getting cache stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار کش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * دریافت آمار attempt کاربر خاص
   * GET /api/cache/user-attempts/:userId/:examId
   */
  static async getUserAttemptStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, examId } = req.params;
      
      if (!userId || !examId) {
        res.status(400).json({
          success: false,
          message: 'userId و examId الزامی هستند'
        });
        return;
      }

      const cacheService = QuestionCacheService.getInstance();
      const userStats = cacheService.getUserAttemptStats(userId, examId);
      
      if (!userStats) {
        res.json({
          success: true,
          data: {
            attemptCount: 0,
            maxAttempts: 5,
            remainingAttempts: 5,
            lastAttemptAt: null,
            usedPoolVersions: []
          }
        });
        return;
      }

      res.json({
        success: true,
        data: {
          attemptCount: userStats.attemptCount,
          maxAttempts: 5,
          remainingAttempts: 5 - userStats.attemptCount,
          lastAttemptAt: userStats.lastAttemptAt,
          usedPoolVersions: userStats.usedPoolVersions
        }
      });
    } catch (error) {
      console.error('Error getting user attempt stats:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آمار attempt کاربر',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پاک کردن کل کش
   * DELETE /api/cache/clear
   */
  static async clearCache(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // بررسی دسترسی ادمین
      if (!req.user?.isAdmin) {
        res.status(403).json({
          success: false,
          message: 'فقط ادمین‌ها می‌توانند کش را پاک کنند'
        });
        return;
      }

      const cacheService = QuestionCacheService.getInstance();
      cacheService.clearCache();
      
      res.json({
        success: true,
        message: 'کش با موفقیت پاک شد'
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پاک کردن کش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پاک کردن کش دسته‌بندی خاص
   * DELETE /api/cache/clear/:category
   */
  static async clearCacheByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      if (!category) {
        res.status(400).json({
          success: false,
          message: 'دسته‌بندی مشخص نشده'
        });
        return;
      }

      const cacheService = QuestionCacheService.getInstance();
      cacheService.clearCacheByCategory(category);
      
      res.json({
        success: true,
        message: `کش دسته‌بندی ${category} پاک شد`
      });
    } catch (error) {
      console.error('Error clearing category cache:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در پاک کردن کش دسته‌بندی',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }

  /**
   * پیش‌گرم کردن کش برای دسته‌بندی‌های پرطرفدار
   * POST /api/cache/warmup
   */
  static async warmupCache(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { categories, difficulties } = req.body;
      
      if (!categories || !Array.isArray(categories)) {
        res.status(400).json({
          success: false,
          message: 'لیست دسته‌بندی‌ها مشخص نشده'
        });
        return;
      }

      const cacheService = QuestionCacheService.getInstance();
      const warmupResults = [];

      // پیش‌گرم کردن برای هر ترکیب دسته‌بندی و سختی
      for (const category of categories) {
        for (const difficulty of difficulties || ['EASY', 'MEDIUM', 'HARD']) {
          try {
            const poolConfig = {
              categories: [category],
              difficulty,
              tags: [],
              totalQuestions: 20 // تعداد پیش‌فرض برای warmup
            };

            const questions = await cacheService.getQuestionPool(poolConfig);
            warmupResults.push({
              category,
              difficulty,
              questionsLoaded: questions.length,
              status: 'success'
            });
          } catch (error) {
            warmupResults.push({
              category,
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
          totalPoolsWarmed: warmupResults.filter(r => r.status === 'success').length,
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
   * تولید پیشنهادات بهینه‌سازی کش
   */
  private static generateRecommendations(stats: any): string[] {
    const recommendations = [];

    if (stats.hitRate < 50) {
      recommendations.push('نرخ hit کش پایین است. در نظر گیرید TTL را افزایش دهید');
    }

    if (stats.memoryUsage > 100 * 1024 * 1024) { // 100MB
      recommendations.push('استفاده از حافظه بالا است. کش قدیمی را پاک کنید');
    }

    if (stats.totalPools > 40) {
      recommendations.push('تعداد pool های کش زیاد است. در نظر گیرید MAX_POOLS را کاهش دهید');
    }

    if (stats.mostUsedPools.length > 0) {
      const topPool = stats.mostUsedPools[0];
      if (topPool.usageCount > 100) {
        recommendations.push(`Pool ${topPool.key} بسیار پرکاربرد است. TTL آن را افزایش دهید`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('عملکرد کش مطلوب است');
    }

    return recommendations;
  }

  /**
   * دریافت جزئیات pool های کش
   * GET /api/cache/pools
   */
  static async getCachePools(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cacheService = QuestionCacheService.getInstance();
      const stats = cacheService.getCacheStats();
      
      res.json({
        success: true,
        data: {
          totalPools: stats.totalPools,
          mostUsedPools: stats.mostUsedPools,
          hitRate: stats.hitRate,
          memoryUsage: stats.memoryUsage
        }
      });
    } catch (error) {
      console.error('Error getting cache pools:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت اطلاعات pool های کش',
        error: error instanceof Error ? error.message : 'خطای ناشناخته'
      });
    }
  }
}

export default CacheManagementController; 