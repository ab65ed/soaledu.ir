/**
 * Course Exam Form - Multi-Step Wizard
 * فرم چند مرحله‌ای ایجاد درس-آزمون
 */

'use client';

import React, { memo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Circle,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  HelpCircle,
  AlertCircle,
  Save,
  Clock
} from 'lucide-react';
import { useCourseExamForm, useCreateCourseExam } from '@/hooks/useCourseExam';
import { CourseExamFormData } from '@/types/courseExam';
import { cn } from '@/lib/utils';

// Lazy load step components for better performance
const CourseTypeStep = React.lazy(() => import('./steps/CourseTypeStep'));
const GradeStep = React.lazy(() => import('./steps/GradeStep'));
const GroupStep = React.lazy(() => import('./steps/GroupStep'));
const DetailsStep = React.lazy(() => import('./steps/DetailsStep'));
const QuestionSelectionStep = React.lazy(() => import('./steps/QuestionSelectionStep'));

// ===============================
// Types & Interfaces
// ===============================

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<StepProps>;
}

interface StepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

// ===============================
// Step Configuration
// ===============================

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'نوع درس',
    description: 'انتخاب نوع درس مورد نظر',
    icon: <BookOpen className="w-5 h-5" />,
    component: CourseTypeStep
  },
  {
    id: 2,
    title: 'مقطع تحصیلی',
    description: 'انتخاب مقطع تحصیلی',
    icon: <GraduationCap className="w-5 h-5" />,
    component: GradeStep
  },
  {
    id: 3,
    title: 'گروه آموزشی',
    description: 'انتخاب گروه آموزشی',
    icon: <Users className="w-5 h-5" />,
    component: GroupStep
  },
  {
    id: 4,
    title: 'جزئیات آزمون',
    description: 'تکمیل اطلاعات آزمون',
    icon: <FileText className="w-5 h-5" />,
    component: DetailsStep
  },
  {
    id: 5,
    title: 'انتخاب سوالات',
    description: 'انتخاب سوالات آزمون',
    icon: <HelpCircle className="w-5 h-5" />,
    component: QuestionSelectionStep
  }
];

// ===============================
// Step Indicator Component
// ===============================

const StepIndicator = memo(({ 
  steps, 
  currentStep, 
  onStepClick 
}: {
  steps: StepConfig[];
  currentStep: number;
  onStepClick: (step: number) => void;
}) => (
  <div className="w-full mb-8">
    <div className="flex items-center justify-between relative">
      {/* Progress line */}
      <div className="absolute top-6 left-0 w-full h-0.5 bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isClickable = currentStep >= step.id;

        return (
          <motion.div
            key={step.id}
            className="flex flex-col items-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                "bg-background shadow-sm",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isActive && "border-primary bg-primary/10 text-primary scale-110",
                !isCompleted && !isActive && "border-muted-foreground/30 text-muted-foreground",
                isClickable && "hover:scale-105 cursor-pointer",
                !isClickable && "cursor-not-allowed opacity-50"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : isActive ? (
                step.icon
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>

            <div className="mt-3 text-center max-w-[120px]">
              <p className={cn(
                "text-sm font-medium",
                isActive && "text-primary",
                isCompleted && "text-primary",
                !isCompleted && !isActive && "text-muted-foreground"
              )}>
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
));

StepIndicator.displayName = 'StepIndicator';

// ===============================
// Auto-Save Indicator
// ===============================

const AutoSaveIndicator = memo(({ 
  lastSaved, 
  isSaving 
}: { 
  lastSaved?: Date; 
  isSaving: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 text-sm text-muted-foreground"
  >
    <Save className={cn("w-4 h-4", isSaving && "animate-spin")} />
    {isSaving ? (
      <span>در حال ذخیره...</span>
    ) : lastSaved ? (
      <span>آخرین ذخیره: {lastSaved.toLocaleTimeString('fa-IR')}</span>
    ) : (
      <span>ذخیره خودکار فعال</span>
    )}
  </motion.div>
));

AutoSaveIndicator.displayName = 'AutoSaveIndicator';

// ===============================
// Form Progress Summary
// ===============================

const FormProgressSummary = memo(({ 
  formData, 
  currentStep 
}: { 
  formData: Partial<CourseExamFormData>; 
  currentStep: number; 
}) => {
  const completedFields = Object.keys(formData).filter(key => 
    formData[key as keyof CourseExamFormData] !== undefined && 
    formData[key as keyof CourseExamFormData] !== ''
  ).length;

  const totalRequiredFields = 6; // courseType, grade, group, title, description, selectedQuestions
  const completionPercentage = Math.round((completedFields / totalRequiredFields) * 100);

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">پیشرفت فرم</h3>
            <p className="text-sm text-muted-foreground">
              {completedFields} از {totalRequiredFields} فیلد تکمیل شده
            </p>
          </div>
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {completionPercentage}%
          </Badge>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        {formData.selectedQuestions && formData.selectedQuestions.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{formData.selectedQuestions.length} سوال انتخاب شده</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FormProgressSummary.displayName = 'FormProgressSummary';

// ===============================
// Step Content Wrapper
// ===============================

const StepContentWrapper = memo(({ 
  children, 
  isLoading 
}: { 
  children: React.ReactNode; 
  isLoading?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="min-h-[400px] flex flex-col"
  >
    {isLoading ? (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-1/4" />
      </div>
    ) : (
      children
    )}
  </motion.div>
));

StepContentWrapper.displayName = 'StepContentWrapper';

// ===============================
// Main Component
// ===============================

export const CourseExamForm: React.FC = memo(() => {
  const {
    formState,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    validateCurrentStep,
    resetForm
  } = useCourseExamForm();

  const createMutation = useCreateCourseExam();
  const [lastSaved, setLastSaved] = React.useState<Date>();
  const [isSaving, setIsSaving] = React.useState(false);

  const currentStepConfig = STEPS.find(step => step.id === formState.currentStep);
  const CurrentStepComponent = currentStepConfig?.component;

  // Handle step navigation
  const handleNext = React.useCallback(() => {
    if (validateCurrentStep()) {
      if (formState.currentStep === 5) {
        // Final step - submit form
        handleSubmit();
      } else {
        nextStep();
      }
    }
  }, [formState.currentStep, validateCurrentStep, nextStep]);

  const handlePrev = React.useCallback(() => {
    prevStep();
  }, [prevStep]);

  // Handle form submission
  const handleSubmit = React.useCallback(async () => {
    if (!validateCurrentStep()) return;

    try {
      await createMutation.mutateAsync(formState.formData as CourseExamFormData);
      resetForm();
    } catch (error) {
      console.error('Failed to create course exam:', error);
    }
  }, [formState.formData, validateCurrentStep, createMutation, resetForm]);

  // Auto-save simulation
  React.useEffect(() => {
    if (Object.keys(formState.formData).length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setLastSaved(new Date());
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formState.formData]);

  // Error display
  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ایجاد درس-آزمون جدید</h1>
        <p className="text-muted-foreground">
          با پیروی از مراحل زیر، درس-آزمون خود را ایجاد کنید
        </p>
      </div>

      {/* Progress Summary */}
      <FormProgressSummary 
        formData={formState.formData} 
        currentStep={formState.currentStep} 
      />

      {/* Step Indicator */}
      <StepIndicator
        steps={STEPS}
        currentStep={formState.currentStep}
        onStepClick={goToStep}
      />

      {/* Main Form Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentStepConfig?.icon}
                {currentStepConfig?.title}
              </CardTitle>
              <CardDescription>
                {currentStepConfig?.description}
              </CardDescription>
            </div>
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
          </div>
        </CardHeader>

        <CardContent>
          {/* Error Alert */}
          {hasErrors && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                لطفاً خطاهای زیر را برطرف کنید:
                <ul className="mt-2 list-disc list-inside">
                  {Object.entries(formState.errors).map(([field, error]) => (
                    <li key={field} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <StepContentWrapper key={formState.currentStep}>
              <Suspense fallback={<StepContentWrapper isLoading />}>
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    formData={formState.formData}
                    onUpdate={updateFormData}
                    errors={formState.errors}
                    onNext={handleNext}
                    onPrev={handlePrev}
                  />
                )}
              </Suspense>
            </StepContentWrapper>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={formState.currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          مرحله قبل
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            مرحله {formState.currentStep} از {STEPS.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={formState.isSubmitting || createMutation.isPending}
          className="flex items-center gap-2"
        >
          {formState.currentStep === 5 ? (
            createMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                در حال ایجاد...
              </>
            ) : (
              'ایجاد آزمون'
            )
          ) : (
            <>
              مرحله بعد
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <Progress value={formState.progress} className="h-1" />
      </div>
    </div>
  );
});

CourseExamForm.displayName = 'CourseExamForm';

export default CourseExamForm; 