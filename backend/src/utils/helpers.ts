/**
 * Helper functions for various utilities
 */

/**
 * Generate URL-friendly slug from text
 * @param text - Input text to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    // Replace Persian/Arabic characters with English equivalents
    .replace(/[آا]/g, 'a')
    .replace(/[ب]/g, 'b')
    .replace(/[پ]/g, 'p')
    .replace(/[ت]/g, 't')
    .replace(/[ث]/g, 's')
    .replace(/[ج]/g, 'j')
    .replace(/[چ]/g, 'ch')
    .replace(/[ح]/g, 'h')
    .replace(/[خ]/g, 'kh')
    .replace(/[د]/g, 'd')
    .replace(/[ذ]/g, 'z')
    .replace(/[ر]/g, 'r')
    .replace(/[ز]/g, 'z')
    .replace(/[ژ]/g, 'zh')
    .replace(/[س]/g, 's')
    .replace(/[ش]/g, 'sh')
    .replace(/[ص]/g, 's')
    .replace(/[ض]/g, 'z')
    .replace(/[ط]/g, 't')
    .replace(/[ظ]/g, 'z')
    .replace(/[ع]/g, 'a')
    .replace(/[غ]/g, 'gh')
    .replace(/[ف]/g, 'f')
    .replace(/[ق]/g, 'gh')
    .replace(/[ک]/g, 'k')
    .replace(/[گ]/g, 'g')
    .replace(/[ل]/g, 'l')
    .replace(/[م]/g, 'm')
    .replace(/[ن]/g, 'n')
    .replace(/[و]/g, 'v')
    .replace(/[ه]/g, 'h')
    .replace(/[ی]/g, 'y')
    // Remove special characters and replace spaces with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Format date to Persian format
 * @param date - Date to format
 * @returns Formatted Persian date string
 */
export const formatPersianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Sanitize HTML content
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML
 */
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

/**
 * Extract plain text from HTML
 * @param html - HTML content
 * @returns Plain text
 */
export const extractTextFromHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
}; 