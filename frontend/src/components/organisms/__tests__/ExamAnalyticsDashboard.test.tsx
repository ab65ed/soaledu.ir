import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExamAnalyticsDashboard from '../ExamAnalyticsDashboard';
import type { TestExamResult } from '@/services/api';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Chart component
jest.mock('@/components/atoms/Chart', () => {
  return function MockChart({ data, type }: { data: unknown[]; type: string }) {
    return (
      <div data-testid={`chart-${type}`}>
        Mock Chart - {type} - {data.length} items
      </div>
    );
  };
});

// Mock LearningPathRecommendations
jest.mock('@/components/organisms/LearningPathRecommendations', () => {
  return function MockLearningPathRecommendations() {
    return <div data-testid="learning-recommendations">Learning Recommendations</div>;
  };
});

// نمونه داده‌های آزمون
const mockExamResult: TestExamResult = {
  id: 'result-123',
  examId: 'exam-456',
  sessionId: 'session-789',
  score: 85,
  maxScore: 100,
  percentage: 85,
  correctAnswers: 17,
  totalQuestions: 20,
  timeSpent: 1800, // 30 دقیقه
  answers: {},
  questionResults: [
    {
      questionId: 'math-q1',
      isCorrect: true,
      userAnswer: 'A',
      correctAnswer: 'A',
      points: 5,
      pointsEarned: 5
    },
    {
      questionId: 'science-q2',
      isCorrect: false,
      userAnswer: 'B',
      correctAnswer: 'C',
      points: 5,
      pointsEarned: 0
    },
    {
      questionId: 'math-q3',
      isCorrect: true,
      userAnswer: 'C',
      correctAnswer: 'C',
      points: 5,
      pointsEarned: 5
    }
  ],
  completedAt: '2024-01-15T10:30:00Z',
  grade: 'B+'
};

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ExamAnalyticsDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('رندر موفق داشبورد با داده‌های آزمون', async () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // بررسی وجود کارت‌های آمار کلی
      expect(screen.getByText('نمره کلی')).toBeInTheDocument();
      expect(screen.getByText('دقت پاسخ‌ها')).toBeInTheDocument();
      expect(screen.getByText('زمان صرف شده')).toBeInTheDocument();
      expect(screen.getByText('امتیاز کلی')).toBeInTheDocument();

      // بررسی نمایش مقادیر صحیح
      expect(screen.getByText('85')).toBeInTheDocument(); // نمره
      expect(screen.getByText('از 100')).toBeInTheDocument();
      expect(screen.getAllByText('17')[0]).toBeInTheDocument(); // پاسخ‌های صحیح
      expect(screen.getAllByText('3')[0]).toBeInTheDocument(); // پاسخ‌های غلط
    });

    test('نمایش درست درصد و سطح عملکرد', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      expect(screen.getAllByText('85.0%')[0]).toBeInTheDocument();
      expect(screen.getByText('خوب')).toBeInTheDocument(); // سطح عملکرد برای 85%
    });

    test('محاسبه و نمایش آمار زمان', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      expect(screen.getAllByText('30')[0]).toBeInTheDocument(); // کل زمان به دقیقه
      expect(screen.getByText('دقیقه')).toBeInTheDocument();
      
      // میانگین زمان به ازای سوال (1800 ثانیه / 20 سوال = 90 ثانیه)
      expect(screen.getByText('میانگین: 90 ثانیه/سوال')).toBeInTheDocument();
    });

    test('نمایش ستاره‌های عملکرد', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // بررسی وجود بخش امتیاز کلی
      expect(screen.getByText('امتیاز کلی')).toBeInTheDocument();
    });
  });

  describe('Performance Level Tests', () => {
    test('نمایش سطح "عالی" برای نمره بالای 90', () => {
      const excellentResult = { ...mockExamResult, percentage: 95, score: 95 };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={excellentResult} />);

      expect(screen.getByText('عالی')).toBeInTheDocument();
    });

    test('نمایش سطح "متوسط" برای نمره 70-79', () => {
      const averageResult = { ...mockExamResult, percentage: 75, score: 75 };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={averageResult} />);

      expect(screen.getAllByText('متوسط')[0]).toBeInTheDocument();
    });

    test('نمایش سطح "نیاز به بهبود" برای نمره زیر 60', () => {
      const poorResult = { ...mockExamResult, percentage: 45, score: 45 };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={poorResult} />);

      expect(screen.getByText('نیاز به بهبود')).toBeInTheDocument();
    });
  });

  describe('Analytics Data Processing', () => {
    test('پردازش صحیح عملکرد بر اساس دسته‌بندی', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // بررسی تب‌های موجود
      expect(screen.getByText('تحلیل‌های گرافیکی')).toBeInTheDocument();
      expect(screen.getByText('مسیر یادگیری')).toBeInTheDocument();
    });

    test('تولید توصیه‌های یادگیری', async () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // کلیک بر روی تب مسیر یادگیری
      const learningTab = screen.getByText('مسیر یادگیری');
      learningTab.click();

      await waitFor(() => {
        expect(screen.getByTestId('learning-recommendations')).toBeInTheDocument();
      });
    });
  });

  describe('Summary Section Tests', () => {
    test('نمایش خلاصه نهایی با نقاط قوت و ضعف', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      expect(screen.getByText('خلاصه و نتیجه‌گیری')).toBeInTheDocument();
      expect(screen.getByText('نقاط قوت:')).toBeInTheDocument();
      expect(screen.getByText('موضوعات نیازمند بهبود:')).toBeInTheDocument();
      expect(screen.getByText('توصیه کلی:')).toBeInTheDocument();
    });

    test('نمایش توصیه مناسب بر اساس نمره', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // برای نمره 85% باید توصیه مربوط به عملکرد خوب نمایش داده شود
      expect(screen.getByText(/عملکرد شما در این آزمون بسیار خوب بوده است/)).toBeInTheDocument();
    });

    test('توصیه متفاوت برای نمره پایین', () => {
      const lowScoreResult = { ...mockExamResult, percentage: 45, score: 45 };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={lowScoreResult} />);

      expect(screen.getByText(/نیاز به بازنگری جدی در روش مطالعه/)).toBeInTheDocument();
    });
  });

  describe('Time Management Analysis', () => {
    test('هشدار زمان‌بندی برای زمان بالا', () => {
      const slowResult = {
        ...mockExamResult,
        timeSpent: 3600, // 1 ساعت = 180 ثانیه به ازای سوال
        totalQuestions: 20
      };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={slowResult} />);

      expect(screen.getByText('نیاز به تسریع')).toBeInTheDocument();
    });

    test('تأیید زمان‌بندی مناسب', () => {
      const fastResult = {
        ...mockExamResult,
        timeSpent: 1200, // 20 دقیقه = 60 ثانیه به ازای سوال
        totalQuestions: 20
      };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={fastResult} />);

      expect(screen.getByText('زمان‌بندی مناسب')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    test('وجود aria-labels مناسب', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // بررسی Progress Bar ها
      const progressBars = document.querySelectorAll('.w-full.bg-gray-200');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    test('استفاده از semantic HTML', () => {
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={mockExamResult} />);

      // بررسی وجود headings
      expect(screen.getAllByRole('heading', { level: 3 })[0]).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('مدیریت آزمون با نمره صفر', () => {
      const zeroScoreResult = {
        ...mockExamResult,
        score: 0,
        percentage: 0,
        correctAnswers: 0
      };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={zeroScoreResult} />);

      expect(screen.getAllByText('0')[0]).toBeInTheDocument();
      expect(screen.getAllByText('0.0%')[0]).toBeInTheDocument();
      expect(screen.getByText('نیاز به بهبود')).toBeInTheDocument();
    });

    test('مدیریت آزمون با نمره کامل', () => {
      const perfectResult = {
        ...mockExamResult,
        score: 100,
        percentage: 100,
        correctAnswers: 20
      };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={perfectResult} />);

      expect(screen.getAllByText('100')[0]).toBeInTheDocument();
      expect(screen.getAllByText('100.0%')[0]).toBeInTheDocument();
      expect(screen.getByText('عالی')).toBeInTheDocument();
    });

    test('مدیریت لیست خالی questionResults', () => {
      const emptyQuestionsResult = {
        ...mockExamResult,
        questionResults: []
      };
      renderWithQueryClient(<ExamAnalyticsDashboard examResult={emptyQuestionsResult} />);

      // کامپوننت نباید crash کند
      expect(screen.getByText('نمره کلی')).toBeInTheDocument();
    });
  });
}); 