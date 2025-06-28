/**
 * Group Selection Step
 * مرحله انتخاب گروه آموزشی
 */

'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator,
  TestTube,
  Palette,
  Wrench,
  BookOpen,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { CourseExamFormData, GROUP_LABELS, Group } from '@/types/courseExam';
import { cn } from '@/lib/utils';

// ===============================
// Types & Interfaces
// ===============================

interface GroupStepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

interface GroupOption {
  value: Group;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  popular?: boolean;
  compatibility?: string[];
}

// ===============================
// Group Options Configuration
// ===============================

const GROUP_OPTIONS: GroupOption[] = [
  {
    value: 'mathematical',
    label: 'ریاضی',
    description: 'علوم ریاضی، فیزیک و کامپیوتر',
    icon: <Calculator className="w-6 h-6" />,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    popular: true,
    compatibility: ['mathematics', 'physics']
  },
  {
    value: 'experimental',
    label: 'تجربی',
    description: 'زیست‌شناسی، شیمی و علوم طبیعی',
    icon: <TestTube className="w-6 h-6" />,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    popular: true,
    compatibility: ['biology', 'chemistry', 'physics']
  },
  {
    value: 'theoretical',
    label: 'نظری',
    description: 'ادبیات، تاریخ، جغرافیا و علوم انسانی',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    popular: true,
    compatibility: ['literature', 'history', 'geography', 'arabic']
  },
  {
    value: 'technical',
    label: 'فنی',
    description: 'علوم فنی و حرفه‌ای',
    icon: <Wrench className="w-6 h-6" />,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    compatibility: ['mathematics', 'physics']
  },
  {
    value: 'art',
    label: 'هنر',
    description: 'هنرهای تجسمی و کاربردی',
    icon: <Palette className="w-6 h-6" />,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
    compatibility: ['literature', 'other']
  },
  {
    value: 'other',
    label: 'سایر',
    description: 'سایر گروه‌های آموزشی',
    icon: <MoreHorizontal className="w-6 h-6" />,
    color: 'bg-gray-500',
    gradient: 'from-gray-500 to-gray-600',
    compatibility: ['other', 'english']
  }
];

// ===============================
// Group Card Component
// ===============================

const GroupCard = memo(({ 
  option, 
  isSelected, 
  onSelect,
  isRecommended = false,
  isCompatible = true
}: {
  option: GroupOption;
  isSelected: boolean;
  onSelect: () => void;
  isRecommended?: boolean;
  isCompatible?: boolean;
}) => (
  <motion.div
    whileHover={{ scale: isCompatible ? 1.02 : 1 }}
    whileTap={{ scale: isCompatible ? 0.98 : 1 }}
    transition={{ duration: 0.2 }}
  >
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 relative overflow-hidden",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg",
        isCompatible ? "hover:shadow-md" : "opacity-50 cursor-not-allowed",
        !isCompatible && "grayscale"
      )}
      onClick={isCompatible ? onSelect : undefined}
    >
      {(option.popular || isRecommended) && (
        <Badge 
          className="absolute top-3 right-3 z-10 text-xs"
          variant={isRecommended ? "default" : "secondary"}
        >
          {isRecommended ? 'پیشنهادی' : 'محبوب'}
        </Badge>
      )}

      {!isCompatible && (
        <Badge 
          className="absolute top-3 left-3 z-10 text-xs"
          variant="outline"
        >
          ناسازگار
        </Badge>
      )}
      
      <div className={cn(
        "h-20 bg-gradient-to-br text-white flex items-center justify-center",
        `bg-gradient-to-br ${option.gradient}`
      )}>
        {option.icon}
      </div>
      
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className={cn(
            "font-semibold text-lg mb-2",
            isSelected && "text-primary"
          )}>
            {option.label}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {option.description}
          </p>
          
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-3 flex justify-center"
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

GroupCard.displayName = 'GroupCard';

// ===============================
// Compatibility Helper
// ===============================

const getCompatibilityInfo = (courseType?: string): {
  compatible: Group[];
  recommended: Group[];
} => {
  if (!courseType) {
    return { 
      compatible: GROUP_OPTIONS.map(opt => opt.value),
      recommended: GROUP_OPTIONS.filter(opt => opt.popular).map(opt => opt.value)
    };
  }

  const compatible = GROUP_OPTIONS.filter(opt => 
    opt.compatibility?.includes(courseType) || opt.value === 'other'
  ).map(opt => opt.value);

  const recommended = GROUP_OPTIONS.filter(opt => 
    opt.compatibility?.includes(courseType) && opt.popular
  ).map(opt => opt.value);

  return { compatible, recommended };
};

// ===============================
// Group Statistics Component
// ===============================

const GroupStatistics = memo(() => (
  <Card className="mb-6">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">آمار انتخاب گروه‌ها</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-500">40%</div>
          <div className="text-xs text-muted-foreground">ریاضی</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-500">35%</div>
          <div className="text-xs text-muted-foreground">تجربی</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-500">25%</div>
          <div className="text-xs text-muted-foreground">نظری</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

GroupStatistics.displayName = 'GroupStatistics';

// ===============================
// Compatibility Notice Component
// ===============================

const CompatibilityNotice = memo(({ 
  courseType, 
  recommendedGroups 
}: { 
  courseType?: string; 
  recommendedGroups: Group[]; 
}) => {
  if (!courseType || recommendedGroups.length === 0) return null;

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-primary mb-1">گروه‌های پیشنهادی</h4>
            <p className="text-sm text-muted-foreground mb-2">
              بر اساس نوع درس انتخابی شما، این گروه‌ها مناسب‌تر هستند:
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendedGroups.map(group => (
                <Badge key={group} variant="outline" className="text-xs">
                  {GROUP_LABELS[group]}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CompatibilityNotice.displayName = 'CompatibilityNotice';

// ===============================
// Main Component
// ===============================

const GroupStep: React.FC<GroupStepProps> = memo(({
  formData,
  onUpdate,
  errors,
  onNext
}) => {
  const selectedGroup = formData.group;
  const courseType = formData.courseType;
  
  const { compatible, recommended } = getCompatibilityInfo(courseType);

  const handleSelect = React.useCallback((group: Group) => {
    onUpdate({ group });
  }, [onUpdate]);

  const handleNext = React.useCallback(() => {
    if (selectedGroup) {
      onNext();
    }
  }, [selectedGroup, onNext]);

  // Auto-proceed to next step after selection (with delay)
  React.useEffect(() => {
    if (selectedGroup && !errors.group) {
      const timer = setTimeout(() => {
        onNext();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedGroup, errors.group, onNext]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">گروه آموزشی را انتخاب کنید</h2>
        <p className="text-muted-foreground">
          گروه آموزشی مناسب برای آزمون خود را مشخص کنید
        </p>
      </div>

      {/* Error Display */}
      {errors.group && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-center"
        >
          {errors.group}
        </motion.div>
      )}

      {/* Group Statistics */}
      <GroupStatistics />

      {/* Compatibility Notice */}
      <CompatibilityNotice 
        courseType={courseType} 
        recommendedGroups={recommended} 
      />

      {/* Group Options */}
      <div>
        <h3 className="text-lg font-semibold mb-4">گروه‌های آموزشی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUP_OPTIONS.map((option, index) => {
            const isCompatible = compatible.includes(option.value);
            const isRecommended = recommended.includes(option.value);
            
            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GroupCard
                  option={option}
                  isSelected={selectedGroup === option.value}
                  onSelect={() => handleSelect(option.value)}
                  isRecommended={isRecommended}
                  isCompatible={isCompatible}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedGroup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="font-medium">
                گروه انتخاب شده: {GROUP_LABELS[selectedGroup]}
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
          💡 نکته: گروه‌های پیشنهادی بر اساس نوع درس انتخابی شما تعیین شده‌اند
        </p>
      </div>
    </div>
  );
});

GroupStep.displayName = 'GroupStep';

export default GroupStep; 