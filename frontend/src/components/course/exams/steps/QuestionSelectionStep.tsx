/**
 * Question Selection Step
 * مرحله انتخاب سوالات آزمون
 */

'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search,
  CheckCircle,
  Clock,
  Star,
  Target,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  CourseExamFormData, 
  Question, 
  QuestionFilters,
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  Difficulty,
  QuestionType
} from '@/types/courseExam';
import { 
  useQuestions, 
  useQuestionsSearch, 
  useQuestionSelection 
} from '@/hooks/useCourseExam';
import { cn } from '@/lib/utils';

// ===============================
// Types & Interfaces
// ===============================

interface QuestionSelectionStepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

interface QuestionFiltersState {
  difficulty?: Difficulty;
  questionType?: QuestionType;
  minPoints?: number;
  maxPoints?: number;
  maxTime?: number;
}

// ===============================
// Question Card Component
// ===============================

const QuestionCard = memo(({ 
  question, 
  isSelected, 
  onToggle
}: {
  question: Question;
  isSelected: boolean;
  onToggle: () => void;
}) => {
  const difficultyColor = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  }[question.difficulty];

  const typeIcon = {
    'multiple-choice': <CheckCircle className="w-4 h-4" />,
    'true-false': <Target className="w-4 h-4" />,
    'short-answer': <BookOpen className="w-4 h-4" />,
    'essay': <HelpCircle className="w-4 h-4" />
  }[question.questionType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md relative",
          isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/5"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggle}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={cn("text-white text-xs", difficultyColor)}
                  >
                    {DIFFICULTY_LABELS[question.difficulty]}
                  </Badge>
                  
                  <Badge variant="secondary" className="text-xs">
                    {typeIcon}
                    <span className="mr-1">{QUESTION_TYPE_LABELS[question.questionType]}</span>
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3" />
                    {question.points}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {question.estimatedTime}د
                  </div>
                </div>
                
                <h4 className="font-medium text-sm mb-2 line-clamp-2">
                  {question.title}
                </h4>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {question.content}
                </p>
                
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {question.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{question.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

QuestionCard.displayName = 'QuestionCard';

// ===============================
// Main Component
// ===============================

const QuestionSelectionStep: React.FC<QuestionSelectionStepProps> = ({
  formData,
  onUpdate,
  errors,
  onNext,
  onPrev
}) => {
  const [filters, setFilters] = useState<QuestionFiltersState>({});
  const [autoSelectionCount, setAutoSelectionCount] = useState(40);

  // Hooks
  const { searchQuery, setSearchQuery, questions: searchResults, isLoading: isSearching } = useQuestionsSearch();
  
  const questionFilters: QuestionFilters = useMemo(() => ({
    courseType: formData.courseType,
    grade: formData.grade,
    group: formData.group,
    search: searchQuery,
    difficulty: filters.difficulty,
    questionType: filters.questionType,
    minPoints: filters.minPoints,
    maxPoints: filters.maxPoints,
    maxTime: filters.maxTime,
  }), [formData, searchQuery, filters]);

  const { data: questions = [], isLoading } = useQuestions(questionFilters);
  
  const {
    selectedQuestions,
    toggleQuestion,
    clearSelection,
    selectRandomQuestions,
    getSelectionStats
  } = useQuestionSelection();

  // Memoized values
  const displayQuestions = useMemo(() => {
    return searchQuery ? searchResults : questions;
  }, [searchQuery, searchResults, questions]);

  const selectionStats = useMemo(() => {
    return getSelectionStats(displayQuestions);
  }, [getSelectionStats, displayQuestions]);

  // Handlers
  const handleNext = useCallback(() => {
    if (selectionStats.isValid) {
      onUpdate({ 
        selectedQuestions,
        questionCount: selectedQuestions.length,
        estimatedDuration: selectionStats.totalEstimatedTime,
        totalPoints: selectionStats.totalPoints
      });
      onNext();
    }
  }, [selectionStats, selectedQuestions, onUpdate, onNext]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">انتخاب سوالات آزمون</h2>
        <p className="text-muted-foreground">
          سوالات مناسب برای آزمون خود را انتخاب کنید
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="جستجو در سوالات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => selectRandomQuestions(displayQuestions, 10)}
          disabled={displayQuestions.length === 0}
        >
          <Plus className="w-4 h-4 ml-1" />
          انتخاب 10 تای تصادفی
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          disabled={selectedQuestions.length === 0}
        >
          <Minus className="w-4 h-4 ml-1" />
          پاک کردن همه
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {selectedQuestions.length} سوال انتخاب شده از {displayQuestions.length} سوال
        </p>
        {selectionStats.count > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            زمان کل: {Math.round(selectionStats.totalEstimatedTime)} دقیقه | 
            امتیاز کل: {selectionStats.totalPoints}
          </div>
        )}
      </div>

      {/* Questions Grid */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {isLoading || isSearching ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : displayQuestions.length > 0 ? (
            <AnimatePresence>
              {displayQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  isSelected={selectedQuestions.includes(question.id)}
                  onToggle={() => toggleQuestion(question.id)}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">سوالی یافت نشد</h3>
              <p className="text-muted-foreground">
                جستجوی جدیدی انجام دهید
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="w-4 h-4 ml-1" />
          مرحله قبل
        </Button>

        <Button 
          onClick={handleNext}
          disabled={!selectionStats.isValid}
          className="flex items-center gap-2"
        >
          {selectionStats.isValid ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          ایجاد آزمون
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Display */}
      {errors.selectedQuestions && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.selectedQuestions}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default memo(QuestionSelectionStep);
