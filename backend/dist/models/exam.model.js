"use strict";
/**
 * Exam model
 *
 * This file defines the Exam schema for MongoDB.
 * Exams contain 30 questions and are generated based on ExamConfig settings.
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       required:
 *         - user
 *         - questions
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         user:
 *           type: string
 *           description: Reference to User taking the exam
 *         title:
 *           type: string
 *           description: Exam title
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Question references (exactly 30)
 *         category:
 *           type: string
 *           description: Reference to Category
 *         lesson:
 *           type: string
 *           description: Reference to Lesson (optional)
 *         hasNegativeMarking:
 *           type: boolean
 *           description: Whether incorrect answers reduce score
 *         timerOption:
 *           type: string
 *           enum: ['50s', '70s', 'none']
 *           description: Time limit per question
 *         duration:
 *           type: number
 *           description: Total exam duration in seconds (based on timerOption)
 *         cost:
 *           type: number
 *           description: Cost to take this exam
 *         startedAt:
 *           type: string
 *           format: date-time
 *           description: When the exam was started
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When the exam was completed
 *         status:
 *           type: string
 *           enum: [created, started, completed, expired]
 *           description: Current exam status
 *         thumbnail:
 *           type: string
 *           description: URL to exam thumbnail image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const ExamSchema = new mongoose_1.Schema({
    // Creator of the exam (admin)
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a creator'],
    },
    // User taking the exam (for exam instances)
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please provide exam title'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    questions: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
        required: [true, 'Please provide questions'],
        validate: {
            validator: function (questions) {
                return questions.length >= 5 && questions.length <= 100;
            },
            message: 'Exam must have between 5 and 100 questions',
        },
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
    },
    lesson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lesson',
    },
    difficulty: {
        type: String,
        enum: {
            values: ['Easy', 'Medium', 'Hard'],
            message: 'Difficulty must be either: Easy, Medium, or Hard',
        },
        default: 'Medium',
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please provide exam duration'],
        min: [5, 'Duration must be at least 5 minutes'],
        max: [180, 'Duration cannot exceed 180 minutes'],
    },
    hasNegativeMarking: {
        type: Boolean,
        default: false,
    },
    negativeMarkingValue: {
        type: Number,
        default: 0.25, // 0.25 points deducted for wrong answer
        min: [0, 'Negative marking value cannot be negative'],
        max: [1, 'Negative marking value cannot exceed 1'],
    },
    passingScore: {
        type: Number,
        default: 60, // 60% to pass
        min: [0, 'Passing score cannot be negative'],
        max: [100, 'Passing score cannot exceed 100'],
    },
    // Scheduling fields
    isScheduled: {
        type: Boolean,
        default: false,
    },
    scheduledStartDate: {
        type: Date,
    },
    scheduledEndDate: {
        type: Date,
    },
    timezone: {
        type: String,
        default: 'Asia/Tehran',
    },
    // Exam instance fields (when user takes exam)
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'scheduled', 'active', 'completed', 'expired', 'archived'],
            message: 'Status must be either: draft, published, scheduled, active, completed, expired, or archived',
        },
        default: 'draft',
    },
    // Settings
    allowReview: {
        type: Boolean,
        default: true,
    },
    showResults: {
        type: Boolean,
        default: true,
    },
    shuffleQuestions: {
        type: Boolean,
        default: false,
    },
    shuffleOptions: {
        type: Boolean,
        default: false,
    },
    // Metadata
    thumbnail: {
        type: String,
        default: null,
    },
    tags: [String],
    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Database indexes for performance optimization
ExamSchema.index({ creator: 1, status: 1, createdAt: -1 }); // Creator's exams by status and date
ExamSchema.index({ user: 1, status: 1, startedAt: -1 }, { sparse: true }); // User's exam attempts
ExamSchema.index({ status: 1, isPublic: 1, createdAt: -1 }); // Public published exams
ExamSchema.index({ category: 1, status: 1, isPublic: 1 }, { sparse: true }); // Category-based searches
ExamSchema.index({ lesson: 1, status: 1 }, { sparse: true }); // Lesson-based exams
ExamSchema.index({ difficulty: 1, status: 1 }); // Filter by difficulty
ExamSchema.index({ tags: 1 }); // Search by tags
ExamSchema.index({ title: 'text', description: 'text' }); // Full-text search
ExamSchema.index({
    scheduledStartDate: 1,
    scheduledEndDate: 1,
    isScheduled: 1,
    status: 1
}, { sparse: true }); // Scheduled exams
ExamSchema.index({
    startedAt: 1,
    duration: 1,
    status: 1
}, { sparse: true }); // Active exam time tracking
ExamSchema.index({ completedAt: -1, status: 1 }, { sparse: true }); // Completed exams by date
ExamSchema.index({ isPublic: 1, status: 1, createdAt: -1 }); // Public exam listings
// Virtual for answers to this exam
ExamSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'exam',
    justOne: false,
});
// Virtual for score of this exam
ExamSchema.virtual('score', {
    ref: 'Score',
    localField: '_id',
    foreignField: 'exam',
    justOne: true,
});
// Method to publish the exam
ExamSchema.methods.publish = function () {
    this.status = 'published';
    return this.save();
};
// Method to schedule the exam
ExamSchema.methods.schedule = function (startDate, endDate) {
    this.status = 'scheduled';
    this.isScheduled = true;
    this.scheduledStartDate = startDate;
    this.scheduledEndDate = endDate;
    return this.save();
};
// Method to start the exam (for user taking exam)
ExamSchema.methods.start = function () {
    this.status = 'active';
    this.startedAt = new Date();
    return this.save();
};
// Method to complete the exam
ExamSchema.methods.complete = function () {
    this.status = 'completed';
    this.completedAt = new Date();
    return this.save();
};
// Method to expire the exam
ExamSchema.methods.expire = function () {
    this.status = 'expired';
    this.completedAt = new Date();
    return this.save();
};
// Method to archive the exam
ExamSchema.methods.archive = function () {
    this.status = 'archived';
    return this.save();
};
// Method to check if exam is timed out
ExamSchema.methods.isTimedOut = function () {
    if (!this.duration || !this.startedAt) {
        return false;
    }
    const now = new Date();
    const elapsedMinutes = (now.getTime() - this.startedAt.getTime()) / (1000 * 60);
    return elapsedMinutes > this.duration;
};
// Method to check if exam is available for taking
ExamSchema.methods.isAvailable = function () {
    const now = new Date();
    // Check if exam is published or scheduled
    if (this.status !== 'published' && this.status !== 'scheduled') {
        return false;
    }
    // Check scheduling constraints
    if (this.isScheduled) {
        if (this.scheduledStartDate && now < this.scheduledStartDate) {
            return false; // Not yet started
        }
        if (this.scheduledEndDate && now > this.scheduledEndDate) {
            return false; // Already ended
        }
    }
    return true;
};
// Method to get remaining time in minutes
ExamSchema.methods.getRemainingTime = function () {
    if (!this.duration || !this.startedAt) {
        return null;
    }
    const now = new Date();
    const elapsedMinutes = (now.getTime() - this.startedAt.getTime()) / (1000 * 60);
    const remainingMinutes = this.duration - elapsedMinutes;
    return Math.max(0, Math.ceil(remainingMinutes));
};
// Static method to find available exams
ExamSchema.statics.findAvailableExams = function (filters = {}) {
    const now = new Date();
    const query = {
        $or: [
            { status: 'published', isScheduled: false },
            {
                status: 'scheduled',
                isScheduled: true,
                scheduledStartDate: { $lte: now },
                scheduledEndDate: { $gte: now },
            },
        ],
        ...filters,
    };
    return this.find(query);
};
exports.default = mongoose_1.default.model('Exam', ExamSchema);
//# sourceMappingURL=exam.model.js.map