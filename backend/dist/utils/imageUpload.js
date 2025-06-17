"use strict";
/**
 * Image Upload Utilities
 * ابزارهای آپلود و مدیریت تصاویر
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = exports.validateImage = exports.deleteImage = exports.uploadImage = void 0;
const logger_1 = require("./logger");
/**
 * Upload image to server
 * @param imageData - Image data or file path
 * @param folder - Upload folder name
 * @returns Upload result
 */
const uploadImage = async (imageData, folder = 'general') => {
    try {
        // Mock implementation - در محیط واقعی باید با سرویس آپلود واقعی جایگزین شود
        const mockResult = {
            url: `https://example.com/uploads/${folder}/${Date.now()}.jpg`,
            uploadedAt: new Date(),
            size: 1024 * 100, // 100KB mock size
            dimensions: {
                width: 800,
                height: 600
            }
        };
        logger_1.logger.info('Image uploaded successfully', {
            folder,
            url: mockResult.url,
            size: mockResult.size
        });
        return mockResult;
    }
    catch (error) {
        logger_1.logger.error('Image upload failed', { error, folder });
        throw new Error('خطا در آپلود تصویر');
    }
};
exports.uploadImage = uploadImage;
/**
 * Delete image from server
 * @param imageUrl - URL of image to delete
 * @returns Success status
 */
const deleteImage = async (imageUrl) => {
    try {
        // Mock implementation - در محیط واقعی باید فایل واقعی حذف شود
        logger_1.logger.info('Image deleted successfully', { imageUrl });
        return true;
    }
    catch (error) {
        logger_1.logger.error('Image deletion failed', { error, imageUrl });
        return false;
    }
};
exports.deleteImage = deleteImage;
/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result
 */
const validateImage = (file) => {
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
exports.validateImage = validateImage;
/**
 * Generate thumbnail from image
 * @param imageUrl - Original image URL
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
const generateThumbnail = async (imageUrl, width = 300, height = 200) => {
    try {
        // Mock implementation - در محیط واقعی باید thumbnail واقعی تولید شود
        const thumbnailUrl = imageUrl.replace('.jpg', `_thumb_${width}x${height}.jpg`);
        logger_1.logger.info('Thumbnail generated', {
            original: imageUrl,
            thumbnail: thumbnailUrl,
            dimensions: { width, height }
        });
        return thumbnailUrl;
    }
    catch (error) {
        logger_1.logger.error('Thumbnail generation failed', { error, imageUrl });
        throw new Error('خطا در تولید تصویر کوچک');
    }
};
exports.generateThumbnail = generateThumbnail;
//# sourceMappingURL=imageUpload.js.map