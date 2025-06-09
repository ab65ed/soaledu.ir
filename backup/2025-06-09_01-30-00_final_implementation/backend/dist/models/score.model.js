"use strict";
/**
 * Score model
 *
 * This model represents the final score and results of an exam attempt
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const scoreSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    },
    exam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam is required'],
        index: true,
    },
    // Score details
    totalQuestions: {
        type: Number,
        required: [true, 'Total questions is required'],
        min: [1, 'Total questions must be at least 1'],
    },
    answeredQuestions: {
        type: Number,
        required: [true, 'Answered questions is required'],
        min: [0, 'Answered questions cannot be negative'],
    },
    correctAnswers: {
        type: Number,
        required: [true, 'Correct answers is required'],
        min: [0, 'Correct answers cannot be negative'],
    },
    incorrectAnswers: {
        type: Number,
        required: [true, 'Incorrect answers is required'],
        min: [0, 'Incorrect answers cannot be negative'],
    },
    skippedQuestions: {
        type: Number,
        default: 0,
        min: [0, 'Skipped questions cannot be negative'],
    },
    // Points and scoring
    totalPoints: {
        type: Number,
        required: [true, 'Total points is required'],
        min: [0, 'Total points cannot be negative'],
    },
    earnedPoints: {
        type: Number,
        required: [true, 'Earned points is required'],
        min: [0, 'Earned points cannot be negative'],
    },
    negativePoints: {
        type: Number,
        default: 0,
        min: [0, 'Negative points cannot be negative'],
    },
    bonusPoints: {
        type: Number,
        default: 0,
        min: [0, 'Bonus points cannot be negative'],
    },
    // Percentage and grades
    percentage: {
        type: Number,
        required: [true, 'Percentage is required'],
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100'],
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'],
        default: 'F',
    },
    isPassed: {
        type: Boolean,
        default: false,
    },
    // Time tracking
    timeStarted: {
        type: Date,
        required: [true, 'Start time is required'],
    },
    timeCompleted: {
        type: Date,
        required: [true, 'Completion time is required'],
    },
    timeTaken: {
        type: Number,
        required: [true, 'Time taken is required'],
        min: [0, 'Time taken cannot be negative'],
    },
    timeAllowed: {
        type: Number,
        required: [true, 'Time allowed is required'],
        min: [0, 'Time allowed cannot be negative'],
    },
    // Attempt information
    attemptNumber: {
        type: Number,
        required: [true, 'Attempt number is required'],
        min: [1, 'Attempt number must be at least 1'],
    },
    isCompleted: {
        type: Boolean,
        default: true,
    },
    isAutoSubmitted: {
        type: Boolean,
        default: false,
    },
    // Security and integrity
    tabSwitches: {
        type: Number,
        default: 0,
        min: [0, 'Tab switches cannot be negative'],
    },
    suspiciousActivity: {
        type: [String],
        default: [],
    },
    violations: {
        type: Number,
        default: 0,
        min: [0, 'Violations cannot be negative'],
    },
    // Question-wise breakdown
    questionScores: [{
            question: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Question',
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            },
            pointsEarned: {
                type: Number,
                required: true,
                min: 0,
            },
            timeSpent: {
                type: Number,
                required: true,
                min: 0,
            },
            selectedOption: {
                type: Number,
                min: 0,
            },
            isSkipped: {
                type: Boolean,
                default: false,
            },
        }],
    // Analytics data
    difficultyBreakdown: {
        easy: {
            total: { type: Number, default: 0, min: 0 },
            correct: { type: Number, default: 0, min: 0 },
            points: { type: Number, default: 0, min: 0 },
        },
        medium: {
            total: { type: Number, default: 0, min: 0 },
            correct: { type: Number, default: 0, min: 0 },
            points: { type: Number, default: 0, min: 0 },
        },
        hard: {
            total: { type: Number, default: 0, min: 0 },
            correct: { type: Number, default: 0, min: 0 },
            points: { type: Number, default: 0, min: 0 },
        },
    },
    categoryBreakdown: [{
            category: {
                type: String,
                required: true,
            },
            total: {
                type: Number,
                required: true,
                min: 0,
            },
            correct: {
                type: Number,
                required: true,
                min: 0,
            },
            points: {
                type: Number,
                required: true,
                min: 0,
            },
        }],
    // Additional metadata
    examVersion: {
        type: Number,
        default: 1,
        min: [1, 'Exam version must be at least 1'],
    },
    deviceInfo: {
        type: String,
        maxlength: [500, 'Device info cannot exceed 500 characters'],
    },
    ipAddress: {
        type: String,
        validate: {
            validator: function (ip) {
                if (!ip)
                    return true; // Optional field
                // Basic IP validation (IPv4 and IPv6)
                const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
                const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                return ipv4Regex.test(ip) || ipv6Regex.test(ip);
            },
            message: 'Invalid IP address format'
        }
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Compound indexes for efficient querying
scoreSchema.index({ user: 1, exam: 1, attemptNumber: 1 }, { unique: true });
scoreSchema.index({ exam: 1, createdAt: -1 });
scoreSchema.index({ user: 1, createdAt: -1 });
scoreSchema.index({ exam: 1, percentage: -1 });
scoreSchema.index({ isPassed: 1, createdAt: -1 });
// Virtual for final score calculation
scoreSchema.virtual('finalScore').get(function () {
    return Math.max(0, this.earnedPoints - this.negativePoints + this.bonusPoints);
});
// Virtual for accuracy percentage
scoreSchema.virtual('accuracy').get(function () {
    if (this.answeredQuestions === 0)
        return 0;
    return (this.correctAnswers / this.answeredQuestions) * 100;
});
// Virtual for completion percentage
scoreSchema.virtual('completionRate').get(function () {
    return (this.answeredQuestions / this.totalQuestions) * 100;
});
// Pre-save middleware to calculate derived fields
scoreSchema.pre('save', function (next) {
    // Calculate skipped questions
    this.skippedQuestions = this.totalQuestions - this.answeredQuestions;
    // Calculate final score
    const finalScore = Math.max(0, this.earnedPoints - this.negativePoints + this.bonusPoints);
    // Calculate percentage
    if (this.totalPoints > 0) {
        this.percentage = (finalScore / this.totalPoints) * 100;
    }
    // Determine grade based on percentage
    if (this.percentage >= 97)
        this.grade = 'A+';
    else if (this.percentage >= 93)
        this.grade = 'A';
    else if (this.percentage >= 90)
        this.grade = 'A-';
    else if (this.percentage >= 87)
        this.grade = 'B+';
    else if (this.percentage >= 83)
        this.grade = 'B';
    else if (this.percentage >= 80)
        this.grade = 'B-';
    else if (this.percentage >= 77)
        this.grade = 'C+';
    else if (this.percentage >= 73)
        this.grade = 'C';
    else if (this.percentage >= 70)
        this.grade = 'C-';
    else if (this.percentage >= 67)
        this.grade = 'D+';
    else if (this.percentage >= 60)
        this.grade = 'D';
    else
        this.grade = 'F';
    next();
});
// Instance methods
scoreSchema.methods.toSafeObject = function () {
    const score = this.toObject();
    return {
        id: score._id,
        exam: score.exam,
        totalQuestions: score.totalQuestions,
        answeredQuestions: score.answeredQuestions,
        correctAnswers: score.correctAnswers,
        incorrectAnswers: score.incorrectAnswers,
        skippedQuestions: score.skippedQuestions,
        totalPoints: score.totalPoints,
        earnedPoints: score.earnedPoints,
        finalScore: score.finalScore,
        percentage: score.percentage,
        grade: score.grade,
        isPassed: score.isPassed,
        timeTaken: score.timeTaken,
        timeAllowed: score.timeAllowed,
        attemptNumber: score.attemptNumber,
        isCompleted: score.isCompleted,
        accuracy: score.accuracy,
        completionRate: score.completionRate,
        createdAt: score.createdAt,
    };
};
// Static methods
scoreSchema.statics.getExamStatistics = function (examId) {
    return this.aggregate([
        { $match: { exam: new mongoose_1.default.Types.ObjectId(examId), isCompleted: true } },
        {
            $group: {
                _id: null,
                totalAttempts: { $sum: 1 },
                averageScore: { $avg: '$percentage' },
                highestScore: { $max: '$percentage' },
                lowestScore: { $min: '$percentage' },
                passedCount: { $sum: { $cond: ['$isPassed', 1, 0] } },
                averageTime: { $avg: '$timeTaken' },
                grades: { $push: '$grade' }
            }
        }
    ]);
};
scoreSchema.statics.getUserBestScore = function (userId, examId) {
    return this.findOne({
        user: userId,
        exam: examId,
        isCompleted: true
    }).sort({ percentage: -1, attemptNumber: 1 });
};
scoreSchema.statics.calculateScore = async function (examId, userId) {
    // Get all answers for this exam and user
    const Answer = mongoose_1.default.model('Answer');
    const Question = mongoose_1.default.model('Question');
    const answers = await Answer.find({ exam: examId, user: userId }).populate('question');
    const exam = await mongoose_1.default.model('Exam').findById(examId);
    if (!exam) {
        throw new Error('Exam not found');
    }
    let correctCount = 0;
    let incorrectCount = 0;
    let totalScore = 0;
    const totalQuestions = exam.questions.length;
    // Calculate scores
    for (const answer of answers) {
        if (answer.isCorrect) {
            correctCount++;
            totalScore += answer.question.points || 1;
        }
        else {
            incorrectCount++;
            if (exam.hasNegativeMarking) {
                totalScore -= (exam.negativeMarkingValue || 0.25) * (answer.question.points || 1);
            }
        }
    }
    const unansweredCount = totalQuestions - answers.length;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    return {
        correctCount,
        incorrectCount,
        unansweredCount,
        totalScore: Math.max(0, totalScore),
        percentage,
        totalQuestions
    };
};
const Score = mongoose_1.default.model('Score', scoreSchema);
exports.default = Score;
//# sourceMappingURL=score.model.js.map