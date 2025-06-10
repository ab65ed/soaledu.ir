import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jest } from '@jest/globals';
import QuestionForm from '../QuestionForm';
import { questionService } from '@/services/api';

// Mock services
jest.mock('@/services/api', () => ({
  questionService: {
    getQuestionById: jest.fn(),
    createQuestion: jest.fn(),
    updateQuestion: jest.fn(),
  },
}));

jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value),
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

describe('QuestionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ایجاد سوال جدید', () => {
    it('باید فرم خالی را نمایش دهد', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      expect(screen.getByText('سوال جدید')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('سوال خود را اینجا بنویسید...')).toHaveValue('');
      expect(screen.getByDisplayValue('multiple-choice')).toBeInTheDocument();
    });

    it('باید اعتبارسنجی متن سوال را انجام دهد', async () => {
      const onSuccess = jest.fn();
      render(<QuestionForm onSuccess={onSuccess} />, { wrapper: createWrapper() });
      
      const submitButton = screen.getByText('ایجاد سوال');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('متن سوال حداقل باید 10 کاراکتر باشد')).toBeInTheDocument();
      });
      
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('باید سوال جدید را با موفقیت ایجاد کند', async () => {
      const mockQuestion = {
        id: '1',
        text: 'این یک سوال تست است',
        type: 'multiple-choice' as const,
        difficulty: 'medium' as const,
        options: ['گزینه 1', 'گزینه 2', 'گزینه 3', 'گزینه 4'],
        correctOptions: [0],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      mockQuestionService.createQuestion.mockResolvedValue(mockQuestion);
      
      const onSuccess = jest.fn();
      render(<QuestionForm onSuccess={onSuccess} />, { wrapper: createWrapper() });
      
      // پر کردن فرم
      const textArea = screen.getByPlaceholderText('سوال خود را اینجا بنویسید...');
      fireEvent.change(textArea, { target: { value: 'این یک سوال تست است' } });
      
      // انتخاب گزینه صحیح
      const firstOptionCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(firstOptionCheckbox);
      
      // ارسال فرم
      const submitButton = screen.getByText('ایجاد سوال');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockQuestionService.createQuestion).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalledWith('سوال با موفقیت ایجاد شد');
      });
    });
  });

  describe('ویرایش سوال موجود', () => {
    const existingQuestion = {
      id: '1',
      text: 'سوال موجود',
      type: 'multiple-choice' as const,
      difficulty: 'easy' as const,
      options: ['گزینه 1', 'گزینه 2'],
      correctOptions: [0],
      points: 10,
      explanation: 'توضیحات',
      category: 'ریاضی',
      tags: ['تست', 'آسان'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    it('باید داده‌های سوال موجود را بارگذاری کند', async () => {
      mockQuestionService.getQuestionById.mockResolvedValue(existingQuestion);
      
      render(<QuestionForm questionId="1" />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('سوال موجود')).toBeInTheDocument();
        expect(screen.getByDisplayValue('ریاضی')).toBeInTheDocument();
      });
    });

    it('باید سوال موجود را به‌روزرسانی کند', async () => {
      mockQuestionService.getQuestionById.mockResolvedValue(existingQuestion);
      mockQuestionService.updateQuestion.mockResolvedValue({
        ...existingQuestion,
        text: 'سوال به‌روزرسانی شده',
      });
      
      const onSuccess = jest.fn();
      render(<QuestionForm questionId="1" onSuccess={onSuccess} />, { wrapper: createWrapper() });
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('سوال موجود')).toBeInTheDocument();
      });
      
      // تغییر متن سوال
      const textArea = screen.getByDisplayValue('سوال موجود');
      fireEvent.change(textArea, { target: { value: 'سوال به‌روزرسانی شده' } });
      
      // ارسال فرم
      const submitButton = screen.getByText('به‌روزرسانی');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockQuestionService.updateQuestion).toHaveBeenCalledWith('1', expect.objectContaining({
          text: 'سوال به‌روزرسانی شده',
        }));
        expect(onSuccess).toHaveBeenCalledWith('سوال با موفقیت به‌روزرسانی شد');
      });
    });
  });

  describe('انواع مختلف سوال', () => {
    it('باید گزینه‌ها را برای سوالات چندگزینه‌ای نمایش دهد', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      expect(screen.getByText('گزینه‌ها')).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText(/گزینه \d/)).toHaveLength(4);
    });

    it('باید پاسخ درست/غلط را برای سوالات درست/غلط نمایش دهد', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      // تغییر نوع سوال به درست/غلط
      const typeSelect = screen.getByDisplayValue('multiple-choice');
      fireEvent.change(typeSelect, { target: { value: 'true-false' } });
      
      expect(screen.getByText('پاسخ صحیح')).toBeInTheDocument();
      expect(screen.getByLabelText('درست')).toBeInTheDocument();
      expect(screen.getByLabelText('غلط')).toBeInTheDocument();
    });
  });

  describe('مدیریت برچسب‌ها', () => {
    it('باید برچسب جدید اضافه کند', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      const tagInput = screen.getByPlaceholderText('برچسب جدید اضافه کنید');
      const addButton = screen.getByText('افزودن');
      
      fireEvent.change(tagInput, { target: { value: 'برچسب-تست' } });
      fireEvent.click(addButton);
      
      expect(screen.getByText('برچسب-تست')).toBeInTheDocument();
    });

    it('باید برچسب را حذف کند', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      // اضافه کردن برچسب
      const tagInput = screen.getByPlaceholderText('برچسب جدید اضافه کنید');
      const addButton = screen.getByText('افزودن');
      
      fireEvent.change(tagInput, { target: { value: 'برچسب-تست' } });
      fireEvent.click(addButton);
      
      // حذف برچسب
      const removeButton = screen.getByText('×');
      fireEvent.click(removeButton);
      
      expect(screen.queryByText('برچسب-تست')).not.toBeInTheDocument();
    });
  });

  describe('قالب‌های آماده', () => {
    it('باید قالب آماده را اعمال کند', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      const templateButton = screen.getByText('تعریف');
      fireEvent.click(templateButton);
      
      const textArea = screen.getByPlaceholderText('سوال خود را اینجا بنویسید...');
      expect(textArea).toHaveValue('تعریف ... چیست؟');
    });
  });

  describe('پیش‌نمایش', () => {
    it('باید پیش‌نمایش سوال را نمایش دهد', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      // پر کردن متن سوال
      const textArea = screen.getByPlaceholderText('سوال خود را اینجا بنویسید...');
      fireEvent.change(textArea, { target: { value: 'این یک سوال تست است' } });
      
      // باز کردن پیش‌نمایش
      const previewButton = screen.getByText('پیش‌نمایش');
      fireEvent.click(previewButton);
      
      expect(screen.getByText('پیش‌نمایش سوال')).toBeInTheDocument();
      expect(screen.getByText('این یک سوال تست است')).toBeInTheDocument();
    });
  });

  describe('اعتبارسنجی فیلدها', () => {
    it('باید خطای امتیاز نامعتبر را نمایش دهد', async () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      const pointsInput = screen.getByDisplayValue('10');
      fireEvent.change(pointsInput, { target: { value: '150' } });
      
      const submitButton = screen.getByText('ایجاد سوال');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('امتیاز حداکثر باید 100 باشد')).toBeInTheDocument();
      });
    });

    it('باید شماره صفحه را اعتبارسنجی کند', () => {
      render(<QuestionForm />, { wrapper: createWrapper() });
      
      const pageInput = screen.getByPlaceholderText('مثل: 125');
      
      // تست ورودی معتبر
      fireEvent.change(pageInput, { target: { value: '123' } });
      expect(pageInput).toHaveValue('123');
      
      // تست ورودی نامعتبر
      fireEvent.change(pageInput, { target: { value: 'abc' } });
      expect(pageInput).toHaveValue('123'); // باید تغییر نکند
    });
  });

  describe('انصراف', () => {
    it('باید تابع onCancel را فراخوانی کند', () => {
      const onCancel = jest.fn();
      render(<QuestionForm onCancel={onCancel} />, { wrapper: createWrapper() });
      
      const cancelButton = screen.getByText('انصراف');
      fireEvent.click(cancelButton);
      
      expect(onCancel).toHaveBeenCalled();
    });
  });
}); 