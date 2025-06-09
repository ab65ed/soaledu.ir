/**
 * Header Component Tests
 * تست‌های ساده کامپوننت هدر
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '../Header';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: () => '/home',
}));

jest.mock('@/stores/authStore', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    canAccessRoute: () => true,
    token: null,
    isLoading: false,
    hasRole: () => false,
    getUserRole: () => null,
    isAdmin: false,
    isLearner: false,
    isSupport: false,
    isExpert: false,
    isDesigner: false,
    setUser: jest.fn(),
    setToken: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    setLoading: jest.fn(),
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useLogout: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    a: 'a',
  },
  AnimatePresence: 'div',
}));

// تنظیمات React Query برای تست
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Header Component', () => {
  test('نمایش لوگو و نام سایت', () => {
    renderWithQueryClient(<Header />);
    
    expect(screen.getByText('سؤال‌ساز')).toBeInTheDocument();
  });

  test('نمایش لینک‌های منوی اصلی', () => {
    renderWithQueryClient(<Header />);
    
    expect(screen.getByText('خانه')).toBeInTheDocument();
    expect(screen.getByText('آزمون‌های درسی')).toBeInTheDocument();
    expect(screen.getByText('آزمون‌های آزمایشی')).toBeInTheDocument();
    expect(screen.getByText('وبلاگ')).toBeInTheDocument();
    expect(screen.getByText('تماس با ما')).toBeInTheDocument();
  });

  test('نمایش دکمه‌های ورود و ثبت‌نام', () => {
    renderWithQueryClient(<Header />);
    
    expect(screen.getByText('ورود')).toBeInTheDocument();
    expect(screen.getByText('ثبت‌نام')).toBeInTheDocument();
  });

  test('رندر بدون خطا', () => {
    expect(() => {
      renderWithQueryClient(<Header />);
    }).not.toThrow();
  });
}); 