"use strict";
/**
 * Blog Post Model
 *
 * Handles blog posts with rich content, categories, tags, and comments
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
// Comment Schema
const CommentSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    // Comment status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    // Reply to another comment
    parentComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    // Moderation
    moderatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    moderatedAt: {
        type: Date,
    },
    // IP address for moderation
    ipAddress: {
        type: String,
    },
}, {
    timestamps: true,
});
// Blog Post Schema
const BlogPostSchema = new mongoose_1.Schema({
    // Basic information
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Post slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
    },
    // Content type (rich text, markdown, etc.)
    contentType: {
        type: String,
        enum: ['html', 'markdown'],
        default: 'html',
    },
    // Categories and tags
    categories: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'BlogCategory',
        }],
    tags: [{
            type: String,
            trim: true,
            lowercase: true,
        }],
    // Featured image
    featuredImage: {
        url: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return !v || /^https?:\/\/.+\.(jpg|jpeg|png)$/i.test(v);
                },
                message: 'Featured image URL must be a valid HTTP/HTTPS URL ending with jpg, jpeg, or png'
            }
        },
        alt: {
            type: String,
            trim: true,
            maxlength: [200, 'Alt text cannot exceed 200 characters'],
        },
        caption: {
            type: String,
            trim: true,
            maxlength: [300, 'Caption cannot exceed 300 characters'],
        },
        uploadedAt: {
            type: Date,
            default: null
        },
        size: {
            type: Number,
            default: 0
        },
        dimensions: {
            width: { type: Number, default: 0 },
            height: { type: Number, default: 0 }
        }
    },
    // Additional images for content
    images: [{
            url: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^https?:\/\/.+\.(jpg|jpeg|png)$/i.test(v);
                    },
                    message: 'Image URL must be a valid HTTP/HTTPS URL ending with jpg, jpeg, or png'
                }
            },
            alt: {
                type: String,
                maxlength: [200, 'Alt text cannot exceed 200 characters'],
                default: ''
            },
            caption: {
                type: String,
                maxlength: [300, 'Caption cannot exceed 300 characters'],
                default: ''
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            },
            size: {
                type: Number,
                default: 0
            },
            dimensions: {
                width: { type: Number, default: 0 },
                height: { type: Number, default: 0 }
            }
        }],
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
    // Post status
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    // Publishing
    publishedAt: {
        type: Date,
    },
    // Author information
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Editor (if different from author)
    lastEditedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Comments
    comments: [CommentSchema],
    // Post settings
    allowComments: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isSticky: {
        type: Boolean,
        default: false,
    },
    // Statistics
    viewCount: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    shareCount: {
        type: Number,
        default: 0,
    },
    // Reading time estimation (in minutes)
    readingTime: {
        type: Number,
        default: 0,
    },
    // Related posts
    relatedPosts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'BlogPost',
        }],
}, {
    timestamps: true,
    collection: 'blog_posts',
});
// Indexes for performance
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ categories: 1, status: 1 });
BlogPostSchema.index({ tags: 1, status: 1 });
BlogPostSchema.index({ author: 1, status: 1 });
BlogPostSchema.index({ isFeatured: 1, status: 1 });
BlogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
// Virtual for approved comments
BlogPostSchema.virtual('approvedComments').get(function () {
    return this.comments.filter(comment => comment.status === 'approved');
});
// Virtual for comment count
BlogPostSchema.virtual('commentCount').get(function () {
    return this.approvedComments.length;
});
// Pre-save middleware
BlogPostSchema.pre('save', function (next) {
    // Set published date when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    // Calculate reading time (average 200 words per minute)
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / 200);
    }
    // Generate excerpt if not provided
    if (this.isModified('content') && !this.excerpt) {
        const plainText = this.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }
    next();
});
// Static method to get published posts
BlogPostSchema.statics.getPublishedPosts = function (options = {}) {
    const { page = 1, limit = 10, category, tag, search, featured, sortBy = 'publishedAt', sortOrder = -1, } = options;
    const query = { status: 'published' };
    if (category) {
        query.categories = category;
    }
    if (tag) {
        query.tags = tag;
    }
    if (search) {
        query.$text = { $search: search };
    }
    if (featured !== undefined) {
        query.isFeatured = featured;
    }
    const skip = (page - 1) * limit;
    return this.find(query)
        .populate('author', 'name email avatar')
        .populate('categories', 'name slug color')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);
};
// Static method to get related posts
BlogPostSchema.statics.getRelatedPosts = async function (postId, limit = 5) {
    const post = await this.findById(postId);
    if (!post)
        return [];
    return this.find({
        _id: { $ne: postId },
        status: 'published',
        $or: [
            { categories: { $in: post.categories } },
            { tags: { $in: post.tags } },
        ],
    })
        .populate('author', 'name avatar')
        .populate('categories', 'name slug color')
        .sort({ publishedAt: -1 })
        .limit(limit);
};
// Method to increment view count
BlogPostSchema.methods.incrementViewCount = function () {
    this.viewCount += 1;
    return this.save();
};
// Method to add comment
BlogPostSchema.methods.addComment = function (commentData) {
    this.comments.push(commentData);
    return this.save();
};
// Method to moderate comment
BlogPostSchema.methods.moderateComment = function (commentId, status, moderatorId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
        comment.status = status;
        comment.moderatedBy = new mongoose_1.default.Types.ObjectId(moderatorId);
        comment.moderatedAt = new Date();
    }
    return this.save();
};
// Transform output
BlogPostSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        // Only include approved comments in public API
        if (ret.comments) {
            ret.comments = ret.comments.filter((comment) => comment.status === 'approved');
        }
        return ret;
    }
});
exports.default = mongoose_1.default.model('BlogPost', BlogPostSchema);
//# sourceMappingURL=BlogPost.js.map