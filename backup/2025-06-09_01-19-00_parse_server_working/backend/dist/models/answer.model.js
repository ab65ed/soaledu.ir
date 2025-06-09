"use strict";
/**
 * Answer model
 *
 * This model represents an answer submitted by a user for a question in an exam
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
const answerSchema = new mongoose_1.Schema({
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
    question: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'Question is required'],
        index: true,
    },
    selectedOption: {
        type: Number,
        required: [true, 'Selected option is required'],
        min: [0, 'Selected option must be at least 0'],
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    timeSpent: {
        type: Number,
        min: [0, 'Time spent cannot be negative'],
    },
    isChanged: {
        type: Boolean,
        default: false,
    },
    changeCount: {
        type: Number,
        default: 0,
        min: [0, 'Change count cannot be negative'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Compound index to ensure one answer per user per question per exam
answerSchema.index({ user: 1, exam: 1, question: 1 }, { unique: true });
// Index for querying answers by exam
answerSchema.index({ exam: 1, user: 1 });
// Index for analytics queries
answerSchema.index({ exam: 1, isCorrect: 1 });
// Pre-save middleware to track changes
answerSchema.pre('save', function (next) {
    if (this.isModified('selectedOption') && !this.isNew) {
        this.isChanged = true;
        this.changeCount += 1;
    }
    next();
});
// Instance methods
answerSchema.methods.toSafeObject = function () {
    const answer = this.toObject();
    return {
        id: answer._id,
        question: answer.question,
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect,
        submittedAt: answer.submittedAt,
        timeSpent: answer.timeSpent,
        isChanged: answer.isChanged,
        changeCount: answer.changeCount,
    };
};
// Static methods
answerSchema.statics.getExamAnswers = function (examId, userId) {
    return this.find({ exam: examId, user: userId })
        .populate('question', 'text options correctOptions points')
        .sort({ submittedAt: 1 });
};
answerSchema.statics.getExamStatistics = function (examId) {
    return this.aggregate([
        { $match: { exam: new mongoose_1.default.Types.ObjectId(examId) } },
        {
            $group: {
                _id: '$question',
                totalAnswers: { $sum: 1 },
                correctAnswers: { $sum: { $cond: ['$isCorrect', 1, 0] } },
                averageTimeSpent: { $avg: '$timeSpent' },
                optionDistribution: {
                    $push: '$selectedOption'
                }
            }
        },
        {
            $lookup: {
                from: 'questions',
                localField: '_id',
                foreignField: '_id',
                as: 'question'
            }
        },
        { $unwind: '$question' },
        {
            $project: {
                questionText: '$question.text',
                totalAnswers: 1,
                correctAnswers: 1,
                correctPercentage: {
                    $multiply: [
                        { $divide: ['$correctAnswers', '$totalAnswers'] },
                        100
                    ]
                },
                averageTimeSpent: 1,
                optionDistribution: 1
            }
        }
    ]);
};
const Answer = mongoose_1.default.model('Answer', answerSchema);
exports.default = Answer;
//# sourceMappingURL=answer.model.js.map