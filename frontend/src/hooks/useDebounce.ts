/**
 * useDebounce Hook
 * هوک برای تاخیر در اجرای عملیات
 */

import { useState, useEffect } from 'react';

/**
 * Hook برای debounce کردن مقادیر
 * @param value مقدار ورودی
 * @param delay تاخیر به میلی‌ثانیه
 * @returns مقدار debounce شده
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
} 