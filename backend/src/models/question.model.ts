/**
 * Question model
 *
 * This file defines the Question schema for MongoDB.
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Question Analytics
interface IQuestionAnalytics {
  usageCount: number;
  correctAnswers: number;
  totalAttempts: number;
  averageResponseTime: number; // in seconds
  lastUsed?: Date;
}

// Interface for Question document
export interface IQuestion extends Document {
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  text: string;
  options?: string[];
  correctOptions?: number[];
  correctAnswer?: string;
  allowMultipleCorrect: boolean;
  category: mongoose.Types.ObjectId;
  lesson?: mongoose.Types.ObjectId;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  explanation?: string;
  tags: string[];
  thumbnail?: string;
  isActive: boolean;
  analytics: IQuestionAnalytics;
  createdBy: mongoose.Types.ObjectId;
  source: 'manual' | 'import' | 'generated';
  version: number;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  checkAnswer(userAnswer: number | number[] | string): boolean;
  getForDisplay(): Partial<IQuestion>;
  recordUsage(isCorrect: boolean, responseTime?: number): Promise<IQuestion>;
  getSuccessRate(): number;
  getSuggestedDifficulty(): 'Easy' | 'Medium' | 'Hard';
}

// Interface for Question model with static methods
export interface IQuestionModel extends Model<IQuestion> {
  findByCriteria(criteria?: any): Promise<IQuestion[]>;
  getRandomQuestions(count: number, criteria?: any): Promise<IQuestion[]>;
  getAnalyticsSummary(criteria?: any): Promise<any[]>; // Define a more specific type if possible
  advancedSearch(searchParams: any): Promise<{ questions: IQuestion[], total: number, pages: number }>; // Define a more specific type for searchParams and result
}

const QuestionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: {
        values: ['multiple-choice', 'true-false', 'short-answer'],
        message: 'Question type must be either: multiple-choice, true-false, or short-answer',
      },
      required: [true, 'Please provide question type'],
      default: 'multiple-choice',
    },
    text: {
      type: String,
      required: [true, 'Please provide question text'],
      trim: true,
      minlength: [10, 'Question text must be at least 10 characters'],
      maxlength: [1000, 'Question text cannot exceed 1000 characters'],
    },
    options: {
      type: [String],
      validate: {
        validator: function (this: IQuestion, options: string[]) {
          if (this.type === 'multiple-choice') {
            return options && options.length >= 2 && options.length <= 4;
          } else if (this.type === 'true-false') {
            return options && options.length === 2;
          } else if (this.type === 'short-answer') {
            return !options || options.length === 0;
          }
          return true;
        },
        message: 'Options validation failed based on question type',
      },
    },
    correctOptions: {
      type: [Number],
      validate: {
        validator: function (this: IQuestion, correctOptions: number[]) {
          if (this.type === 'multiple-choice') {
            return correctOptions && correctOptions.length >= 1 &&
                   correctOptions.every(idx => idx >= 0 && idx < (this.options?.length || 0));
          } else if (this.type === 'true-false') {
            return correctOptions && correctOptions.length === 1 &&
                   correctOptions[0] >= 0 && correctOptions[0] < 2;
          } else if (this.type === 'short-answer') {
            return !correctOptions || correctOptions.length === 0;
          }
          return true;
        },
        message: 'Correct options validation failed based on question type',
      },
    },
    correctAnswer: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: IQuestion, correctAnswer: string) {
          if (this.type === 'short-answer') {
            return correctAnswer && correctAnswer.length > 0;
          }
          return true;
        },
        message: 'Correct answer is required for short-answer questions',
      },
    },
    allowMultipleCorrect: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    lesson: {
      type: Schema.Types.ObjectId,
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
    points: {
      type: Number,
      default: 1,
      min: [0.1, 'Points must be at least 0.1'],
      max: [10, 'Points cannot exceed 10'],
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: [500, 'Explanation cannot exceed 500 characters'],
    },
    tags: [String],
    thumbnail: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    analytics: {
      usageCount: {
        type: Number,
        default: 0,
      },
      correctAnswers: {
        type: Number,
        default: 0,
      },
      totalAttempts: {
        type: Number,
        default: 0,
      },
      averageResponseTime: {
        type: Number, // in seconds
        default: 0,
      },
      lastUsed: {
        type: Date,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator'],
    },
    source: {
      type: String,
      enum: ['manual', 'import', 'generated'],
      default: 'manual',
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Database indexes for performance optimization
QuestionSchema.index({ category: 1, isActive: 1 }); // Most common query pattern
QuestionSchema.index({ lesson: 1, isActive: 1 }, { sparse: true }); // Sparse for optional lesson
QuestionSchema.index({ difficulty: 1, isActive: 1 }); // Filter by difficulty and active status
QuestionSchema.index({ type: 1, isActive: 1 }); // Filter by question type
QuestionSchema.index({ tags: 1 }); // Search by tags
QuestionSchema.index({ createdBy: 1, createdAt: -1 }); // User's questions, sorted by creation date
QuestionSchema.index({ text: 'text' }); // Full-text search on question text
QuestionSchema.index({ 'analytics.usageCount': -1 }); // Most used questions
QuestionSchema.index({ 'analytics.lastUsed': -1 }, { sparse: true }); // Recently used questions
QuestionSchema.index({ source: 1, createdAt: -1 }); // Filter by source and creation date
QuestionSchema.index({ category: 1, difficulty: 1, type: 1, isActive: 1 }); // Compound index for complex queries
QuestionSchema.index({ version: 1, _id: 1 }); // Version control and unique identification

QuestionSchema.pre('save', async function (this: IQuestion, next: (error?: mongoose.Error) => void) {
  if (this.lesson) {
    const Lesson = mongoose.model('Lesson'); // Consider defining ILesson and importing
    const lesson = await Lesson.findById(this.lesson) as any; // Add proper type for lesson

    if (!lesson) {
      return next(new Error('Lesson not found'));
    }

    if (!lesson.category.equals(this.category)) {
      return next(new Error('Lesson does not belong to the selected category'));
    }
  }

  if (this.type === 'true-false' && (!this.options || this.options.length === 0)) {
    this.options = ['درست', 'غلط'];
  }

  if (this.type === 'multiple-choice' && this.allowMultipleCorrect) {
    if (!this.correctOptions || this.correctOptions.length < 2) {
      return next(new Error('Multiple correct questions must have at least 2 correct options'));
    }
  }

  next();
});

QuestionSchema.methods.checkAnswer = function (this: IQuestion, userAnswer: number | number[] | string): boolean {
  if (this.type === 'multiple-choice' || this.type === 'true-false') {
    if (Array.isArray(userAnswer)) {
      return userAnswer.length === (this.correctOptions?.length || 0) &&
             userAnswer.every(ans => this.correctOptions?.includes(ans as number));
    } else {
      return this.correctOptions?.includes(userAnswer as number) || false;
    }
  } else if (this.type === 'short-answer') {
    return (this.correctAnswer?.toLowerCase().trim() ===
           (userAnswer as string).toLowerCase().trim()) || false;
  }
  return false;
};

QuestionSchema.methods.getForDisplay = function (this: IQuestion): Partial<IQuestion> {
  const question = this.toObject() as Partial<IQuestion>;
  delete question.correctOptions;
  delete question.correctAnswer;
  return question;
};

QuestionSchema.statics.findByCriteria = function (this: IQuestionModel, criteria: any = {}): Promise<IQuestion[]> {
  const query = { isActive: true, ...criteria };
  return this.find(query).exec();
};

QuestionSchema.statics.getRandomQuestions = function (this: IQuestionModel, count: number, criteria: any = {}): Promise<IQuestion[]> {
  const query = { isActive: true, ...criteria };
  return this.aggregate([
    { $match: query },
    { $sample: { size: count } }
  ]).exec();
};

QuestionSchema.methods.recordUsage = function (this: IQuestion, isCorrect: boolean, responseTime?: number): Promise<IQuestion> {
  this.analytics.usageCount += 1;
  this.analytics.totalAttempts += 1;
  this.analytics.lastUsed = new Date();

  if (isCorrect) {
    this.analytics.correctAnswers += 1;
  }

  if (responseTime) {
    const currentAvg = this.analytics.averageResponseTime || 0;
    const totalTime = currentAvg * (this.analytics.totalAttempts - 1) + responseTime;
    this.analytics.averageResponseTime = totalTime / this.analytics.totalAttempts;
  }
  return this.save();
};

QuestionSchema.methods.getSuccessRate = function (this: IQuestion): number {
  if (this.analytics.totalAttempts === 0) return 0;
  return (this.analytics.correctAnswers / this.analytics.totalAttempts) * 100;
};

QuestionSchema.methods.getSuggestedDifficulty = function (this: IQuestion): 'Easy' | 'Medium' | 'Hard' {
  const successRate = this.getSuccessRate();
  if (successRate >= 80) return 'Easy';
  if (successRate >= 60) return 'Medium';
  return 'Hard';
};

QuestionSchema.statics.getAnalyticsSummary = function (this: IQuestionModel, criteria: any = {}): Promise<any[]> {
  const query = { isActive: true, ...criteria };
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        totalUsage: { $sum: '$analytics.usageCount' },
        totalAttempts: { $sum: '$analytics.totalAttempts' },
        totalCorrectAnswers: { $sum: '$analytics.correctAnswers' },
        averageSuccessRate: {
          $avg: {
            $cond: [
              { $eq: ['$analytics.totalAttempts', 0] },
              0,
              { $multiply: [{ $divide: ['$analytics.correctAnswers', '$analytics.totalAttempts'] }, 100] }
            ]
          }
        },
        averageResponseTime: { $avg: '$analytics.averageResponseTime' },
        difficultyDistribution: {
          $push: '$difficulty'
        }
      }
    }
  ]).exec();
};

interface AdvancedSearchParams {
  keyword?: string;
  category?: string | mongoose.Types.ObjectId;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  type?: 'multiple-choice' | 'true-false' | 'short-answer';
  createdBy?: string | mongoose.Types.ObjectId;
  minSuccessRate?: number;
  maxSuccessRate?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

QuestionSchema.statics.advancedSearch = async function (this: IQuestionModel, searchParams: AdvancedSearchParams): Promise<{ questions: IQuestion[], total: number, pages: number }> {
  const {
    keyword,
    category,
    difficulty,
    tags,
    type,
    createdBy,
    minSuccessRate,
    maxSuccessRate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = searchParams;

  const query: any = { isActive: true };

  if (keyword) {
    query.$or = [
      { text: { $regex: keyword, $options: 'i' } },
      { explanation: { $regex: keyword, $options: 'i' } }
    ];
  }
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (type) query.type = type;
  if (createdBy) query.createdBy = createdBy;
  if (tags && tags.length > 0) query.tags = { $in: tags };

  const skip = (Number(page) - 1) * Number(limit);
  const sortOptions: any = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const pipeline: mongoose.PipelineStage[] = [
    { $match: query },
    {
      $addFields: {
        successRate: {
          $cond: [
            { $eq: ['$analytics.totalAttempts', 0] },
            0,
            { $multiply: [{ $divide: ['$analytics.correctAnswers', '$analytics.totalAttempts'] }, 100] }
          ]
        }
      }
    }
  ];

  if (minSuccessRate !== undefined || maxSuccessRate !== undefined) {
    const successRateFilter: any = {};
    if (minSuccessRate !== undefined) successRateFilter.$gte = minSuccessRate;
    if (maxSuccessRate !== undefined) successRateFilter.$lte = maxSuccessRate;
    pipeline.push({ $match: { successRate: successRateFilter } });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];
  const dataPipeline = [
    ...pipeline,
    { $sort: sortOptions },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryObj' // Use a different name to avoid conflict
      }
    },
    { $unwind: { path: '$categoryObj', preserveNullAndEmptyArrays: true } }, // Handle if category is not found
    {
      $lookup: {
        from: 'lessons',
        localField: 'lesson',
        foreignField: '_id',
        as: 'lessonObj'
      }
    },
    { $unwind: { path: '$lessonObj', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdByUser'
      }
    },
    { $unwind: { path: '$createdByUser', preserveNullAndEmptyArrays: true } },
    {
      $project: { // Select and reshape fields as needed
        text: 1, type: 1, options: 1, difficulty: 1, points: 1, explanation: 1, tags: 1, thumbnail: 1, isActive: 1,
        analytics: 1, source: 1, version: 1, createdAt: 1, updatedAt: 1, successRate: 1,
        category: '$categoryObj',
        lesson: '$lessonObj',
        createdBy: '$createdByUser'
      }
    }
  ];

  const [totalResults, questions] = await Promise.all([
    this.aggregate(countPipeline).exec(),
    this.aggregate(dataPipeline).exec() as Promise<IQuestion[]>
  ]);

  const total = totalResults.length > 0 ? totalResults[0].total : 0;
  const pages = Math.ceil(total / Number(limit));

  return { questions, total, pages };
};

export default mongoose.model<IQuestion, IQuestionModel>('Question', QuestionSchema); 