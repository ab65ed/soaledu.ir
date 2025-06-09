/**
 * Ticket model
 *
 * This file defines the Ticket schema for MongoDB.
 * Tickets are used for the support system.
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

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

// Interface for Ticket document
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

  // Methods
  addResponse(userId: mongoose.Types.ObjectId, message: string): Promise<ITicket>;
  updateStatus(status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<ITicket>;
  assignTo(userId: mongoose.Types.ObjectId): Promise<ITicket>;
  escalate(): Promise<ITicket>;
}

// Interface for Ticket model with static methods
export interface ITicketModel extends Model<ITicket> {
  findTicketsForEscalation(): Promise<ITicket[]>;
}

const TicketSchema = new Schema<ITicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
      maxlength: [100, 'Subject cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ['technical', 'billing', 'exam-issues', 'other'],
        message: 'Category must be either: technical, billing, exam-issues, or other',
      },
      required: [true, 'Please provide a category'],
      default: 'other',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in-progress', 'resolved', 'closed'],
        message: 'Status must be either: open, in-progress, resolved, or closed',
      },
      default: 'open',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be either: low, medium, or high',
      },
      default: 'low',
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        mimetype: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    escalated: {
      type: Boolean,
      default: false,
    },
    lastEscalated: {
      type: Date,
    },
    responses: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

TicketSchema.methods.addResponse = function (this: ITicket, userId: mongoose.Types.ObjectId, message: string): Promise<ITicket> {
  this.responses.push({
    user: userId,
    message,
    createdAt: new Date() // Ensure createdAt is set here if not defaulted in sub-schema
  });
  return this.save();
};

TicketSchema.methods.updateStatus = function (this: ITicket, status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<ITicket> {
  this.status = status;
  return this.save();
};

TicketSchema.methods.assignTo = function (this: ITicket, userId: mongoose.Types.ObjectId): Promise<ITicket> {
  this.assignedTo = userId;
  if (this.status === 'open') {
    this.status = 'in-progress';
  }
  return this.save();
};

TicketSchema.methods.escalate = function (this: ITicket): Promise<ITicket> {
  this.escalated = true;
  this.lastEscalated = new Date();
  this.priority = 'high';
  return this.save();
};

TicketSchema.statics.findTicketsForEscalation = function (this: ITicketModel): Promise<ITicket[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.find({
    priority: 'high',
    status: { $in: ['open', 'in-progress'] },
    escalated: false,
    createdAt: { $lte: twentyFourHoursAgo }
  }).exec();
};

export default mongoose.model<ITicket, ITicketModel>('Ticket', TicketSchema); 