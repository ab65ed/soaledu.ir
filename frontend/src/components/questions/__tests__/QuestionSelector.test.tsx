import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jest } from '@jest/globals';
import QuestionSelector from '../QuestionSelector';
import { questionService } from '@/services/api';

// Mock services
jest.mock('@/services/api', () => ({
  questionService: {
    fetchQuestions: jest.fn(),
  },
}));

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

// Mock react-window
jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemData, itemCount }: { 
    children: (props: { index: number; style: object; data: unknown }) => React.ReactNode; 
    itemData: unknown; 
    itemCount: number 
  }) => (
    <div data-testid="virtualized-list">
      {Array.from({ length: itemCount }, (_, index) =>
        children({ index, style: {}, data: itemData })
      )}
    </div>
  ),
}));

const mockQuestionService = questionService as jest.Mocked<typeof questionService>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return Wrapper;
};

const mockQuestions = [
  {
    id: '1',
    text: 'سوال آسان اول',
    type: 'multiple-choice' as const,
    difficulty: 'easy' as const,
    category: 'ریاضی',
    options: ['گزینه 1', 'گزینه 2'],
    correctOptions: [0],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    text: 'سوال متوسط اول',
    type: 'true-false' as const,
    difficulty: 'medium' as const,
    category: 'علوم',
    correctAnswer: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    text: 'سوال سخت اول',
    type: 'multiple-choice' as const,
    difficulty: 'hard' as const,
    category: 'فیزیک',
    options: ['گزینه 1', 'گزینه 2', 'گزینه 3'],
    correctOptions: [1],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('QuestionSelector', () => {
  const defaultProps = {
    selectedQuestions: [],
    onQuestionsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuestionService.fetchQuestions.mockResolvedValue({
      questions: mockQuestions,
      pagination: {
        total: 3,
        count: 3,
        limit: 100,
        skip: 0,
      },
    });
  });

  describe('رندر اولیه', () => {
    it('باید کامپوننت را با موفقیت رندر کند', async () => {
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      expect(screen.getByText('انتخاب سوالات')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('جستجو در سوالات...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
      });
    });

    it('باید آمار انتخاب شده را نمایش دهد', async () => {
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText('0 از 3 سوال انتخاب شده')).toBeInTheDocument();
      });
    });
  });

  describe('جستجو و فیلترها', () => {
    it('باید جستجو را انجام دهد', async () => {
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      const searchInput = screen.getByPlaceholderText('جستجو در سوالات...');
      fireEvent.change(searchInput, { target: { value: 'ریاضی' } });
      
      await waitFor(() => {
        expect(mockQuestionService.fetchQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'ریاضی',
          })
        );
      });
    });

    it('باید فیلتر سطح سختی را اعمال کند', async () => {
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      const difficultySelect = screen.getByDisplayValue('همه سطوح');
      fireEvent.change(difficultySelect, { target: { value: 'easy' } });
      
      await waitFor(() => {
        expect(mockQuestionService.fetchQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            difficulty: 'easy',
          })
        );
      });
    });

    it('باید فیلتر نوع سوال را اعمال کند', async () => {
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      const typeSelect = screen.getByDisplayValue('همه انواع');
      fireEvent.change(typeSelect, { target: { value: 'multiple-choice' } });
      
      await waitFor(() => {
        expect(mockQuestionService.fetchQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'multiple-choice',
          })
        );
      });
    });
  });

  describe('انتخاب سوالات', () => {
    it('باید سوال را انتخاب کند', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector {...defaultProps} onQuestionsChange={onQuestionsChange} />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
      });
      
      // شبیه‌سازی کلیک روی سوال
      const questionCard = screen.getByText('سوال آسان اول');
      fireEvent.click(questionCard.closest('div')!);
      
      expect(onQuestionsChange).toHaveBeenCalledWith(['1']);
    });

    it('باید انتخاب سوال را لغو کند', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector 
          {...defaultProps} 
          selectedQuestions={['1']}
          onQuestionsChange={onQuestionsChange} 
        />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
      });
      
      // شبیه‌سازی کلیک روی سوال انتخاب شده
      const questionCard = screen.getByText('سوال آسان اول');
      fireEvent.click(questionCard.closest('div')!);
      
      expect(onQuestionsChange).toHaveBeenCalledWith([]);
    });
  });

  describe('انتخاب همه و پاک کردن', () => {
    it('باید همه سوالات را انتخاب کند', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector {...defaultProps} onQuestionsChange={onQuestionsChange} />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByText('انتخاب همه')).toBeInTheDocument();
      });
      
      const selectAllButton = screen.getByText('انتخاب همه');
      fireEvent.click(selectAllButton);
      
      expect(onQuestionsChange).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('باید همه انتخاب‌ها را پاک کند', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector 
          {...defaultProps} 
          selectedQuestions={['1', '2']}
          onQuestionsChange={onQuestionsChange} 
        />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByText('پاک کردن')).toBeInTheDocument();
      });
      
      const clearButton = screen.getByText('پاک کردن');
      fireEvent.click(clearButton);
      
      expect(onQuestionsChange).toHaveBeenCalledWith([]);
    });
  });

  describe('انتخاب هوشمند', () => {
    it('باید انتخاب متعادل 10 سوال را انجام دهد', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector {...defaultProps} onQuestionsChange={onQuestionsChange} />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByText('انتخاب هوشمند')).toBeInTheDocument();
      });
      
      // شبیه‌سازی hover روی دکمه انتخاب هوشمند
      const smartButton = screen.getByText('انتخاب هوشمند');
      fireEvent.mouseEnter(smartButton);
      
      await waitFor(() => {
        expect(screen.getByText('10 سوال متعادل')).toBeInTheDocument();
      });
      
      const balancedButton = screen.getByText('10 سوال متعادل');
      fireEvent.click(balancedButton);
      
      expect(onQuestionsChange).toHaveBeenCalled();
      const calledWith = onQuestionsChange.mock.calls[0][0];
      expect(Array.isArray(calledWith)).toBe(true);
      expect(calledWith.length).toBeLessThanOrEqual(3); // حداکثر 3 سوال داریم
    });

    it('باید انتخاب تصادفی را انجام دهد', async () => {
      const onQuestionsChange = jest.fn();
      render(
        <QuestionSelector {...defaultProps} onQuestionsChange={onQuestionsChange} />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(screen.getByText('انتخاب هوشمند')).toBeInTheDocument();
      });
      
      // شبیه‌سازی hover روی دکمه انتخاب هوشمند
      const smartButton = screen.getByText('انتخاب هوشمند');
      fireEvent.mouseEnter(smartButton);
      
      await waitFor(() => {
        expect(screen.getByText('10 سوال تصادفی')).toBeInTheDocument();
      });
      
      const randomButton = screen.getByText('10 سوال تصادفی');
      fireEvent.click(randomButton);
      
      expect(onQuestionsChange).toHaveBeenCalled();
    });
  });

  describe('حالت‌های مختلف', () => {
    it('باید حالت بارگذاری را نمایش دهد', () => {
      mockQuestionService.fetchQuestions.mockImplementation(
        () => new Promise(() => {}) // Promise که هرگز resolve نمی‌شود
      );
      
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      expect(screen.getByText('در حال بارگذاری سوالات...')).toBeInTheDocument();
    });

    it('باید حالت خطا را نمایش دهد', async () => {
      mockQuestionService.fetchQuestions.mockRejectedValue(new Error('خطا در بارگذاری'));
      
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText('خطا در بارگذاری سوالات')).toBeInTheDocument();
      });
    });

    it('باید حالت عدم وجود سوال را نمایش دهد', async () => {
      mockQuestionService.fetchQuestions.mockResolvedValue({
        questions: [],
        pagination: {
          total: 0,
          count: 0,
          limit: 100,
          skip: 0,
        },
      });
      
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText('سوالی یافت نشد')).toBeInTheDocument();
      });
    });
  });

  describe('A/B Testing', () => {
    it('باید اطلاعات A/B Testing را در development نمایش دهد', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<QuestionSelector {...defaultProps} />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByText(/A\/B Test Variant:/)).toBeInTheDocument();
      });
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('فیلترهای خارجی', () => {
    it('باید فیلترهای خارجی را اعمال کند', async () => {
      const filters = {
        courseType: 'math',
        grade: '10',
        difficulty: 'medium',
      };
      
      render(
        <QuestionSelector {...defaultProps} filters={filters} />, 
        { wrapper: createWrapper() }
      );
      
      await waitFor(() => {
        expect(mockQuestionService.fetchQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            difficulty: 'medium',
          })
        );
      });
    });
  });
}); 