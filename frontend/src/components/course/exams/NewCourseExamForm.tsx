'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseExamService } from '@/services/api';
import QuestionSelector from '@/components/questions/QuestionSelector';
import StarRating from '@/components/molecules/StarRating';
import { toast } from 'react-hot-toast';

// Zod Schema برای اعتبارسنجی فرم
const courseExamSchema = z.object({
  // مرحله 1: نوع درس
  courseType: z.string().min(1, 'نوع درس الزامی است'),
  
  // مرحله 2: مقطع
  grade: z.string().min(1, 'مقطع الزامی است'),
  
  // مرحله 3: گروه
  group: z.string().min(1, 'گروه الزامی است'),
  
  // مرحله 4: جزئیات
  title: z.string().min(3, 'عنوان باید حداقل 3 کاراکتر باشد').max(100, 'عنوان نباید بیش از 100 کاراکتر باشد'),
  description: z.string().min(10, 'توضیحات باید حداقل 10 کاراکتر باشد').max(500, 'توضیحات نباید بیش از 500 کاراکتر باشد'),
  price: z.number().min(1, 'قیمت باید بیش از 0 باشد'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedTime: z.number().min(5, 'زمان تخمینی باید حداقل 5 دقیقه باشد').max(180, 'زمان تخمینی نباید بیش از 180 دقیقه باشد'),
  tags: z.array(z.string()),
  
  // مرحله 5: سوالات
  selectedQuestions: z.array(z.string()).min(1, 'حداقل یک سوال باید انتخاب شود'),
  
  // نظرسنجی
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
});

type CourseExamFormData = z.infer<typeof courseExamSchema>;

// گزینه‌های dropdown ها
const courseTypes = [
  { value: 'math', label: 'ریاضی' },
  { value: 'physics', label: 'فیزیک' },
  { value: 'chemistry', label: 'شیمی' },
  { value: 'biology', label: 'زیست‌شناسی' },
  { value: 'literature', label: 'ادبیات' },
  { value: 'history', label: 'تاریخ' },
  { value: 'geography', label: 'جغرافیا' },
  { value: 'english', label: 'زبان انگلیسی' },
];

const grades = [
  { value: 'elementary', label: 'ابتدایی' },
  { value: 'middle', label: 'متوسطه اول' },
  { value: 'high', label: 'متوسطه دوم' },
  { value: 'university', label: 'دانشگاهی' },
];

const groups = [
  { value: 'math-physics', label: 'ریاضی-فیزیک' },
  { value: 'experimental', label: 'تجربی' },
  { value: 'humanities', label: 'انسانی' },
  { value: 'art', label: 'هنر' },
  { value: 'technical', label: 'فنی-حرفه‌ای' },
];

const difficulties = [
  { value: 'easy', label: 'آسان', color: 'text-green-600' },
  { value: 'medium', label: 'متوسط', color: 'text-yellow-600' },
  { value: 'hard', label: 'سخت', color: 'text-red-600' },
];

export default function NewCourseExamForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showRating, setShowRating] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CourseExamFormData>({
    resolver: zodResolver(courseExamSchema),
    mode: 'onChange',
    defaultValues: {
      price: 30,
      difficulty: 'medium',
      estimatedTime: 60,
      tags: [],
      selectedQuestions: [],
    },
  });

  // Mutation برای ایجاد درس-آزمون
  const createCourseExamMutation = useMutation({
    mutationFn: courseExamService.createCourseExam,
    onSuccess: () => {
      toast.success('درس-آزمون با موفقیت ایجاد شد!');
      queryClient.invalidateQueries({ queryKey: ['courseExams'] });
      setShowRating(true);
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد درس-آزمون: ${error.message}`);
    },
  });

  const watchedValues = watch();

  // تابع رفتن به مرحله بعد
  const nextStep = async () => {
    let fieldsToValidate: (keyof CourseExamFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['courseType'];
        break;
      case 2:
        fieldsToValidate = ['grade'];
        break;
      case 3:
        fieldsToValidate = ['group'];
        break;
      case 4:
        fieldsToValidate = ['title', 'description', 'price', 'difficulty', 'estimatedTime'];
        break;
      case 5:
        fieldsToValidate = ['selectedQuestions'];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // تابع برگشت به مرحله قبل
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // تابع ارسال فرم
  const onSubmit = (formData: CourseExamFormData) => {
    const submitData = {
      ...formData,
      selectedQuestions,
      questionCount: selectedQuestions.length,
    };
    
    createCourseExamMutation.mutate(submitData);
  };

  // تابع ارسال نظرسنجی
  const handleRatingSubmit = (userRating: number, userFeedback?: string) => {
    // ارسال نظرسنجی به سرور
    console.log('Rating:', userRating, 'Feedback:', userFeedback);
    toast.success('نظر شما ثبت شد. متشکریم!');
    setShowRating(false);
    // ریدایرکت به داشبورد یا صفحه لیست درس‌ها
  };

  // رندر مرحله فعلی
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              نوع درس را انتخاب کنید
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {courseTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${watchedValues.courseType === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('courseType')}
                    className="sr-only"
                  />
                  <span className="font-medium">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.courseType && (
              <p className="text-red-500 text-sm text-center">{errors.courseType.message}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              مقطع تحصیلی را انتخاب کنید
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {grades.map((grade) => (
                <label
                  key={grade.value}
                  className={`
                    flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${watchedValues.grade === grade.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={grade.value}
                    {...register('grade')}
                    className="sr-only"
                  />
                  <span className="font-medium">{grade.label}</span>
                </label>
              ))}
            </div>
            {errors.grade && (
              <p className="text-red-500 text-sm text-center">{errors.grade.message}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              گروه آموزشی را انتخاب کنید
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <label
                  key={group.value}
                  className={`
                    flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${watchedValues.group === group.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={group.value}
                    {...register('group')}
                    className="sr-only"
                  />
                  <span className="font-medium">{group.label}</span>
                </label>
              ))}
            </div>
            {errors.group && (
              <p className="text-red-500 text-sm text-center">{errors.group.message}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              جزئیات درس-آزمون
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* عنوان */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان درس-آزمون *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: آزمون ریاضی پایه دهم - فصل اول"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* توضیحات */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="توضیح کاملی از محتوای درس-آزمون ارائه دهید..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* قیمت */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت (تومان) *
                </label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* سطح سختی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سطح سختی *
                </label>
                <select
                  {...register('difficulty')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>
                )}
              </div>

              {/* زمان تخمینی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  زمان تخمینی (دقیقه) *
                </label>
                <input
                  type="number"
                  {...register('estimatedTime', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="180"
                />
                {errors.estimatedTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.estimatedTime.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              انتخاب سوالات
            </h2>
            <QuestionSelector
              selectedQuestions={selectedQuestions}
              onQuestionsChange={(questions) => {
                setSelectedQuestions(questions);
                setValue('selectedQuestions', questions);
              }}
              filters={{
                courseType: watchedValues.courseType,
                grade: watchedValues.grade,
                difficulty: watchedValues.difficulty,
              }}
            />
            {errors.selectedQuestions && (
              <p className="text-red-500 text-sm text-center">{errors.selectedQuestions.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold
                ${step <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all
            ${currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
            }
          `}
        >
          مرحله قبل
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all"
          >
            مرحله بعد
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={createCourseExamMutation.isPending}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {createCourseExamMutation.isPending ? 'در حال ایجاد...' : 'ایجاد درس-آزمون'}
          </button>
        )}
      </div>

      {/* Rating Modal */}
      {showRating && (
        <StarRating
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
} 