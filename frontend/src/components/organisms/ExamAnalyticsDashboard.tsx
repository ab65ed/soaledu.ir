'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';

import Progress from '@/components/atoms/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import ResultCharts, { type ExamAnalyticsData } from '@/components/molecules/ResultCharts';
import LearningPathRecommendations from '@/components/organisms/LearningPathRecommendations';
import { 
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import type { TestExamResult } from '@/services/api';

interface ExamAnalyticsDashboardProps {
  examResult: TestExamResult;
}

/**
 * داشبورد اصلی آنالیز آزمون تستی
 * Main Exam Analytics Dashboard Component
 */
const ExamAnalyticsDashboard: React.FC<ExamAnalyticsDashboardProps> = ({ examResult }) => {
  // انیمیشن‌های کامپوننت
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // تبدیل داده‌های نتیجه آزمون به فرمت مورد نیاز برای آنالیز
  const analyticsData: ExamAnalyticsData = useMemo(() => {
    // محاسبه عملکرد بر اساس دسته‌بندی
    const categoryPerformance = examResult.questionResults.reduce((acc, result) => {
      // فرض می‌کنیم که دسته‌بندی از questionId استخراج می‌شود
      // در پیاده‌سازی واقعی باید از API دریافت شود
      const category = result.questionId.split('-')[0] || 'عمومی';
      
      if (!acc[category]) {
        acc[category] = { correct: 0, total: 0 };
      }
      
      acc[category].total++;
      if (result.isCorrect) {
        acc[category].correct++;
      }
      
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    const categoryPerformanceArray = Object.entries(categoryPerformance).map(([category, data]) => ({
      category,
      correct: data.correct,
      total: data.total,
      percentage: (data.correct / data.total) * 100
    }));

    // محاسبه عملکرد بر اساس سختی (فرضی - باید از API دریافت شود)
    const difficultyPerformance = [
      { difficulty: 'easy' as const, correct: 8, total: 10, percentage: 80 },
      { difficulty: 'medium' as const, correct: 6, total: 10, percentage: 60 },
      { difficulty: 'hard' as const, correct: 4, total: 10, percentage: 40 }
    ];

    // تولید داده‌های جعلی برای زمان هر سوال (باید از API دریافت شود)
    const answers = examResult.questionResults.map((result, index) => ({
      questionId: result.questionId,
      isCorrect: result.isCorrect,
      timeSpent: Math.random() * 180 + 30, // 30 تا 210 ثانیه
      difficulty: (['easy', 'medium', 'hard'] as const)[index % 3],
      category: result.questionId.split('-')[0] || 'عمومی'
    }));

    return {
      score: examResult.score,
      maxScore: examResult.maxScore,
      percentage: examResult.percentage,
      correctAnswers: examResult.correctAnswers,
      totalQuestions: examResult.totalQuestions,
      timeSpent: examResult.timeSpent,
      answers,
      categoryPerformance: categoryPerformanceArray,
      difficultyPerformance
    };
  }, [examResult]);

  // محاسبه سطح عملکرد
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { label: 'عالی', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 80) return { label: 'خوب', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 70) return { label: 'متوسط', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percentage >= 60) return { label: 'قابل قبول', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'نیاز به بهبود', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performanceLevel = getPerformanceLevel(analyticsData.percentage);

  // محاسبه آمار کلی
  const totalTimeInMinutes = Math.round(analyticsData.timeSpent / 60);
  const averageTimePerQuestion = Math.round(analyticsData.timeSpent / analyticsData.totalQuestions);
  const accuracy = (analyticsData.correctAnswers / analyticsData.totalQuestions) * 100;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* کارت‌های آمار کلی */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* نمره کلی */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-blue-700 font-iransans">
                    نمره کلی
                  </p>
                  <p className="text-3xl font-bold text-blue-900 font-iransans">
                    {analyticsData.score}
                  </p>
                  <p className="text-sm text-blue-600 font-iransans">
                    از {analyticsData.maxScore}
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <TrophyIcon className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600 font-iransans">درصد:</span>
                  <span className="text-sm font-bold text-blue-800 font-iransans">
                    {analyticsData.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={analyticsData.percentage} className="h-2" />
                <div className={`text-xs font-medium px-2 py-1 rounded-full text-center font-iransans ${performanceLevel.bg} ${performanceLevel.color}`}>
                  {performanceLevel.label}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* دقت پاسخ‌ها */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-green-700 font-iransans">
                    دقت پاسخ‌ها
                  </p>
                  <p className="text-3xl font-bold text-green-900 font-iransans">
                    {accuracy.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-700" />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-800 font-iransans">
                    {analyticsData.correctAnswers}
                  </div>
                  <div className="text-green-600 text-xs font-iransans">صحیح</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-800 font-iransans">
                    {analyticsData.totalQuestions - analyticsData.correctAnswers}
                  </div>
                  <div className="text-red-600 text-xs font-iransans">غلط</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* مدیریت زمان */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-orange-700 font-iransans">
                    زمان صرف شده
                  </p>
                  <p className="text-3xl font-bold text-orange-900 font-iransans">
                    {totalTimeInMinutes}
                  </p>
                  <p className="text-sm text-orange-600 font-iransans">
                    دقیقه
                  </p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <ClockIcon className="w-6 h-6 text-orange-700" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-orange-700 font-iransans">
                  میانگین: {averageTimePerQuestion} ثانیه/سوال
                </div>
                <div className="text-xs text-orange-600 font-iransans mt-1">
                  {averageTimePerQuestion > 120 ? 'نیاز به تسریع' : 'زمان‌بندی مناسب'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* رتبه عملکرد */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-purple-700 font-iransans">
                    امتیاز کلی
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.ceil(analyticsData.percentage / 20)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <AcademicCapIcon className="w-6 h-6 text-purple-700" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-800 font-iransans">
                  {Math.ceil(analyticsData.percentage / 20)}/5
                </div>
                <div className="text-xs text-purple-600 font-iransans">
                  ستاره عملکرد
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* تب‌های تحلیل */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="charts" className="font-iransans">
              <ChartBarIcon className="w-4 h-4 ml-2" />
              تحلیل‌های گرافیکی
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="font-iransans">
              <LightBulbIcon className="w-4 h-4 ml-2" />
              مسیر یادگیری
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <ResultCharts data={analyticsData} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <LearningPathRecommendations data={analyticsData} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* خلاصه نهایی */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-iransans">
              <CheckCircleIcon className="w-6 h-6 text-gray-600" />
              خلاصه و نتیجه‌گیری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 font-iransans">
                  نقاط قوت:
                </h4>
                <div className="space-y-2">
                  {analyticsData.categoryPerformance
                    .filter(cat => cat.percentage >= 70)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700 font-iransans">
                          {category.category}: {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  {analyticsData.categoryPerformance.filter(cat => cat.percentage >= 70).length === 0 && (
                    <p className="text-sm text-gray-600 font-iransans italic">
                      نیاز به تقویت همه موضوعات
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 font-iransans">
                  موضوعات نیازمند بهبود:
                </h4>
                <div className="space-y-2">
                  {analyticsData.categoryPerformance
                    .filter(cat => cat.percentage < 70)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <XCircleIcon className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700 font-iransans">
                          {category.category}: {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  {analyticsData.categoryPerformance.filter(cat => cat.percentage < 70).length === 0 && (
                    <p className="text-sm text-gray-600 font-iransans italic">
                      عملکرد مناسب در همه موضوعات
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-iransans leading-relaxed">
                <strong>توصیه کلی:</strong> {' '}
                {analyticsData.percentage >= 80 
                  ? 'عملکرد شما در این آزمون بسیار خوب بوده است. برای حفظ این سطح، مطالعه منظم را ادامه دهید.'
                  : analyticsData.percentage >= 60
                  ? 'عملکرد شما قابل قبول است اما با تمرین بیشتر می‌توانید نتایج بهتری کسب کنید.'
                  : 'نیاز به بازنگری جدی در روش مطالعه و تمرین بیشتر دارید. از برنامه مطالعاتی پیشنهادی استفاده کنید.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ExamAnalyticsDashboard; 