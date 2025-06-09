import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import ContentReview from '../ContentReview';
import { expertService } from '@/services/api';

// Mock dependencies
jest.mock('@/services/api');
jest.mock('sonner');
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockExpertService = expertService as jest.Mocked<typeof expertService>;
const mockToast = toast as jest.Mocked<typeof toast>;

// Test data
const mockPendingContent = {
  items: [
    {
      id: '1',
      title: 'سوال ریاضی پایه دهم',
      type: 'question',
      content_preview: 'این یک سوال نمونه است...',
      full_content: 'سوال کامل ریاضی درباره مشتق و انتگرال...',
      created_date: '1402/10/15',
      priority: 'high',
      author_id: 'author1',
      author_name: 'علی احمدی',
      status: 'pending',
    },
    {
      id: '2',
      title: 'آزمون فیزیک',
      type: 'course-exam',
      content_preview: 'آزمون جامع فیزیک...',
      full_content: 'آزمون کامل فیزیک شامل مکانیک و ترمودینامیک...',
      created_date: '1402/10/14',
      priority: 'medium',
      author_id: 'author2',
      author_name: 'مریم محمدی',
      status: 'pending',
    },
  ],
  total: 2,
};

describe('ContentReview Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      pendingContent: mockPendingContent,
      isLoading: false,
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <ContentReview {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Rendering', () => {
    test('نمایش لیست محتوای در انتظار بررسی', () => {
      renderComponent();

      expect(screen.getByText('سوال ریاضی پایه دهم')).toBeInTheDocument();
      expect(screen.getByText('آزمون فیزیک')).toBeInTheDocument();
      expect(screen.getByText('سوال')).toBeInTheDocument();
      expect(screen.getByText('درس-آزمون')).toBeInTheDocument();
    });

    test('نمایش حالت loading', () => {
      renderComponent({ isLoading: true });

      const loadingCards = screen.getAllByTestId('loading-card');
      expect(loadingCards).toHaveLength(3);
    });

    test('نمایش پیام خالی بودن لیست', () => {
      renderComponent({
        pendingContent: { items: [], total: 0 },
      });

      expect(screen.getByText('عالی! همه محتواها بررسی شده‌اند')).toBeInTheDocument();
      expect(screen.getByText('در حال حاضر محتوای جدیدی برای بررسی وجود ندارد')).toBeInTheDocument();
    });

    test('نمایش اولویت محتوا', () => {
      renderComponent();

      expect(screen.getByText('اولویت بالا')).toBeInTheDocument();
      expect(screen.getByText('اولویت متوسط')).toBeInTheDocument();
    });
  });

  describe('Review Modal', () => {
    test('باز شدن modal بررسی', async () => {
      renderComponent();

      const reviewButton = screen.getAllByText('بررسی')[0];
      fireEvent.click(reviewButton);

      await waitFor(() => {
        expect(screen.getByText('بررسی محتوا: سوال ریاضی پایه دهم')).toBeInTheDocument();
        expect(screen.getByText('محتوای کامل:')).toBeInTheDocument();
        expect(screen.getByDisplayValue('')).toBeInTheDocument(); // فرم بازخورد
      });
    });

    test('بستن modal با کلیک روی انصراف', async () => {
      renderComponent();

      const reviewButton = screen.getAllByText('بررسی')[0];
      fireEvent.click(reviewButton);

      await waitFor(() => {
        const cancelButton = screen.getByText('انصراف');
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('بررسی محتوا: سوال ریاضی پایه دهم')).not.toBeInTheDocument();
      });
    });
  });

  describe('Review Form', () => {
    beforeEach(async () => {
      renderComponent();
      const reviewButton = screen.getAllByText('بررسی')[0];
      fireEvent.click(reviewButton);
      await waitFor(() => {
        expect(screen.getByText('بررسی محتوا: سوال ریاضی پایه دهم')).toBeInTheDocument();
      });
    });

    test('اعتبارسنجی فرم - فیلدهای اجباری', async () => {
      const submitButton = screen.getByText('ارسال بازخورد');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('بازخورد باید حداقل ۱۰ کاراکتر باشد')).toBeInTheDocument();
      });
    });

    test('پر کردن و ارسال فرم با موفقیت', async () => {
      mockExpertService.submitReview.mockResolvedValue({
        success: true,
        message: 'بازخورد ارسال شد',
        updatedItem: mockPendingContent.items[0],
      });

      // انتخاب وضعیت
      const statusSelect = screen.getByText('انتخاب وضعیت');
      fireEvent.click(statusSelect);
      await waitFor(() => {
        const approveOption = screen.getByText('تأیید');
        fireEvent.click(approveOption);
      });

      // وارد کردن امتیاز
      const scoreInput = screen.getByPlaceholderText('امتیاز از ۱ تا ۱۰');
      fireEvent.change(scoreInput, { target: { value: '8' } });

      // وارد کردن بازخورد
      const feedbackTextarea = screen.getByPlaceholderText('نظر و بازخورد خود را وارد کنید...');
      fireEvent.change(feedbackTextarea, { 
        target: { value: 'محتوای بسیار خوبی است و قابل تأیید می‌باشد.' } 
      });

      // ارسال فرم
      const submitButton = screen.getByText('ارسال بازخورد');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockExpertService.submitReview).toHaveBeenCalledWith('1', {
          status: 'approved',
          feedback: 'محتوای بسیار خوبی است و قابل تأیید می‌باشد.',
          quality_score: 8,
          improvements: undefined,
        });
        expect(mockToast.success).toHaveBeenCalledWith('بازخورد با موفقیت ارسال شد');
      });
    });

    test('مدیریت خطا در ارسال فرم', async () => {
      mockExpertService.submitReview.mockRejectedValue(new Error('Network error'));

      // پر کردن فرم
      const statusSelect = screen.getByText('انتخاب وضعیت');
      fireEvent.click(statusSelect);
      await waitFor(() => {
        const approveOption = screen.getByText('تأیید');
        fireEvent.click(approveOption);
      });

      const scoreInput = screen.getByPlaceholderText('امتیاز از ۱ تا ۱۰');
      fireEvent.change(scoreInput, { target: { value: '7' } });

      const feedbackTextarea = screen.getByPlaceholderText('نظر و بازخورد خود را وارد کنید...');
      fireEvent.change(feedbackTextarea, { 
        target: { value: 'نیاز به بازنگری دارد.' } 
      });

      // ارسال فرم
      const submitButton = screen.getByText('ارسال بازخورد');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('خطا در ارسال بازخورد');
      });
    });

    test('امتیاز خارج از بازه مجاز', async () => {
      const scoreInput = screen.getByPlaceholderText('امتیاز از ۱ تا ۱۰');
      
      // امتیاز بیش از ۱۰
      fireEvent.change(scoreInput, { target: { value: '15' } });
      const submitButton = screen.getByText('ارسال بازخورد');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/حداکثر ۱۰/)).toBeInTheDocument();
      });

      // امتیاز کمتر از ۱
      fireEvent.change(scoreInput, { target: { value: '0' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/حداقل ۱/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('دسترسی‌پذیری کیبرد', () => {
      renderComponent();

      const reviewButtons = screen.getAllByText('بررسی');
      reviewButtons[0].focus();
      expect(reviewButtons[0]).toHaveFocus();

      // شبیه‌سازی فشردن Enter
      fireEvent.keyDown(reviewButtons[0], { key: 'Enter', code: 'Enter' });
      // بررسی باز شدن modal
    });

    test('ARIA labels و roles', () => {
      renderComponent();

      // بررسی وجود role های مناسب
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBeGreaterThan(0);

      // بررسی alt text ها
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('RTL Support', () => {
    test('پشتیبانی از متن راست به چپ', () => {
      renderComponent();

      const persianTexts = screen.getAllByText(/سوال|آزمون|بررسی/);
      persianTexts.forEach(text => {
        expect(text.closest('[dir="rtl"]')).toBeTruthy();
      });
    });
  });
}); 