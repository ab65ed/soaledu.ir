'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartPieIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// انواع داده‌ها برای نظر‌سنجی
interface ExamSurvey {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  rating: number; // 1-5
  feedback: string;
  difficultyRating: number; // 1-5
  questionsQuality: number; // 1-5
  timeAdequacy: number; // 1-5
  uiExperience: number; // 1-5
  wouldRecommend: boolean;
  improvementSuggestions: string[];
  technicalIssues: boolean;
  issueDescription?: string;
  examType: 'course_exam' | 'test_exam' | 'flashcard';
  designerId?: string;
  designerName?: string;
}

interface SurveyStatistics {
  totalSurveys: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
  difficultyDistribution: { level: string; count: number; percentage: number }[];
  qualityMetrics: {
    questionsQuality: number;
    timeAdequacy: number;
    uiExperience: number;
    recommendationRate: number;
  };
  technicalIssuesRate: number;
  trendsOverTime: { date: string; rating: number; count: number }[];
  topSuggestions: { suggestion: string; count: number }[];
}

interface SurveyDisplayProps {
  userRole: 'admin' | 'designer' | 'expert';
  userId?: string;
  examId?: string;
  dateRange?: { start: string; end: string };
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockSurveys: ExamSurvey[] = [
  {
    id: 'survey-001',
    examId: 'exam-001',
    examTitle: 'آزمون ریاضی فصل اول',
    studentId: 'student-123',
    studentName: 'علی احمدی',
    submittedAt: '1403/10/22 14:30',
    rating: 4,
    feedback: 'آزمون خوبی بود ولی بعضی سوالات کمی سخت بودند.',
    difficultyRating: 4,
    questionsQuality: 5,
    timeAdequacy: 3,
    uiExperience: 4,
    wouldRecommend: true,
    improvementSuggestions: ['افزایش زمان آزمون', 'اضافه کردن نمونه حل'],
    technicalIssues: false,
    examType: 'course_exam',
    designerId: 'designer-001',
    designerName: 'مریم حسینی'
  },
  {
    id: 'survey-002',
    examId: 'exam-002',
    examTitle: 'تست فیزیک مکانیک',
    studentId: 'student-124',
    studentName: 'فاطمه رضایی',
    submittedAt: '1403/10/21 16:15',
    rating: 5,
    feedback: 'عالی بود! سوالات متنوع و آموزنده.',
    difficultyRating: 3,
    questionsQuality: 5,
    timeAdequacy: 4,
    uiExperience: 5,
    wouldRecommend: true,
    improvementSuggestions: ['اضافه کردن شکل و نمودار بیشتر'],
    technicalIssues: false,
    examType: 'test_exam',
    designerId: 'designer-002',
    designerName: 'احمد محمدی'
  },
  {
    id: 'survey-003',
    examId: 'exam-003',
    examTitle: 'فلش‌کارت شیمی آلی',
    studentId: 'student-125',
    studentName: 'رضا مرادی',
    submittedAt: '1403/10/20 10:45',
    rating: 3,
    feedback: 'متوسط بود. بعضی توضیحات کافی نبود.',
    difficultyRating: 5,
    questionsQuality: 3,
    timeAdequacy: 4,
    uiExperience: 3,
    wouldRecommend: false,
    improvementSuggestions: ['بهبود توضیحات', 'اضافه کردن مثال‌های بیشتر'],
    technicalIssues: true,
    issueDescription: 'صفحه چند بار بارگذاری نشد',
    examType: 'flashcard',
    designerId: 'designer-003',
    designerName: 'سارا کریمی'
  }
];

const mockStatistics: SurveyStatistics = {
  totalSurveys: 156,
  averageRating: 4.2,
  ratingDistribution: [
    { rating: 1, count: 5 },
    { rating: 2, count: 12 },
    { rating: 3, count: 28 },
    { rating: 4, count: 67 },
    { rating: 5, count: 44 }
  ],
  difficultyDistribution: [
    { level: 'خیلی آسان', count: 8, percentage: 5.1 },
    { level: 'آسان', count: 23, percentage: 14.7 },
    { level: 'متوسط', count: 89, percentage: 57.1 },
    { level: 'سخت', count: 31, percentage: 19.9 },
    { level: 'خیلی سخت', count: 5, percentage: 3.2 }
  ],
  qualityMetrics: {
    questionsQuality: 4.3,
    timeAdequacy: 3.8,
    uiExperience: 4.1,
    recommendationRate: 78.2
  },
  technicalIssuesRate: 12.5,
  trendsOverTime: [
    { date: '1403/10/15', rating: 3.9, count: 12 },
    { date: '1403/10/16', rating: 4.1, count: 15 },
    { date: '1403/10/17', rating: 4.0, count: 18 },
    { date: '1403/10/18', rating: 4.3, count: 22 },
    { date: '1403/10/19', rating: 4.2, count: 19 },
    { date: '1403/10/20', rating: 4.4, count: 24 },
    { date: '1403/10/21', rating: 4.5, count: 28 }
  ],
  topSuggestions: [
    { suggestion: 'افزایش زمان آزمون', count: 45 },
    { suggestion: 'بهبود رابط کاربری', count: 32 },
    { suggestion: 'اضافه کردن نمونه حل', count: 28 },
    { suggestion: 'تنوع بیشتر سوالات', count: 24 },
    { suggestion: 'بهبود توضیحات', count: 19 }
  ]
};

const SurveyDisplay: React.FC<SurveyDisplayProps> = ({
  userRole,
  userId,
  examId,
  dateRange,
  className = ''
}) => {
  const [surveys, setSurveys] = useState<ExamSurvey[]>(mockSurveys);
  const [statistics, setStatistics] = useState<SurveyStatistics>(mockStatistics);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'examType'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('stats');

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        // شبیه‌سازی فراخوانی API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // فیلتر بر اساس نقش کاربر
        let filteredSurveys = mockSurveys;
        if (userRole === 'designer' && userId) {
          filteredSurveys = mockSurveys.filter(survey => survey.designerId === userId);
        }
        if (examId) {
          filteredSurveys = filteredSurveys.filter(survey => survey.examId === examId);
        }
        
        setSurveys(filteredSurveys);
        // محاسبه آمار بر اساس داده‌های فیلتر شده
        const calculatedStats = calculateStatistics(filteredSurveys);
        setStatistics(calculatedStats);
      } catch (error) {
        console.error('خطا در دریافت نظر‌سنجی‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [userRole, userId, examId, dateRange]);

  const calculateStatistics = (surveyData: ExamSurvey[]): SurveyStatistics => {
    // محاسبه آمار واقعی بر اساس داده‌های ورودی
    const totalSurveys = surveyData.length;
    const averageRating = surveyData.reduce((sum, survey) => sum + survey.rating, 0) / totalSurveys;
    
    // توزیع امتیازات
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: surveyData.filter(survey => survey.rating === rating).length
    }));

    // محاسبه سایر آمار...
    return {
      ...mockStatistics,
      totalSurveys,
      averageRating: parseFloat(averageRating.toFixed(1))
    };
  };

  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'نظر‌سنجی کلی آزمون‌ها',
          description: 'مدیریت و نظارت بر کیفیت آزمون‌ها',
          permissions: ['view_all', 'export', 'manage']
        };
      case 'designer':
        return {
          title: 'نظر‌سنجی آزمون‌های من',
          description: 'بازخورد دانش‌آموزان از آزمون‌های طراحی شده',
          permissions: ['view_own', 'respond']
        };
      case 'expert':
        return {
          title: 'تحلیل کیفیت آزمون‌ها',
          description: 'بررسی و ارزیابی تخصصی',
          permissions: ['view_all', 'analyze', 'recommend']
        };
      default:
        return {
          title: 'نظر‌سنجی آزمون‌ها',
          description: 'نمایش نظر‌سنجی‌ها',
          permissions: ['view']
        };
    }
  };

  const getFilteredSurveys = () => {
    let filtered = surveys;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(survey => survey.examType === selectedFilter);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'examType':
          return a.examType.localeCompare(b.examType);
        case 'date':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const roleContent = getRoleSpecificContent();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ChartPieIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{roleContent.title}</h3>
              <p className="text-sm text-gray-600">{roleContent.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setViewMode(viewMode === 'stats' ? 'list' : 'stats')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                viewMode === 'stats'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {viewMode === 'stats' ? 'نمایش لیست' : 'نمایش آمار'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'stats' ? (
          <div className="space-y-6">
            {/* آمار کلی */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{statistics.totalSurveys}</div>
                <div className="text-sm text-blue-600">کل نظر‌سنجی‌ها</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <StarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{statistics.averageRating.toFixed(1)}</div>
                <div className="text-sm text-green-600">میانگین امتیاز</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUpIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">{statistics.qualityMetrics.recommendationRate}%</div>
                <div className="text-sm text-orange-600">نرخ توصیه</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">{statistics.technicalIssuesRate}%</div>
                <div className="text-sm text-red-600">مشکلات فنی</div>
              </div>
            </div>

            {/* نمودارها */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* توزیع امتیازات */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">توزیع امتیازات</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={statistics.ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, 'تعداد']}
                      labelFormatter={(label) => `${label} ستاره`}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* روند زمانی */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">روند امتیازات</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={statistics.trendsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'rating' ? `${value} ستاره` : value,
                        name === 'rating' ? 'میانگین امتیاز' : 'تعداد نظر‌سنجی'
                      ]}
                    />
                    <Line type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* متریک‌های کیفی */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">متریک‌های کیفی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {statistics.qualityMetrics.questionsQuality.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">کیفیت سوالات</div>
                  <div className="flex justify-center mt-1">
                    {getRatingStars(Math.round(statistics.qualityMetrics.questionsQuality))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {statistics.qualityMetrics.timeAdequacy.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">کفایت زمان</div>
                  <div className="flex justify-center mt-1">
                    {getRatingStars(Math.round(statistics.qualityMetrics.timeAdequacy))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {statistics.qualityMetrics.uiExperience.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">تجربه کاربری</div>
                  <div className="flex justify-center mt-1">
                    {getRatingStars(Math.round(statistics.qualityMetrics.uiExperience))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {statistics.qualityMetrics.recommendationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">نرخ توصیه</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${statistics.qualityMetrics.recommendationRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* پیشنهادات بهبود */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">پیشنهادات بهبود</h4>
              <div className="space-y-3">
                {statistics.topSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                    <span className="text-gray-800">{suggestion.suggestion}</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm text-gray-600">{suggestion.count} نفر</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(suggestion.count / statistics.totalSurveys) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* فیلتر و مرتب‌سازی */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">همه انواع</option>
                    <option value="course_exam">درس-آزمون</option>
                    <option value="test_exam">آزمون تستی</option>
                    <option value="flashcard">فلش‌کارت</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="date">تاریخ</option>
                    <option value="rating">امتیاز</option>
                    <option value="examType">نوع آزمون</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {getFilteredSurveys().length} نظر‌سنجی
              </div>
            </div>

            {/* لیست نظر‌سنجی‌ها */}
            <div className="space-y-4">
              {getFilteredSurveys().map((survey) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <h4 className="font-medium text-gray-900">{survey.examTitle}</h4>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {survey.examType === 'course_exam' ? 'درس-آزمون' : 
                           survey.examType === 'test_exam' ? 'آزمون تستی' : 'فلش‌کارت'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                        <span>{survey.studentName}</span>
                        <span>{survey.submittedAt}</span>
                        {survey.designerName && userRole !== 'designer' && (
                          <span>طراح: {survey.designerName}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className="flex items-center space-x-1 space-x-reverse mb-1">
                        {getRatingStars(survey.rating)}
                        <span className={`text-sm font-medium ${getSentimentColor(survey.rating)}`}>
                          {survey.rating}/5
                        </span>
                      </div>
                      {survey.wouldRecommend ? (
                        <div className="flex items-center space-x-1 space-x-reverse text-xs text-green-600">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>توصیه می‌کند</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 space-x-reverse text-xs text-red-600">
                          <XCircleIcon className="w-3 h-3" />
                          <span>توصیه نمی‌کند</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {survey.feedback && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-start space-x-2 space-x-reverse">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">{survey.feedback}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">{survey.difficultyRating}/5</div>
                      <div className="text-gray-600">سختی</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">{survey.questionsQuality}/5</div>
                      <div className="text-gray-600">کیفیت</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">{survey.timeAdequacy}/5</div>
                      <div className="text-gray-600">زمان</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">{survey.uiExperience}/5</div>
                      <div className="text-gray-600">رابط</div>
                    </div>
                  </div>
                  
                  {survey.technicalIssues && survey.issueDescription && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-start space-x-2 space-x-reverse">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-red-800">مشکل فنی گزارش شده:</div>
                          <div className="text-xs text-red-700">{survey.issueDescription}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {survey.improvementSuggestions.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">پیشنهادات بهبود:</div>
                      <div className="flex flex-wrap gap-1">
                        {survey.improvementSuggestions.map((suggestion, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                          >
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SurveyDisplay; 