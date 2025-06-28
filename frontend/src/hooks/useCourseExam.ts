/**
 * Course Exam Custom Hooks
 * هوک‌های سفارشی برای مدیریت درس-آزمون
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import courseExamService from '@/services/courseExamService';
import {
  CourseExamFormData,
  CourseExamFormState,
  Question,
  QuestionFilters,
  CourseExam,
  CourseExamStepSchema,
  BasicInfo,
  ExamSettings
} from '@/types/courseExam';

// ===============================
// Form Management Hook
// ===============================

export const useCourseExamForm = () => {
  const [formState, setFormState] = useState<CourseExamFormState>({
    currentStep: 1,
    formData: {},
    isSubmitting: false,
    errors: {},
    progress: 0
  });

  const queryClient = useQueryClient();

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (Object.keys(formState.formData).length > 0) {
        courseExamService.autoSave(formState.formData);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formState.formData]);

  // Load auto-saved data on mount
  useEffect(() => {
    const savedData = courseExamService.loadAutoSavedData();
    if (savedData) {
      setFormState(prev => ({
        ...prev,
        formData: savedData
      }));
    }
  }, []);

  const updateFormData = useCallback((data: Partial<CourseExamFormData>) => {
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      errors: {} // Clear errors when data changes
    }));
  }, []);

  const nextStep = useCallback(() => {
    setFormState(prev => {
      const newStep = Math.min(prev.currentStep + 1, 5);
      return {
        ...prev,
        currentStep: newStep,
        progress: (newStep / 5) * 100
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setFormState(prev => {
      const newStep = Math.max(prev.currentStep - 1, 1);
      return {
        ...prev,
        currentStep: newStep,
        progress: (newStep / 5) * 100
      };
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 5) {
      setFormState(prev => ({
        ...prev,
        currentStep: step,
        progress: (step / 5) * 100
      }));
    }
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    const { currentStep, formData } = formState;
    const errors: Record<string, string> = {};

    try {
      switch (currentStep) {
        case 1:
          if (!formData.courseType) {
            errors.courseType = 'نوع درس الزامی است';
          }
          break;
        case 2:
          if (!formData.grade) {
            errors.grade = 'مقطع الزامی است';
          }
          break;
        case 3:
          if (!formData.group) {
            errors.group = 'گروه الزامی است';
          }
          break;
        case 4:
          // Validate step 4 fields
          const step4Schema = CourseExamStepSchema.pick({
            title: true,
            description: true,
            estimatedTime: true,
            price: true
          });
          step4Schema.parse(formData);
          break;
        case 5:
          if (!formData.selectedQuestions || formData.selectedQuestions.length === 0) {
            errors.selectedQuestions = 'حداقل یک سوال باید انتخاب شود';
          }
          break;
      }
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
      }
    }

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [formState]);

  const resetForm = useCallback(() => {
    setFormState({
      currentStep: 1,
      formData: {},
      isSubmitting: false,
      errors: {},
      progress: 0
    });
    courseExamService.clearAutoSavedData();
  }, []);

  return {
    formState,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    resetForm,
    setFormState
  };
};

// ===============================
// API Hooks
// ===============================

export const useCreateCourseExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseExamFormData) => courseExamService.createCourseExam(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courseExams'] });
      courseExamService.clearAutoSavedData();
      toast({
        title: 'موفقیت',
        description: 'درس-آزمون با موفقیت ایجاد شد',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطا',
        description: error.message || 'خطا در ایجاد درس-آزمون',
        variant: 'destructive',
      });
    },
  });
};

export const useCourseExams = (filters: {
  search?: string;
  courseType?: string;
  grade?: string;
  group?: string;
  limit?: number;
  skip?: number;
} = {}) => {
  return useQuery({
    queryKey: ['courseExams', filters],
    queryFn: () => courseExamService.getCourseExams(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export interface CourseExamData {
  basicInfo: BasicInfo;
  participants: {
    students: string[];
    instructors: string[];
  };
  settings: ExamSettings;
}

export const useCourseExam = () => {
  const [examData, setExamData] = useState<CourseExamData>({
    basicInfo: {
      title: '',
      description: '',
      duration: '',
      category: ''
    },
    participants: {
      students: [],
      instructors: []
    },
    settings: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      allowRetake: false,
      showResults: true,
      randomizeQuestions: false,
      requirePassword: false,
      examPassword: '',
      maxAttempts: 1
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBasicInfo = useCallback((data: CourseExamData['basicInfo']) => {
    setExamData(prev => ({
      ...prev,
      basicInfo: data
    }));
  }, []);

  const updateParticipants = useCallback((data: CourseExamData['participants']) => {
    setExamData(prev => ({
      ...prev,
      participants: data
    }));
  }, []);

  const updateSettings = useCallback((data: CourseExamData['settings']) => {
    setExamData(prev => ({
      ...prev,
      settings: data
    }));
  }, []);

  const saveExam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Exam saved:', examData);
      return true;
    } catch (err) {
      setError('خطا در ذخیره آزمون');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [examData]);

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  return {
    examData,
    currentStep,
    isLoading,
    error,
    updateBasicInfo,
    updateParticipants,
    updateSettings,
    saveExam,
    nextStep,
    previousStep,
    goToStep
  };
};

export const useQuestions = (filters: QuestionFilters = {}) => {
  return useQuery({
    queryKey: ['questions', filters],
    queryFn: () => courseExamService.getQuestions(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useQuestionsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['questionsSearch', debouncedQuery],
    queryFn: () => {
      if (!debouncedQuery.trim()) {
        return Promise.resolve([]);
      }
      return courseExamService.searchQuestions(debouncedQuery);
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    searchQuery,
    setSearchQuery,
    questions: questions || [],
    isLoading,
    error
  };
};

// ===============================
// Question Selection Hook
// ===============================

export const useQuestionSelection = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'manual' | 'auto' | 'random'>('manual');

  const toggleQuestion = useCallback((questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  }, []);

  const selectQuestions = useCallback((questionIds: string[]) => {
    setSelectedQuestions(questionIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedQuestions([]);
  }, []);

  const selectRandomQuestions = useCallback((questions: Question[], count: number = 40) => {
    // Implement smart selection algorithm
    const distribution = {
      easy: Math.floor(count * 0.4), // 40% easy
      medium: Math.floor(count * 0.4), // 40% medium
      hard: count - Math.floor(count * 0.4) - Math.floor(count * 0.4) // 20% hard
    };

    const easyQuestions = questions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
    const hardQuestions = questions.filter(q => q.difficulty === 'hard');

    const selected: string[] = [];

    // Select easy questions
    const selectedEasy = easyQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(distribution.easy, easyQuestions.length))
      .map(q => q.id);

    // Select medium questions
    const selectedMedium = mediumQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(distribution.medium, mediumQuestions.length))
      .map(q => q.id);

    // Select hard questions
    const selectedHard = hardQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(distribution.hard, hardQuestions.length))
      .map(q => q.id);

    selected.push(...selectedEasy, ...selectedMedium, ...selectedHard);

    // If we don't have enough questions, fill with remaining
    if (selected.length < count) {
      const remaining = questions
        .filter(q => !selected.includes(q.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, count - selected.length)
        .map(q => q.id);
      
      selected.push(...remaining);
    }

    setSelectedQuestions(selected);
    setSelectionMode('random');
  }, []);

  const getSelectionStats = useCallback((questions: Question[]) => {
    const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));
    
    const distribution = {
      easy: selectedQuestionsData.filter(q => q.difficulty === 'easy').length,
      medium: selectedQuestionsData.filter(q => q.difficulty === 'medium').length,
      hard: selectedQuestionsData.filter(q => q.difficulty === 'hard').length,
    };

    const totalEstimatedTime = selectedQuestionsData.reduce((sum, q) => sum + q.estimatedTime, 0);
    const totalPoints = selectedQuestionsData.reduce((sum, q) => sum + q.points, 0);

    return {
      count: selectedQuestions.length,
      distribution,
      totalEstimatedTime,
      totalPoints,
      isValid: selectedQuestions.length > 0
    };
  }, [selectedQuestions]);

  return {
    selectedQuestions,
    selectionMode,
    toggleQuestion,
    selectQuestions,
    clearSelection,
    selectRandomQuestions,
    getSelectionStats,
    setSelectionMode
  };
};

// ===============================
// A/B Testing Hook
// ===============================

export const useABTest = (testName: string) => {
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    // Simple A/B testing logic
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const isVariantB = Math.abs(hash) % 2 === 0;
    setVariant(isVariantB ? 'B' : 'A');

    // Track the variant assignment
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        test_name: testName,
        variant: isVariantB ? 'B' : 'A'
      });
    }
  }, [testName]);

  const trackConversion = useCallback((eventName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        test_name: testName,
        variant,
        event_name: eventName
      });
    }
  }, [testName, variant]);

  return { variant, trackConversion };
};

// ===============================
// Performance Tracking Hook
// ===============================

export const usePerformanceTracking = () => {
  const trackEvent = useCallback((eventName: string, duration?: number, metadata?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...metadata,
        ...(duration && { value: Math.round(duration) })
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${eventName}`, { duration, metadata });
    }
  }, []);

  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    eventName: string,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      trackEvent(eventName, duration, { ...metadata, success: true });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      trackEvent(eventName, duration, { ...metadata, success: false, error: String(error) });
      throw error;
    }
  }, [trackEvent]);

  return { trackEvent, measureAsync };
}; 