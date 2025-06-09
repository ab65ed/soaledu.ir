/**
 * Footer Component Tests
 * تست‌های ساده کامپوننت فوتر
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    a: 'a',
  },
}));

describe('Footer Component', () => {
  test('نمایش لوگو و نام سایت', () => {
    render(<Footer />);
    
    expect(screen.getByText('سؤال‌ساز')).toBeInTheDocument();
  });

  test('نمایش توضیحات سایت', () => {
    render(<Footer />);
    
    expect(screen.getByText(/پلتفرم جامع ایجاد و مدیریت آزمون‌های آموزشی/)).toBeInTheDocument();
  });

  test('نمایش لینک‌های سریع', () => {
    render(<Footer />);
    
    expect(screen.getByText('خدمات')).toBeInTheDocument();
    expect(screen.getByText('پشتیبانی')).toBeInTheDocument();
    expect(screen.getByText('قوانین')).toBeInTheDocument();
  });

  test('نمایش اطلاعات تماس', () => {
    render(<Footer />);
    
    expect(screen.getByText('اطلاعات تماس')).toBeInTheDocument();
    expect(screen.getByText('تلفن تماس')).toBeInTheDocument();
    expect(screen.getByText('ایمیل')).toBeInTheDocument();
    expect(screen.getByText('آدرس')).toBeInTheDocument();
  });

  test('نمایش کپی‌رایت', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} سؤال‌ساز`))).toBeInTheDocument();
  });

  test('نمایش نسخه', () => {
    render(<Footer />);
    
    expect(screen.getByText('نسخه ۱.۰.۰')).toBeInTheDocument();
  });

  test('رندر بدون خطا', () => {
    expect(() => {
      render(<Footer />);
    }).not.toThrow();
  });
}); 