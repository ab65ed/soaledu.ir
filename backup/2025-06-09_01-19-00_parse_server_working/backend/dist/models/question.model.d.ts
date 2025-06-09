/**
 * Question model
 *
 * This file defines the Question schema for MongoDB.
 */
import mongoose, { Document, Model } from 'mongoose';
interface IQuestionAnalytics {
    usageCount: number;
    correctAnswers: number;
    totalAttempts: number;
    averageResponseTime: number;
    lastUsed?: Date;
}
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
    checkAnswer(userAnswer: number | number[] | string): boolean;
    getForDisplay(): Partial<IQuestion>;
    recordUsage(isCorrect: boolean, responseTime?: number): Promise<IQuestion>;
    getSuccessRate(): number;
    getSuggestedDifficulty(): 'Easy' | 'Medium' | 'Hard';
}
export interface IQuestionModel extends Model<IQuestion> {
    findByCriteria(criteria?: any): Promise<IQuestion[]>;
    getRandomQuestions(count: number, criteria?: any): Promise<IQuestion[]>;
    getAnalyticsSummary(criteria?: any): Promise<any[]>;
    advancedSearch(searchParams: any): Promise<{
        questions: IQuestion[];
        total: number;
        pages: number;
    }>;
}
declare const _default: IQuestionModel;
export default _default;
