/**
 * Image Upload Utilities
 * ابزارهای آپلود و مدیریت تصاویر
 */

import path from 'path';
import fs from 'fs/promises';
import { logger } from './logger';

export interface ImageUploadResult {
  url: string;
  alt?: string;
  caption?: string;
  uploadedAt: Date;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Upload image to server
 * @param imageData - Image data or file path
 * @param folder - Upload folder name
 * @returns Upload result
 */
export const uploadImage = async (
  imageData: any,
  folder: string = 'general'
): Promise<ImageUploadResult> => {
  try {
    // Mock implementation - در محیط واقعی باید با سرویس آپلود واقعی جایگزین شود
    const mockResult: ImageUploadResult = {
      url: `https://example.com/uploads/${folder}/${Date.now()}.jpg`,
      uploadedAt: new Date(),
      size: 1024 * 100, // 100KB mock size
      dimensions: {
        width: 800,
        height: 600
      }
    };

    logger.info('Image uploaded successfully', {
      folder,
      url: mockResult.url,
      size: mockResult.size
    });

    return mockResult;
  } catch (error) {
    logger.error('Image upload failed', { error, folder });
    throw new Error('خطا در آپلود تصویر');
  }
};

/**
 * Delete image from server
 * @param imageUrl - URL of image to delete
 * @returns Success status
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Mock implementation - در محیط واقعی باید فایل واقعی حذف شود
    logger.info('Image deleted successfully', { imageUrl });
    return true;
  } catch (error) {
    logger.error('Image deletion failed', { error, imageUrl });
    return false;
  }
};

/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result
 */
export const validateImage = (file: any): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return { isValid: false, error: 'فایل تصویر الزامی است' };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return { isValid: false, error: 'فرمت تصویر باید JPG یا PNG باشد' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'حجم تصویر نباید بیش از 5 مگابایت باشد' };
  }

  return { isValid: true };
};

/**
 * Generate thumbnail from image
 * @param imageUrl - Original image URL
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export const generateThumbnail = async (
  imageUrl: string,
  width: number = 300,
  height: number = 200
): Promise<string> => {
  try {
    // Mock implementation - در محیط واقعی باید thumbnail واقعی تولید شود
    const thumbnailUrl = imageUrl.replace('.jpg', `_thumb_${width}x${height}.jpg`);
    
    logger.info('Thumbnail generated', {
      original: imageUrl,
      thumbnail: thumbnailUrl,
      dimensions: { width, height }
    });

    return thumbnailUrl;
  } catch (error) {
    logger.error('Thumbnail generation failed', { error, imageUrl });
    throw new Error('خطا در تولید تصویر کوچک');
  }
}; 