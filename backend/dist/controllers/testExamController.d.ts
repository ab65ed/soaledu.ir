declare const TestExam: any, ExamSession: any;
declare const validationResult: any;
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
declare class TestExamController {
    /**
     * Create a new test exam
     * POST /api/test-exams
     */
    static create(req: any, res: any): Promise<any>;
    /**
     * Get all test exams with filtering and pagination
     * GET /api/test-exams
     */
    static list(req: any, res: any): Promise<void>;
    /**
     * Get a single test exam by ID
     * GET /api/test-exams/:id
     */
    static getById(req: any, res: any): Promise<any>;
    /**
     * Update a test exam
     * PUT /api/test-exams/:id
     */
    static update(req: any, res: any): Promise<any>;
    /**
     * Delete a test exam
     * DELETE /api/test-exams/:id
     */
    static delete(req: any, res: any): Promise<any>;
    /**
     * Publish a test exam
     * PATCH /api/test-exams/:id/publish
     */
    static publish(req: any, res: any): Promise<any>;
    /**
     * Unpublish a test exam
     * PATCH /api/test-exams/:id/unpublish
     */
    static unpublish(req: any, res: any): Promise<any>;
    /**
     * Generate questions for exam based on configuration
     * POST /api/test-exams/:id/generate-questions
     */
    static generateQuestions(req: any, res: any): Promise<any>;
    /**
     * Start an exam session
     * POST /api/test-exams/:id/start
     */
    static startExam(req: any, res: any): Promise<any>;
    /**
     * Submit an answer
     * POST /api/exam-sessions/:sessionId/answer
     */
    static submitAnswer(req: any, res: any): Promise<any>;
    /**
     * Finish exam and calculate results
     * POST /api/exam-sessions/:sessionId/finish
     */
    static finishExam(req: any, res: any): Promise<any>;
    /**
     * Get exam session
     * GET /api/exam-sessions/:sessionId
     */
    static getSession(req: any, res: any): Promise<any>;
    /**
     * Get exam results with analytics
     * GET /api/exam-sessions/:sessionId/results
     */
    static getResults(req: any, res: any): Promise<any>;
    /**
     * Calculate detailed analytics for exam results
     */
    static calculateAnalytics(result: any): {
        difficultyBreakdown: {
            easy: {
                total: number;
                correct: number;
                percentage: number;
            };
            medium: {
                total: number;
                correct: number;
                percentage: number;
            };
            hard: {
                total: number;
                correct: number;
                percentage: number;
            };
        };
        categoryBreakdown: {};
        typeBreakdown: {};
        timeAnalysis: {
            totalTime: number;
            averageTimePerQuestion: number;
            fastestQuestion: number;
            slowestQuestion: number;
            timeDistribution: any[];
        };
        performanceMetrics: {
            accuracy: any;
            speed: number;
            consistency: number;
            improvement: number;
        };
    };
    /**
     * Calculate consistency score based on time distribution
     */
    static calculateConsistency(timeDistribution: any): number;
}
