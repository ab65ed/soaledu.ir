import mongoose, { Schema, Model } from 'mongoose';
import { IExamResult, Answer, ResultAnalytics, ResultMetadata, SuspiciousActivity } from '../types/index';

const answerSchema = new Schema<Answer>({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: Schema.Types.Mixed, // Can be string, number, or array for multiple choice
    required: true
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // Time spent on this question in seconds
    default: 0
  },
  points: {
    type: Number,
    default: 0
  }
}, { _id: false });

const resultSchema = new Schema<IExamResult>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
    index: true
  },

  // Exam attempt details
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Total time taken in seconds
    required: true
  },

  // Scoring
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  incorrectAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  unansweredQuestions: {
    type: Number,
    default: 0,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // Detailed answers
  answers: [answerSchema],

  // Status and metadata
  status: {
    type: String,
    enum: ['completed', 'abandoned', 'timeout'],
    default: 'completed'
  },
  isPassed: {
    type: Boolean,
    required: true
  },
  passingScore: {
    type: Number,
    required: true
  },

  // Analytics data
  analytics: {
    averageTimePerQuestion: {
      type: Number,
      default: 0
    },
    fastestQuestion: {
      questionId: Schema.Types.ObjectId,
      timeSpent: Number
    },
    slowestQuestion: {
      questionId: Schema.Types.ObjectId,
      timeSpent: Number
    },
    categoryPerformance: [{
      category: String,
      correct: Number,
      total: Number,
      percentage: Number
    }],
    difficultyPerformance: [{
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      },
      correct: Number,
      total: Number,
      percentage: Number
    }]
  },

  // Additional metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: {
      type: String,
      enum: ['desktop', 'tablet', 'mobile'],
      default: 'desktop'
    },
    browserInfo: {
      name: String,
      version: String
    }
  },

  // Flags
  isReviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // Cheating detection
  suspiciousActivity: {
    tabSwitches: {
      type: Number,
      default: 0
    },
    copyPasteAttempts: {
      type: Number,
      default: 0
    },
    rightClickAttempts: {
      type: Number,
      default: 0
    },
    unusualPatterns: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
resultSchema.index({ user: 1, exam: 1 }, { unique: true }); // Prevent duplicate results
resultSchema.index({ exam: 1, completedAt: -1 }); // Exam analytics queries
resultSchema.index({ user: 1, completedAt: -1 }); // User history queries
resultSchema.index({ percentage: -1 }); // Leaderboard queries
resultSchema.index({ 'analytics.categoryPerformance.category': 1 }); // Category analytics
resultSchema.index({ status: 1, completedAt: -1 }); // Status-based queries
resultSchema.index({ isPassed: 1, exam: 1 }); // Pass rate analytics

// Virtual for grade calculation
resultSchema.virtual('grade').get(function(this: IExamResult): string {
  if (this.percentage >= 90) return 'A';
  if (this.percentage >= 80) return 'B';
  if (this.percentage >= 70) return 'C';
  if (this.percentage >= 60) return 'D';
  return 'F';
});

// Virtual for performance level
resultSchema.virtual('performanceLevel').get(function(this: IExamResult): string {
  if (this.percentage >= 90) return 'excellent';
  if (this.percentage >= 80) return 'good';
  if (this.percentage >= 70) return 'average';
  if (this.percentage >= 60) return 'below_average';
  return 'poor';
});

// Pre-save middleware to calculate analytics
resultSchema.pre('save', function(this: IExamResult, next) {
  if (this.isNew || this.isModified('answers')) {
    this.calculateAnalytics();
  }
  next();
});

// Method to calculate analytics
resultSchema.methods.calculateAnalytics = function(this: IExamResult): void {
  if (!this.answers || this.answers.length === 0) return;

  // Calculate average time per question
  const totalTime = this.answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0);
  this.analytics.averageTimePerQuestion = totalTime / this.answers.length;

  // Find fastest and slowest questions
  const sortedByTime = [...this.answers].sort((a, b) => a.timeSpent - b.timeSpent);
  this.analytics.fastestQuestion = {
    questionId: sortedByTime[0].questionId,
    timeSpent: sortedByTime[0].timeSpent
  };
  this.analytics.slowestQuestion = {
    questionId: sortedByTime[sortedByTime.length - 1].questionId,
    timeSpent: sortedByTime[sortedByTime.length - 1].timeSpent
  };
};

// Interface for user statistics
interface UserStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  passedExams: number;
}

// Interface for exam statistics
interface ExamStats {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageDuration: number;
}

// Interface for score distribution
interface ScoreDistribution {
  _id: number | string;
  count: number;
  averageScore: number;
}

// Static method to get user statistics
resultSchema.statics.getUserStats = async function(userId: string): Promise<UserStats> {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        bestScore: { $max: '$percentage' },
        totalTimeSpent: { $sum: '$duration' },
        passedExams: {
          $sum: { $cond: ['$isPassed', 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    passedExams: 0
  };
};

// Static method to get exam statistics
resultSchema.statics.getExamStats = async function(examId: string): Promise<ExamStats> {
  const stats = await this.aggregate([
    { $match: { exam: new mongoose.Types.ObjectId(examId) } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        passRate: {
          $avg: { $cond: ['$isPassed', 1, 0] }
        },
        averageDuration: { $avg: '$duration' }
      }
    }
  ]);

  return stats[0] || {
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    averageDuration: 0
  };
};

// Static method to get score distribution
resultSchema.statics.getScoreDistribution = async function(examId: string): Promise<ScoreDistribution[]> {
  return await this.aggregate([
    { $match: { exam: new mongoose.Types.ObjectId(examId) } },
    {
      $bucket: {
        groupBy: '$percentage',
        boundaries: [0, 20, 40, 60, 80, 100],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          averageScore: { $avg: '$percentage' }
        }
      }
    }
  ]);
};

// Extend the model interface with static methods
interface IResultModel extends Model<IExamResult> {
  getUserStats(userId: string): Promise<UserStats>;
  getExamStats(examId: string): Promise<ExamStats>;
  getScoreDistribution(examId: string): Promise<ScoreDistribution[]>;
}

export default mongoose.model<IExamResult, IResultModel>('Result', resultSchema); 