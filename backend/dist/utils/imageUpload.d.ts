/**
 * Image Upload Utilities
 * ابزارهای آپلود و مدیریت تصاویر
 */
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
export declare const uploadImage: (imageData: any, folder?: string) => Promise<ImageUploadResult>;
/**
 * Delete image from server
 * @param imageUrl - URL of image to delete
 * @returns Success status
 */
export declare const deleteImage: (imageUrl: string) => Promise<boolean>;
/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result
 */
export declare const validateImage: (file: any) => {
    isValid: boolean;
    error?: string;
};
/**
 * Generate thumbnail from image
 * @param imageUrl - Original image URL
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export declare const generateThumbnail: (imageUrl: string, width?: number, height?: number) => Promise<string>;
