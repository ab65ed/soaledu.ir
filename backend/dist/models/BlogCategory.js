"use strict";
/**
 * Blog Category Model
 *
 * Handles hierarchical blog categories for content organization
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
// Blog Category Schema
const BlogCategorySchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Updated by
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
    collection: 'blog_categories',
});
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
BlogCategorySchema.pre('save', async function (next) {
    if (this.isModified('parent') || this.isNew) {
        if (this.parent) {
            const parentCategory = await this.constructor.findById(this.parent);
            if (parentCategory) {
                this.level = parentCategory.level + 1;
                this.path = parentCategory.path ? `${parentCategory.path}/${this.slug}` : this.slug;
            }
            else {
                this.level = 0;
                this.path = this.slug;
            }
        }
        else {
            this.level = 0;
            this.path = this.slug;
        }
    }
    next();
});
// Static method to get category tree
BlogCategorySchema.statics.getCategoryTree = async function (parentId = null) {
    const categories = await this.find({
        parent: parentId,
        isActive: true
    }).sort({ order: 1, name: 1 });
    const tree = [];
    for (const category of categories) {
        const children = await this.getCategoryTree(category._id);
        tree.push({
            ...category.toObject(),
            children
        });
    }
    return tree;
};
// Static method to get category breadcrumbs
BlogCategorySchema.statics.getBreadcrumbs = async function (categoryId) {
    const breadcrumbs = [];
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
        }
        else {
            currentCategory = null;
        }
    }
    return breadcrumbs;
};
// Static method to get all descendant categories
BlogCategorySchema.statics.getDescendants = async function (categoryId) {
    const descendants = [];
    const children = await this.find({ parent: categoryId });
    for (const child of children) {
        descendants.push(child);
        const childDescendants = await this.getDescendants(child._id.toString());
        descendants.push(...childDescendants);
    }
    return descendants;
};
// Method to update post count
BlogCategorySchema.methods.updatePostCount = async function () {
    const BlogPost = require('./BlogPost');
    this.postCount = await BlogPost.countDocuments({
        categories: this._id,
        status: 'published'
    });
    await this.save();
};
// Pre-deleteOne middleware to handle category deletion
BlogCategorySchema.pre('deleteOne', async function (next) {
    const docToDelete = await this.model.findOne(this.getFilter());
    if (docToDelete) {
        // Move children to parent or root
        await this.model.updateMany({ parent: docToDelete._id }, { parent: docToDelete.parent });
        // Remove this category from blog posts
        const BlogPost = require('./BlogPost');
        await BlogPost.updateMany({ categories: docToDelete._id }, { $pull: { categories: docToDelete._id } });
    }
    next();
});
// Transform output
BlogCategorySchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});
exports.default = mongoose_1.default.model('BlogCategory', BlogCategorySchema);
//# sourceMappingURL=BlogCategory.js.map