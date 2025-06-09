/**
 * Blog Category Model
 * 
 * Handles hierarchical blog categories for content organization
 */

import mongoose, { Schema, Model } from 'mongoose';
import { IBlogCategory } from '../types/index';

interface ICategoryImage {
  url?: string;
  alt?: string;
}

interface IBlogCategoryDocument extends IBlogCategory {
  slug: string;
  parent?: mongoose.Types.ObjectId;
  path: string;
  level: number;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  image?: ICategoryImage;
  color: string;
  postCount: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  children?: IBlogCategoryDocument[];
  posts?: any[];
  updatePostCount(): Promise<void>;
}

// Blog Category Schema
const BlogCategorySchema = new Schema<IBlogCategoryDocument>(
  {
    // Category identification
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    // Hierarchical structure
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'BlogCategory',
      default: null,
    },
    
    // Category path for breadcrumbs (e.g., "education/math")
    path: {
      type: String,
      default: '',
    },
    
    // Category level (0 for root, 1 for first level, etc.)
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Maximum 5 levels deep
    },
    
    // Display order
    order: {
      type: Number,
      default: 0,
    },
    
    // SEO fields
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    
    metaKeywords: [{
      type: String,
      trim: true,
    }],
    
    // Category image
    image: {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    
    // Category color for UI
    color: {
      type: String,
      default: '#213448',
      match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'],
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Statistics
    postCount: {
      type: Number,
      default: 0,
    },
    
    // Created by
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Updated by
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: 'blog_categories',
  }
);

// Indexes for performance
BlogCategorySchema.index({ slug: 1 }, { unique: true });
BlogCategorySchema.index({ parent: 1, order: 1 });
BlogCategorySchema.index({ path: 1 });
BlogCategorySchema.index({ isActive: 1 });
BlogCategorySchema.index({ level: 1 });

// Virtual for children categories
BlogCategorySchema.virtual('children', {
  ref: 'BlogCategory',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual for posts in this category
BlogCategorySchema.virtual('posts', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'categories',
});

// Pre-save middleware to generate path and level
BlogCategorySchema.pre('save', async function(this: IBlogCategoryDocument, next) {
  if (this.isModified('parent') || this.isNew) {
    if (this.parent) {
      const parentCategory = await (this.constructor as any).findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = parentCategory.path ? `${parentCategory.path}/${this.slug}` : this.slug;
      } else {
        this.level = 0;
        this.path = this.slug;
      }
    } else {
      this.level = 0;
      this.path = this.slug;
    }
  }
  next();
});

interface CategoryTreeItem extends IBlogCategoryDocument {
  children: CategoryTreeItem[];
}

interface BreadcrumbItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  path: string;
}

interface BlogCategoryModel extends Model<IBlogCategoryDocument> {
  getCategoryTree(parentId?: mongoose.Types.ObjectId | null): Promise<CategoryTreeItem[]>;
  getBreadcrumbs(categoryId: string): Promise<BreadcrumbItem[]>;
  getDescendants(categoryId: string): Promise<IBlogCategoryDocument[]>;
}

// Static method to get category tree
BlogCategorySchema.statics.getCategoryTree = async function(parentId: mongoose.Types.ObjectId | null = null) {
  const categories = await this.find({ 
    parent: parentId, 
    isActive: true 
  }).sort({ order: 1, name: 1 });
  
  const tree: CategoryTreeItem[] = [];
  for (const category of categories) {
    const children = await (this as BlogCategoryModel).getCategoryTree(category._id);
    tree.push({
      ...category.toObject(),
      children
    });
  }
  
  return tree;
};

// Static method to get category breadcrumbs
BlogCategorySchema.statics.getBreadcrumbs = async function(categoryId: string) {
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentCategory = await this.findById(categoryId);
  
  while (currentCategory) {
    breadcrumbs.unshift({
      _id: currentCategory._id,
      name: currentCategory.name,
      slug: currentCategory.slug,
      path: currentCategory.path,
    });
    
    if (currentCategory.parent) {
      currentCategory = await this.findById(currentCategory.parent);
    } else {
      currentCategory = null;
    }
  }
  
  return breadcrumbs;
};

// Static method to get all descendant categories
BlogCategorySchema.statics.getDescendants = async function(categoryId: string) {
  const descendants: IBlogCategoryDocument[] = [];
  const children = await this.find({ parent: categoryId });
  
  for (const child of children) {
    descendants.push(child);
    const childDescendants = await (this as BlogCategoryModel).getDescendants(child._id.toString());
    descendants.push(...childDescendants);
  }
  
  return descendants;
};

// Method to update post count
BlogCategorySchema.methods.updatePostCount = async function(this: IBlogCategoryDocument) {
  const BlogPost = require('./BlogPost');
  this.postCount = await BlogPost.countDocuments({ 
    categories: this._id, 
    status: 'published' 
  });
  await this.save();
};

// Pre-deleteOne middleware to handle category deletion
BlogCategorySchema.pre('deleteOne', async function(this: any, next) {
  const docToDelete = await this.model.findOne(this.getFilter());
  if (docToDelete) {
    // Move children to parent or root
    await this.model.updateMany(
      { parent: docToDelete._id },
      { parent: docToDelete.parent }
    );
    
    // Remove this category from blog posts
    const BlogPost = require('./BlogPost');
    await BlogPost.updateMany(
      { categories: docToDelete._id },
      { $pull: { categories: docToDelete._id } }
    );
  }
  
  next();
});

// Transform output
BlogCategorySchema.set('toJSON', {
  transform: function(doc: any, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IBlogCategoryDocument, BlogCategoryModel>('BlogCategory', BlogCategorySchema); 