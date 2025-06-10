'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { 
  LightBulbIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import type { ExamAnalyticsData } from '@/components/molecules/ResultCharts';

interface LearningRecommendation {
  type: 'strength' | 'weakness' | 'improvement' | 'study_plan';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  resources?: Array<{
    title: string;
    type: 'video' | 'article' | 'practice' | 'exam';
    url?: string;
  }>;
}

interface LearningPathRecommendationsProps {
  data: ExamAnalyticsData;
}

/**
 * کامپوننت ارائه مسیر یادگیری و توصیه‌های بهبود
 * Learning Path Recommendations Component
 */
const LearningPathRecommendations: React.FC<LearningPathRecommendationsProps> = ({ data }) => {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  // تولید توصیه‌های یادگیری بر اساس نتایج آزمون
  const generateRecommendations = (): LearningRecommendation[] => {
    const recommendations: LearningRecommendation[] = [];

    // تحلیل نقاط قوت
    const strongCategories = data.categoryPerformance.filter(cat => cat.percentage >= 80);
    if (strongCategories.length > 0) {
      recommendations.push({
        type: 'strength',
        title: 'نقاط قوت شما',
        description: `عملکرد شما در ${strongCategories.map(cat => cat.category).join('، ')} بسیار عالی است. این موضوعات را به عنوان پایه برای یادگیری موضوعات مرتبط استفاده کنید.`,
        priority: 'low',
        actionable: false
      });
    }

    // تحلیل نقاط ضعف
    const weakCategories = data.categoryPerformance.filter(cat => cat.percentage < 60);
    if (weakCategories.length > 0) {
      recommendations.push({
        type: 'weakness',
        title: 'نقاط نیازمند تقویت',
        description: `موضوعات ${weakCategories.map(cat => cat.category).join('، ')} نیاز به مطالعه بیشتری دارند. پیشنهاد می‌کنیم ابتدا مفاهیم پایه را مرور کنید.`,
        priority: 'high',
        actionable: true,
        resources: [
          { title: 'مرور مفاهیم پایه', type: 'article' },
          { title: 'تمرین‌های تکمیلی', type: 'practice' },
          { title: 'ویدیوهای آموزشی', type: 'video' }
        ]
      });
    }

    // تحلیل زمان
    const averageTimePerQuestion = data.timeSpent / data.totalQuestions;
    if (averageTimePerQuestion > 120) { // بیش از 2 دقیقه به ازای سوال
      recommendations.push({
        type: 'improvement',
        title: 'بهبود مدیریت زمان',
        description: 'میانگین زمان شما برای هر سوال بالا است. تمرین سرعت حل سوال می‌تواند عملکرد کلی شما را بهبود دهد.',
        priority: 'medium',
        actionable: true,
        resources: [
          { title: 'تکنیک‌های حل سریع سوال', type: 'article' },
          { title: 'آزمون‌های زمان‌دار', type: 'exam' }
        ]
      });
    }

    // تحلیل سختی سوالات
    const hardQuestions = data.difficultyPerformance.find(diff => diff.difficulty === 'hard');
    if (hardQuestions && hardQuestions.percentage < 50) {
      recommendations.push({
        type: 'improvement',
        title: 'تقویت حل سوالات سخت',
        description: 'عملکرد شما در سوالات سخت قابل بهبود است. با تمرین مداوم و تحلیل سوالات می‌توانید این مهارت را تقویت کنید.',
        priority: 'medium',
        actionable: true,
        resources: [
          { title: 'بانک سوالات سطح بالا', type: 'practice' },
          { title: 'تحلیل الگوهای سوال', type: 'article' }
        ]
      });
    }

    // برنامه مطالعاتی پیشنهادی
    recommendations.push({
      type: 'study_plan',
      title: 'برنامه مطالعاتی پیشنهادی',
      description: 'بر اساس نتایج آزمون، یک برنامه مطالعاتی شخصی‌سازی شده برای شما تهیه شده است.',
      priority: 'high',
      actionable: true,
      resources: [
        { title: 'برنامه هفتگی مطالعه', type: 'article' },
        { title: 'آزمون‌های تمرینی', type: 'exam' },
        { title: 'منابع تکمیلی', type: 'article' }
      ]
    });

    return recommendations;
  };

  const recommendations = generateRecommendations();

  // رنگ‌بندی بر اساس نوع توصیه
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'weakness':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
      case 'improvement':
        return <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />;
      case 'study_plan':
        return <AcademicCapIcon className="w-6 h-6 text-purple-600" />;
      default:
        return <LightBulbIcon className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'border-green-200 bg-green-50';
      case 'weakness':
        return 'border-red-200 bg-red-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'study_plan':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="font-iransans">اولویت بالا</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="font-iransans">اولویت متوسط</Badge>;
      case 'low':
        return <Badge variant="outline" className="font-iransans">اولویت پایین</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* هدر بخش */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-iransans text-xl">
              <LightBulbIcon className="w-7 h-7 text-blue-600" />
              مسیر یادگیری پیشنهادی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-iransans">
              بر اساس تحلیل عملکرد شما در این آزمون، توصیه‌های زیر برای بهبود نتایج آینده ارائه شده است:
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* آمار کلی عملکرد */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="font-iransans">خلاصه عملکرد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 font-iransans">
                  {data.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 font-iransans">
                  نمره کلی
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 font-iransans">
                  {data.correctAnswers}/{data.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 font-iransans">
                  پاسخ‌های صحیح
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 font-iransans">
                  {Math.round(data.timeSpent / 60)}
                </div>
                <div className="text-sm text-gray-600 font-iransans">
                  زمان (دقیقه)
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 font-iransans">
                  {data.categoryPerformance.filter(cat => cat.percentage >= 70).length}
                </div>
                <div className="text-sm text-gray-600 font-iransans">
                  موضوعات تسلط
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* لیست توصیه‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${getRecommendationColor(recommendation.type)}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getRecommendationIcon(recommendation.type)}
                    <CardTitle className="font-iransans text-lg">
                      {recommendation.title}
                    </CardTitle>
                  </div>
                  {getPriorityBadge(recommendation.priority)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 font-iransans leading-relaxed">
                  {recommendation.description}
                </p>

                {/* منابع پیشنهادی */}
                {recommendation.resources && recommendation.resources.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 font-iransans">
                      منابع پیشنهادی:
                    </h4>
                    <div className="space-y-2">
                      {recommendation.resources.map((resource, resourceIndex) => (
                        <div
                          key={resourceIndex}
                          className="flex items-center gap-3 p-2 bg-white rounded border"
                        >
                          <div className="flex-shrink-0">
                            {resource.type === 'video' && <ClockIcon className="w-4 h-4 text-red-500" />}
                            {resource.type === 'article' && <BookOpenIcon className="w-4 h-4 text-blue-500" />}
                            {resource.type === 'practice' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                            {resource.type === 'exam' && <AcademicCapIcon className="w-4 h-4 text-purple-500" />}
                          </div>
                          <span className="text-sm text-gray-700 font-iransans">
                            {resource.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* دکمه اقدام */}
                {recommendation.actionable && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-iransans"
                    >
                      شروع بهبود
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* بخش برنامه‌ریزی مطالعه */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-iransans">
              <ClockIcon className="w-6 h-6 text-purple-600" />
              برنامه مطالعاتی هفتگی پیشنهادی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 font-iransans">
                  اولویت‌های مطالعاتی:
                </h4>
                <div className="space-y-2">
                  {data.categoryPerformance
                    .sort((a, b) => a.percentage - b.percentage)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-white rounded border"
                      >
                        <span className="text-sm font-iransans text-gray-700">
                          {category.category}
                        </span>
                        <Badge 
                          variant={category.percentage < 60 ? 'destructive' : 'secondary'}
                          className="font-iransans"
                        >
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 font-iransans">
                  پیشنهاد زمان‌بندی:
                </h4>
                <div className="space-y-2 text-sm text-gray-700 font-iransans">
                  <div>• مرور مفاهیم ضعیف: ۳۰ دقیقه روزانه</div>
                  <div>• تمرین سوالات جدید: ۲۰ دقیقه روزانه</div>
                  <div>• آزمون تمرینی: ۲ بار در هفته</div>
                  <div>• بررسی و تحلیل خطاها: ۱۵ دقیقه بعد از هر آزمون</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LearningPathRecommendations; 