/**
 * Ticket model
 *
 * This file defines the Ticket schema for MongoDB.
 * Tickets are used for the support system.
 */
import mongoose, { Document, Model } from 'mongoose';
interface IAttachment {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    uploadedAt: Date;
}
interface ITicketResponse {
    user: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
}
export interface ITicket extends Document {
    user: mongoose.Types.ObjectId;
    subject: string;
    message: string;
    category: 'technical' | 'billing' | 'exam-issues' | 'other';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    attachments: IAttachment[];
    assignedTo?: mongoose.Types.ObjectId;
    escalated: boolean;
    lastEscalated?: Date;
    responses: ITicketResponse[];
    createdAt: Date;
    updatedAt: Date;
    addResponse(userId: mongoose.Types.ObjectId, message: string): Promise<ITicket>;
    updateStatus(status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<ITicket>;
    assignTo(userId: mongoose.Types.ObjectId): Promise<ITicket>;
    escalate(): Promise<ITicket>;
}
export interface ITicketModel extends Model<ITicket> {
    findTicketsForEscalation(): Promise<ITicket[]>;
}
declare const _default: ITicketModel;
export default _default;
