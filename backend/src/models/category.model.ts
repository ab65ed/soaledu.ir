/**
 * Category model
 *
 * This file defines the Category schema for MongoDB.
 * Categories represent educational groups (e.g., "Science", "Engineering").
 */

import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Category document
export interface ICategory extends Document {
  name: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | null;
  level: number;
  path?: string;
  icon?: string;
  color: string;
  thumbnail?: string;
  isActive: boolean;
  sortOrder: number;
  questionCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  generatePath(): Promise<void>;
  getFullTree(): Promise<ICategory[]>; 
  getBreadcrumb(): Promise<{ _id: mongoose.Types.ObjectId; name: string; path?: string }[]>;
}

// Interface for Category model with static methods
export interface ICategoryModel extends Model<ICategory> {
  getCategoryTree(parentId?: mongoose.Types.ObjectId | null): Promise<ICategory[]>;
  getFlatHierarchy(): Promise<any[]>; // Define a more specific type if possible
  updateQuestionCounts(): Promise<void>;
}

const CategorySchema = new Schema<ICategory>(
  {
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
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide creator'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

// Database indexes for performance optimization
CategorySchema.index({ name: 1, parent: 1 }, { unique: true }); // Unique name per parent
CategorySchema.index({ parent: 1, level: 1, sortOrder: 1 }); // Hierarchical queries
CategorySchema.index({ path: 1 }, { unique: true, sparse: true }); // Unique paths
CategorySchema.index({ isActive: 1, sortOrder: 1, name: 1 }); // Active categories listing
CategorySchema.index({ level: 1, isActive: 1 }); // Level-based queries
CategorySchema.index({ name: 'text', description: 'text' }); // Full-text search
CategorySchema.index({ createdBy: 1, createdAt: -1 }); // Creator's categories
CategorySchema.index({ questionCount: -1, isActive: 1 }); // Sort by question count

CategorySchema.pre<ICategory>('save', async function (next) {
  if (this.isModified('name') || this.isModified('parent')) {
    await this.generatePath();
  }
  next();
});

CategorySchema.methods.generatePath = async function (this: ICategory): Promise<void> {
  if (!this.parent) {
    this.path = this.name.toLowerCase().replace(/\s+/g, '-');
    this.level = 0;
  } else {
    const parentDoc = await mongoose.model<ICategory>('Category').findById(this.parent);
    if (parentDoc) {
      this.path = `${parentDoc.path}/${this.name.toLowerCase().replace(/\s+/g, '-')}`;
      this.level = parentDoc.level + 1;
    }
  }
};

CategorySchema.methods.getFullTree = async function (this: ICategory): Promise<ICategory[]> {
  const ancestors: ICategory[] = [];
  let current: ICategory | null = this;

  while (current && current.parent) {
    current = await mongoose.model<ICategory>('Category').findById(current.parent);
    if (current) {
      ancestors.unshift(current);
    }
  }
  return ancestors;
};

CategorySchema.statics.getCategoryTree = function (this: ICategoryModel, parentId: mongoose.Types.ObjectId | null | undefined = null): Promise<ICategory[]> {
  return this.find({ parent: parentId, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .populate('children').exec();
};

CategorySchema.statics.getFlatHierarchy = function (this: ICategoryModel): Promise<any[]> {
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

CategorySchema.statics.updateQuestionCounts = async function (this: ICategoryModel): Promise<void> {
  const Question = mongoose.model('Question'); // Assuming IQuestionModel is available

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

CategorySchema.methods.getBreadcrumb = async function (this: ICategory): Promise<{ _id: mongoose.Types.ObjectId; name: string; path?: string }[]> {
  const breadcrumb: { _id: mongoose.Types.ObjectId; name: string; path?: string }[] = [];
  let current: ICategory | null = this;

  while (current) {
    breadcrumb.unshift({
      _id: current._id as mongoose.Types.ObjectId,
      name: current.name,
      path: current.path
    });
    if (current.parent) {
      current = await mongoose.model<ICategory>('Category').findById(current.parent);
    } else {
      current = null;
    }
  }
  return breadcrumb;
};

export default mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema); 