/**
 * ExamConfig model
 *
 * This model represents configuration settings for exams
 */
import mongoose, { Document, Types } from 'mongoose';
export interface IExamConfig extends Document {
    _id: Types.ObjectId;
    exam: Types.ObjectId;
    timeLimit: number;
    timeWarnings: number[];
    autoSubmit: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    questionsPerPage: number;
    allowReview: boolean;
    showQuestionNumbers: boolean;
    allowBackward: boolean;
    allowForward: boolean;
    showProgress: boolean;
    lockdownBrowser: boolean;
    preventCopyPaste: boolean;
    preventRightClick: boolean;
    preventScreenshots: boolean;
    tabSwitchLimit: number;
    negativeMarking: boolean;
    negativeMarkingValue: number;
    partialMarking: boolean;
    passingScore: number;
    showResults: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    showScore: boolean;
    maxAttempts: number;
    retakeDelay: number;
    requireCamera: boolean;
    requireMicrophone: boolean;
    faceDetection: boolean;
    voiceDetection: boolean;
    instructions: string;
    welcomeMessage: string;
    completionMessage: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExamConfig: mongoose.Model<IExamConfig, {}, {}, {}, mongoose.Document<unknown, {}, IExamConfig, {}> & IExamConfig & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExamConfig;
