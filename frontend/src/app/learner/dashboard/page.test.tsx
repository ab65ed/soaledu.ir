/**
 * تست‌های صفحه داشبورد فراگیر
 * Tests for Learner Dashboard Page
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jest } from '@jest/globals';
import LearnerDashboardPage from './page';
import { learnerService } from '@/services/api';

// Mock components
jest.mock('@/components/learner/LearnerOverview', () => {
  return function MockLearnerOverview({ data }: { data?: unknown }) {
    return (
      <div data-testid="learner-overview">
        {data ? 'Learner Overview with data' : 'Learner Overview loading'}
      </div>
    );
  };
});

// Mock API service
jest.mock('@/services/api', () => ({
  learnerService: {
    getLearnerOverview: jest.fn(),
  },
}));

const mockLearnerService = learnerService as jest.Mocked<typeof learnerService>;

describe('LearnerDashboardPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('نمایش loader در حالت بارگذاری', async () => {
    // تنظیم API برای پاسخ pending
    mockLearnerService.getLearnerOverview.mockImplementation(
      () => new Promise(() => {}) // Promise که resolve نمی‌شود
    );

    renderWithProviders(<LearnerDashboardPage />);

    expect(screen.getByText('در حال بارگذاری داشبورد...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('نمایش خطا در صورت شکست در بارگذاری', async () => {
    // تنظیم API برای خطا
    mockLearnerService.getLearnerOverview.mockRejectedValue(
      new Error('خطا در دریافت اطلاعات')
    );

    renderWithProviders(<LearnerDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('خطا در بارگذاری')).toBeInTheDocument();
      expect(screen.getByText('لطفاً دوباره تلاش کنید')).toBeInTheDocument();
    });
  });

  it('نمایش داشبورد با داده‌های صحیح', async () => {
    const mockData = {
      exams: [],
      wallet: {
        balance: 100000,
        totalSpent: 50000,
        rewardsEarned: 1500,
        transactions: [],
        rewards: {
          current: 15000,
          target: 120000,
          level: 'نقره‌ای',
        },
      },
      progress: {
        totalExamsCompleted: 5,
        totalTimeSpent: 7200,
        averageScore: 85.5,
        strongSubjects: ['ریاضی', 'فیزیک'],
        weakSubjects: ['شیمی'],
        recentActivity: [],
      },
      recentExams: [],
      recommendations: [],
    };

    mockLearnerService.getLearnerOverview.mockResolvedValue(mockData);

    renderWithProviders(<LearnerDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('داشبورد فراگیر')).toBeInTheDocument();
      expect(screen.getByText('مشاهده آزمون‌ها، پیشرفت و عملکرد خود')).toBeInTheDocument();
      expect(screen.getByTestId('learner-overview')).toBeInTheDocument();
      expect(screen.getByText('Learner Overview with data')).toBeInTheDocument();
    });
  });

  it('فراخوانی API با تنظیمات صحیح', async () => {
    const mockData = {
      exams: [],
      wallet: {
        balance: 0,
        totalSpent: 0,
        rewardsEarned: 0,
        transactions: [],
        rewards: { current: 0, target: 0, level: '' },
      },
      progress: {
        totalExamsCompleted: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        strongSubjects: [],
        weakSubjects: [],
        recentActivity: [],
      },
      recentExams: [],
      recommendations: [],
    };

    mockLearnerService.getLearnerOverview.mockResolvedValue(mockData);

    renderWithProviders(<LearnerDashboardPage />);

    await waitFor(() => {
      expect(mockLearnerService.getLearnerOverview).toHaveBeenCalledTimes(1);
    });
  });

  it('اعمال استایل‌های RTL و responsive', async () => {
    const mockData = {
      exams: [],
      wallet: {
        balance: 0,
        totalSpent: 0,
        rewardsEarned: 0,
        transactions: [],
        rewards: { current: 0, target: 0, level: '' },
      },
      progress: {
        totalExamsCompleted: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        strongSubjects: [],
        weakSubjects: [],
        recentActivity: [],
      },
      recentExams: [],
      recommendations: [],
    };

    mockLearnerService.getLearnerOverview.mockResolvedValue(mockData);

    renderWithProviders(<LearnerDashboardPage />);

    await waitFor(() => {
      const mainContainer = screen.getByText('داشبورد فراگیر').closest('div');
      expect(mainContainer).toHaveClass('rtl');
      expect(mainContainer).toHaveClass('min-h-screen');
      expect(mainContainer).toHaveClass('bg-gray-50');
    });
  });

  it('accessibility بررسی ARIA attributes', async () => {
    const mockData = {
      exams: [],
      wallet: {
        balance: 0,
        totalSpent: 0,
        rewardsEarned: 0,
        transactions: [],
        rewards: { current: 0, target: 0, level: '' },
      },
      progress: {
        totalExamsCompleted: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        strongSubjects: [],
        weakSubjects: [],
        recentActivity: [],
      },
      recentExams: [],
      recommendations: [],
    };

    mockLearnerService.getLearnerOverview.mockResolvedValue(mockData);

    renderWithProviders(<LearnerDashboardPage />);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('داشبورد فراگیر');
    });
  });
}); 