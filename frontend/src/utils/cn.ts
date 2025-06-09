/**
 * Utility function for merging classnames
 * تابع کمکی برای ترکیب کلاس‌ها
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 