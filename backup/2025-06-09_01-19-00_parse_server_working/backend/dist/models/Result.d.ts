import { Model } from 'mongoose';
import { IExamResult } from '../types/index';
interface UserStats {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
    passedExams: number;
}
interface ExamStats {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    averageDuration: number;
}
interface ScoreDistribution {
    _id: number | string;
    count: number;
    averageScore: number;
}
interface IResultModel extends Model<IExamResult> {
    getUserStats(userId: string): Promise<UserStats>;
    getExamStats(examId: string): Promise<ExamStats>;
    getScoreDistribution(examId: string): Promise<ScoreDistribution[]>;
}
declare const _default: IResultModel;
export default _default;
