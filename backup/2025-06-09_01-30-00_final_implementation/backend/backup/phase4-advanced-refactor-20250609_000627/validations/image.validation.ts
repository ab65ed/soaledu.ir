import { z } from 'zod';

// Type definitions
export type ImageType = 'avatar' | 'blog' | 'lesson' | 'exam';

export interface ImageFile {
  size: number;
  mimetype: string;
  originalname?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface DimensionLimits {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

// Enum for image types
const ImageTypeEnum = z.enum(['avatar', 'blog', 'lesson', 'exam'], {
  errorMap: () => ({ message: 'نوع تصویر باید یکی از موارد مجاز باشد' })
});

// MongoDB ObjectId pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Image upload validation schema
export const ImageUploadSchema = z.object({
  type: ImageTypeEnum,
  description: z.string()
    .max(500, { message: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد' })
    .optional()
});

// Image update validation schema
export const ImageUpdateSchema = z.object({
  url: z.string()
    .url({ message: 'آدرس تصویر معتبر نیست' }),
  alt: z.string()
    .max(200, { message: 'متن جایگزین نباید بیشتر از ۲۰۰ کاراکتر باشد' })
    .optional(),
  caption: z.string()
    .max(300, { message: 'عنوان تصویر نباید بیشتر از ۳۰۰ کاراکتر باشد' })
    .optional()
});

// Blog post image validation schema
export const BlogImageSchema = z.object({
  postId: z.string()
    .regex(objectIdPattern, { message: 'شناسه پست معتبر نیست' })
}).merge(ImageUpdateSchema);

// Lesson image validation schema
export const LessonImageSchema = z.object({
  lessonId: z.string()
    .regex(objectIdPattern, { message: 'شناسه درس معتبر نیست' })
}).merge(ImageUpdateSchema);

// File validation helper
export const validateImageFile = (file: ImageFile | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Check if file exists
  if (!file) {
    errors.push({ field: 'image', message: 'فایل تصویر الزامی است' });
    return errors;
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push({ 
      field: 'image', 
      message: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد' 
    });
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push({ 
      field: 'image', 
      message: 'فرمت فایل باید PNG یا JPG باشد' 
    });
  }
  
  // Check file name length
  if (file.originalname && file.originalname.length > 255) {
    errors.push({ 
      field: 'image', 
      message: 'نام فایل نباید بیشتر از ۲۵۵ کاراکتر باشد' 
    });
  }
  
  return errors;
};

// Image dimensions validation
export const validateImageDimensions = (width: number, height: number, type: ImageType): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const dimensionLimits: Record<ImageType, DimensionLimits> = {
    avatar: { minWidth: 100, minHeight: 100, maxWidth: 1000, maxHeight: 1000 },
    blog: { minWidth: 400, minHeight: 200, maxWidth: 2000, maxHeight: 2000 },
    lesson: { minWidth: 300, minHeight: 200, maxWidth: 1500, maxHeight: 1500 },
    exam: { minWidth: 200, minHeight: 100, maxWidth: 1000, maxHeight: 1000 }
  };
  
  const limits = dimensionLimits[type];
  if (!limits) {
    errors.push({ field: 'type', message: 'نوع تصویر معتبر نیست' });
    return errors;
  }
  
  if (width < limits.minWidth || height < limits.minHeight) {
    errors.push({ 
      field: 'dimensions', 
      message: `ابعاد تصویر باید حداقل ${limits.minWidth}x${limits.minHeight} پیکسل باشد` 
    });
  }
  
  if (width > limits.maxWidth || height > limits.maxHeight) {
    errors.push({ 
      field: 'dimensions', 
      message: `ابعاد تصویر نباید بیشتر از ${limits.maxWidth}x${limits.maxHeight} پیکسل باشد` 
    });
  }
  
  return errors;
};

// Type exports for TypeScript
export type ImageUploadType = z.infer<typeof ImageUploadSchema>;
export type ImageUpdateType = z.infer<typeof ImageUpdateSchema>;
export type BlogImageType = z.infer<typeof BlogImageSchema>;
export type LessonImageType = z.infer<typeof LessonImageSchema>; 