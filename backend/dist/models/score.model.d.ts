/**
 * Score model
 *
 * This model represents the final score and results of an exam attempt
 */
import { Document, Types, Model } from 'mongoose';
export interface IScore extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    exam: Types.ObjectId;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    totalPoints: number;
    earnedPoints: number;
    negativePoints: number;
    bonusPoints: number;
    percentage: number;
    grade: string;
    isPassed: boolean;
    timeStarted: Date;
    timeCompleted: Date;
    timeTaken: number;
    timeAllowed: number;
    attemptNumber: number;
    isCompleted: boolean;
    isAutoSubmitted: boolean;
    tabSwitches: number;
    suspiciousActivity: string[];
    violations: number;
    questionScores: {
        question: Types.ObjectId;
        isCorrect: boolean;
        pointsEarned: number;
        timeSpent: number;
        selectedOption?: number;
        isSkipped: boolean;
    }[];
    difficultyBreakdown: {
        easy: {
            total: number;
            correct: number;
            points: number;
        };
        medium: {
            total: number;
            correct: number;
            points: number;
        };
        hard: {
            total: number;
            correct: number;
            points: number;
        };
    };
    categoryBreakdown: {
        category: string;
        total: number;
        correct: number;
        points: number;
    }[];
    examVersion: number;
    deviceInfo?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IScoreModel extends Model<IScore> {
    getExamStatistics(examId: string): Promise<any>;
    getUserBestScore(userId: string, examId: string): Promise<IScore | null>;
    calculateScore(examId: string, userId: string): Promise<{
        correctCount: number;
        incorrectCount: number;
        unansweredCount: number;
        totalScore: number;
        percentage: number;
        totalQuestions: number;
    }>;
}
declare const Score: IScoreModel;
export default Score;
