import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewCourseExamForm from '../NewCourseExamForm';
import { courseExamService } from '@/services/api';

// Mock services
jest.mock('@/services/api', () => ({
  courseExamService: {
    createCourseExam: jest.fn(),
  },
}));

// Mock components
jest.mock('@/components/questions/QuestionSelector', () => {
  return function MockQuestionSelector({ onQuestionsChange }: { onQuestionsChange: (questions: string[]) => void }) {
    React.useEffect(() => {
      onQuestionsChange(['question-1', 'question-2']);
    }, [onQuestionsChange]);

    return (
      <div data-testid="question-selector">
        <button 
          data-testid="select-questions"
          onClick={() => onQuestionsChange(['question-1', 'question-2'])}
        >
          انتخاب سوالات
        </button>
      </div>
    );
  };
});

jest.mock('@/components/molecules/StarRating', () => {
  return function MockStarRating({ onSubmit, onClose }: { onSubmit: (rating: number, feedback?: string) => void; onClose: () => void }) {
    return (
      <div data-testid="star-rating">
        <button onClick={() => onSubmit(5, 'عالی')}>ارسال امتیاز</button>
        <button onClick={onClose}>بستن</button>
      </div>
    );
  };
});

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

// Mock the courseExamService for tests
const mockCourseExamService = courseExamService as jest.Mocked<typeof courseExamService>;

describe('NewCourseExamForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('نمایش مرحله اول فرم (انتخاب نوع درس)', () => {
    renderWithProviders(<NewCourseExamForm />);
    
    expect(screen.getByText('نوع درس را انتخاب کنید')).toBeInTheDocument();
    expect(screen.getByText('ریاضی')).toBeInTheDocument();
    expect(screen.getByText('فیزیک')).toBeInTheDocument();
    expect(screen.getByText('شیمی')).toBeInTheDocument();
  });

  it('نمایش progress bar با مرحله فعلی', () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // بررسی وجود progress bar
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle('width: 20%');
  });

  it('غیرفعال بودن دکمه "مرحله قبل" در مرحله اول', () => {
    renderWithProviders(<NewCourseExamForm />);
    
    const prevButton = screen.getByText('مرحله قبل');
    expect(prevButton).toBeDisabled();
  });

  it('انتقال به مرحله بعد پس از انتخاب نوع درس', async () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // انتخاب نوع درس
    fireEvent.click(screen.getByText('ریاضی'));
    
    // کلیک روی مرحله بعد
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getByText('مقطع تحصیلی را انتخاب کنید')).toBeInTheDocument();
    });
  });

  it('عدم انتقال به مرحله بعد بدون انتخاب گزینه', () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // کلیک روی مرحله بعد بدون انتخاب
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    // باید همچنان در مرحله اول باشیم
    expect(screen.getByText('نوع درس را انتخاب کنید')).toBeInTheDocument();
  });

  it('طی کردن تمام مراحل فرم', async () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // مرحله 1: انتخاب نوع درس
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getByText('مقطع تحصیلی را انتخاب کنید')).toBeInTheDocument();
    });
    
    // مرحله 2: انتخاب مقطع
    fireEvent.click(screen.getByText('متوسطه دوم'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getByText('گروه آموزشی را انتخاب کنید')).toBeInTheDocument();
    });
    
    // مرحله 3: انتخاب گروه
    fireEvent.click(screen.getByText('ریاضی-فیزیک'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getByText('جزئیات درس-آزمون')).toBeInTheDocument();
    });
    
    // مرحله 4: وارد کردن جزئیات
    fireEvent.change(screen.getByPlaceholderText('مثال: آزمون ریاضی پایه دهم - فصل اول'), {
      target: { value: 'آزمون ریاضی تست' }
    });
    fireEvent.change(screen.getByPlaceholderText('توضیح کاملی از محتوای درس-آزمون ارائه دهید...'), {
      target: { value: 'این یک آزمون تستی برای ریاضی است' }
    });
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getAllByText('انتخاب سوالات')[0]).toBeInTheDocument();
    });
  });

  it('اعتبارسنجی فیلدهای الزامی در مرحله جزئیات', async () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // رفتن به مرحله 4
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('متوسطه دوم'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('ریاضی-فیزیک'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('جزئیات درس-آزمون')).toBeInTheDocument();
    });
    
    // تلاش برای رفتن به مرحله بعد بدون پر کردن فیلدها
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    // باید همچنان در مرحله 4 باشیم
    expect(screen.getByText('جزئیات درس-آزمون')).toBeInTheDocument();
  });

  it('نمایش کامپوننت QuestionSelector در مرحله 5', async () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // طی کردن مراحل تا مرحله 5
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('متوسطه دوم'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('ریاضی-فیزیک'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('مثال: آزمون ریاضی پایه دهم - فصل اول'), {
        target: { value: 'آزمون ریاضی تست' }
      });
      fireEvent.change(screen.getByPlaceholderText('توضیح کاملی از محتوای درس-آزمون ارائه دهید...'), {
        target: { value: 'این یک آزمون تستی برای ریاضی است' }
      });
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('question-selector')).toBeInTheDocument();
    });
  });

  it('ارسال فرم پس از انتخاب سوالات', async () => {
    mockCourseExamService.createCourseExam.mockResolvedValue({
      id: '1',
      title: 'آزمون تست',
      courseType: 'math',
      grade: 'high',
      group: 'math-physics',
      description: 'این یک آزمون تستی برای ریاضی است',
      tags: [],
      isPublished: false,
      isDraft: true,
      questionCount: 2,
      totalSales: 0,
      revenue: 0,
      difficulty: 'medium',
      estimatedTime: 60,
      price: 30,
      authorId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    renderWithProviders(<NewCourseExamForm />);
    
    // طی کردن تمام مراحل
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('متوسطه دوم'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('ریاضی-فیزیک'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('مثال: آزمون ریاضی پایه دهم - فصل اول'), {
        target: { value: 'آزمون ریاضی تست' }
      });
      fireEvent.change(screen.getByPlaceholderText('توضیح کاملی از محتوای درس-آزمون ارائه دهید...'), {
        target: { value: 'این یک آزمون تستی برای ریاضی است' }
      });
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      // انتخاب سوالات
      fireEvent.click(screen.getByTestId('select-questions'));
      
      // ارسال فرم
      fireEvent.click(screen.getByText('ایجاد درس-آزمون'));
    });
    
    await waitFor(() => {
      expect(mockCourseExamService.createCourseExam).toHaveBeenCalledWith(
        expect.objectContaining({
          courseType: 'math',
          grade: 'high',
          group: 'math-physics',
          title: 'آزمون ریاضی تست',
          description: 'این یک آزمون تستی برای ریاضی است',
          selectedQuestions: ['question-1', 'question-2'],
          questionCount: 2,
        })
      );
    });
  });

  it('نمایش کامپوننت StarRating پس از ایجاد موفق درس-آزمون', async () => {
    mockCourseExamService.createCourseExam.mockResolvedValue({
      id: '1',
      title: 'آزمون تست',
      courseType: 'math',
      grade: 'high',
      group: 'math-physics',
      description: 'این یک آزمون تستی برای ریاضی است',
      tags: [],
      isPublished: false,
      isDraft: true,
      questionCount: 2,
      totalSales: 0,
      revenue: 0,
      difficulty: 'medium',
      estimatedTime: 60,
      price: 30,
      authorId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    renderWithProviders(<NewCourseExamForm />);
    
    // طی کردن فرم و ارسال
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('متوسطه دوم'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('ریاضی-فیزیک'));
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('مثال: آزمون ریاضی پایه دهم - فصل اول'), {
        target: { value: 'آزمون ریاضی تست' }
      });
      fireEvent.change(screen.getByPlaceholderText('توضیح کاملی از محتوای درس-آزمون ارائه دهید...'), {
        target: { value: 'این یک آزمون تستی برای ریاضی است' }
      });
      fireEvent.click(screen.getByText('مرحله بعد'));
    });
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('select-questions'));
      fireEvent.click(screen.getByText('ایجاد درس-آزمون'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    });
  });

  it('بازگشت به مرحله قبل', async () => {
    renderWithProviders(<NewCourseExamForm />);
    
    // رفتن به مرحله 2
    fireEvent.click(screen.getByText('ریاضی'));
    fireEvent.click(screen.getByText('مرحله بعد'));
    
    await waitFor(() => {
      expect(screen.getByText('مقطع تحصیلی را انتخاب کنید')).toBeInTheDocument();
    });
    
    // بازگشت به مرحله 1
    fireEvent.click(screen.getByText('مرحله قبل'));
    
    await waitFor(() => {
      expect(screen.getByText('نوع درس را انتخاب کنید')).toBeInTheDocument();
    });
  });
}); 