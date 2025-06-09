/**
 * Answer model
 *
 * This model represents an answer submitted by a user for a question in an exam
 */
import mongoose, { Document, Types } from 'mongoose';
export interface IAnswer extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    exam: Types.ObjectId;
    question: Types.ObjectId;
    selectedOption: number;
    isCorrect: boolean;
    submittedAt: Date;
    timeSpent?: number;
    isChanged: boolean;
    changeCount: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Answer: mongoose.Model<IAnswer, {}, {}, {}, mongoose.Document<unknown, {}, IAnswer, {}> & IAnswer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Answer;
