/**
 * A/B Test Controller
 * 
 * Handles A/B test operations including creation, management, participant assignment, and analytics
 */

import { Request, Response } from 'express';
import { RequestWithUser } from '../types/index';
import { 
  ABTest, 
  ABTestVariant, 
  ABTestParticipant, 
  ABTestResult, 
  ABTestSummary,
  ABTestUtils 
} from '../models/ab-test';

// Mock data برای شروع (در پروژه واقعی از Parse Server استفاده می‌شود)
let abTests: ABTest[] = [
  {
    id: 'test-1',
    name: 'فرم تست سوال - نسخه بهبود یافته',
    description: 'تست رابط کاربری فرم ایجاد سوال',
    status: 'running',
    targetType: 'form',
    targetPath: '/questions',
    variants: [
      {
        id: 'control',
        name: 'فرم اصلی',
        description: 'فرم فعلی ایجاد سوال',
        percentage: 50,
        config: { layout: 'traditional', colorScheme: 'blue' },
        isControl: true
      },
      {
        id: 'variant-a',
        name: 'فرم بهبود یافته',
        description: 'فرم با UI مدرن و step-by-step',
        percentage: 50,
        config: { layout: 'modern', colorScheme: 'green', steps: true },
        isControl: false
      }
    ],
    metrics: [
      {
        name: 'conversion_rate',
        type: 'conversion',
        description: 'نرخ تبدیل فرم',
        goal: 'maximize'
      },
      {
        name: 'completion_time',
        type: 'duration',
        description: 'زمان تکمیل فرم',
        goal: 'minimize'
      }
    ],
    participants: [],
    startDate: new Date('2025-01-20'),
    minSampleSize: 100,
    confidenceLevel: 95,
    createdBy: 'admin',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20')
  },
  {
    id: 'test-2',
    name: 'داشبورد اصلی - چیدمان جدید',
    description: 'تست چیدمان و رنگ‌بندی داشبورد',
    status: 'draft',
    targetType: 'dashboard',
    targetPath: '/dashboard',
    variants: [
      {
        id: 'control',
        name: 'داشبورد فعلی',
        description: 'چیدمان کنونی داشبورد',
        percentage: 40,
        config: { layout: 'sidebar', theme: 'light' },
        isControl: true
      },
      {
        id: 'variant-b',
        name: 'چیدمان کارتی',
        description: 'چیدمان بر اساس کارت‌ها',
        percentage: 30,
        config: { layout: 'cards', theme: 'light' },
        isControl: false
      },
      {
        id: 'variant-c',
        name: 'حالت تیره',
        description: 'داشبورد با تم تیره',
        percentage: 30,
        config: { layout: 'sidebar', theme: 'dark' },
        isControl: false
      }
    ],
    metrics: [
      {
        name: 'user_engagement',
        type: 'numeric',
        description: 'میزان تعامل کاربر',
        goal: 'maximize'
      },
      {
        name: 'task_completion',
        type: 'conversion',
        description: 'تکمیل وظایف',
        goal: 'maximize'
      }
    ],
    participants: [],
    startDate: new Date('2025-01-25'),
    minSampleSize: 200,
    confidenceLevel: 95,
    createdBy: 'admin',
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25')
  }
];

let participants: ABTestParticipant[] = [];

/**
 * دریافت لیست تست‌های A/B
 */
export const getABTests = async (req: RequestWithUser, res: Response) => {
  try {
    const { status, targetType, page = 1, limit = 10 } = req.query;

    let filteredTests = [...abTests];

    // فیلتر بر اساس وضعیت
    if (status && status !== 'all') {
      filteredTests = filteredTests.filter(test => test.status === status);
    }

    // فیلتر بر اساس نوع هدف
    if (targetType && targetType !== 'all') {
      filteredTests = filteredTests.filter(test => test.targetType === targetType);
    }

    // صفحه‌بندی
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTests = filteredTests.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        tests: paginatedTests,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredTests.length,
          totalPages: Math.ceil(filteredTests.length / Number(limit))
        },
        summary: {
          total: abTests.length,
          running: abTests.filter(t => t.status === 'running').length,
          draft: abTests.filter(t => t.status === 'draft').length,
          completed: abTests.filter(t => t.status === 'completed').length,
          paused: abTests.filter(t => t.status === 'paused').length
        }
      }
    });
  } catch (error) {
    console.error('Error getting A/B tests:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تست‌های A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * ایجاد تست A/B جدید
 */
export const createABTest = async (req: RequestWithUser, res: Response) => {
  try {
    const testData = req.body;

    // اعتبارسنجی
    if (!testData.name || !testData.description || !testData.targetPath) {
      return res.status(400).json({
        success: false,
        message: 'فیلدهای name، description و targetPath الزامی هستند'
      });
    }

    // بررسی مجموع درصد variants
    const totalPercentage = testData.variants.reduce((sum: number, v: ABTestVariant) => sum + v.percentage, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({
        success: false,
        message: 'مجموع درصد variants باید 100 باشد'
      });
    }

    const newTest: ABTest = {
      id: `test-${Date.now()}`,
      ...testData,
      status: 'draft',
      participants: [],
      createdBy: req.user?.id || 'admin', // فرض کنیم user از middleware می‌آید
      createdAt: new Date(),
      updatedAt: new Date()
    };

    abTests.push(newTest);

    res.status(201).json({
      success: true,
      message: 'تست A/B با موفقیت ایجاد شد',
      data: newTest
    });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت تست A/B بر اساس ID
 */
export const getABTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    // محاسبه آمار اضافی
    const testParticipants = participants.filter(p => 
      test.variants.some(v => v.id === p.variantId)
    );

    const variantStats = test.variants.map(variant => {
      const variantParticipants = testParticipants.filter(p => p.variantId === variant.id);
      const conversions = variantParticipants.filter(p => p.hasConverted).length;
      
      return {
        ...variant,
        participantCount: variantParticipants.length,
        conversions,
        conversionRate: variantParticipants.length > 0 ? (conversions / variantParticipants.length) * 100 : 0
      };
    });

    res.json({
      success: true,
      data: {
        ...test,
        variants: variantStats,
        totalParticipants: testParticipants.length,
        totalConversions: testParticipants.filter(p => p.hasConverted).length
      }
    });
  } catch (error) {
    console.error('Error getting A/B test by ID:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * شروع تست A/B
 */
export const startABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    if (test.status !== 'draft' && test.status !== 'paused') {
      return res.status(400).json({
        success: false,
        message: 'فقط تست‌های پیش‌نویس یا متوقف شده قابل شروع هستند'
      });
    }

    test.status = 'running';
    test.startDate = new Date();
    test.updatedAt = new Date();

    res.json({
      success: true,
      message: 'تست A/B با موفقیت شروع شد',
      data: test
    });
  } catch (error) {
    console.error('Error starting A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در شروع تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * متوقف کردن تست A/B
 */
export const pauseABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    if (test.status !== 'running') {
      return res.status(400).json({
        success: false,
        message: 'فقط تست‌های در حال اجرا قابل توقف هستند'
      });
    }

    test.status = 'paused';
    test.updatedAt = new Date();

    res.json({
      success: true,
      message: 'تست A/B متوقف شد',
      data: test
    });
  } catch (error) {
    console.error('Error pausing A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در توقف تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * پایان تست A/B
 */
export const stopABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    test.status = 'completed';
    test.endDate = new Date();
    test.updatedAt = new Date();

    res.json({
      success: true,
      message: 'تست A/B به پایان رسید',
      data: test
    });
  } catch (error) {
    console.error('Error stopping A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در پایان تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * اختصاص کاربر به variant
 * با پشتیبانی از course-exam و questions
 */
export const assignUserToVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, courseExamId, questionIds, targetPath } = req.body;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    if (test.status !== 'running') {
      return res.status(400).json({
        success: false,
        message: 'تست در حال اجرا نیست'
      });
    }

    // بررسی اینکه کاربر قبلاً شرکت کرده یا نه
    const existingParticipant = participants.find(p => 
      p.userId === userId && test.variants.some(v => v.id === p.variantId)
    );

    if (existingParticipant) {
      const variant = test.variants.find(v => v.id === existingParticipant.variantId);
      return res.json({
        success: true,
        message: 'کاربر قبلاً در تست شرکت کرده',
        data: { 
          variant,
          assignment: existingParticipant
        }
      });
    }

    // انتخاب variant بر اساس درصد
    const random = Math.random() * 100;
    let cumulativePercentage = 0;
    let selectedVariant: ABTestVariant | null = null;

    for (const variant of test.variants) {
      cumulativePercentage += variant.percentage;
      if (random <= cumulativePercentage) {
        selectedVariant = variant;
        break;
      }
    }

    if (!selectedVariant) {
      selectedVariant = test.variants[0]; // fallback
    }

    // ایجاد شرکت‌کننده جدید با اطلاعات course-exam
    const newParticipant: ABTestParticipant = {
      userId,
      variantId: selectedVariant.id,
      assignedAt: new Date(),
      hasConverted: false,
      metrics: {
        courseExamId: courseExamId || null,
        questionIds: questionIds || [],
        targetPath: targetPath || null,
        initialAssignment: new Date().toISOString()
      }
    };

    participants.push(newParticipant);

    // ثبت log برای security و audit
    console.log(`A/B Test Assignment: User ${userId} assigned to variant ${selectedVariant.id} for test ${id}`, {
      courseExamId,
      questionIds,
      targetPath,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'کاربر به variant اختصاص یافت',
      data: { 
        variant: selectedVariant,
        assignment: newParticipant
      }
    });
  } catch (error) {
    console.error('Error assigning user to variant:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در اختصاص کاربر به variant',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * ثبت conversion
 * با پشتیبانی از course-exam و question interactions
 */
export const recordConversion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      userId, 
      variantId,
      metricName = 'conversion',
      value = 1,
      metadata = {} 
    } = req.body;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    const participant = participants.find(p => 
      p.userId === userId && p.variantId === variantId
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'شرکت‌کننده یافت نشد'
      });
    }

    // بروزرسانی metrics
    participant.hasConverted = true;
    participant.metrics = { 
      ...participant.metrics, 
      [metricName]: value,
      lastConversion: new Date().toISOString(),
      ...metadata
    };

    // ثبت log برای tracking
    console.log(`A/B Test Conversion: User ${userId} converted in test ${id}`, {
      variantId,
      metricName,
      value,
      metadata,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'conversion ثبت شد',
      data: {
        participant,
        conversion: {
          metricName,
          value,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error recording conversion:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت conversion',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت نتایج تست A/B
 */
export const getABTestResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    const testParticipants = participants.filter(p => 
      test.variants.some(v => v.id === p.variantId)
    );

    const results = test.variants.map(variant => {
      const variantParticipants = testParticipants.filter(p => p.variantId === variant.id);
      const conversions = variantParticipants.filter(p => p.hasConverted).length;
      const conversionRate = variantParticipants.length > 0 ? (conversions / variantParticipants.length) * 100 : 0;

      return {
        variantId: variant.id,
        variantName: variant.name,
        participantsCount: variantParticipants.length,
        conversions,
        conversionRate,
        isControl: variant.isControl,
        isStatisticallySignificant: variantParticipants.length >= test.minSampleSize && conversionRate > 0
      };
    });

    // یافتن بهترین variant
    const bestVariant = results.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    );

    res.json({
      success: true,
      data: {
        testId: test.id,
        testName: test.name,
        status: test.status,
        totalParticipants: testParticipants.length,
        results,
        winner: bestVariant,
        isComplete: test.status === 'completed',
        hasSignificantResults: results.some(r => r.isStatisticallySignificant)
      }
    });
  } catch (error) {
    console.error('Error getting A/B test results:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت نتایج تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * دریافت تحلیل‌های تست A/B
 */
export const getABTestAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = abTests.find(t => t.id === id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    // تولید داده‌های تحلیلی نمونه
    const analytics = {
      timeline: generateTimelineData(test),
      demographics: generateDemographicsData(),
      performance: generatePerformanceData(test),
      recommendations: generateRecommendations(test)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting A/B test analytics:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تحلیل‌های تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

// Helper functions
function generateTimelineData(test: ABTest) {
  const days = [];
  const startDate = new Date(test.startDate);
  const endDate = test.endDate ? new Date(test.endDate) : new Date();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push({
      date: new Date(d).toISOString().split('T')[0],
      participants: Math.floor(Math.random() * 50) + 10,
      conversions: Math.floor(Math.random() * 20) + 2
    });
  }
  
  return days;
}

function generateDemographicsData() {
  return {
    ageGroups: [
      { group: '18-25', percentage: 35 },
      { group: '26-35', percentage: 40 },
      { group: '36-45', percentage: 20 },
      { group: '45+', percentage: 5 }
    ],
    devices: [
      { device: 'Desktop', percentage: 60 },
      { device: 'Mobile', percentage: 35 },
      { device: 'Tablet', percentage: 5 }
    ]
  };
}

function generatePerformanceData(test: ABTest) {
  return test.variants.map(variant => ({
    variantId: variant.id,
    variantName: variant.name,
    avgSessionTime: Math.floor(Math.random() * 300) + 120,
    bounceRate: Math.floor(Math.random() * 30) + 20,
    pageViews: Math.floor(Math.random() * 10) + 3
  }));
}

function generateRecommendations(test: ABTest) {
  const recommendations = [
    'نمونه آماری کافی برای نتیجه‌گیری معنادار جمع‌آوری شده است',
    'variant B عملکرد بهتری نسبت به کنترل دارد',
    'پیشنهاد می‌شود تست را برای یک هفته دیگر ادامه دهید'
  ];
  
  return recommendations.slice(0, Math.floor(Math.random() * 3) + 1);
}

/**
 * بروزرسانی تست A/B
 */
export const updateABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const testIndex = abTests.findIndex(t => t.id === id);
    if (testIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    // بررسی اینکه تست در حال اجرا نباشد برای تغییرات حساس
    if (abTests[testIndex].status === 'running' && (updates.variants || updates.targetPath)) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توان variants یا targetPath را در حین اجرای تست تغییر داد'
      });
    }

    abTests[testIndex] = {
      ...abTests[testIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'تست A/B بروزرسانی شد',
      data: abTests[testIndex]
    });
  } catch (error) {
    console.error('Error updating A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * حذف تست A/B
 */
export const deleteABTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testIndex = abTests.findIndex(t => t.id === id);
    if (testIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'تست A/B یافت نشد'
      });
    }

    // بررسی اینکه تست در حال اجرا نباشد
    if (abTests[testIndex].status === 'running') {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توان تست در حال اجرا را حذف کرد'
      });
    }

    const deletedTest = abTests.splice(testIndex, 1)[0];

    // حذف شرکت‌کنندگان مربوط به این تست
    participants = participants.filter(p => 
      !deletedTest.variants.some(v => v.id === p.variantId)
    );

    res.json({
      success: true,
      message: 'تست A/B حذف شد',
      data: deletedTest
    });
  } catch (error) {
    console.error('Error deleting A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف تست A/B',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};
