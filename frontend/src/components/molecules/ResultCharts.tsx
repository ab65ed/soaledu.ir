'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Chart, { type ChartDataPoint } from '@/components/atoms/Chart';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

export interface ExamAnalyticsData {
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // در ثانیه
  answers: Array<{
    questionId: string;
    isCorrect: boolean;
    timeSpent: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  difficultyPerformance: Array<{
    difficulty: 'easy' | 'medium' | 'hard';
    correct: number;
    total: number;
    percentage: number;
  }>;
}

interface ResultChartsProps {
  data: ExamAnalyticsData;
}

/**
 * کامپوننت نمایش چارت‌های تحلیل نتایج آزمون
 * Result Charts Component for Exam Analytics
 */
const ResultCharts: React.FC<ResultChartsProps> = ({ data }) => {
  // انیمیشن‌های کارت‌ها
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // آماده‌سازی داده‌های چارت عملکرد بر اساس سختی
  const difficultyChartData: ChartDataPoint[] = data.difficultyPerformance.map(item => ({
    label: item.difficulty === 'easy' ? 'آسان' : item.difficulty === 'medium' ? 'متوسط' : 'سخت',
    value: item.percentage,
    color: item.difficulty === 'easy' ? '#10B981' : item.difficulty === 'medium' ? '#F59E0B' : '#EF4444'
  }));

  // آماده‌سازی داده‌های چارت توزیع نتایج
  const resultDistributionData: ChartDataPoint[] = [
    {
      label: 'پاسخ‌های صحیح',
      value: data.correctAnswers,
      color: '#10B981'
    },
    {
      label: 'پاسخ‌های غلط',
      value: data.totalQuestions - data.correctAnswers,
      color: '#EF4444'
    }
  ];

  // آماده‌سازی داده‌های چارت زمان بر اساس سوالات
  const timeDistributionData: ChartDataPoint[] = data.answers
    .slice(0, 10) // نمایش 10 سوال اول
    .map((answer, index) => ({
      label: `سوال ${index + 1}`,
      value: Math.round(answer.timeSpent / 60), // تبدیل به دقیقه
      color: answer.isCorrect ? '#10B981' : '#EF4444'
    }));

  // آماده‌سازی داده‌های چارت روند دقت
  const accuracyTrendData: ChartDataPoint[] = data.answers
    .reduce((acc, answer, index) => {
      const groupIndex = Math.floor(index / 5); // گروه‌بندی 5 تایی
      if (!acc[groupIndex]) {
        acc[groupIndex] = { correct: 0, total: 0 };
      }
      acc[groupIndex].total++;
      if (answer.isCorrect) {
        acc[groupIndex].correct++;
      }
      return acc;
    }, [] as Array<{ correct: number; total: number }>)
    .map((group, index) => ({
      label: `${index * 5 + 1}-${(index + 1) * 5}`,
      value: Math.round((group.correct / group.total) * 100),
      color: '#3B82F6'
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* چارت عملکرد بر اساس سختی */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-iransans">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              عملکرد بر اساس سطح سختی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Chart
                data={difficultyChartData}
                type="bar"
                width={350}
                height={250}
                animated={true}
                showValues={true}
                showLabels={true}
              />
              
              {/* جزئیات عددی */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {data.difficultyPerformance.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-600 font-iransans mb-1">
                      {item.difficulty === 'easy' ? 'آسان' : item.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                    </div>
                    <div className="font-bold text-lg font-iransans">
                      {item.correct}/{item.total}
                    </div>
                    <div className="text-xs text-gray-500 font-iransans">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* چارت توزیع نتایج */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-iransans">
              <PresentationChartBarIcon className="w-5 h-5 text-green-600" />
              توزیع پاسخ‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Chart
                data={resultDistributionData}
                type="donut"
                width={350}
                height={250}
                animated={true}
                showValues={true}
                showLabels={true}
              />
              
              {/* آمار کلی */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 font-iransans">
                    {data.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600 font-iransans">
                    پاسخ صحیح
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 font-iransans">
                    {data.totalQuestions - data.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600 font-iransans">
                    پاسخ غلط
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* چارت تحلیل زمان */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-iransans">
              <ClockIcon className="w-5 h-5 text-orange-600" />
              تحلیل زمان سوالات (دقیقه)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Chart
                data={timeDistributionData}
                type="bar"
                width={350}
                height={250}
                animated={true}
                showValues={true}
                showLabels={true}
              />
              
              {/* آمار زمان */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600 font-iransans">
                    {Math.round(data.timeSpent / 60)}
                  </div>
                  <div className="text-xs text-gray-600 font-iransans">
                    کل زمان (دقیقه)
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600 font-iransans">
                    {Math.round(data.timeSpent / data.totalQuestions / 60)}
                  </div>
                  <div className="text-xs text-gray-600 font-iransans">
                    میانگین به ازای سوال
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600 font-iransans">
                    {Math.round(Math.max(...data.answers.map(a => a.timeSpent)) / 60)}
                  </div>
                  <div className="text-xs text-gray-600 font-iransans">
                    بیشترین زمان
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* چارت روند دقت */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-iransans">
              <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
              روند دقت در طول آزمون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Chart
                data={accuracyTrendData}
                type="line"
                width={350}
                height={250}
                animated={true}
                showValues={true}
                showLabels={true}
              />
              
              {/* تحلیل روند */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 font-iransans mb-2">
                  تحلیل روند عملکرد:
                </div>
                <div className="space-y-1">
                  {accuracyTrendData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-iransans">
                        سوالات {item.label}:
                      </span>
                      <span className={`font-bold font-iransans ${
                        item.value >= 80 ? 'text-green-600' : 
                        item.value >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultCharts; 