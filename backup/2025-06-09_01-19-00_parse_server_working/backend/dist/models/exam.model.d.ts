/**
 * Exam model
 *
 * This file defines the Exam schema for MongoDB.
 * Exams contain 30 questions and are generated based on ExamConfig settings.
 */
import mongoose, { Document, Model } from 'mongoose';
export interface IExam extends Document {
    creator: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    questions: mongoose.Types.ObjectId[];
    category?: mongoose.Types.ObjectId;
    lesson?: mongoose.Types.ObjectId;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: number;
    hasNegativeMarking: boolean;
    negativeMarkingValue: number;
    passingScore: number;
    isScheduled: boolean;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    timezone: string;
    startedAt?: Date;
    completedAt?: Date;
    status: 'draft' | 'published' | 'scheduled' | 'active' | 'completed' | 'expired' | 'archived';
    allowReview: boolean;
    showResults: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    thumbnail?: string;
    tags: string[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    publish(): Promise<IExam>;
    schedule(startDate: Date, endDate: Date): Promise<IExam>;
    start(): Promise<IExam>;
    complete(): Promise<IExam>;
    expire(): Promise<IExam>;
    archive(): Promise<IExam>;
    isTimedOut(): boolean;
    isAvailable(): boolean;
    getRemainingTime(): number | null;
}
export interface IExamModel extends Model<IExam> {
    findAvailableExams(filters?: any): Promise<IExam[]>;
}
declare const _default: IExamModel;
export default _default;
