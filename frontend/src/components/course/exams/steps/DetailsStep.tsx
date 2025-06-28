/**
 * Details Step - Course Exam Form
 * مرحله جزئیات آزمون
 */

'use client';

import React, { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText,
  Clock,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
  Hash,
  Eye
} from 'lucide-react';
import { CourseExamFormData, DIFFICULTY_LABELS, Difficulty } from '@/types/courseExam';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// ===============================
// Types & Validation Schema
// ===============================

interface DetailsStepProps {
  formData: Partial<CourseExamFormData>;
  onUpdate: (data: Partial<CourseExamFormData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
}

const DetailsSchema = z.object({
  title: z.string()
    .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
    .max(200, 'عنوان حداکثر 200 کاراکتر')
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\w\d۰-۹]+$/, 'عنوان باید شامل حروف فارسی، انگلیسی و اعداد باشد'),
  
  description: z.string()
    .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد')
    .max(2000, 'توضیحات حداکثر 2000 کاراکتر'),
  
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  
  estimatedTime: z.number()
    .min(5, 'زمان تخمینی باید حداقل 5 دقیقه باشد')
    .max(480, 'زمان تخمینی حداکثر 480 دقیقه (8 ساعت)'),
  
  price: z.number()
    .min(0, 'قیمت نمی‌تواند منفی باشد')
    .max(1000000, 'قیمت حداکثر 1,000,000 تومان'),
  
  tags: z.array(z.string()).optional(),
  
  isPublic: z.boolean().optional(),
  allowRetake: z.boolean().optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional()
});

type DetailsFormData = z.infer<typeof DetailsSchema>;

// ===============================
// Difficulty Options
// ===============================

const DIFFICULTY_OPTIONS = [
  {
    value: 'easy' as Difficulty,
    label: 'آسان',
    description: 'مناسب برای مبتدیان',
    color: 'bg-green-500',
    icon: <Target className="w-4 h-4" />,
    multiplier: 0.8
  },
  {
    value: 'medium' as Difficulty,
    label: 'متوسط',
    description: 'سطح متعادل',
    color: 'bg-yellow-500',
    icon: <TrendingUp className="w-4 h-4" />,
    multiplier: 1.0
  },
  {
    value: 'hard' as Difficulty,
    label: 'سخت',
    description: 'چالش برانگیز',
    color: 'bg-red-500',
    icon: <Zap className="w-4 h-4" />,
    multiplier: 1.5
  }
];

// ===============================
// Tag Input Component
// ===============================

const TagInput = memo(({ 
  tags = [], 
  onChange,
  placeholder = "برچسب جدید..."
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  }, [tags, onChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }, [inputValue, addTag, removeTag, tags]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border rounded-lg bg-background">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => removeTag(tag)}
              >
                <Hash className="w-3 h-3" />
                {tag}
                <span className="ml-1 text-xs">×</span>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[120px] p-0"
          disabled={tags.length >= 10}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Enter یا کاما برای افزودن برچسب</span>
        <span>{tags.length}/10</span>
      </div>
    </div>
  );
});

TagInput.displayName = 'TagInput';

// ===============================
// Difficulty Selector Component
// ===============================

const DifficultySelector = memo(({ 
  value, 
  onChange 
}: {
  value?: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {DIFFICULTY_OPTIONS.map((option) => {
      const isSelected = value === option.value;
      
      return (
        <motion.div
          key={option.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              isSelected && "ring-2 ring-primary ring-offset-2 shadow-lg"
            )}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white",
                  option.color
                )}>
                  {option.icon}
                </div>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "font-semibold",
                    isSelected && "text-primary"
                  )}>
                    {option.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    })}
  </div>
));

DifficultySelector.displayName = 'DifficultySelector';

// ===============================
// Price Calculator Component
// ===============================

const PriceCalculator = memo(({ 
  basePrice, 
  difficulty, 
  estimatedTime,
  onChange 
}: {
  basePrice: number;
  difficulty?: Difficulty;
  estimatedTime: number;
  onChange: (price: number) => void;
}) => {
  const difficultyMultiplier = DIFFICULTY_OPTIONS.find(
    opt => opt.value === difficulty
  )?.multiplier || 1;
  
  const timeMultiplier = Math.max(0.5, Math.min(2, estimatedTime / 60));
  const suggestedPrice = Math.round(basePrice * difficultyMultiplier * timeMultiplier);

  const handleUseSuggested = useCallback(() => {
    onChange(suggestedPrice);
  }, [suggestedPrice, onChange]);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="font-medium">محاسبه قیمت هوشمند</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>قیمت پایه:</span>
            <span>{basePrice.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between">
            <span>ضریب سختی:</span>
            <span>×{difficultyMultiplier}</span>
          </div>
          <div className="flex justify-between">
            <span>ضریب زمان:</span>
            <span>×{timeMultiplier.toFixed(1)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-primary">
            <span>قیمت پیشنهادی:</span>
            <span>{suggestedPrice.toLocaleString()} تومان</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUseSuggested}
          className="w-full mt-3"
        >
          استفاده از قیمت پیشنهادی
        </Button>
      </CardContent>
    </Card>
  );
});

PriceCalculator.displayName = 'PriceCalculator';

// ===============================
// Main Component
// ===============================

const DetailsStep: React.FC<DetailsStepProps> = memo(({
  formData,
  onUpdate,
  errors,
  onNext,
  onPrev
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors, isValid }
  } = useForm<DetailsFormData>({
    resolver: zodResolver(DetailsSchema),
    defaultValues: {
      title: formData.title || '',
      description: formData.description || '',
      difficulty: formData.difficulty,
      estimatedTime: formData.estimatedTime || 60,
      price: formData.price || 50000,
      tags: formData.tags || [],
      isPublic: true,
      allowRetake: true,
      shuffleQuestions: true,
      showResults: true
    },
    mode: 'onChange'
  });

  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 500);

  // Auto-update parent form data
  useEffect(() => {
    onUpdate(debouncedValues);
  }, [debouncedValues, onUpdate]);

  const onSubmit = useCallback((data: DetailsFormData) => {
    onUpdate(data);
    onNext();
  }, [onUpdate, onNext]);

  const handleTagsChange = useCallback((tags: string[]) => {
    setValue('tags', tags, { shouldValidate: true });
  }, [setValue]);

  const handlePriceChange = useCallback((price: number) => {
    setValue('price', price, { shouldValidate: true });
  }, [setValue]);

  const estimatedTime = watch('estimatedTime');
  const difficulty = watch('difficulty');
  const price = watch('price');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">جزئیات آزمون را تکمیل کنید</h2>
        <p className="text-muted-foreground">
          اطلاعات کامل آزمون خود را وارد کنید
        </p>
      </div>

      {/* Title Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            عنوان و توضیحات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان آزمون *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="مثال: آزمون ریاضی دهم - فصل اول"
                  className={cn(formErrors.title && "border-destructive")}
                />
              )}
            />
            {formErrors.title && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">توضیحات آزمون *</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="توضیح کاملی از محتوا، اهداف و سطح آزمون ارائه دهید..."
                  rows={4}
                  className={cn(formErrors.description && "border-destructive")}
                />
              )}
            />
            {formErrors.description && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {formErrors.description.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {watch('description')?.length || 0}/2000 کاراکتر
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            سطح سختی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <DifficultySelector
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Time and Price Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              زمان تخمینی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>زمان (دقیقه): {estimatedTime}</Label>
              <Controller
                name="estimatedTime"
                control={control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={5}
                    max={480}
                    step={5}
                    className="mt-2"
                  />
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 دقیقه</span>
                <span>8 ساعت</span>
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                زمان تخمینی به کاربران کمک می‌کند برنامه‌ریزی بهتری داشته باشند
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              قیمت‌گذاری
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">قیمت (تومان)</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="price"
                    type="number"
                    min="0"
                    max="1000000"
                    step="1000"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={cn(formErrors.price && "border-destructive")}
                  />
                )}
              />
              {formErrors.price && (
                <p className="text-sm text-destructive mt-1">
                  {formErrors.price.message}
                </p>
              )}
            </div>

            <PriceCalculator
              basePrice={50000}
              difficulty={difficulty}
              estimatedTime={estimatedTime}
              onChange={handlePriceChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            برچسب‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput
                tags={field.value || []}
                onChange={handleTagsChange}
                placeholder="برچسب‌هایی مانند: هندسه، جبر، کنکور..."
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            تنظیمات آزمون
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>آزمون عمومی</Label>
                <p className="text-sm text-muted-foreground">
                  همه کاربران می‌توانند آزمون را ببینند
                </p>
              </div>
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>امکان تکرار</Label>
                <p className="text-sm text-muted-foreground">
                  کاربران می‌توانند چندین بار آزمون دهند
                </p>
              </div>
              <Controller
                name="allowRetake"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ترتیب تصادفی سوالات</Label>
                <p className="text-sm text-muted-foreground">
                  سوالات به صورت تصادفی نمایش داده شوند
                </p>
              </div>
              <Controller
                name="shuffleQuestions"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>نمایش نتایج</Label>
                <p className="text-sm text-muted-foreground">
                  نتایج بلافاصله بعد از آزمون نمایش داده شود
                </p>
              </div>
              <Controller
                name="showResults"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-primary" />
            <span className="font-medium">خلاصه آزمون</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">{estimatedTime} دقیقه</div>
              <div className="text-muted-foreground">زمان تخمینی</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">
                {price?.toLocaleString()} تومان
              </div>
              <div className="text-muted-foreground">قیمت</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">
                {difficulty ? DIFFICULTY_LABELS[difficulty] : 'نامشخص'}
              </div>
              <div className="text-muted-foreground">سطح سختی</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">
                {watch('tags')?.length || 0}
              </div>
              <div className="text-muted-foreground">برچسب</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex items-center gap-2"
        >
          مرحله قبل
        </Button>

        <Button
          type="submit"
          disabled={!isValid}
          className="flex items-center gap-2"
        >
          ادامه
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
});

DetailsStep.displayName = 'DetailsStep';

export default DetailsStep; 