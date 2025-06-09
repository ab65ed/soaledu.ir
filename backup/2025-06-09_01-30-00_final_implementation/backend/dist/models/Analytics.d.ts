/**
 * Analytics Model
 *
 * Handles analytics data storage and aggregation for comprehensive reporting
 */
import { Document, Model } from 'mongoose';
interface IAnalyticsData {
    [key: string]: any;
}
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
declare const Analytics: IAnalyticsModel;
export default Analytics;
