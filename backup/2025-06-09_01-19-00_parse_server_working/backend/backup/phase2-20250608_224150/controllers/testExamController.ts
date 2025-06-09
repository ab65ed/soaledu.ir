const { TestExam, ExamSession } = require('../models/TestExam');
const { validationResult } = require('express-validator');

/**
 * TestExam Controller
 * کنترلر مدیریت آزمون‌های تستی با 40 سوال و توزیع سختی
 * 
 * ویژگی‌های اصلی:
 * - CRUD کامل آزمون‌ها
 * - تولید سوالات بر اساس توزیع سختی
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل گرافیکی
 */

class TestExamController {
  /**
   * Create a new test exam
   * POST /api/test-exams
   */
  static async create(req, res) {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
          }))
        });
      }

      const examData = {
        ...req.body,
        authorId: req.user.id,
        author: req.user
      };

      const exam = await TestExam.create(examData);

      res.status(201).json({
        success: true,
        message: 'آزمون با موفقیت ایجاد شد',
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error creating test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ایجاد آزمون',
        error: error.message
      });
    }
  }

  /**
   * Get all test exams with filtering and pagination
   * GET /api/test-exams
   */
  static async list(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        status,
        search,
        publishedOnly = 'true',
        authorId
      } = req.query;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        type,
        status,
        search
      };

      let exams;
      if (publishedOnly === 'true') {
        exams = await TestExam.findPublished(options);
      } else if (authorId) {
        exams = await TestExam.findByAuthor(authorId, options);
      } else {
        // Admin or special access
        const query = new Parse.Query(TestExam);
        
        if (options.type) query.equalTo('type', options.type);
        if (options.status) query.equalTo('status', options.status);
        
        if (options.search) {
          const titleQuery = new Parse.Query(TestExam);
          titleQuery.contains('title', options.search);
          
          const descQuery = new Parse.Query(TestExam);
          descQuery.contains('description', options.search);
          
          const searchQuery = Parse.Query.or(titleQuery, descQuery);
          query = Parse.Query.and(query, searchQuery);
        }
        
        query.include('author');
        query.limit(options.limit);
        query.skip(options.skip);
        query.descending('createdAt');
        
        exams = await query.find();
      }

      // Get total count for pagination
      const totalQuery = new Parse.Query(TestExam);
      if (publishedOnly === 'true') {
        totalQuery.equalTo('isPublished', true);
        totalQuery.equalTo('status', 'active');
      }
      if (authorId) {
        totalQuery.equalTo('authorId', authorId);
      }
      
      const totalCount = await totalQuery.count();
      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: exams.map(e => e.toJSON()),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Error listing test exams:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت لیست آزمون‌ها',
        error: error.message
      });
    }
  }

  /**
   * Get a single test exam by ID
   * GET /api/test-exams/:id
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check access permissions
      if (!exam.isPublished && exam.authorId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
      }

      res.json({
        success: true,
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error getting test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت آزمون',
        error: error.message
      });
    }
  }

  /**
   * Update a test exam
   * PUT /api/test-exams/:id
   */
  static async update(req, res) {
    try {
      // Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'خطاهای اعتبارسنجی',
          errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
          }))
        });
      }

      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check ownership
      if (exam.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'فقط سازنده آزمون می‌تواند آن را ویرایش کند'
        });
      }

      // Update fields
      Object.keys(req.body).forEach(key => {
        if (exam.hasOwnProperty(key)) {
          exam[key] = req.body[key];
        }
      });

      // If configuration changed, regenerate questions
      if (req.body.configuration) {
        await exam.generateQuestions(req.body.configuration);
      }

      // Update metadata
      const currentMetadata = exam.metadata || {};
      exam.metadata = {
        ...currentMetadata,
        lastModified: new Date(),
        version: (currentMetadata.version || 0) + 1
      };

      await exam.save();

      res.json({
        success: true,
        message: 'آزمون با موفقیت به‌روزرسانی شد',
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error updating test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در به‌روزرسانی آزمون',
        error: error.message
      });
    }
  }

  /**
   * Delete a test exam
   * DELETE /api/test-exams/:id
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check ownership
      if (exam.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'فقط سازنده آزمون می‌تواند آن را حذف کند'
        });
      }

      await exam.destroy();

      res.json({
        success: true,
        message: 'آزمون با موفقیت حذف شد'
      });

    } catch (error) {
      console.error('Error deleting test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در حذف آزمون',
        error: error.message
      });
    }
  }

  /**
   * Publish a test exam
   * PATCH /api/test-exams/:id/publish
   */
  static async publish(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check ownership
      if (exam.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'فقط سازنده آزمون می‌تواند آن را منتشر کند'
        });
      }

      await exam.publish();

      res.json({
        success: true,
        message: 'آزمون با موفقیت منتشر شد',
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error publishing test exam:', error);
      res.status(400).json({
        success: false,
        message: 'خطا در انتشار آزمون',
        error: error.message
      });
    }
  }

  /**
   * Unpublish a test exam
   * PATCH /api/test-exams/:id/unpublish
   */
  static async unpublish(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check ownership
      if (exam.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'فقط سازنده آزمون می‌تواند آن را از انتشار خارج کند'
        });
      }

      await exam.unpublish();

      res.json({
        success: true,
        message: 'آزمون از انتشار خارج شد',
        data: exam.toJSON()
      });

    } catch (error) {
      console.error('Error unpublishing test exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در خروج از انتشار',
        error: error.message
      });
    }
  }

  /**
   * Generate questions for exam based on configuration
   * POST /api/test-exams/:id/generate-questions
   */
  static async generateQuestions(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check ownership
      if (exam.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'فقط سازنده آزمون می‌تواند سوالات را تولید کند'
        });
      }

      const configuration = req.body.configuration || exam.configuration;
      const questions = await exam.generateQuestions(configuration);

      await exam.save();

      res.json({
        success: true,
        message: 'سوالات با موفقیت تولید شدند',
        data: {
          exam: exam.toJSON(),
          questionsGenerated: questions.length,
          distribution: {
            easy: questions.filter(q => q.difficulty === 'Easy').length,
            medium: questions.filter(q => q.difficulty === 'Medium').length,
            hard: questions.filter(q => q.difficulty === 'Hard').length
          }
        }
      });

    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تولید سوالات',
        error: error.message
      });
    }
  }

  /**
   * Start an exam session
   * POST /api/test-exams/:id/start
   */
  static async startExam(req, res) {
    try {
      const { id } = req.params;
      const exam = await TestExam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'آزمون یافت نشد'
        });
      }

      // Check if exam is published and active
      if (!exam.isPublished || exam.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'آزمون در دسترس نیست'
        });
      }

      // Check if user already has an active session
      const existingSessionQuery = new Parse.Query(ExamSession);
      existingSessionQuery.equalTo('examId', id);
      existingSessionQuery.equalTo('participantId', req.user.id);
      existingSessionQuery.equalTo('status', 'active');
      
      const existingSession = await existingSessionQuery.first();
      if (existingSession) {
        return res.json({
          success: true,
          message: 'جلسه آزمون فعال موجود است',
          data: existingSession.toJSON()
        });
      }

      // Create new session
      const sessionData = {
        examId: id,
        exam: exam,
        participantId: req.user.id,
        participant: req.user,
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip
      };

      const session = await ExamSession.create(sessionData);

      res.json({
        success: true,
        message: 'آزمون شروع شد',
        data: session.toJSON()
      });

    } catch (error) {
      console.error('Error starting exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در شروع آزمون',
        error: error.message
      });
    }
  }

  /**
   * Submit an answer
   * POST /api/exam-sessions/:sessionId/answer
   */
  static async submitAnswer(req, res) {
    try {
      const { sessionId } = req.params;
      const { questionId, answer } = req.body;

      const sessionQuery = new Parse.Query(ExamSession);
      const session = await sessionQuery.get(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
      }

      // Check ownership
      if (session.participantId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
      }

      // Check if session is active
      if (session.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'جلسه آزمون فعال نیست'
        });
      }

      await session.submitAnswer(questionId, answer);

      res.json({
        success: true,
        message: 'پاسخ ثبت شد',
        data: session.toJSON()
      });

    } catch (error) {
      console.error('Error submitting answer:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ثبت پاسخ',
        error: error.message
      });
    }
  }

  /**
   * Finish exam and calculate results
   * POST /api/exam-sessions/:sessionId/finish
   */
  static async finishExam(req, res) {
    try {
      const { sessionId } = req.params;

      const sessionQuery = new Parse.Query(ExamSession);
      const session = await sessionQuery.get(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
      }

      // Check ownership
      if (session.participantId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
      }

      // Check if session is active
      if (session.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'جلسه آزمون فعال نیست'
        });
      }

      await session.finishExam();

      // Update exam statistics
      const exam = await TestExam.findById(session.examId);
      if (exam) {
        await exam.updateStats({
          percentage: session.percentage,
          resultStatus: session.resultStatus
        });
      }

      // Calculate detailed analytics
      const result = await session.calculateResult();
      const analytics = this.calculateAnalytics(result);

      res.json({
        success: true,
        message: 'آزمون تکمیل شد',
        data: {
          session: session.toJSON(),
          result,
          analytics
        }
      });

    } catch (error) {
      console.error('Error finishing exam:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در تکمیل آزمون',
        error: error.message
      });
    }
  }

  /**
   * Get exam session
   * GET /api/exam-sessions/:sessionId
   */
  static async getSession(req, res) {
    try {
      const { sessionId } = req.params;

      const sessionQuery = new Parse.Query(ExamSession);
      sessionQuery.include('exam');
      const session = await sessionQuery.get(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
      }

      // Check ownership
      if (session.participantId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
      }

      res.json({
        success: true,
        data: session.toJSON()
      });

    } catch (error) {
      console.error('Error getting session:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت جلسه آزمون',
        error: error.message
      });
    }
  }

  /**
   * Get exam results with analytics
   * GET /api/exam-sessions/:sessionId/results
   */
  static async getResults(req, res) {
    try {
      const { sessionId } = req.params;

      const sessionQuery = new Parse.Query(ExamSession);
      sessionQuery.include('exam');
      const session = await sessionQuery.get(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'جلسه آزمون یافت نشد'
        });
      }

      // Check ownership
      if (session.participantId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'دسترسی غیرمجاز'
        });
      }

      // Check if session is completed
      if (session.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'آزمون هنوز تکمیل نشده است'
        });
      }

      const result = await session.calculateResult();
      const analytics = this.calculateAnalytics(result);

      res.json({
        success: true,
        data: {
          session: session.toJSON(),
          result,
          analytics
        }
      });

    } catch (error) {
      console.error('Error getting results:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت نتایج',
        error: error.message
      });
    }
  }

  /**
   * Calculate detailed analytics for exam results
   */
  static calculateAnalytics(result) {
    const { detailedResults } = result;
    
    // Difficulty breakdown
    const difficultyBreakdown = {
      easy: { total: 0, correct: 0, percentage: 0 },
      medium: { total: 0, correct: 0, percentage: 0 },
      hard: { total: 0, correct: 0, percentage: 0 }
    };

    // Category breakdown
    const categoryBreakdown = {};

    // Type breakdown
    const typeBreakdown = {};

    // Time analysis
    let totalTime = 0;
    let fastestQuestion = Infinity;
    let slowestQuestion = 0;
    const timeDistribution = [];

    detailedResults.forEach(questionResult => {
      const { difficulty, category, question, timeSpent, isCorrect } = questionResult;
      
      // Difficulty analysis
      const diffKey = difficulty.toLowerCase();
      if (difficultyBreakdown[diffKey]) {
        difficultyBreakdown[diffKey].total++;
        if (isCorrect) {
          difficultyBreakdown[diffKey].correct++;
        }
      }

      // Category analysis
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { total: 0, correct: 0, percentage: 0 };
      }
      categoryBreakdown[category].total++;
      if (isCorrect) {
        categoryBreakdown[category].correct++;
      }

      // Type analysis
      const type = question.type;
      if (!typeBreakdown[type]) {
        typeBreakdown[type] = { total: 0, correct: 0, percentage: 0 };
      }
      typeBreakdown[type].total++;
      if (isCorrect) {
        typeBreakdown[type].correct++;
      }

      // Time analysis
      totalTime += timeSpent;
      fastestQuestion = Math.min(fastestQuestion, timeSpent);
      slowestQuestion = Math.max(slowestQuestion, timeSpent);
      timeDistribution.push(timeSpent);
    });

    // Calculate percentages
    Object.keys(difficultyBreakdown).forEach(key => {
      const breakdown = difficultyBreakdown[key];
      breakdown.percentage = breakdown.total > 0 ? 
        Math.round((breakdown.correct / breakdown.total) * 100) : 0;
    });

    Object.keys(categoryBreakdown).forEach(key => {
      const breakdown = categoryBreakdown[key];
      breakdown.percentage = breakdown.total > 0 ? 
        Math.round((breakdown.correct / breakdown.total) * 100) : 0;
    });

    Object.keys(typeBreakdown).forEach(key => {
      const breakdown = typeBreakdown[key];
      breakdown.percentage = breakdown.total > 0 ? 
        Math.round((breakdown.correct / breakdown.total) * 100) : 0;
    });

    const averageTimePerQuestion = detailedResults.length > 0 ? 
      Math.round(totalTime / detailedResults.length) : 0;

    return {
      difficultyBreakdown,
      categoryBreakdown,
      typeBreakdown,
      timeAnalysis: {
        totalTime,
        averageTimePerQuestion,
        fastestQuestion: fastestQuestion === Infinity ? 0 : fastestQuestion,
        slowestQuestion,
        timeDistribution
      },
      performanceMetrics: {
        accuracy: result.percentage,
        speed: totalTime > 0 ? Math.round((detailedResults.length / (totalTime / 60)) * 100) / 100 : 0,
        consistency: this.calculateConsistency(timeDistribution),
        improvement: 0 // Can be calculated based on previous attempts
      }
    };
  }

  /**
   * Calculate consistency score based on time distribution
   */
  static calculateConsistency(timeDistribution) {
    if (timeDistribution.length === 0) return 0;
    
    const mean = timeDistribution.reduce((sum, time) => sum + time, 0) / timeDistribution.length;
    const variance = timeDistribution.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / timeDistribution.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to consistency score (lower deviation = higher consistency)
    const consistencyScore = Math.max(0, 100 - (standardDeviation / mean) * 100);
    return Math.round(consistencyScore);
  }
}

module.exports = TestExamController; 