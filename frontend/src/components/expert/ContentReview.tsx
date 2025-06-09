'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Textarea from '@/components/atoms/Textarea';
import Label from '@/components/atoms/Label';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { AlertCircle, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { expertService } from '@/services/api';
import { toast } from 'sonner';

// اعتبارسنجی فرم بازخورد با Zod
const reviewSchema = z.object({
  status: z.enum(['approved', 'needs_revision', 'rejected']),
  feedback: z.string().min(10, 'بازخورد باید حداقل ۱۰ کاراکتر باشد'),
  quality_score: z.number().min(1).max(10),
  improvements: z.string().optional()
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface PendingContentItem {
  id: string;
  title: string;
  type: string;
  content_preview: string;
  full_content: string;
  created_date: string;
  priority?: string;
}

interface ContentReviewProps {
  pendingContent: {
    items?: Array<PendingContentItem>;
    total?: number;
  } | null;
  isLoading: boolean;
}

const ContentReview: React.FC<ContentReviewProps> = ({ pendingContent, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState<PendingContentItem | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema)
  });

  // ارسال بازخورد
  const reviewMutation = useMutation({
    mutationFn: (data: { itemId: string; review: ReviewFormData }) => 
      expertService.submitReview(data.itemId, data.review),
    onSuccess: () => {
      toast.success('بازخورد با موفقیت ارسال شد');
      setShowReviewForm(false);
      setSelectedItem(null);
      reset();
      // آپدیت کش
      queryClient.invalidateQueries({ queryKey: ['expert', 'content', 'pending'] });
    },
    onError: (error) => {
      toast.error('خطا در ارسال بازخورد');
      console.error('Review submission error:', error);
    }
  });

  const onSubmitReview = (data: ReviewFormData) => {
    if (selectedItem) {
      reviewMutation.mutate({ itemId: selectedItem.id, review: data });
    }
  };

  // تابع نمایش جزئیات محتوا
  const handleViewContent = (item: PendingContentItem) => {
    setSelectedItem(item);
    setShowReviewForm(true);
  };

  // انیمیشن‌های کارت‌ها
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* لیست محتوای در انتظار */}
      <div className="space-y-4">
        {pendingContent?.items?.map((item: PendingContentItem) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 font-iransans">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-iransans">نوع:</span>
                      <Badge variant={item.type === 'question' ? 'default' : 'secondary'}>
                        {item.type === 'question' ? 'سوال' : 'درس-آزمون'}
                      </Badge>
                      <span className="font-iransans">ارسال شده:</span>
                      <span className="font-iransans">{item.created_date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContent(item)}
                      className="font-iransans"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      بررسی
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-iransans line-clamp-3">
                    {item.content_preview}
                  </p>
                </div>

                {item.priority && (
                  <div className="mt-3">
                    <Badge 
                      variant={item.priority === 'high' ? 'destructive' : 
                              item.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      اولویت {item.priority === 'high' ? 'بالا' : 
                              item.priority === 'medium' ? 'متوسط' : 'پایین'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* فرم بازخورد در Modal */}
      <AnimatePresence>
        {showReviewForm && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="font-iransans text-right">
                    بررسی محتوا: {selectedItem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* نمایش محتوای کامل */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 font-iransans">محتوای کامل:</h4>
                    <div className="text-gray-700 font-iransans whitespace-pre-wrap">
                      {selectedItem.full_content}
                    </div>
                  </div>

                  {/* فرم بازخورد */}
                  <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                    {/* وضعیت تأیید */}
                    <div>
                      <Label className="font-iransans">وضعیت بررسی *</Label>
                      <Select onValueChange={(value: string) => setValue('status', value as 'approved' | 'needs_revision' | 'rejected')}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="انتخاب وضعیت" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="font-iransans">تأیید</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="needs_revision">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                              <span className="font-iransans">نیاز به بازنگری</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="font-iransans">رد</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1 font-iransans">
                          {errors.status.message}
                        </p>
                      )}
                    </div>

                    {/* امتیاز کیفیت */}
                    <div>
                      <Label className="font-iransans">امتیاز کیفیت (۱-۱۰) *</Label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        {...register('quality_score', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="امتیاز از ۱ تا ۱۰"
                      />
                      {errors.quality_score && (
                        <p className="text-red-500 text-sm mt-1 font-iransans">
                          {errors.quality_score.message}
                        </p>
                      )}
                    </div>

                    {/* بازخورد */}
                    <div>
                      <Label className="font-iransans">بازخورد *</Label>
                      <Textarea
                        {...register('feedback')}
                        placeholder="نظر و بازخورد خود را وارد کنید..."
                        className="min-h-[100px] font-iransans"
                        dir="rtl"
                      />
                      {errors.feedback && (
                        <p className="text-red-500 text-sm mt-1 font-iransans">
                          {errors.feedback.message}
                        </p>
                      )}
                    </div>

                    {/* پیشنهادات بهبود */}
                    <div>
                      <Label className="font-iransans">پیشنهادات بهبود (اختیاری)</Label>
                      <Textarea
                        {...register('improvements')}
                        placeholder="پیشنهادات خود برای بهبود محتوا را وارد کنید..."
                        className="min-h-[80px] font-iransans"
                        dir="rtl"
                      />
                    </div>

                    {/* دکمه‌های عملیات */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={reviewMutation.isPending}
                        className="flex-1 font-iransans"
                      >
                        {reviewMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            در حال ارسال...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 ml-2" />
                            ارسال بازخورد
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                        className="font-iransans"
                      >
                        انصراف
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* پیام خالی بودن لیست */}
      {pendingContent?.items?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-iransans">
              عالی! همه محتواها بررسی شده‌اند
            </h3>
            <p className="text-gray-600 font-iransans">
              در حال حاضر محتوای جدیدی برای بررسی وجود ندارد
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentReview; 