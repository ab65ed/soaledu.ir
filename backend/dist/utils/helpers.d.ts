/**
 * Helper functions for various utilities
 */
/**
 * Generate URL-friendly slug from text
 * @param text - Input text to convert to slug
 * @returns URL-friendly slug
 */
export declare const generateSlug: (text: string) => string;
/**
 * Format date to Persian format
 * @param date - Date to format
 * @returns Formatted Persian date string
 */
export declare const formatPersianDate: (date: Date) => string;
/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export declare const truncateText: (text: string, length: number) => string;
/**
 * Sanitize HTML content
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML
 */
export declare const sanitizeHtml: (html: string) => string;
/**
 * Extract plain text from HTML
 * @param html - HTML content
 * @returns Plain text
 */
export declare const extractTextFromHtml: (html: string) => string;
