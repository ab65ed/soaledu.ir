/**
 * Course Type Selection Step
 * مرحله انتخاب نوع درس
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calculator,
  Atom,
  TestTube,
  Dna,
  Clock,
  Globe,
  BookOpen,
  Languages,
  MessageCircle,
  MoreHorizontal,
  Search,
  ChevronRight
} from 'lucide-react';
import { CourseExamFormData, COURSE_TYPE_LABELS, CourseType } from '@/types/courseExam';
import { cn } from '@/lib/utils';

// ===============================
// Types & Interfaces
// ===============================

interface CourseTypeStepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

interface CourseTypeOption {
  value: CourseType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  popular?: boolean;
}

// ===============================
// Course Type Options
// ===============================

const COURSE_TYPE_OPTIONS: CourseTypeOption[] = [
  {
    value: 'mathematics',
    label: 'ریاضی',
    icon: <Calculator className="w-6 h-6" />,
    description: 'ریاضی و علوم محاسباتی',
    color: 'bg-blue-500',
    popular: true
  },
  {
    value: 'physics',
    label: 'فیزیک',
    icon: <Atom className="w-6 h-6" />,
    description: 'فیزیک و علوم طبیعی',
    color: 'bg-purple-500',
    popular: true
  },
  {
    value: 'chemistry',
    label: 'شیمی',
    icon: <TestTube className="w-6 h-6" />,
    description: 'شیمی و علوم مولکولی',
    color: 'bg-green-500',
    popular: true
  },
  {
    value: 'biology',
    label: 'زیست‌شناسی',
    icon: <Dna className="w-6 h-6" />,
    description: 'زیست‌شناسی و علوم حیات',
    color: 'bg-emerald-500',
    popular: true
  },
  {
    value: 'history',
    label: 'تاریخ',
    icon: <Clock className="w-6 h-6" />,
    description: 'تاریخ و تمدن',
    color: 'bg-amber-500'
  },
  {
    value: 'geography',
    label: 'جغرافیا',
    icon: <Globe className="w-6 h-6" />,
    description: 'جغرافیا و علوم زمین',
    color: 'bg-cyan-500'
  },
  {
    value: 'literature',
    label: 'ادبیات',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'ادبیات فارسی و کلاسیک',
    color: 'bg-rose-500'
  },
  {
    value: 'english',
    label: 'انگلیسی',
    icon: <Languages className="w-6 h-6" />,
    description: 'زبان انگلیسی',
    color: 'bg-indigo-500'
  },
  {
    value: 'arabic',
    label: 'عربی',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'زبان عربی',
    color: 'bg-orange-500'
  },
  {
    value: 'other',
    label: 'سایر',
    icon: <MoreHorizontal className="w-6 h-6" />,
    description: 'سایر موضوعات',
    color: 'bg-gray-500'
  }
];

// ===============================
// Course Type Card Component
// ===============================

const CourseTypeCard = memo(({ 
  option, 
  isSelected, 
  onSelect 
}: {
  option: CourseTypeOption;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative overflow-hidden",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
      )}
      onClick={onSelect}
    >
      {option.popular && (
        <Badge 
          className="absolute top-2 right-2 z-10 text-xs"
          variant="secondary"
        >
          محبوب
        </Badge>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-3 rounded-lg text-white flex-shrink-0",
            option.color
          )}>
            {option.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1">
              {option.label}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {option.description}
            </p>
          </div>
          
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
));

CourseTypeCard.displayName = 'CourseTypeCard';

// ===============================
// Popular Courses Section
// ===============================

const PopularCoursesSection = memo(({ 
  selectedType, 
  onSelect 
}: {
  selectedType?: CourseType;
  onSelect: (type: CourseType) => void;
}) => {
  const popularCourses = COURSE_TYPE_OPTIONS.filter(option => option.popular);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">دروس محبوب</h3>
        <Badge variant="outline" className="text-xs">
          پیشنهادی
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popularCourses.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseTypeCard
              option={option}
              isSelected={selectedType === option.value}
              onSelect={() => onSelect(option.value)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

PopularCoursesSection.displayName = 'PopularCoursesSection';

// ===============================
// All Courses Section
// ===============================

const AllCoursesSection = memo(({ 
  selectedType, 
  onSelect,
  searchQuery,
  setSearchQuery 
}: {
  selectedType?: CourseType;
  onSelect: (type: CourseType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const filteredCourses = COURSE_TYPE_OPTIONS.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">همه دروس</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="جستجو در دروس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>نتیجه‌ای یافت نشد</p>
          <p className="text-sm">لطفاً کلمه کلیدی دیگری امتحان کنید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CourseTypeCard
                option={option}
                isSelected={selectedType === option.value}
                onSelect={() => onSelect(option.value)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
});

AllCoursesSection.displayName = 'AllCoursesSection';

// ===============================
// Main Component
// ===============================

const CourseTypeStep: React.FC<CourseTypeStepProps> = memo(({
  formData,
  onUpdate,
  errors,
  onNext
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const selectedType = formData.courseType;

  const handleSelect = React.useCallback((courseType: CourseType) => {
    onUpdate({ courseType });
  }, [onUpdate]);

  const handleNext = React.useCallback(() => {
    if (selectedType) {
      onNext();
    }
  }, [selectedType, onNext]);

  // Auto-proceed to next step after selection (with delay)
  React.useEffect(() => {
    if (selectedType && !errors.courseType) {
      const timer = setTimeout(() => {
        onNext();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedType, errors.courseType, onNext]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">نوع درس خود را انتخاب کنید</h2>
        <p className="text-muted-foreground">
          ابتدا موضوع درسی که می‌خواهید برای آن آزمون ایجاد کنید را مشخص کنید
        </p>
      </div>

      {/* Error Display */}
      {errors.courseType && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-center"
        >
          {errors.courseType}
        </motion.div>
      )}

      {/* Popular Courses */}
      <PopularCoursesSection
        selectedType={selectedType}
        onSelect={handleSelect}
      />

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">یا</span>
        </div>
      </div>

      {/* All Courses */}
      <AllCoursesSection
        selectedType={selectedType}
        onSelect={handleSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Selection Summary */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="font-medium">
                درس انتخاب شده: {COURSE_TYPE_LABELS[selectedType]}
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

CourseTypeStep.displayName = 'CourseTypeStep';

export default CourseTypeStep; 