"use strict";
/**
 * ExamConfig model
 *
 * This model represents configuration settings for exams
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
const examConfigSchema = new mongoose_1.Schema({
    exam: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Exam',
        required: [true, 'Exam reference is required'],
        unique: true,
        index: true,
    },
    // Time settings
    timeLimit: {
        type: Number,
        required: [true, 'Time limit is required'],
        min: [1, 'Time limit must be at least 1 minute'],
        max: [480, 'Time limit cannot exceed 8 hours'],
    },
    timeWarnings: {
        type: [Number],
        default: [30, 15, 5], // warnings at 30, 15, and 5 minutes
        validate: {
            validator: function (warnings) {
                return warnings.every(w => w > 0 && w < this.timeLimit);
            },
            message: 'Warning times must be positive and less than time limit'
        }
    },
    autoSubmit: {
        type: Boolean,
        default: true,
    },
    // Question settings
    shuffleQuestions: {
        type: Boolean,
        default: false,
    },
    shuffleOptions: {
        type: Boolean,
        default: false,
    },
    questionsPerPage: {
        type: Number,
        default: 1,
        min: [1, 'Questions per page must be at least 1'],
        max: [50, 'Questions per page cannot exceed 50'],
    },
    allowReview: {
        type: Boolean,
        default: true,
    },
    showQuestionNumbers: {
        type: Boolean,
        default: true,
    },
    // Navigation settings
    allowBackward: {
        type: Boolean,
        default: true,
    },
    allowForward: {
        type: Boolean,
        default: true,
    },
    showProgress: {
        type: Boolean,
        default: true,
    },
    // Security settings
    lockdownBrowser: {
        type: Boolean,
        default: false,
    },
    preventCopyPaste: {
        type: Boolean,
        default: true,
    },
    preventRightClick: {
        type: Boolean,
        default: true,
    },
    preventScreenshots: {
        type: Boolean,
        default: true,
    },
    tabSwitchLimit: {
        type: Number,
        default: 3,
        min: [0, 'Tab switch limit cannot be negative'],
        max: [10, 'Tab switch limit cannot exceed 10'],
    },
    // Scoring settings
    negativeMarking: {
        type: Boolean,
        default: false,
    },
    negativeMarkingValue: {
        type: Number,
        default: 0.25,
        min: [0, 'Negative marking value cannot be negative'],
        max: [1, 'Negative marking value cannot exceed 1'],
    },
    partialMarking: {
        type: Boolean,
        default: false,
    },
    passingScore: {
        type: Number,
        default: 60,
        min: [0, 'Passing score cannot be negative'],
        max: [100, 'Passing score cannot exceed 100'],
    },
    // Display settings
    showResults: {
        type: Boolean,
        default: true,
    },
    showCorrectAnswers: {
        type: Boolean,
        default: false,
    },
    showExplanations: {
        type: Boolean,
        default: false,
    },
    showScore: {
        type: Boolean,
        default: true,
    },
    // Attempts settings
    maxAttempts: {
        type: Number,
        default: 1,
        min: [1, 'Max attempts must be at least 1'],
        max: [10, 'Max attempts cannot exceed 10'],
    },
    retakeDelay: {
        type: Number,
        default: 0, // hours
        min: [0, 'Retake delay cannot be negative'],
        max: [720, 'Retake delay cannot exceed 30 days'],
    },
    // Proctoring settings
    requireCamera: {
        type: Boolean,
        default: false,
    },
    requireMicrophone: {
        type: Boolean,
        default: false,
    },
    faceDetection: {
        type: Boolean,
        default: false,
    },
    voiceDetection: {
        type: Boolean,
        default: false,
    },
    // Miscellaneous
    instructions: {
        type: String,
        maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
        default: '',
    },
    welcomeMessage: {
        type: String,
        maxlength: [500, 'Welcome message cannot exceed 500 characters'],
        default: '',
    },
    completionMessage: {
        type: String,
        maxlength: [500, 'Completion message cannot exceed 500 characters'],
        default: '',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Instance methods
examConfigSchema.methods.toSafeObject = function () {
    const config = this.toObject();
    return {
        id: config._id,
        exam: config.exam,
        timeLimit: config.timeLimit,
        timeWarnings: config.timeWarnings,
        autoSubmit: config.autoSubmit,
        shuffleQuestions: config.shuffleQuestions,
        shuffleOptions: config.shuffleOptions,
        questionsPerPage: config.questionsPerPage,
        allowReview: config.allowReview,
        showQuestionNumbers: config.showQuestionNumbers,
        allowBackward: config.allowBackward,
        allowForward: config.allowForward,
        showProgress: config.showProgress,
        negativeMarking: config.negativeMarking,
        negativeMarkingValue: config.negativeMarkingValue,
        partialMarking: config.partialMarking,
        passingScore: config.passingScore,
        showResults: config.showResults,
        showCorrectAnswers: config.showCorrectAnswers,
        showExplanations: config.showExplanations,
        showScore: config.showScore,
        maxAttempts: config.maxAttempts,
        retakeDelay: config.retakeDelay,
        instructions: config.instructions,
        welcomeMessage: config.welcomeMessage,
        completionMessage: config.completionMessage,
    };
};
// Static methods
examConfigSchema.statics.getDefaultConfig = function () {
    return {
        timeLimit: 60,
        timeWarnings: [30, 15, 5],
        autoSubmit: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        questionsPerPage: 1,
        allowReview: true,
        showQuestionNumbers: true,
        allowBackward: true,
        allowForward: true,
        showProgress: true,
        lockdownBrowser: false,
        preventCopyPaste: true,
        preventRightClick: true,
        preventScreenshots: true,
        tabSwitchLimit: 3,
        negativeMarking: false,
        negativeMarkingValue: 0.25,
        partialMarking: false,
        passingScore: 60,
        showResults: true,
        showCorrectAnswers: false,
        showExplanations: false,
        showScore: true,
        maxAttempts: 1,
        retakeDelay: 0,
        requireCamera: false,
        requireMicrophone: false,
        faceDetection: false,
        voiceDetection: false,
        instructions: '',
        welcomeMessage: '',
        completionMessage: '',
    };
};
const ExamConfig = mongoose_1.default.model('ExamConfig', examConfigSchema);
exports.default = ExamConfig;
//# sourceMappingURL=examConfig.model.js.map