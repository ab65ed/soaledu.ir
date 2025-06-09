/**
 * Answer model
 * 
 * This model represents an answer submitted by a user for a question in an exam
 */

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnswer extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  exam: Types.ObjectId;
  question: Types.ObjectId;
  selectedOption: number;
  isCorrect: boolean;
  submittedAt: Date;
  timeSpent?: number; // seconds spent on this question
  isChanged: boolean; // whether the answer was changed after initial submission
  changeCount: number; // number of times the answer was changed
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
      index: true,
    },
    question: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to ensure one answer per user per question per exam
answerSchema.index({ user: 1, exam: 1, question: 1 }, { unique: true });

// Index for querying answers by exam
answerSchema.index({ exam: 1, user: 1 });

// Index for analytics queries
answerSchema.index({ exam: 1, isCorrect: 1 });

// Pre-save middleware to track changes
answerSchema.pre('save', function(next) {
  if (this.isModified('selectedOption') && !this.isNew) {
    this.isChanged = true;
    this.changeCount += 1;
  }
  next();
});

// Instance methods
answerSchema.methods.toSafeObject = function() {
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
answerSchema.statics.getExamAnswers = function(examId: string, userId: string) {
  return this.find({ exam: examId, user: userId })
    .populate('question', 'text options correctOptions points')
    .sort({ submittedAt: 1 });
};

answerSchema.statics.getExamStatistics = function(examId: string) {
  return this.aggregate([
    { $match: { exam: new mongoose.Types.ObjectId(examId) } },
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

const Answer = mongoose.model<IAnswer>('Answer', answerSchema);

export default Answer; 