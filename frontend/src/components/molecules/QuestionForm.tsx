'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { questionService, Question } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';

// اعتبارسنجی با Zod
const questionSchema = z.object({
  text: z.string().min(10, 'متن سوال حداقل باید 10 کاراکتر باشد'),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay', 'fill-blank']),
  options: z.array(z.string()).optional(),
  correctOptions: z.array(z.number()).optional(),
  correctAnswer: z.union([z.string(), z.number(), z.boolean()]).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.number().min(1, 'امتیاز حداقل باید 1 باشد').max(100, 'امتیاز حداکثر باید 100 باشد').optional(),
  explanation: z.string().optional(),
  category: z.string().optional(),
  lesson: z.string().optional(),
  tags: z.array(z.string()).optional(),
  timeLimit: z.number().optional(),
  sourcePage: z.string().optional(),
  sourceBook: z.string().optional(),
  sourceChapter: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  questionId?: string | null;
  onSuccess?: (message: string) => void;
  onCancel?: () => void;
}

interface FormState {
  data: QuestionFormData;
  errors: Record<string, string>;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  currentTag: string;
  showPreview: boolean;
}

// قالب‌های آماده سوال
const QUESTION_TEMPLATES = [
  {
    id: 'general',
    name: 'سوال عمومی',
    template: 'سوال خود را اینجا بنویسید...',
  },
  {
    id: 'definition',
    name: 'تعریف',
    template: 'تعریف ... چیست؟',
  },
  {
    id: 'comparison',
    name: 'مقایسه',
    template: 'تفاوت بین ... و ... در چیست؟',
  },
  {
    id: 'calculation',
    name: 'محاسبه',
    template: 'مقدار ... را محاسبه کنید.',
  },
];

export default function QuestionForm({ questionId, onSuccess, onCancel }: QuestionFormProps) {
  const [state, setState] = useState<FormState>({
    data: {
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctOptions: [],
      difficulty: 'medium',
      points: 10,
      explanation: '',
      category: '',
      lesson: '',
      tags: [],
      timeLimit: 120,
      sourcePage: '',
      sourceBook: '',
      sourceChapter: '',
    },
    errors: {},
    isAutoSaving: false,
    lastSaved: null,
    currentTag: '',
    showPreview: false,
  });

  // Debounce برای auto-save
  const debouncedFormData = useDebounce(state.data, 3000);

  // Query برای دریافت سوال موجود
  const { data: existingQuestion } = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => questionService.getQuestionById(questionId!),
    enabled: !!questionId,
  });

  // Mutation برای ایجاد سوال
  const createMutation = useMutation({
    mutationFn: (data: Partial<Question>) => questionService.createQuestion(data),
    onSuccess: () => {
      onSuccess?.('سوال با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      setState(prev => ({
        ...prev,
        errors: { general: error.message || 'خطا در ایجاد سوال' }
      }));
    },
  });

  // Mutation برای به‌روزرسانی سوال
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Question>) => 
      questionService.updateQuestion(questionId!, data),
    onSuccess: () => {
      onSuccess?.('سوال با موفقیت به‌روزرسانی شد');
    },
    onError: (error: Error) => {
      setState(prev => ({
        ...prev,
        errors: { general: error.message || 'خطا در به‌روزرسانی سوال' }
      }));
    },
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (data: QuestionFormData) => {
      if (questionId) {
        // تبدیل داده‌ها به فرمت مناسب برای API
        const apiData: Partial<Question> = {
          ...data,
          correctAnswer: data.type === 'true-false' && typeof data.correctAnswer === 'boolean' 
            ? (data.correctAnswer ? 1 : 0) 
            : data.correctAnswer as string | number | undefined
        };
        await questionService.updateQuestion(questionId, apiData);
      }
    },
    onMutate: () => {
      setState(prev => ({ ...prev, isAutoSaving: true }));
    },
    onSettled: () => {
      setState(prev => ({ 
        ...prev, 
        isAutoSaving: false,
        lastSaved: new Date(),
      }));
    },
  });

  // Auto-save effect
  useEffect(() => {
    if (questionId && debouncedFormData && !state.isAutoSaving) {
      try {
        questionSchema.parse(debouncedFormData);
        autoSaveMutation.mutate(debouncedFormData);
      } catch {
        // اگر اعتبارسنجی شکست خورد، auto-save نکن
      }
    }
  }, [debouncedFormData, questionId, autoSaveMutation, state.isAutoSaving]);

  // Load existing question data
  useEffect(() => {
    if (existingQuestion) {
      setState(prev => ({
        ...prev,
        data: {
          text: existingQuestion.text || '',
          type: existingQuestion.type || 'multiple-choice',
          options: existingQuestion.options || ['', '', '', ''],
          correctOptions: existingQuestion.correctOptions || [],
          difficulty: existingQuestion.difficulty || 'medium',
          points: existingQuestion.points || 10,
          explanation: existingQuestion.explanation || '',
          category: existingQuestion.category || '',
          lesson: existingQuestion.lesson || '',
          tags: existingQuestion.tags || [],
          timeLimit: existingQuestion.timeLimit || 120,
          sourcePage: existingQuestion.sourcePage || '',
          sourceBook: existingQuestion.sourceBook || '',
          sourceChapter: existingQuestion.sourceChapter || '',
        },
      }));
    }
  }, [existingQuestion]);

  // Helper functions
  const updateData = useCallback((updates: Partial<QuestionFormData>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates },
      errors: {},
    }));
  }, []);

  const validateForm = useCallback(() => {
    try {
      questionSchema.parse(state.data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setState(prev => ({ ...prev, errors: newErrors }));
      }
      return false;
    }
  }, [state.data]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // تبدیل داده‌ها به فرمت مناسب برای API
    const apiData: Partial<Question> = {
      ...state.data,
      correctAnswer: state.data.type === 'true-false' && typeof state.data.correctAnswer === 'boolean' 
        ? (state.data.correctAnswer ? 1 : 0) 
        : state.data.correctAnswer as string | number | undefined
    };

    if (questionId) {
      updateMutation.mutate(apiData);
    } else {
      createMutation.mutate(apiData);
    }
  }, [state.data, questionId, validateForm, createMutation, updateMutation]);

  const handleAddOption = useCallback(() => {
    const newOptions = [...(state.data.options || []), ''];
    updateData({ options: newOptions });
  }, [state.data.options, updateData]);

  const handleRemoveOption = useCallback((index: number) => {
    const newOptions = state.data.options?.filter((_, i) => i !== index);
    const newCorrectOptions = state.data.correctOptions?.filter(i => i !== index);
    updateData({ 
      options: newOptions,
      correctOptions: newCorrectOptions,
    });
  }, [state.data.options, state.data.correctOptions, updateData]);

  const handleOptionChange = useCallback((index: number, value: string) => {
    const newOptions = [...(state.data.options || [])];
    newOptions[index] = value;
    updateData({ options: newOptions });
  }, [state.data.options, updateData]);

  const handleCorrectOptionToggle = useCallback((index: number) => {
    const currentCorrect = state.data.correctOptions || [];
    const newCorrect = currentCorrect.includes(index)
      ? currentCorrect.filter(i => i !== index)
      : [...currentCorrect, index];
    updateData({ correctOptions: newCorrect });
  }, [state.data.correctOptions, updateData]);

  const handleAddTag = useCallback(() => {
    if (state.currentTag.trim() && !state.data.tags?.includes(state.currentTag.trim())) {
      const newTags = [...(state.data.tags || []), state.currentTag.trim()];
      updateData({ tags: newTags });
      setState(prev => ({ ...prev, currentTag: '' }));
    }
  }, [state.currentTag, state.data.tags, updateData]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    const newTags = state.data.tags?.filter(tag => tag !== tagToRemove);
    updateData({ tags: newTags });
  }, [state.data.tags, updateData]);

  const handleTemplateSelect = useCallback((template: string) => {
    updateData({ text: template });
  }, [updateData]);

  // Memoized values
  const isSubmitting = useMemo(() => 
    createMutation.isPending || updateMutation.isPending, 
    [createMutation.isPending, updateMutation.isPending]
  );

  const canSubmit = useMemo(() => 
    state.data.text.length >= 10 && !isSubmitting,
    [state.data.text.length, isSubmitting]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {questionId ? 'ویرایش سوال' : 'سوال جدید'}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* نمایش وضعیت Auto-save */}
          {state.isAutoSaving && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2"></div>
              در حال ذخیره...
            </div>
          )}
          
          {state.lastSaved && !state.isAutoSaving && (
            <div className="text-sm text-green-600">
              آخرین ذخیره: {state.lastSaved.toLocaleTimeString('fa-IR')}
            </div>
          )}
          
          <button
            onClick={() => setState(prev => ({ ...prev, showPreview: !prev.showPreview }))}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            {state.showPreview ? 'پنهان کردن' : 'پیش‌نمایش'}
          </button>
        </div>
      </div>

      {/* خطاهای عمومی */}
      {state.errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {state.errors.general}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* قالب‌های آماده */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            قالب‌های آماده
          </label>
          <div className="grid grid-cols-2 gap-2">
            {QUESTION_TEMPLATES.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.template)}
                className="p-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 text-right"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* متن سوال */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            متن سوال *
          </label>
          <textarea
            value={state.data.text}
            onChange={(e) => updateData({ text: e.target.value })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.errors.text ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="سوال خود را اینجا بنویسید..."
          />
          {state.errors.text && (
            <p className="text-red-500 text-sm mt-1">{state.errors.text}</p>
          )}
          <div className="text-sm text-gray-500 mt-1">
            {state.data.text.length}/10 کاراکتر (حداقل)
          </div>
        </div>

        {/* نوع سوال */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع سوال *
          </label>
          <select
            value={state.data.type}
            onChange={(e) => updateData({ 
              type: e.target.value as QuestionFormData['type'],
              options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined,
              correctOptions: e.target.value === 'multiple-choice' ? [] : undefined,
              correctAnswer: e.target.value === 'true-false' ? false : undefined,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="multiple-choice">چندگزینه‌ای</option>
            <option value="true-false">درست/غلط</option>
            <option value="short-answer">پاسخ کوتاه</option>
            <option value="essay">تشریحی</option>
            <option value="fill-blank">جای خالی</option>
          </select>
        </div>

        {/* گزینه‌ها برای سوالات چندگزینه‌ای */}
        {state.data.type === 'multiple-choice' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                گزینه‌ها
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + افزودن گزینه
              </button>
            </div>
            
            <div className="space-y-3">
              {state.data.options?.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={state.data.correctOptions?.includes(index) || false}
                      onChange={() => handleCorrectOptionToggle(index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 mr-2">صحیح</span>
                  </div>
                  
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`گزینه ${index + 1}`}
                  />
                  
                  {(state.data.options?.length || 0) > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* پاسخ صحیح برای سوالات درست/غلط */}
        {state.data.type === 'true-false' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              پاسخ صحیح
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={state.data.correctAnswer === true}
                  onChange={() => updateData({ correctAnswer: true })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="mr-2">درست</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={state.data.correctAnswer === false}
                  onChange={() => updateData({ correctAnswer: false })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="mr-2">غلط</span>
              </label>
            </div>
          </div>
        )}

        {/* سطح سختی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سطح سختی *
          </label>
          <select
            value={state.data.difficulty}
            onChange={(e) => updateData({ difficulty: e.target.value as QuestionFormData['difficulty'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="easy">آسان</option>
            <option value="medium">متوسط</option>
            <option value="hard">سخت</option>
          </select>
        </div>

        {/* Grid برای فیلدهای کوچک */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* امتیاز */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              امتیاز
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={state.data.points || ''}
              onChange={(e) => updateData({ points: parseInt(e.target.value) || undefined })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                state.errors.points ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {state.errors.points && (
              <p className="text-red-500 text-sm mt-1">{state.errors.points}</p>
            )}
          </div>

          {/* محدودیت زمان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محدودیت زمان (ثانیه)
            </label>
            <input
              type="number"
              min="30"
              value={state.data.timeLimit || ''}
              onChange={(e) => updateData({ timeLimit: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* دسته‌بندی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی
            </label>
            <input
              type="text"
              value={state.data.category || ''}
              onChange={(e) => updateData({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="مثل: ریاضی، علوم، ..."
            />
          </div>

          {/* درس */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              درس
            </label>
            <input
              type="text"
              value={state.data.lesson || ''}
              onChange={(e) => updateData({ lesson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="نام درس"
            />
          </div>
        </div>

        {/* برچسب‌ها */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            برچسب‌ها
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={state.currentTag}
              onChange={(e) => setState(prev => ({ ...prev, currentTag: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="برچسب جدید اضافه کنید"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              افزودن
            </button>
          </div>
          
          {state.data.tags && state.data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {state.data.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="mr-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* اطلاعات منبع */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">اطلاعات منبع (اختیاری)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                کتاب منبع
              </label>
              <input
                type="text"
                value={state.data.sourceBook || ''}
                onChange={(e) => updateData({ sourceBook: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فصل
              </label>
              <input
                type="text"
                value={state.data.sourceChapter || ''}
                onChange={(e) => updateData({ sourceChapter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره صفحه (1-9999)
              </label>
              <input
                type="text"
                value={state.data.sourcePage || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 9999)) {
                    updateData({ sourcePage: value });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثل: 125"
              />
            </div>
          </div>
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات پاسخ
          </label>
          <textarea
            value={state.data.explanation || ''}
            onChange={(e) => updateData({ explanation: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="توضیح درباره پاسخ صحیح..."
          />
        </div>

        {/* دکمه‌های عمل */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                canSubmit
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'در حال ذخیره...' : questionId ? 'به‌روزرسانی' : 'ایجاد سوال'}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      </form>

      {/* پیش‌نمایش */}
      <AnimatePresence>
        {state.showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t"
          >
            <h4 className="text-lg font-medium text-gray-900 mb-4">پیش‌نمایش سوال</h4>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-3">{state.data.text}</div>
              
              {state.data.type === 'multiple-choice' && state.data.options && (
                <div className="space-y-2">
                  {state.data.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        state.data.correctOptions?.includes(index)
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-white border border-gray-300'
                      }`}
                    >
                      {index + 1}. {option}
                      {state.data.correctOptions?.includes(index) && (
                        <span className="text-green-600 text-sm mr-2">(صحیح)</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {state.data.type === 'true-false' && (
                <div className="text-gray-600">
                  پاسخ صحیح: {state.data.correctAnswer ? 'درست' : 'غلط'}
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <div>سطح سختی: {
                  state.data.difficulty === 'easy' ? 'آسان' :
                  state.data.difficulty === 'medium' ? 'متوسط' : 'سخت'
                }</div>
                {state.data.points && <div>امتیاز: {state.data.points}</div>}
                {state.data.timeLimit && <div>محدودیت زمان: {state.data.timeLimit} ثانیه</div>}
                {state.data.category && <div>دسته‌بندی: {state.data.category}</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 