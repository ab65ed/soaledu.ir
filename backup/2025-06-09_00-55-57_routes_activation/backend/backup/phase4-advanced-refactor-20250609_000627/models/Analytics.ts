/**
 * Analytics Model
 * 
 * Handles analytics data storage and aggregation for comprehensive reporting
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IExam } from './exam.model'; // Assuming IExam interface exists or will be created
import { IUser } from './user.model'; // Assuming IUser interface exists
import { ITicket } from './ticket.model'; // Assuming ITicket interface exists
import { IQuestion } from './question.model'; // Assuming IQuestion interface exists
// import { ITransaction } from './transaction.model'; // Assuming ITransaction interface exists

// Define an interface for the Transaction model if not already available
// This is a placeholder, adjust based on your actual Transaction model
interface ITransaction extends Document {
  createdAt: Date;
  status: string;
  amount: number;
  // Add other fields from your Transaction model
}

// Define an interface for Analytics data structure (flexible based on metricType)
interface IAnalyticsData {
  [key: string]: any; // Allows for various data structures
}

// Define the Analytics document interface
export interface IAnalytics extends Document {
  metricType: 'exam_performance' | 'user_engagement' | 'payment_metrics' | 'ticket_statistics' | 'question_analytics' | 'daily_summary' | 'weekly_summary' | 'monthly_summary';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: Date;
  endDate: Date;
  data: IAnalyticsData;
  metadata: {
    totalRecords?: number;
    calculatedAt?: Date;
    version?: string;
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Analytics model interface with static methods
export interface IAnalyticsModel extends Model<IAnalytics> {
  getExamPerformanceAnalytics(startDate: Date | string, endDate: Date | string): Promise<any>;
  getUserEngagementAnalytics(startDate: Date | string, endDate: Date | string): Promise<any>;
  getPaymentMetrics(startDate: Date | string, endDate: Date | string): Promise<any>;
  getTicketStatistics(startDate: Date | string, endDate: Date | string): Promise<any>;
  getQuestionAnalytics(startDate: Date | string, endDate: Date | string): Promise<any>;
  getDashboardAnalytics(startDate: Date | string, endDate: Date | string): Promise<any>;
  cacheAnalytics(metricType: string, period: string, startDate: Date | string, endDate: Date | string, data: any): Promise<IAnalytics>;
  getCachedAnalytics(metricType: string, period: string, startDate: Date | string, endDate: Date | string, maxAge?: number): Promise<IAnalyticsData | null>;
}

// Analytics Schema
const AnalyticsSchema: Schema<IAnalytics> = new Schema(
  {
    metricType: {
      type: String,
      required: [true, 'Metric type is required'],
      enum: [
        'exam_performance',
        'user_engagement',
        'payment_metrics',
        'ticket_statistics',
        'question_analytics',
        'daily_summary',
        'weekly_summary',
        'monthly_summary',
      ],
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    data: {
      type: Schema.Types.Mixed,
      required: [true, 'Analytics data is required'],
    },
    metadata: {
      totalRecords: {
        type: Number,
        default: 0,
      },
      calculatedAt: {
        type: Date,
        default: Date.now,
      },
      version: {
        type: String,
        default: '1.0',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'analytics',
  }
);

// Indexes
AnalyticsSchema.index({ metricType: 1, period: 1, startDate: 1, endDate: 1 });
AnalyticsSchema.index({ metricType: 1, startDate: -1 });
AnalyticsSchema.index({ calculatedAt: -1 });

// Static methods implementation
AnalyticsSchema.statics.getExamPerformanceAnalytics = async function(startDate: Date | string, endDate: Date | string): Promise<any> {
  const Exam = mongoose.model<IExam>('Exam'); // Ensure Exam model is registered
  // const User = mongoose.model<IUser>('User'); // Not used in this specific method
  
  const pipeline: any[] = [
    {
      $match: {
        status: 'completed',
        completedAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalExams: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        averageTimeSpent: { $avg: '$timeSpent' },
        completionRate: { $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        passRate: { $avg: { $cond: [{ $gte: ['$score', '$passingScore'] }, 1, 0] } },
        scoreDistribution: {
          $push: {
            score: '$score',
            category: '$category',
            difficulty: '$difficulty'
          }
        }
      }
    }
  ];
  
  const result = await Exam.aggregate(pipeline).exec();
  return result[0] || {};
};

AnalyticsSchema.statics.getUserEngagementAnalytics = async function(startDate: Date | string, endDate: Date | string): Promise<any> {
  const User = mongoose.model<IUser>('User');
  
  const pipeline: any[] = [
    {
      $match: {
        lastLogin: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' }
        },
        activeUsers: { $sum: 1 },
        newUsers: {
          $sum: {
            $cond: [
              {
                $gte: ['$createdAt', new Date(startDate)]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];
  
  const dailyEngagement = await User.aggregate(pipeline).exec();
  
  const totalUsers = await User.countDocuments({
    createdAt: { $lte: new Date(endDate) }
  }).exec();
  
  const activeUsersCount = await User.countDocuments({
    lastLogin: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).exec();
  
  return {
    dailyEngagement,
    totalUsers,
    activeUsers: activeUsersCount,
    engagementRate: totalUsers > 0 ? (activeUsersCount / totalUsers) * 100 : 0
  };
};

AnalyticsSchema.statics.getPaymentMetrics = async function(startDate: Date | string, endDate: Date | string): Promise<any> {
  // Assuming Transaction model is registered elsewhere, or define/import it here
  const Transaction = mongoose.model<ITransaction>('Transaction'); 
  
  const pipeline: any[] = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' }
      }
    }
  ];
  
  const statusMetrics = await Transaction.aggregate(pipeline).exec();
  
  const totalTransactions = statusMetrics.reduce((sum, item) => sum + item.count, 0);
  const successfulTransactions = statusMetrics.find(item => item._id === 'completed')?.count || 0;
  const failedTransactions = statusMetrics.find(item => item._id === 'failed')?.count || 0;
  const refundedTransactions = statusMetrics.find(item => item._id === 'refunded')?.count || 0;
  
  const totalRevenue = statusMetrics.find(item => item._id === 'completed')?.totalAmount || 0;
  const refundedAmount = statusMetrics.find(item => item._id === 'refunded')?.totalAmount || 0;
  
  return {
    totalTransactions,
    successfulTransactions,
    failedTransactions,
    refundedTransactions,
    successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
    failureRate: totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0,
    refundRate: totalTransactions > 0 ? (refundedTransactions / totalTransactions) * 100 : 0,
    totalRevenue,
    refundedAmount,
    netRevenue: totalRevenue - refundedAmount,
    averageTransactionValue: successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0
  };
};

AnalyticsSchema.statics.getTicketStatistics = async function(startDate: Date | string, endDate: Date | string): Promise<any> {
  const Ticket = mongoose.model<ITicket>('Ticket');
  
  const pipeline: any[] = [
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          status: '$status',
          priority: '$priority',
          // Ensure category field exists on Ticket model or remove/adjust
          // category: '$category' 
        },
        count: { $sum: 1 },
        averageResolutionTime: {
          $avg: {
            $cond: [
              { $eq: ['$status', 'resolved'] },
              // Ensure resolvedAt and createdAt exist and are Dates
              { $subtract: ['$resolvedAt', '$createdAt'] }, 
              null
            ]
          }
        }
      }
    }
  ];
  
  const ticketMetrics = await Ticket.aggregate(pipeline).exec();
  
  const totalTickets = await Ticket.countDocuments({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).exec();
  
  const resolvedTickets = await Ticket.countDocuments({
    status: 'resolved',
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).exec();
  
  const escalatedTickets = await Ticket.countDocuments({
    isEscalated: true, // Ensure isEscalated exists on Ticket model
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).exec();
  
  return {
    totalTickets,
    resolvedTickets,
    escalatedTickets,
    resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0,
    escalationRate: totalTickets > 0 ? (escalatedTickets / totalTickets) * 100 : 0,
    ticketMetrics
  };
};

AnalyticsSchema.statics.getQuestionAnalytics = async function(startDate: Date | string, endDate: Date | string): Promise<any> {
  const Question = mongoose.model<IQuestion>('Question');
  
  const pipeline: any[] = [
    {
      $match: {
        isActive: true,
        // Ensure analytics.lastUsed exists and is a Date
        'analytics.lastUsed': { 
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          difficulty: '$difficulty',
          type: '$type',
          category: '$category'
        },
        totalQuestions: { $sum: 1 },
        totalUsage: { $sum: '$analytics.usageCount' },
        totalAttempts: { $sum: '$analytics.totalAttempts' },
        totalCorrectAnswers: { $sum: '$analytics.correctAnswers' },
        averageResponseTime: { $avg: '$analytics.averageResponseTime' },
        averageSuccessRate: {
          $avg: {
            $cond: [
              { $gt: ['$analytics.totalAttempts', 0] },
              { $multiply: [{ $divide: ['$analytics.correctAnswers', '$analytics.totalAttempts'] }, 100] },
              0
            ]
          }
        }
      }
    }
  ];
  
  const questionMetrics = await Question.aggregate(pipeline).exec();
  
  return {
    questionMetrics,
    totalActiveQuestions: await Question.countDocuments({ isActive: true }).exec(),
    totalUsedQuestions: await Question.countDocuments({
      isActive: true,
      'analytics.usageCount': { $gt: 0 }
    }).exec()
  };
};

AnalyticsSchema.statics.getDashboardAnalytics = async function(this: IAnalyticsModel, startDate: Date | string, endDate: Date | string): Promise<any> {
  const [
    examPerformance,
    userEngagement,
    paymentMetrics,
    ticketStatistics,
    questionAnalytics
  ] = await Promise.all([
    this.getExamPerformanceAnalytics(startDate, endDate),
    this.getUserEngagementAnalytics(startDate, endDate),
    this.getPaymentMetrics(startDate, endDate),
    this.getTicketStatistics(startDate, endDate),
    this.getQuestionAnalytics(startDate, endDate)
  ]);
  
  return {
    examPerformance,
    userEngagement,
    paymentMetrics,
    ticketStatistics,
    questionAnalytics,
    generatedAt: new Date(),
    period: { startDate: new Date(startDate), endDate: new Date(endDate) }
  };
};

AnalyticsSchema.statics.cacheAnalytics = async function(
  this: IAnalyticsModel, // Add this to correctly type 'this'
  metricType: string, 
  period: string, 
  startDate: Date | string, 
  endDate: Date | string, 
  data: any
): Promise<IAnalytics> {
  const existingAnalytics = await this.findOne({
    metricType,
    period,
    startDate: new Date(startDate),
    endDate: new Date(endDate)
  });
  
  if (existingAnalytics) {
    existingAnalytics.data = data;
    if (existingAnalytics.metadata) {
      existingAnalytics.metadata.calculatedAt = new Date();
      existingAnalytics.metadata.totalRecords = Array.isArray(data) ? data.length : 1;
    } else {
      existingAnalytics.metadata = { calculatedAt: new Date(), totalRecords: Array.isArray(data) ? data.length : 1 };
    }
    return await existingAnalytics.save();
  } else {
    return await this.create({
      metricType,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data,
      metadata: {
        calculatedAt: new Date(),
        totalRecords: Array.isArray(data) ? data.length : 1
      }
    });
  }
};

AnalyticsSchema.statics.getCachedAnalytics = async function(
  this: IAnalyticsModel,
  metricType: string, 
  period: string, 
  startDate: Date | string, 
  endDate: Date | string, 
  maxAge: number = 30 * 60 * 1000
): Promise<IAnalyticsData | null> {
  const analytics = await this.findOne({
    metricType,
    period,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    isActive: true,
    'metadata.calculatedAt': {
      $gte: new Date(Date.now() - maxAge)
    }
  }).exec();
  
  return analytics?.data || null;
};

const Analytics: IAnalyticsModel = mongoose.model<IAnalytics, IAnalyticsModel>('Analytics', AnalyticsSchema);

export default Analytics; 