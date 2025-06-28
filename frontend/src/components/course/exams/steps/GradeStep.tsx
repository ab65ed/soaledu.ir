/**
 * Grade Selection Step
 * مرحله انتخاب مقطع تحصیلی
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap,
  BookOpen,
  School,
  University,
  Target,
  ChevronRight,
  Users
} from 'lucide-react';
import { CourseExamFormData, GRADE_LABELS, Grade } from '@/types/courseExam';
import { cn } from '@/lib/utils';

// ===============================
// Types & Interfaces
// ===============================

interface GradeStepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

interface GradeGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  grades: Array<{
    value: Grade;
    label: string;
    popular?: boolean;
  }>;
}

// ===============================
// Grade Groups Configuration
// ===============================

const GRADE_GROUPS: GradeGroup[] = [
  {
    title: 'ابتدایی',
    description: 'پایه‌های اول تا ششم ابتدایی',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-green-500',
    grades: [
      { value: 'elementary-1', label: 'اول ابتدایی' },
      { value: 'elementary-2', label: 'دوم ابتدایی' },
      { value: 'elementary-3', label: 'سوم ابتدایی' },
      { value: 'elementary-4', label: 'چهارم ابتدایی' },
      { value: 'elementary-5', label: 'پنجم ابتدایی' },
      { value: 'elementary-6', label: 'ششم ابتدایی' },
    ]
  },
  {
    title: 'متوسطه اول',
    description: 'پایه‌های هفتم تا نهم',
    icon: <School className="w-5 h-5" />,
    color: 'bg-blue-500',
    grades: [
      { value: 'middle-school-1', label: 'هفتم', popular: true },
      { value: 'middle-school-2', label: 'هشتم', popular: true },
      { value: 'middle-school-3', label: 'نهم', popular: true },
    ]
  },
  {
    title: 'متوسطه دوم',
    description: 'پایه‌های دهم تا دوازدهم',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-purple-500',
    grades: [
      { value: 'high-school-10', label: 'دهم', popular: true },
      { value: 'high-school-11', label: 'یازدهم', popular: true },
      { value: 'high-school-12', label: 'دوازدهم', popular: true },
    ]
  },
  {
    title: 'دانشگاه و کنکور',
    description: 'دوره‌های تخصصی و آمادگی کنکور',
    icon: <University className="w-5 h-5" />,
    color: 'bg-orange-500',
    grades: [
      { value: 'konkur', label: 'کنکور', popular: true },
      { value: 'university', label: 'دانشگاه' },
    ]
  }
];

// ===============================
// Grade Card Component
// ===============================

const GradeCard = memo(({ 
  grade, 
  isSelected, 
  onSelect,
  popular = false
}: {
  grade: { value: Grade; label: string };
  isSelected: boolean;
  onSelect: () => void;
  popular?: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/5"
      )}
      onClick={onSelect}
    >
      {popular && (
        <Badge 
          className="absolute top-2 right-2 z-10 text-xs"
          variant="secondary"
        >
          محبوب
        </Badge>
      )}
      
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
          <h3 className={cn(
            "font-semibold text-sm",
            isSelected && "text-primary"
          )}>
            {grade.label}
          </h3>
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

GradeCard.displayName = 'GradeCard';

// ===============================
// Grade Group Component
// ===============================

const GradeGroupSection = memo(({ 
  group, 
  selectedGrade, 
  onSelect 
}: {
  group: GradeGroup;
  selectedGrade?: Grade;
  onSelect: (grade: Grade) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8"
  >
    <Card className="overflow-hidden">
      <div className={cn("p-4 text-white", group.color)}>
        <div className="flex items-center gap-3">
          {group.icon}
          <div>
            <h3 className="font-semibold text-lg">{group.title}</h3>
            <p className="text-white/90 text-sm">{group.description}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {group.grades.map((grade, index) => (
            <motion.div
              key={grade.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GradeCard
                grade={grade}
                isSelected={selectedGrade === grade.value}
                onSelect={() => onSelect(grade.value)}
                popular={grade.popular}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

GradeGroupSection.displayName = 'GradeGroupSection';

// ===============================
// Popular Grades Section
// ===============================

const PopularGradesSection = memo(({ 
  selectedGrade, 
  onSelect 
}: {
  selectedGrade?: Grade;
  onSelect: (grade: Grade) => void;
}) => {
  const popularGrades = GRADE_GROUPS.flatMap(group => 
    group.grades.filter(grade => grade.popular)
  );

  if (popularGrades.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">مقاطع محبوب</h3>
        <Badge variant="outline" className="text-xs">
          پیشنهادی
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularGrades.map((grade, index) => (
              <motion.div
                key={grade.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GradeCard
                  grade={grade}
                  isSelected={selectedGrade === grade.value}
                  onSelect={() => onSelect(grade.value)}
                  popular={true}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PopularGradesSection.displayName = 'PopularGradesSection';

// ===============================
// Grade Statistics Component
// ===============================

const GradeStatistics = memo(() => (
  <Card className="mb-6">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">آمار انتخاب مقاطع</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">45%</div>
          <div className="text-xs text-muted-foreground">متوسطه دوم</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-500">30%</div>
          <div className="text-xs text-muted-foreground">متوسطه اول</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">15%</div>
          <div className="text-xs text-muted-foreground">کنکور</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-500">10%</div>
          <div className="text-xs text-muted-foreground">ابتدایی</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

GradeStatistics.displayName = 'GradeStatistics';

// ===============================
// Main Component
// ===============================

const GradeStep: React.FC<GradeStepProps> = memo(({
  formData,
  onUpdate,
  errors,
  onNext
}) => {
  const selectedGrade = formData.grade;

  const handleSelect = React.useCallback((grade: Grade) => {
    onUpdate({ grade });
  }, [onUpdate]);

  const handleNext = React.useCallback(() => {
    if (selectedGrade) {
      onNext();
    }
  }, [selectedGrade, onNext]);

  // Auto-proceed to next step after selection (with delay)
  React.useEffect(() => {
    if (selectedGrade && !errors.grade) {
      const timer = setTimeout(() => {
        onNext();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedGrade, errors.grade, onNext]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">مقطع تحصیلی را انتخاب کنید</h2>
        <p className="text-muted-foreground">
          مقطع تحصیلی مناسب برای آزمون خود را مشخص کنید
        </p>
      </div>

      {/* Error Display */}
      {errors.grade && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-center"
        >
          {errors.grade}
        </motion.div>
      )}

      {/* Grade Statistics */}
      <GradeStatistics />

      {/* Popular Grades */}
      <PopularGradesSection
        selectedGrade={selectedGrade}
        onSelect={handleSelect}
      />

      {/* All Grade Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">همه مقاطع</h3>
        {GRADE_GROUPS.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GradeGroupSection
              group={group}
              selectedGrade={selectedGrade}
              onSelect={handleSelect}
            />
          </motion.div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedGrade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="font-medium">
                مقطع انتخاب شده: {GRADE_LABELS[selectedGrade]}
              </span>
            </div>
            <Button
              onClick={handleNext}
              size="sm"
              className="flex items-center gap-2"
            >
              ادامه
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Helper Text */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          💡 نکته: پس از انتخاب، به صورت خودکار به مرحله بعد منتقل می‌شوید
        </p>
      </div>
    </div>
  );
});

GradeStep.displayName = 'GradeStep';

export default GradeStep; 