import { z } from 'zod';

// Blog Post Validation Schema
const blogPostSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است').max(200, 'عنوان نمی‌تواند بیش از 200 کاراکتر باشد'),
  content: z.string().min(1, 'محتوا الزامی است'),
  excerpt: z.string().max(500, 'خلاصه نمی‌تواند بیش از 500 کاراکتر باشد').optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  allowComments: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isSticky: z.boolean().optional(),
  metaTitle: z.string().max(60, 'عنوان متا نمی‌تواند بیش از 60 کاراکتر باشد').optional(),
  metaDescription: z.string().max(160, 'توضیحات متا نمی‌تواند بیش از 160 کاراکتر باشد').optional(),
  metaKeywords: z.array(z.string()).optional(),
});

// Blog Category Validation Schema
const blogCategorySchema = z.object({
  name: z.string().min(1, 'نام دسته‌بندی الزامی است').max(100, 'نام نمی‌تواند بیش از 100 کاراکتر باشد'),
  description: z.string().max(500, 'توضیحات نمی‌تواند بیش از 500 کاراکتر باشد').optional(),
  parent: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'رنگ باید در فرمت هگز باشد').optional(),
  order: z.number().min(0).optional(),
});

export const validateBlogPost = (data: any) => {
  try {
    const result = blogPostSchema.parse(data);
    return { isValid: true, data: result, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { isValid: false, data: null, errors: [{ field: 'general', message: 'خطای اعتبارسنجی' }] };
  }
};

export const validateBlogCategory = (data: any) => {
  try {
    const result = blogCategorySchema.parse(data);
    return { isValid: true, data: result, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { isValid: false, data: null, errors: [{ field: 'general', message: 'خطای اعتبارسنجی' }] };
  }
}; 