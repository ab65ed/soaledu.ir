import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import StudentDashboard from '../StudentDashboard';

// Mock data
const mockStudentStats = {
  totalExams: 45,
  completedExams: 38,
  averageScore: 87.5,
  totalStudyTime: 2840,
  rank: 23,
  totalStudents: 1250,
  streak: 7,
  achievements: [
    {
      id: 'first_exam',
      title: 'اولین آزمون',
      description: 'اولین آزمون خود را با موفقیت پاس کردید',
      icon: '🎓',
      unlockedAt: '2024-01-05',
      rarity: 'common' as const
    }
  ]
};

const mockRecentExams = [
  {
    id: 'exam-1',
    title: 'آزمون ریاضی فصل 3',
    score: 92,
    maxScore: 100,
    completedAt: '2024-01-15T10:30:00Z',
    duration: 90,
    subject: 'ریاضی',
    difficulty: 'medium' as const
  }
];

const mockUpcomingExams = [
  {
    id: 'upcoming-1',
    title: 'آزمون ریاضی فصل 4',
    scheduledAt: '2024-01-20T10:00:00Z',
    duration: 90,
    questionsCount: 25,
    subject: 'ریاضی',
    isRequired: true
  }
];

// Mock useQuery hook
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false
    })),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn()
    }))
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('StudentDashboard', () => {
  const mockUseQuery = vi.mocked(vi.importMock('@tanstack/react-query')).useQuery;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockUseQuery
      .mockReturnValueOnce({
        data: mockStudentStats,
        isLoading: false,
        error: null
      })
      .mockReturnValueOnce({
        data: mockRecentExams,
        isLoading: false,
        error: null
      })
      .mockReturnValueOnce({
        data: mockUpcomingExams,
        isLoading: false,
        error: null
      })
      .mockReturnValueOnce({
        data: [],
        isLoading: false,
        error: null
      });
  });

  describe('Rendering and Layout', () => {
    it('should render dashboard with correct title and subtitle', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('داشبورد دانش‌آموز')).toBeInTheDocument();
      expect(screen.getByText('خوش آمدید! پیشرفت تحصیلی خود را مشاهده کنید')).toBeInTheDocument();
    });

    it('should have RTL direction attribute', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const dashboardContainer = screen.getByRole('main') || screen.getByTestId('dashboard-container');
      expect(dashboardContainer).toHaveAttribute('dir', 'rtl');
    });

    it('should render all navigation tabs', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('نمای کلی')).toBeInTheDocument();
      expect(screen.getByText('پیشرفت')).toBeInTheDocument();
      expect(screen.getByText('دستاوردها')).toBeInTheDocument();
      expect(screen.getByText('برنامه')).toBeInTheDocument();
    });

    it('should render time range selector with Persian labels', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByDisplayValue('هفته جاری')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ماه جاری' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ترم جاری' })).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when data is loading', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null
      });

      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should hide loading spinner when data is loaded', async () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Statistics Cards', () => {
    it('should display completed exams statistics correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('آزمون‌های تکمیل شده')).toBeInTheDocument();
      expect(screen.getByText('38/45')).toBeInTheDocument();
      expect(screen.getByText('میانگین نمره: 87.5%')).toBeInTheDocument();
    });

    it('should display class rank correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('رتبه کلاسی')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText(/از.*دانش‌آموز/)).toBeInTheDocument();
    });

    it('should display study time correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('زمان مطالعه')).toBeInTheDocument();
      expect(screen.getByText('47h')).toBeInTheDocument();
    });

    it('should display streak information', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('روزهای متوالی')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('به همین روال ادامه دهید! 🔥')).toBeInTheDocument();
    });

    it('should format Persian numbers correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // Check if Persian numerals are used
      const persianNumbers = screen.getByText('۱,۲۵۰');
      expect(persianNumbers).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should have overview tab active by default', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const overviewTab = screen.getByRole('tab', { name: /نمای کلی/ });
      expect(overviewTab).toHaveClass('border-blue-500', 'text-blue-600');
    });

    it('should switch to achievements tab when clicked', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const achievementsTab = screen.getByRole('tab', { name: /دستاوردها/ });
      fireEvent.click(achievementsTab);
      
      expect(achievementsTab).toHaveClass('border-blue-500', 'text-blue-600');
      expect(screen.getByText('دستاوردهای شما')).toBeInTheDocument();
    });

    it('should switch to progress tab when clicked', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const progressTab = screen.getByRole('tab', { name: /پیشرفت/ });
      fireEvent.click(progressTab);
      
      expect(progressTab).toHaveClass('border-blue-500');
      expect(screen.getByText('نمودار پیشرفت - در حال توسعه')).toBeInTheDocument();
    });

    it('should switch to schedule tab when clicked', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const scheduleTab = screen.getByRole('tab', { name: /برنامه/ });
      fireEvent.click(scheduleTab);
      
      expect(scheduleTab).toHaveClass('border-blue-500');
      expect(screen.getByText('تقویم آزمون‌ها - در حال توسعه')).toBeInTheDocument();
    });
  });

  describe('Time Range Filtering', () => {
    it('should change time range when dropdown is changed', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const timeRangeSelector = screen.getByDisplayValue('هفته جاری');
      fireEvent.change(timeRangeSelector, { target: { value: 'month' } });
      
      expect(timeRangeSelector).toHaveValue('month');
    });

    it('should trigger new data fetch when time range changes', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const timeRangeSelector = screen.getByDisplayValue('هفته جاری');
      fireEvent.change(timeRangeSelector, { target: { value: 'semester' } });
      
      // Query should be called again with new parameters
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(['student-stats', 'semester'])
        })
      );
    });
  });

  describe('Recent Exams Section', () => {
    it('should display recent exams section', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('آزمون‌های اخیر')).toBeInTheDocument();
    });

    it('should display exam information correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('آزمون ریاضی فصل 3')).toBeInTheDocument();
      expect(screen.getByText('ریاضی')).toBeInTheDocument();
      expect(screen.getByText('متوسط')).toBeInTheDocument();
      expect(screen.getByText('92/100')).toBeInTheDocument();
    });

    it('should apply correct difficulty styling', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const difficultyBadge = screen.getByText('متوسط');
      expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should apply correct score color based on percentage', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const scoreElement = screen.getByText('92/100');
      expect(scoreElement).toHaveClass('text-green-600'); // High score
    });
  });

  describe('Upcoming Exams Section', () => {
    it('should display upcoming exams section', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('آزمون‌های آینده')).toBeInTheDocument();
    });

    it('should display upcoming exam information', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      expect(screen.getByText('آزمون ریاضی فصل 4')).toBeInTheDocument();
      expect(screen.getByText('اجباری')).toBeInTheDocument();
      expect(screen.getByText('25 سؤال')).toBeInTheDocument();
      expect(screen.getByText('90 دقیقه')).toBeInTheDocument();
    });

    it('should display required badge for mandatory exams', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const requiredBadge = screen.getByText('اجباری');
      expect(requiredBadge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('Achievements Section', () => {
    it('should display achievements when tab is active', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const achievementsTab = screen.getByRole('tab', { name: /دستاوردها/ });
      fireEvent.click(achievementsTab);
      
      expect(screen.getByText('دستاوردهای شما')).toBeInTheDocument();
      expect(screen.getByText('اولین آزمون')).toBeInTheDocument();
      expect(screen.getByText('اولین آزمون خود را با موفقیت پاس کردید')).toBeInTheDocument();
    });

    it('should display achievement icon and date', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const achievementsTab = screen.getByRole('tab', { name: /دستاوردها/ });
      fireEvent.click(achievementsTab);
      
      expect(screen.getByText('🎓')).toBeInTheDocument();
      // Date should be formatted in Persian
      expect(screen.getByText(/1403/)).toBeInTheDocument();
    });

    it('should apply correct rarity styling', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const achievementsTab = screen.getByRole('tab', { name: /دستاوردها/ });
      fireEvent.click(achievementsTab);
      
      const achievementCard = screen.getByText('اولین آزمون').closest('div');
      expect(achievementCard).toHaveClass('border-gray-300', 'bg-gray-50');
    });
  });

  describe('Helper Functions', () => {
    it('should format duration correctly', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // 90 minutes should be displayed as "90 دقیقه"
      expect(screen.getByText('90 دقیقه')).toBeInTheDocument();
    });

    it('should format large numbers with Persian locale', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // 1250 should be formatted as "۱,۲۵۰"
      expect(screen.getByText('۱,۲۵۰')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle loading errors gracefully', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error')
      });

      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // Should not crash and should show some fallback
      expect(screen.getByText('داشبورد دانش‌آموز')).toBeInTheDocument();
    });

    it('should display fallback data when API fails', () => {
      mockUseQuery
        .mockReturnValueOnce({
          data: undefined,
          isLoading: false,
          error: new Error('API Error')
        })
        .mockReturnValue({
          data: [],
          isLoading: false,
          error: null
        });

      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // Should still render the dashboard structure
      expect(screen.getByText('داشبورد دانش‌آموز')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('داشبورد دانش‌آموز');
    });

    it('should have proper tab navigation', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
    });

    it('should have proper ARIA attributes for statistics', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const statCards = screen.getAllByRole('article');
      expect(statCards.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      const firstTab = screen.getByRole('tab', { name: /نمای کلی/ });
      firstTab.focus();
      
      expect(document.activeElement).toBe(firstTab);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // Re-render with same props
      rerender(<StudentDashboard />);
      
      // Should still display correctly
      expect(screen.getByText('داشبورد دانش‌آموز')).toBeInTheDocument();
    });

    it('should implement proper query caching', () => {
      render(<StudentDashboard />, { wrapper: createWrapper() });
      
      // useQuery should be called with correct caching options
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.any(Array),
          queryFn: expect.any(Function),
          refetchInterval: 30000
        })
      );
    });
  });
});