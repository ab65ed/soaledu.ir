"use strict";
/**
 * Ticket model
 *
 * This file defines the Ticket schema for MongoDB.
 * Tickets are used for the support system.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TicketSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
TicketSchema.methods.addResponse = function (userId, message) {
    this.responses.push({
        user: userId,
        message,
        createdAt: new Date() // Ensure createdAt is set here if not defaulted in sub-schema
    });
    return this.save();
};
TicketSchema.methods.updateStatus = function (status) {
    this.status = status;
    return this.save();
};
TicketSchema.methods.assignTo = function (userId) {
    this.assignedTo = userId;
    if (this.status === 'open') {
        this.status = 'in-progress';
    }
    return this.save();
};
TicketSchema.methods.escalate = function () {
    this.escalated = true;
    this.lastEscalated = new Date();
    this.priority = 'high';
    return this.save();
};
TicketSchema.statics.findTicketsForEscalation = function () {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.find({
        priority: 'high',
        status: { $in: ['open', 'in-progress'] },
        escalated: false,
        createdAt: { $lte: twentyFourHoursAgo }
    }).exec();
};
exports.default = mongoose_1.default.model('Ticket', TicketSchema);
//# sourceMappingURL=ticket.model.js.map