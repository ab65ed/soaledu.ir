"use strict";
/**
 * Category model
 *
 * This file defines the Category schema for MongoDB.
 * Categories represent educational groups (e.g., "Science", "Engineering").
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
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    level: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
    },
    path: {
        type: String,
        trim: true,
    },
    icon: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: '#547792',
    },
    thumbnail: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    questionCount: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide creator'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
CategorySchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});
CategorySchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});
CategorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
    justOne: false,
});
CategorySchema.index({ name: 1, parent: 1 }, { unique: true });
CategorySchema.index({ parent: 1, level: 1, sortOrder: 1 });
CategorySchema.index({ path: 1 });
CategorySchema.pre('save', async function (next) {
    if (this.isModified('name') || this.isModified('parent')) {
        await this.generatePath();
    }
    next();
});
CategorySchema.methods.generatePath = async function () {
    if (!this.parent) {
        this.path = this.name.toLowerCase().replace(/\s+/g, '-');
        this.level = 0;
    }
    else {
        const parentDoc = await mongoose_1.default.model('Category').findById(this.parent);
        if (parentDoc) {
            this.path = `${parentDoc.path}/${this.name.toLowerCase().replace(/\s+/g, '-')}`;
            this.level = parentDoc.level + 1;
        }
    }
};
CategorySchema.methods.getFullTree = async function () {
    const ancestors = [];
    let current = this;
    while (current && current.parent) {
        current = await mongoose_1.default.model('Category').findById(current.parent);
        if (current) {
            ancestors.unshift(current);
        }
    }
    return ancestors;
};
CategorySchema.statics.getCategoryTree = function (parentId = null) {
    return this.find({ parent: parentId, isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .populate('children').exec();
};
CategorySchema.statics.getFlatHierarchy = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $lookup: {
                from: 'categories',
                localField: 'parent',
                foreignField: '_id',
                as: 'parentInfo'
            }
        },
        {
            $addFields: {
                parentName: { $arrayElemAt: ['$parentInfo.name', 0] },
                fullPath: '$path'
            }
        },
        { $sort: { level: 1, sortOrder: 1, name: 1 } }
    ]).exec();
};
CategorySchema.statics.updateQuestionCounts = async function () {
    const Question = mongoose_1.default.model('Question'); // Assuming IQuestionModel is available
    const counts = await Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).exec();
    await this.updateMany({}, { $set: { questionCount: 0 } }).exec();
    for (const item of counts) {
        if (item._id) {
            await this.findByIdAndUpdate(item._id, { $set: { questionCount: item.count } }).exec();
        }
    }
};
CategorySchema.methods.getBreadcrumb = async function () {
    const breadcrumb = [];
    let current = this;
    while (current) {
        breadcrumb.unshift({
            _id: current._id,
            name: current.name,
            path: current.path
        });
        if (current.parent) {
            current = await mongoose_1.default.model('Category').findById(current.parent);
        }
        else {
            current = null;
        }
    }
    return breadcrumb;
};
exports.default = mongoose_1.default.model('Category', CategorySchema);
//# sourceMappingURL=category.model.js.map