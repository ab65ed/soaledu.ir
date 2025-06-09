"use strict";
/**
 * Test Exam TypeScript Model
 * مدل TypeScript آزمون تستی
 *
 * ویژگی‌های اصلی:
 * - 40 سوال با توزیع سختی (10 آسان، 15 متوسط، 15 سخت)
 * - شخصی‌سازی تعداد/سطح
 * - مدیریت جلسات آزمون
 * - محاسبه نتایج و تحلیل گرافیکی
 * - مسیر یادگیری
 *
 * @author Exam-Edu Platform
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDifficultyLabel = exports.getTypeLabel = exports.getStatusLabel = exports.formatExamDuration = exports.generateLearningPath = exports.getQuestionPoints = exports.calculateExamScore = exports.validatePersonalizationConfig = exports.validateDifficultyDistribution = exports.DEFAULT_EXAM_CONFIG = exports.DEFAULT_DIFFICULTY_DISTRIBUTION = exports.ResultStatus = exports.SessionStatus = exports.QuestionDifficulty = exports.TestExamType = exports.TestExamStatus = void 0;
// Enums
var TestExamStatus;
(function (TestExamStatus) {
    TestExamStatus["DRAFT"] = "draft";
    TestExamStatus["ACTIVE"] = "active";
    TestExamStatus["COMPLETED"] = "completed";
    TestExamStatus["CANCELLED"] = "cancelled";
})(TestExamStatus || (exports.TestExamStatus = TestExamStatus = {}));
var TestExamType;
(function (TestExamType) {
    TestExamType["PRACTICE"] = "practice";
    TestExamType["OFFICIAL"] = "official";
    TestExamType["TIMED"] = "timed";
    TestExamType["CUSTOM"] = "custom";
})(TestExamType || (exports.TestExamType = TestExamType = {}));
var QuestionDifficulty;
(function (QuestionDifficulty) {
    QuestionDifficulty["EASY"] = "easy";
    QuestionDifficulty["MEDIUM"] = "medium";
    QuestionDifficulty["HARD"] = "hard";
})(QuestionDifficulty || (exports.QuestionDifficulty = QuestionDifficulty = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["NOT_STARTED"] = "not_started";
    SessionStatus["IN_PROGRESS"] = "in_progress";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["EXPIRED"] = "expired";
    SessionStatus["CANCELLED"] = "cancelled";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var ResultStatus;
(function (ResultStatus) {
    ResultStatus["PASSED"] = "passed";
    ResultStatus["FAILED"] = "failed";
    ResultStatus["PENDING"] = "pending";
})(ResultStatus || (exports.ResultStatus = ResultStatus = {}));
// Default configurations
exports.DEFAULT_DIFFICULTY_DISTRIBUTION = {
    easy: 10,
    medium: 15,
    hard: 15
};
exports.DEFAULT_EXAM_CONFIG = {
    totalQuestions: 40,
    difficultyDistribution: exports.DEFAULT_DIFFICULTY_DISTRIBUTION,
    timeLimit: 60, // 60 دقیقه
    categories: [],
    tags: [],
    allowReview: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    showHints: false,
    passingScore: 70
};
// Validation functions
const validateDifficultyDistribution = (distribution) => {
    const total = distribution.easy + distribution.medium + distribution.hard;
    return total === 40 &&
        distribution.easy >= 0 &&
        distribution.medium >= 0 &&
        distribution.hard >= 0;
};
exports.validateDifficultyDistribution = validateDifficultyDistribution;
const validatePersonalizationConfig = (config) => {
    if (config.totalQuestions && (config.totalQuestions < 10 || config.totalQuestions > 50)) {
        return false;
    }
    if (config.difficultyDistribution) {
        const total = (config.difficultyDistribution.easy || 0) +
            (config.difficultyDistribution.medium || 0) +
            (config.difficultyDistribution.hard || 0);
        if (total > 0 && total !== (config.totalQuestions || 40)) {
            return false;
        }
    }
    if (config.timeLimit && (config.timeLimit < 5 || config.timeLimit > 180)) {
        return false;
    }
    return true;
};
exports.validatePersonalizationConfig = validatePersonalizationConfig;
// Utility functions
const calculateExamScore = (answers, questions) => {
    let totalScore = 0;
    let maxScore = 0;
    questions.forEach(question => {
        const answer = answers.find(a => a.questionId === question.questionId);
        const questionPoints = (0, exports.getQuestionPoints)(question.difficulty);
        maxScore += questionPoints;
        if (answer && answer.isCorrect) {
            totalScore += answer.points || questionPoints;
        }
    });
    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
};
exports.calculateExamScore = calculateExamScore;
const getQuestionPoints = (difficulty) => {
    switch (difficulty) {
        case QuestionDifficulty.EASY:
            return 1;
        case QuestionDifficulty.MEDIUM:
            return 2;
        case QuestionDifficulty.HARD:
            return 3;
        default:
            return 1;
    }
};
exports.getQuestionPoints = getQuestionPoints;
const generateLearningPath = (result) => {
    const analytics = result.analytics;
    const weakAreas = [];
    const strengthAreas = [];
    const recommendedTopics = [];
    // تحلیل نقاط ضعف و قوت
    Object.entries(analytics.categoryBreakdown).forEach(([category, stats]) => {
        if (stats.percentage < 60) {
            weakAreas.push(category);
            recommendedTopics.push(`مرور مجدد ${category}`);
        }
        else if (stats.percentage > 80) {
            strengthAreas.push(category);
        }
    });
    // تحلیل سختی سوالات
    Object.entries(analytics.difficultyBreakdown).forEach(([difficulty, stats]) => {
        if (stats.percentage < 50) {
            recommendedTopics.push(`تمرین بیشتر سوالات ${difficulty === 'easy' ? 'آسان' : difficulty === 'medium' ? 'متوسط' : 'سخت'}`);
        }
    });
    const nextSteps = [
        'مرور مجدد موضوعات ضعیف',
        'حل تمرین‌های بیشتر',
        'مطالعه منابع اضافی',
        'شرکت در آزمون‌های مشابه'
    ];
    const progressPercentage = Math.min(100, result.percentage + 10);
    const milestones = [
        {
            id: '1',
            title: 'تکمیل اولین آزمون',
            description: 'شرکت در اولین آزمون تستی',
            completed: true,
            completedAt: new Date()
        },
        {
            id: '2',
            title: 'کسب حداقل 70% نمره',
            description: 'رسیدن به حد قبولی',
            completed: result.percentage >= 70,
            completedAt: result.percentage >= 70 ? new Date() : undefined
        },
        {
            id: '3',
            title: 'کسب 90% نمره',
            description: 'رسیدن به سطح عالی',
            completed: result.percentage >= 90,
            completedAt: result.percentage >= 90 ? new Date() : undefined
        }
    ];
    return {
        recommendedTopics,
        weakAreas,
        strengthAreas,
        nextSteps,
        progressPercentage,
        milestones
    };
};
exports.generateLearningPath = generateLearningPath;
const formatExamDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
        return `${hours} ساعت و ${minutes} دقیقه`;
    }
    if (minutes > 0) {
        return `${minutes} دقیقه و ${remainingSeconds} ثانیه`;
    }
    return `${remainingSeconds} ثانیه`;
};
exports.formatExamDuration = formatExamDuration;
const getStatusLabel = (status) => {
    switch (status) {
        case TestExamStatus.DRAFT:
            return 'پیش‌نویس';
        case TestExamStatus.ACTIVE:
            return 'فعال';
        case TestExamStatus.COMPLETED:
            return 'تکمیل شده';
        case TestExamStatus.CANCELLED:
            return 'لغو شده';
        default:
            return 'نامشخص';
    }
};
exports.getStatusLabel = getStatusLabel;
const getTypeLabel = (type) => {
    switch (type) {
        case TestExamType.PRACTICE:
            return 'تمرینی';
        case TestExamType.OFFICIAL:
            return 'رسمی';
        case TestExamType.TIMED:
            return 'زمان‌دار';
        case TestExamType.CUSTOM:
            return 'سفارشی';
        default:
            return 'نامشخص';
    }
};
exports.getTypeLabel = getTypeLabel;
const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
        case QuestionDifficulty.EASY:
            return 'آسان';
        case QuestionDifficulty.MEDIUM:
            return 'متوسط';
        case QuestionDifficulty.HARD:
            return 'سخت';
        default:
            return 'نامشخص';
    }
};
exports.getDifficultyLabel = getDifficultyLabel;
//# sourceMappingURL=test-exam.js.map