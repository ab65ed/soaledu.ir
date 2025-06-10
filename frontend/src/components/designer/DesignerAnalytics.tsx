'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

interface RevenueData {
  date: string;
  earnings: number;
  views: number;
  purchases: number;
  questionsSold: number;
}

interface QuestionPerformance {
  id: string;
  title: string;
  views: number;
  purchases: number;
  earnings: number;
  rating: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  createdAt: string;
  conversionRate: number;
}

interface AnalyticsSummary {
  totalEarnings: number;
  totalViews: number;
  totalPurchases: number;
  averageRating: number;
  conversionRate: number;
  activeQuestions: number;
  monthlyGrowth: number;
  topSubject: string;
}

interface SubjectBreakdown {
  subject: string;
  earnings: number;
  questions: number;
  averageRating: number;
  color: string;
}

const DesignerAnalytics: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'earnings' | 'views' | 'purchases'>('earnings');

  // Mock data - در production از API واقعی بیاید
  const mockRevenueData: RevenueData[] = [
    { date: '1403/10/01', earnings: 25000, views: 150, purchases: 12, questionsSold: 8 },
    { date: '1403/10/02', earnings: 30000, views: 180, purchases: 15, questionsSold: 10 },
    { date: '1403/10/03', earnings: 22000, views: 120, purchases: 11, questionsSold: 7 },
    { date: '1403/10/04', earnings: 45000, views: 240, purchases: 18, questionsSold: 15 },
    { date: '1403/10/05', earnings: 38000, views: 200, purchases: 16, questionsSold: 12 },
    { date: '1403/10/06', earnings: 42000, views: 220, purchases: 17, questionsSold: 14 },
    { date: '1403/10/07', earnings: 35000, views: 190, purchases: 14, questionsSold: 11 },
    { date: '1403/10/08', earnings: 50000, views: 280, purchases: 20, questionsSold: 18 },
    { date: '1403/10/09', earnings: 28000, views: 160, purchases: 13, questionsSold: 9 },
    { date: '1403/10/10', earnings: 32000, views: 170, purchases: 15, questionsSold: 12 }
  ];

  const mockAnalyticsSummary: AnalyticsSummary = {
    totalEarnings: 347000,
    totalViews: 1910,
    totalPurchases: 151,
    averageRating: 4.3,
    conversionRate: 7.9,
    activeQuestions: 85,
    monthlyGrowth: 23.5,
    topSubject: 'ریاضی'
  };

  const mockQuestionPerformance: QuestionPerformance[] = [
    {
      id: 'q1',
      title: 'مسائل هندسه تحلیلی',
      views: 320,
      purchases: 28,
      earnings: 56000,
      rating: 4.8,
      difficulty: 'hard',
      subject: 'ریاضی',
      createdAt: '2024-01-01',
      conversionRate: 8.75
    },
    {
      id: 'q2',
      title: 'فیزیک نوری کنکور',
      views: 280,
      purchases: 22,
      earnings: 44000,
      rating: 4.5,
      difficulty: 'medium',
      subject: 'فیزیک',
      createdAt: '2024-01-05',
      conversionRate: 7.86
    },
    {
      id: 'q3',
      title: 'شیمی آلی پایه',
      views: 190,
      purchases: 15,
      earnings: 30000,
      rating: 4.2,
      difficulty: 'easy',
      subject: 'شیمی',
      createdAt: '2024-01-10',
      conversionRate: 7.89
    }
  ];

  const mockSubjectBreakdown: SubjectBreakdown[] = [
    { subject: 'ریاضی', earnings: 145000, questions: 32, averageRating: 4.4, color: '#3B82F6' },
    { subject: 'فیزیک', earnings: 98000, questions: 24, averageRating: 4.3, color: '#10B981' },
    { subject: 'شیمی', earnings: 67000, questions: 18, averageRating: 4.1, color: '#F59E0B' },
    { subject: 'زیست‌شناسی', earnings: 37000, questions: 11, averageRating: 4.2, color: '#EF4444' }
  ];

  // Queries
  const { data: revenueData = mockRevenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['designer-revenue', selectedTimeRange],
    queryFn: () => Promise.resolve(mockRevenueData),
    refetchInterval: 30000
  });

  const { data: analyticsSummary = mockAnalyticsSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['designer-analytics-summary', selectedTimeRange],
    queryFn: () => Promise.resolve(mockAnalyticsSummary)
  });

  const { data: questionPerformance = mockQuestionPerformance } = useQuery({
    queryKey: ['question-performance', selectedTimeRange],
    queryFn: () => Promise.resolve(mockQuestionPerformance)
  });

  const { data: subjectBreakdown = mockSubjectBreakdown } = useQuery({
    queryKey: ['subject-breakdown'],
    queryFn: () => Promise.resolve(mockSubjectBreakdown)
  });

  // Computed values
  const chartData = useMemo(() => {
    return revenueData.map(item => ({
      ...item,
      formattedDate: item.date.substring(8) // نمایش روز
    }));
  }, [revenueData]);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fa-IR')} تومان`;
  };

  const getMetricData = (metric: string) => {
    switch (metric) {
      case 'earnings': return chartData.map(d => d.earnings);
      case 'views': return chartData.map(d => d.views);
      case 'purchases': return chartData.map(d => d.purchases);
      default: return chartData.map(d => d.earnings);
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'earnings': return '#10B981';
      case 'views': return '#3B82F6';
      case 'purchases': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">آنالیتیکس درآمد</h1>
          <p className="text-gray-600">تحلیل عملکرد و درآمد سؤالات شما</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 روز گذشته</option>
            <option value="30d">30 روز گذشته</option>
            <option value="90d">3 ماه گذشته</option>
            <option value="1y">یک سال گذشته</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل درآمد</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsSummary.totalEarnings)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{analyticsSummary.monthlyGrowth}%</span>
            <span className="text-sm text-gray-500 mr-2">نسبت به ماه قبل</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل بازدید</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsSummary.totalViews.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              نرخ تبدیل: {analyticsSummary.conversionRate}%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">فروش کل</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsSummary.totalPurchases.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <BookOpenIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              میانگین قیمت: {formatCurrency(analyticsSummary.totalEarnings / analyticsSummary.totalPurchases)}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">میانگین امتیاز</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsSummary.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              {analyticsSummary.activeQuestions} سؤال فعال
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">روند درآمد</h3>
          <div className="flex space-x-2 space-x-reverse">
            {[
              { key: 'earnings', label: 'درآمد', color: '#10B981' },
              { key: 'views', label: 'بازدید', color: '#3B82F6' },
              { key: 'purchases', label: 'فروش', color: '#F59E0B' }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => `روز ${value}`}
              formatter={(value, name) => [
                selectedMetric === 'earnings' 
                  ? formatCurrency(value as number)
                  : (value as number).toLocaleString('fa-IR'),
                selectedMetric === 'earnings' ? 'درآمد' : 
                selectedMetric === 'views' ? 'بازدید' : 'فروش'
              ]}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={getMetricColor(selectedMetric)}
              fill={getMetricColor(selectedMetric)}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Breakdown & Top Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع درآمد بر اساس درس</h3>
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={subjectBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="earnings"
                  label={({ subject, earnings }) => 
                    `${subject}: ${formatCurrency(earnings)}`
                  }
                >
                  {subjectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {subjectBreakdown.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <span className="text-sm font-medium">{subject.subject}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {subject.questions} سؤال • ⭐ {subject.averageRating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Questions */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">بهترین سؤالات</h3>
          <div className="space-y-4">
            {questionPerformance.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900">{question.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty === 'easy' ? 'آسان' : 
                         question.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">درآمد:</span> {formatCurrency(question.earnings)}
                      </div>
                      <div>
                        <span className="font-medium">بازدید:</span> {question.views.toLocaleString('fa-IR')}
                      </div>
                      <div>
                        <span className="font-medium">فروش:</span> {question.purchases.toLocaleString('fa-IR')}
                      </div>
                      <div>
                        <span className="font-medium">تبدیل:</span> {question.conversionRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className="flex items-center space-x-1 space-x-reverse text-yellow-500">
                      <StarIcon className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{question.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">نمودار عملکرد هفتگی</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedDate" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              labelFormatter={(value) => `روز ${value}`}
              formatter={(value, name) => [
                name === 'earnings' 
                  ? formatCurrency(value as number)
                  : (value as number).toLocaleString('fa-IR'),
                name === 'earnings' ? 'درآمد' : 'تعداد فروش'
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="earnings" fill="#10B981" name="درآمد" />
            <Bar yAxisId="right" dataKey="purchases" fill="#3B82F6" name="تعداد فروش" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DesignerAnalytics;