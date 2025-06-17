"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogCategory = exports.validateBlogPost = void 0;
const zod_1 = require("zod");
// Blog Post Validation Schema
const blogPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'عنوان الزامی است').max(200, 'عنوان نمی‌تواند بیش از 200 کاراکتر باشد'),
    content: zod_1.z.string().min(1, 'محتوا الزامی است'),
    excerpt: zod_1.z.string().max(500, 'خلاصه نمی‌تواند بیش از 500 کاراکتر باشد').optional(),
    categories: zod_1.z.array(zod_1.z.string()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.enum(['draft', 'published', 'archived']).optional(),
    allowComments: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    isSticky: zod_1.z.boolean().optional(),
    metaTitle: zod_1.z.string().max(60, 'عنوان متا نمی‌تواند بیش از 60 کاراکتر باشد').optional(),
    metaDescription: zod_1.z.string().max(160, 'توضیحات متا نمی‌تواند بیش از 160 کاراکتر باشد').optional(),
    metaKeywords: zod_1.z.array(zod_1.z.string()).optional(),
});
// Blog Category Validation Schema
const blogCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'نام دسته‌بندی الزامی است').max(100, 'نام نمی‌تواند بیش از 100 کاراکتر باشد'),
    description: zod_1.z.string().max(500, 'توضیحات نمی‌تواند بیش از 500 کاراکتر باشد').optional(),
    parent: zod_1.z.string().optional(),
    color: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i, 'رنگ باید در فرمت هگز باشد').optional(),
    order: zod_1.z.number().min(0).optional(),
});
const validateBlogPost = (data) => {
    try {
        const result = blogPostSchema.parse(data);
        return { isValid: true, data: result, errors: [] };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateBlogPost = validateBlogPost;
const validateBlogCategory = (data) => {
    try {
        const result = blogCategorySchema.parse(data);
        return { isValid: true, data: result, errors: [] };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateBlogCategory = validateBlogCategory;
//# sourceMappingURL=validation.js.map