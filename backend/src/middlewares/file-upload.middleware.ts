/**
 * File Upload Security Middleware
 * اعتبارسنجی و امنیت فایل‌های آپلود شده
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// ============================= تنظیمات فایل ============================= //

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSIONS = {
  width: 4000,
  height: 4000
};

// ============================= Storage Configuration ============================= //

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    
    // اطمینان از وجود پوشه uploads
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  
  filename: (req, file, cb) => {
    // تولید نام فایل امن با timestamp و hash
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${timestamp}_${randomHash}${extension}`;
    
    cb(null, safeName);
  }
});

// ============================= File Filter ============================= //

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  try {
    // بررسی نوع فایل
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      logger.warn('File upload rejected - invalid type', {
        mimetype: file.mimetype,
        originalname: file.originalname,
        ip: req.ip
      });
      
      return cb(new Error('فقط فایل‌های PNG و JPG مجاز هستند'));
    }
    
    // بررسی پسوند فایل
    const extension = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      logger.warn('File upload rejected - invalid extension', {
        extension,
        originalname: file.originalname,
        ip: req.ip
      });
      
      return cb(new Error('پسوند فایل نامعتبر است'));
    }
    
    // بررسی نام فایل برای کاراکترهای مخرب
    const filename = file.originalname;
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(filename)) {
      logger.warn('File upload rejected - dangerous characters', {
        originalname: file.originalname,
        ip: req.ip
      });
      
      return cb(new Error('نام فایل شامل کاراکترهای غیرمجاز است'));
    }
    
    cb(null, true);
  } catch (error) {
    logger.error('File filter error:', error);
    cb(new Error('خطا در بررسی فایل'));
  }
};

// ============================= Multer Configuration ============================= //

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // تنها یک فایل در هر درخواست
    fieldSize: 1024 * 1024, // 1MB for field data
    fieldNameSize: 100,
    fields: 10
  }
});

// ============================= Image Dimension Validator ============================= //

export const validateImageDimensions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }
    
    // استفاده از sharp برای بررسی ابعاد تصویر (اختیاری)
    // در صورت نصب sharp، این کد را فعال کنید:
    /*
    const sharp = require('sharp');
    const metadata = await sharp(req.file.path).metadata();
    
    if (metadata.width > MAX_IMAGE_DIMENSIONS.width || 
        metadata.height > MAX_IMAGE_DIMENSIONS.height) {
      
      // حذف فایل نامعتبر
      fs.unlinkSync(req.file.path);
      
      logger.warn('Image rejected - dimensions too large', {
        width: metadata.width,
        height: metadata.height,
        maxWidth: MAX_IMAGE_DIMENSIONS.width,
        maxHeight: MAX_IMAGE_DIMENSIONS.height,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        message: `ابعاد تصویر نباید بیشتر از ${MAX_IMAGE_DIMENSIONS.width}x${MAX_IMAGE_DIMENSIONS.height} پیکسل باشد`
      });
    }
    */
    
    // Log successful upload
    logger.info('File uploaded successfully', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      ip: req.ip,
      userId: (req as any).user?.id
    });
    
    next();
  } catch (error) {
    logger.error('Image dimension validation error:', error);
    
    // حذف فایل در صورت خطا
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در پردازش تصویر'
    });
  }
};

// ============================= File Security Scanner ============================= //

export const scanFileForMalware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next();
    }
    
    // بررسی Magic Numbers برای تشخیص نوع واقعی فایل
    const buffer = fs.readFileSync(req.file.path);
    const magicNumbers = buffer.toString('hex', 0, 4).toUpperCase();
    
    const validMagicNumbers = {
      'FFD8': 'image/jpeg', // JPEG
      '89504E47': 'image/png' // PNG (4 bytes)
    };
    
    let isValidFile = false;
    
    // بررسی JPEG
    if (magicNumbers.startsWith('FFD8')) {
      isValidFile = req.file.mimetype === 'image/jpeg';
    }
    
    // بررسی PNG
    if (buffer.toString('hex', 0, 8).toUpperCase() === '89504E470D0A1A0A') {
      isValidFile = req.file.mimetype === 'image/png';
    }
    
    if (!isValidFile) {
      // حذف فایل مشکوک
      fs.unlinkSync(req.file.path);
      
      logger.warn('File rejected - magic number mismatch', {
        magicNumbers,
        declaredMimetype: req.file.mimetype,
        originalname: req.file.originalname,
        ip: req.ip
      });
      
      return res.status(400).json({
        success: false,
        message: 'فایل آپلود شده معتبر نیست'
      });
    }
    
    next();
  } catch (error) {
    logger.error('File security scan error:', error);
    
    // حذف فایل در صورت خطا
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در بررسی امنیت فایل'
    });
  }
};

// ============================= Error Handler ============================= //

export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    let message = 'خطا در آپلود فایل';
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `حجم فایل نباید بیشتر از ${MAX_FILE_SIZE / (1024 * 1024)}MB باشد`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'تعداد فایل‌های آپلود شده بیش از حد مجاز است';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'فیلد فایل غیرمنتظره دریافت شد';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'تعداد فیلدهای فرم بیش از حد مجاز است';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'اندازه فیلد فرم بیش از حد مجاز است';
        break;
    }
    
    logger.warn('Multer upload error', {
      code: error.code,
      message: error.message,
      ip: req.ip
    });
    
    return res.status(400).json({
      success: false,
      message
    });
  }
  
  // سایر خطاها
  logger.error('Upload error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'خطا در آپلود فایل'
  });
};

// ============================= Usage Examples ============================= //

/*
استفاده در routes:

// آپلود تک فایل
app.post('/upload/avatar', 
  uploadMiddleware.single('avatar'),
  validateImageDimensions,
  scanFileForMalware,
  handleUploadError,
  (req, res) => {
    res.json({
      success: true,
      file: req.file
    });
  }
);

// آپلود چند فایل
app.post('/upload/gallery',
  uploadMiddleware.array('images', 5),
  validateImageDimensions,
  scanFileForMalware,
  handleUploadError,
  (req, res) => {
    res.json({
      success: true,
      files: req.files
    });
  }
);
*/ 