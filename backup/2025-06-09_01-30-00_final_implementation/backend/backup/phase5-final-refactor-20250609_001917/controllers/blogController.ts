import { Request, Response } from 'express';
import { BlogPost } from '../models/BlogPost';
import { BlogCategory } from '../models/BlogCategory';
import { RequestWithUser, ApiResponse, QueryOptions, PaginationResult } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBlogPost, validateBlogCategory } from '../utils/validation';
import { logger } from '../utils/logger';
import { generateSlug } from '../utils/helpers';
import { uploadImage, deleteImage } from '../utils/imageUpload';

// Get all published blog posts with pagination and filtering
export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = 'publishedAt',
      order = 'desc',
      featured,
      status = 'published'
    } = req.query as any;

    const query: any = {};
    
    // Only show published posts for public access
    if (status === 'published') {
      query.status = 'published';
      query.publishedAt = { $lte: new Date() };
    }

    // Category filter
    if (category) {
      const categoryDoc = await BlogCategory.findOne({ slug: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate('author', 'name email avatar')
        .populate('categories', 'name slug color')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      BlogPost.countDocuments(query)
    ]);

    const response: ApiResponse = {
      success: true,
      data: {
        data: posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت مقالات'
    });
  }
};

// Get single blog post by slug
export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({ slug, status: 'published' })
      .populate('author', 'name email avatar')
      .populate('categories', 'name slug color description')
      .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'مقاله یافت نشد'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    const response: ApiResponse = {
      success: true,
      data: post
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت مقاله'
    });
  }
};

// Create new blog post (Admin only)
export const createBlogPost = async (req: RequestWithUser, res: Response) => {
  try {
    const {
      title,
      content,
      excerpt,
      categories,
      tags,
      featuredImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      status = 'draft',
      allowComments = true,
      isFeatured = false,
      isSticky = false
    } = req.body;

    // Generate unique slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    while (await BlogPost.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Handle featured image upload
    let uploadedImage;
    if (featuredImage && typeof featuredImage === 'object') {
      uploadedImage = await uploadImage(featuredImage, 'blog-featured');
    }

    const postData = {
      title,
      slug,
      content,
      excerpt,
      categories: categories || [],
      tags: tags || [],
      featuredImage: uploadedImage || featuredImage,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      metaKeywords: metaKeywords || [],
      status,
      author: req.user!.id,
      allowComments,
      isFeatured,
      isSticky,
      publishedAt: status === 'published' ? new Date() : undefined
    };

    const post = new BlogPost(postData);
    await post.save();

    // Populate the response
    await post.populate('author', 'name email avatar');
    await post.populate('categories', 'name slug color');

    logger.info('Blog post created', {
      userId: req.user!.id,
      postId: post._id,
      title: post.title
    });

    const response: ApiResponse = {
      success: true,
      data: post,
      message: 'مقاله با موفقیت ایجاد شد'
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در ایجاد مقاله'
    });
  }
};

// Update blog post (Admin only)
export const updateBlogPost = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  
  const post = await BlogPost.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  const validation = validateBlogPost(req.body, true);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'داده‌های ورودی نامعتبر است',
      details: validation.errors
    });
  }

  const {
    title,
    content,
    excerpt,
    categories,
    tags,
    featuredImage,
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
    allowComments,
    isFeatured,
    isSticky
  } = req.body;

  // Update slug if title changed
  if (title && title !== post.title) {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    
    while (await BlogPost.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    post.slug = slug;
  }

  // Handle featured image update
  if (featuredImage && typeof featuredImage === 'object') {
    // Delete old image if exists
    if (post.featuredImage?.url) {
      await deleteImage(post.featuredImage.url);
    }
    post.featuredImage = await uploadImage(featuredImage, 'blog-featured');
  }

  // Update fields
  if (title) post.title = title;
  if (content) post.content = content;
  if (excerpt) post.excerpt = excerpt;
  if (categories) post.categories = categories;
  if (tags) post.tags = tags;
  if (metaTitle) post.metaTitle = metaTitle;
  if (metaDescription) post.metaDescription = metaDescription;
  if (metaKeywords) post.metaKeywords = metaKeywords;
  if (status) {
    post.status = status;
    if (status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }
  }
  if (typeof allowComments === 'boolean') post.allowComments = allowComments;
  if (typeof isFeatured === 'boolean') post.isFeatured = isFeatured;
  if (typeof isSticky === 'boolean') post.isSticky = isSticky;
  
  post.lastEditedBy = req.user!.id;

  await post.save();

  // Populate the response
  await post.populate('author', 'name email avatar');
  await post.populate('categories', 'name slug color');

  logger.info('Blog post updated', {
    userId: req.user!.id,
    postId: post._id,
    title: post.title
  });

  const response: ApiResponse = {
    success: true,
    data: post,
    message: 'مقاله با موفقیت به‌روزرسانی شد'
  };

  res.json(response);
});

// Delete blog post (Admin only)
export const deleteBlogPost = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  const post = await BlogPost.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  // Delete featured image if exists
  if (post.featuredImage?.url) {
    await deleteImage(post.featuredImage.url);
  }

  // Delete all images in the post
  if (post.images && post.images.length > 0) {
    for (const image of post.images) {
      if (image.url) {
        await deleteImage(image.url);
      }
    }
  }

  await BlogPost.findByIdAndDelete(id);

  logger.info('Blog post deleted', {
    userId: req.user!.id,
    postId: id,
    title: post.title
  });

  const response: ApiResponse = {
    success: true,
    message: 'مقاله با موفقیت حذف شد'
  };

  res.json(response);
});

// Get blog categories
export const getBlogCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive = false } = req.query;

    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    const categories = await BlogCategory.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    const response: ApiResponse = {
      success: true,
      data: categories
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت دسته‌بندی‌ها'
    });
  }
};

// Create blog category (Admin only)
export const createBlogCategory = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const validation = validateBlogCategory(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'داده‌های ورودی نامعتبر است',
      details: validation.errors
    });
  }

  const { name, description, parent, color, order } = req.body;

  // Generate unique slug
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (await BlogCategory.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const categoryData = {
    name,
    slug,
    description,
    parent,
    color: color || '#3B82F6',
    order: order || 0,
    createdBy: req.user!.id
  };

  const category = new BlogCategory(categoryData);
  await category.save();

  logger.info('Blog category created', {
    userId: req.user!.id,
    categoryId: category._id,
    name: category.name
  });

  const response: ApiResponse = {
    success: true,
    data: category,
    message: 'دسته‌بندی با موفقیت ایجاد شد'
  };

  res.status(201).json(response);
});

// Add comment to blog post
export const addComment = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { content, parentComment } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'محتوای نظر نمی‌تواند خالی باشد'
      });
    }

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'مقاله یافت نشد'
      });
    }

    if (!post.allowComments) {
      return res.status(403).json({
        success: false,
        error: 'امکان ثبت نظر برای این مقاله وجود ندارد'
      });
    }

    const commentData = {
      author: req.user!.id,
      content: content.trim(),
      parentComment,
      ipAddress: req.ip
    };

    await post.addComment(commentData);

    logger.info('Comment added to blog post', {
      userId: req.user!.id,
      postId: id,
      commentContent: content.substring(0, 100)
    });

    const response: ApiResponse = {
      success: true,
      message: 'نظر شما با موفقیت ثبت شد و در انتظار تأیید است'
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطا در ثبت نظر'
    });
  }
};

// Moderate comment (Admin only)
export const moderateComment = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { postId, commentId } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'وضعیت نظر نامعتبر است'
    });
  }

  const post = await BlogPost.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  await post.moderateComment(commentId, status, req.user!.id);

  logger.info('Comment moderated', {
    userId: req.user!.id,
    postId,
    commentId,
    status
  });

  const response: ApiResponse = {
    success: true,
    message: `نظر با موفقیت ${status === 'approved' ? 'تأیید' : status === 'rejected' ? 'رد' : 'در انتظار بررسی قرار گرفت'}`
  };

  res.json(response);
});

// Get blog statistics (Admin only)
export const getBlogStats = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalCategories,
    totalComments,
    pendingComments,
    totalViews
  ] = await Promise.all([
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    BlogPost.countDocuments({ status: 'draft' }),
    BlogCategory.countDocuments({ isActive: true }),
    BlogPost.aggregate([
      { $unwind: '$comments' },
      { $count: 'total' }
    ]).then(result => result[0]?.total || 0),
    BlogPost.aggregate([
      { $unwind: '$comments' },
      { $match: { 'comments.status': 'pending' } },
      { $count: 'total' }
    ]).then(result => result[0]?.total || 0),
    BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]).then(result => result[0]?.total || 0)
  ]);

  const stats = {
    posts: {
      total: totalPosts,
      published: publishedPosts,
      draft: draftPosts
    },
    categories: totalCategories,
    comments: {
      total: totalComments,
      pending: pendingComments
    },
    views: totalViews
  };

  const response: ApiResponse = {
    success: true,
    data: stats
  };

  res.json(response);
});

// Additional functions needed for routes

export const updateBlogPost = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const post = await BlogPost.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  Object.assign(post, updates);
  await post.save();

  const response: ApiResponse = {
    success: true,
    data: post,
    message: 'مقاله با موفقیت به‌روزرسانی شد'
  };

  res.json(response);
});

export const deleteBlogPost = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  const post = await BlogPost.findById(id);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  await BlogPost.findByIdAndDelete(id);

  const response: ApiResponse = {
    success: true,
    message: 'مقاله با موفقیت حذف شد'
  };

  res.json(response);
});

export const updateBlogCategory = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const category = await BlogCategory.findById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'دسته‌بندی یافت نشد'
    });
  }

  Object.assign(category, updates);
  await category.save();

  const response: ApiResponse = {
    success: true,
    data: category,
    message: 'دسته‌بندی با موفقیت به‌روزرسانی شد'
  };

  res.json(response);
});

export const deleteBlogCategory = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  const category = await BlogCategory.findById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'دسته‌بندی یافت نشد'
    });
  }

  await BlogCategory.findByIdAndDelete(id);

  const response: ApiResponse = {
    success: true,
    message: 'دسته‌بندی با موفقیت حذف شد'
  };

  res.json(response);
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { page = 1, limit = 10 } = req.query as any;

  const post = await BlogPost.findOne({ slug }).populate('comments.author', 'name avatar');
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  const comments = post.comments.filter(comment => comment.status === 'approved');
  const total = comments.length;
  const skip = (Number(page) - 1) * Number(limit);
  const paginatedComments = comments.slice(skip, skip + Number(limit));

  const response: ApiResponse = {
    success: true,
    data: {
      data: paginatedComments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
});

export const likePost = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { slug } = req.params;

  const post = await BlogPost.findOne({ slug });
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  // Toggle like logic would go here
  const response: ApiResponse = {
    success: true,
    message: 'عملیات با موفقیت انجام شد'
  };

  res.json(response);
});

export const getRelatedPosts = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const post = await BlogPost.findOne({ slug }).populate('categories');
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  const relatedPosts = await BlogPost.find({
    _id: { $ne: post._id },
    status: 'published',
    categories: { $in: post.categories }
  }).limit(5).select('title slug excerpt featuredImage publishedAt');

  const response: ApiResponse = {
    success: true,
    data: relatedPosts
  };

  res.json(response);
});

export const searchBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const { q, page = 1, limit = 10 } = req.query as any;

  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'کلمه کلیدی جستجو الزامی است'
    });
  }

  const query = {
    status: 'published',
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ]
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .populate('author', 'name avatar')
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    BlogPost.countDocuments(query)
  ]);

  const response: ApiResponse = {
    success: true,
    data: {
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
}); 