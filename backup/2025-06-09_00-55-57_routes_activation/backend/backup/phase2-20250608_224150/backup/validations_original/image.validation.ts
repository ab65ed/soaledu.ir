import Validator from 'fastest-validator';

const validator = new Validator({
  messages: {
    required: 'این فیلد الزامی است',
    string: 'این فیلد باید متن باشد',
    url: 'آدرس وارد شده معتبر نیست',
    enum: 'مقدار انتخاب شده معتبر نیست',
    max: 'حداکثر اندازه مجاز {expected} است',
    min: 'حداقل اندازه مورد نیاز {expected} است'
  }
});

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

// Image upload validation schema
const imageUploadSchema = {
  type: {
    type: 'string',
    required: true,
    enum: ['avatar', 'blog', 'lesson', 'exam'],
    messages: {
      required: 'نوع تصویر الزامی است',
      enum: 'نوع تصویر باید یکی از موارد مجاز باشد'
    }
  },
  description: {
    type: 'string',
    optional: true,
    max: 500,
    messages: {
      max: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد'
    }
  }
};

// Image update validation schema
const imageUpdateSchema = {
  url: {
    type: 'url',
    required: true,
    messages: {
      required: 'آدرس تصویر الزامی است',
      url: 'آدرس تصویر معتبر نیست'
    }
  },
  alt: {
    type: 'string',
    optional: true,
    max: 200,
    messages: {
      max: 'متن جایگزین نباید بیشتر از ۲۰۰ کاراکتر باشد'
    }
  },
  caption: {
    type: 'string',
    optional: true,
    max: 300,
    messages: {
      max: 'عنوان تصویر نباید بیشتر از ۳۰۰ کاراکتر باشد'
    }
  }
};

// Blog post image validation schema
const blogImageSchema = {
  postId: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/,
    messages: {
      required: 'شناسه پست الزامی است',
      pattern: 'شناسه پست معتبر نیست'
    }
  },
  ...imageUpdateSchema
};

// Lesson image validation schema
const lessonImageSchema = {
  lessonId: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/,
    messages: {
      required: 'شناسه درس الزامی است',
      pattern: 'شناسه درس معتبر نیست'
    }
  },
  ...imageUpdateSchema
};

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

// Compile validation schemas
export const validateImageUpload = validator.compile(imageUploadSchema);
export const validateImageUpdate = validator.compile(imageUpdateSchema);
export const validateBlogImage = validator.compile(blogImageSchema);
export const validateLessonImage = validator.compile(lessonImageSchema);

// Export schemas for potential reuse
export {
  imageUploadSchema,
  imageUpdateSchema,
  blogImageSchema,
  lessonImageSchema
}; 