'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  UserGroupIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BeakerIcon,
  AdjustmentsHorizontalIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

interface ABTestData {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
  variants: {
    id: string;
    name: string;
    traffic: number;
    conversions: number;
    participants: number;
    conversionRate: number;
    revenue?: number;
  }[];
  metrics: {
    primaryMetric: string;
    significance: number;
    confidence: number;
    estimatedDuration?: number;
    potentialLift?: number;
  };
  courseExamConnection?: {
    connectedExams: number;
    totalImpact: number;
  };
}

interface SystemMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
  serverLoad: number;
  memoryUsage: number;
  databaseConnections: number;
  cacheHitRate: number;
}

interface PerformanceData {
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
}

const ScalabilityDashboard: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState<'overview' | 'abtests' | 'performance' | 'questions'>('overview');
  const queryClient = useQueryClient();

  // Mock data - در production باید از API واقعی بیاید
  const mockABTests: ABTestData[] = [
    {
      id: 'test-1',
      name: 'فرم درس-آزمون نسخه جدید',
      status: 'running',
      startDate: '1403/10/15',
      variants: [
        { 
          id: 'control', 
          name: 'فرم کنترل', 
          traffic: 50, 
          conversions: 120, 
          participants: 1000, 
          conversionRate: 12.0,
          revenue: 3600000
        },
        { 
          id: 'variant-a', 
          name: 'فرم بهینه شده', 
          traffic: 50, 
          conversions: 145, 
          participants: 1020, 
          conversionRate: 14.2,
          revenue: 4350000
        }
      ],
      metrics: { 
        primaryMetric: 'نرخ تبدیل', 
        significance: 0.85, 
        confidence: 85,
        estimatedDuration: 14,
        potentialLift: 18.3
      },
      courseExamConnection: {
        connectedExams: 25,
        totalImpact: 750000
      }
    },
    {
      id: 'test-2',
      name: 'انتخابگر سوالات پیشرفته',
      status: 'completed',
      startDate: '1403/10/01',
      endDate: '1403/10/14',
      variants: [
        { 
          id: 'control', 
          name: 'انتخابگر معمولی', 
          traffic: 50, 
          conversions: 89, 
          participants: 800, 
          conversionRate: 11.1,
          revenue: 2670000
        },
        { 
          id: 'variant-a', 
          name: 'انتخابگر هوشمند', 
          traffic: 50, 
          conversions: 108, 
          participants: 820, 
          conversionRate: 13.2,
          revenue: 3240000
        }
      ],
      metrics: { 
        primaryMetric: 'کیفیت سوالات انتخاب شده', 
        significance: 0.92, 
        confidence: 92,
        potentialLift: 21.4
      },
      courseExamConnection: {
        connectedExams: 18,
        totalImpact: 570000
      }
    },
    {
      id: 'test-3',
      name: 'UI تست سوالات',
      status: 'running',
      startDate: '1403/10/20',
      variants: [
        { 
          id: 'control', 
          name: 'UI قدیمی', 
          traffic: 33, 
          conversions: 45, 
          participants: 450, 
          conversionRate: 10.0,
          revenue: 1350000
        },
        { 
          id: 'variant-a', 
          name: 'UI مدرن', 
          traffic: 33, 
          conversions: 52, 
          participants: 460, 
          conversionRate: 11.3,
          revenue: 1560000
        },
        { 
          id: 'variant-b', 
          name: 'UI تعاملی', 
          traffic: 34, 
          conversions: 58, 
          participants: 470, 
          conversionRate: 12.3,
          revenue: 1740000
        }
      ],
      metrics: { 
        primaryMetric: 'تعامل کاربری', 
        significance: 0.78, 
        confidence: 78,
        estimatedDuration: 10,
        potentialLift: 23.0
      },
      courseExamConnection: {
        connectedExams: 12,
        totalImpact: 390000
      }
    }
  ];

  const mockSystemMetrics: SystemMetrics = {
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.12,
    activeUsers: 1847,
    serverLoad: 68,
    memoryUsage: 72,
    databaseConnections: 45,
    cacheHitRate: 94.5
  };

  const mockPerformanceData: PerformanceData[] = [
    { timestamp: '14:00', responseTime: 220, throughput: 1100, errorRate: 0.08, activeUsers: 1650 },
    { timestamp: '14:15', responseTime: 235, throughput: 1180, errorRate: 0.10, activeUsers: 1720 },
    { timestamp: '14:30', responseTime: 245, throughput: 1250, errorRate: 0.12, activeUsers: 1847 },
    { timestamp: '14:45', responseTime: 255, throughput: 1320, errorRate: 0.15, activeUsers: 1920 },
    { timestamp: '15:00', responseTime: 250, throughput: 1280, errorRate: 0.11, activeUsers: 1890 },
    { timestamp: '15:15', responseTime: 240, throughput: 1200, errorRate: 0.09, activeUsers: 1750 },
    { timestamp: '15:30', responseTime: 230, throughput: 1150, errorRate: 0.07, activeUsers: 1680 },
    { timestamp: '15:45', responseTime: 225, throughput: 1120, errorRate: 0.06, activeUsers: 1620 }
  ];

  // Query for A/B tests
  const { data: abTests = mockABTests, isLoading: testsLoading } = useQuery({
    queryKey: ['ab-tests'],
    queryFn: () => Promise.resolve(mockABTests),
    refetchInterval: 30000
  });

  // Query for system metrics
  const { data: systemMetrics = mockSystemMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics', timeRange],
    queryFn: () => Promise.resolve(mockSystemMetrics),
    refetchInterval: 10000
  });

  // Query for performance data
  const { data: performanceData = mockPerformanceData } = useQuery({
    queryKey: ['performance-data', timeRange],
    queryFn: () => Promise.resolve(mockPerformanceData),
    refetchInterval: 60000
  });

  // Mutations for controlling tests
  const controlTestMutation = useMutation({
    mutationFn: async ({ testId, action }: { testId: string; action: 'start' | 'pause' | 'stop' }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { testId, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
    }
  });

  const getStatusColor = (status: ABTestData['status']) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'draft': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: ABTestData['status']) => {
    switch (status) {
      case 'running': return <PlayIcon className="w-4 h-4" />;
      case 'paused': return <PauseIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'draft': return <ClockIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getMetricStatus = (value: number, threshold: number, isReverse = false) => {
    const isGood = isReverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">داشبورد A/B Testing و مقیاس‌پذیری</h1>
            <p className="text-gray-600">نظارت بر عملکرد سیستم و آزمایش‌های A/B</p>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">یک ساعت گذشته</option>
              <option value="24h">24 ساعت گذشته</option>
              <option value="7d">7 روز گذشته</option>
              <option value="30d">30 روز گذشته</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 space-x-reverse border-b border-gray-200">
          {[
            { id: 'overview', name: 'نمای کلی', icon: DocumentChartBarIcon },
            { id: 'abtests', name: 'A/B Testing', icon: BeakerIcon },
            { id: 'performance', name: 'عملکرد سیستم', icon: ServerIcon },
            { id: 'questions', name: 'سوالات تست', icon: AdjustmentsHorizontalIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">زمان پاسخ</p>
                  <p className={`text-2xl font-semibold ${getMetricStatus(systemMetrics.responseTime, 300, true)}`}>
                    {systemMetrics.responseTime}ms
                  </p>
                </div>
                <div className={`p-2 rounded-full ${systemMetrics.responseTime > 300 ? 'bg-red-100' : 'bg-green-100'}`}>
                  <ChartBarIcon className={`w-6 h-6 ${systemMetrics.responseTime > 300 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {getTrendIcon(systemMetrics.responseTime, 220)}
                <span className="text-xs text-gray-500 mr-1">نسبت به ساعت قبل</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">کاربران فعال</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {systemMetrics.activeUsers.toLocaleString('fa-IR')}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {getTrendIcon(systemMetrics.activeUsers, 1650)}
                <span className="text-xs text-gray-500 mr-1">+12% امروز</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">نرخ خطا</p>
                  <p className={`text-2xl font-semibold ${getMetricStatus(systemMetrics.errorRate, 0.5, true)}`}>
                    %{systemMetrics.errorRate.toFixed(2)}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${systemMetrics.errorRate > 0.5 ? 'bg-red-100' : 'bg-green-100'}`}>
                  <ExclamationTriangleIcon className={`w-6 h-6 ${systemMetrics.errorRate > 0.5 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {getTrendIcon(0.08, systemMetrics.errorRate)}
                <span className="text-xs text-gray-500 mr-1">در حد مطلوب</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">بار سرور</p>
                  <p className={`text-2xl font-semibold ${getMetricStatus(systemMetrics.serverLoad, 80, true)}`}>
                    %{systemMetrics.serverLoad}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${systemMetrics.serverLoad > 80 ? 'bg-red-100' : 'bg-green-100'}`}>
                  <CpuChipIcon className={`w-6 h-6 ${systemMetrics.serverLoad > 80 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                {getTrendIcon(60, systemMetrics.serverLoad)}
                <span className="text-xs text-gray-500 mr-1">قابل قبول</span>
              </div>
            </div>
          </motion.div>

          {/* Running A/B Tests Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">خلاصه آزمایش‌های A/B فعال</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {abTests.filter(test => test.status === 'running').map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">اعتماد:</span>
                      <span className="font-medium">{test.metrics.confidence}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">بهترین نسخه:</span>
                      <span className="font-medium text-green-600">
                        {test.variants.reduce((best, variant) => 
                          variant.conversionRate > best.conversionRate ? variant : best
                        ).name}
                      </span>
                    </div>
                    {test.courseExamConnection && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">آزمون‌های متصل:</span>
                        <span className="font-medium">{test.courseExamConnection.connectedExams}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* A/B Tests Tab */}
      {activeTab === 'abtests' && (
        <div className="space-y-6">
          {abTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">
                    شروع: {test.startDate} {test.endDate && `- پایان: ${test.endDate}`}
                  </p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(test.status)}`}>
                    {getStatusIcon(test.status)}
                    <span className="mr-1">
                      {test.status === 'running' && 'در حال اجرا'}
                      {test.status === 'paused' && 'متوقف شده'}
                      {test.status === 'completed' && 'تکمیل شده'}
                      {test.status === 'draft' && 'پیش‌نویس'}
                    </span>
                  </div>
                  {test.status === 'running' && (
                    <button
                      onClick={() => controlTestMutation.mutate({ testId: test.id, action: 'pause' })}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <PauseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Test Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">متریک اصلی</p>
                  <p className="text-lg font-semibold text-blue-800">{test.metrics.primaryMetric}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">سطح اعتماد</p>
                  <p className="text-lg font-semibold text-green-800">{test.metrics.confidence}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">بهبود احتمالی</p>
                  <p className="text-lg font-semibold text-purple-800">
                    {test.metrics.potentialLift ? `+${test.metrics.potentialLift}%` : 'N/A'}
                  </p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">مدت برآوردی</p>
                  <p className="text-lg font-semibold text-orange-800">
                    {test.metrics.estimatedDuration ? `${test.metrics.estimatedDuration} روز` : 'تکمیل شده'}
                  </p>
                </div>
              </div>

              {/* Variants Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {test.variants.map((variant, variantIndex) => (
                  <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{variant.name}</h4>
                      <div className="text-sm text-gray-600">{variant.traffic}% ترافیک</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">شرکت‌کنندگان:</span>
                        <span className="font-medium">{variant.participants.toLocaleString('fa-IR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">تبدیل‌ها:</span>
                        <span className="font-medium">{variant.conversions.toLocaleString('fa-IR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">نرخ تبدیل:</span>
                        <span className="font-semibold text-blue-600">{variant.conversionRate.toFixed(1)}%</span>
                      </div>
                      {variant.revenue && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">درآمد:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(variant.revenue)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            variantIndex === 0 ? 'bg-blue-500' : variantIndex === 1 ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${variant.conversionRate * 5}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course-Exam Connection */}
              {test.courseExamConnection && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">اتصال به درس-آزمون</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">آزمون‌های متصل:</span>
                      <span className="font-medium">{test.courseExamConnection.connectedExams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">تأثیر کل:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(test.courseExamConnection.totalImpact)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نمودار عملکرد زمان واقعی</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">زمان پاسخ و ترافیک</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) => `زمان: ${value}`}
                      formatter={(value, name) => [
                        name === 'responseTime' ? `${value}ms` : value,
                        name === 'responseTime' ? 'زمان پاسخ' : 'کاربران فعال'
                      ]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">ترافیک و نرخ خطا</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) => `زمان: ${value}`}
                      formatter={(value, name) => [
                        name === 'throughput' ? value : `${value}%`,
                        name === 'throughput' ? 'ترافیک' : 'نرخ خطا'
                      ]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="throughput"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="errorRate"
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Additional System Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">استفاده از حافظه</p>
                  <p className="text-2xl font-semibold text-gray-900">{systemMetrics.memoryUsage}%</p>
                </div>
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { value: systemMetrics.memoryUsage },
                          { value: 100 - systemMetrics.memoryUsage }
                        ]}
                        innerRadius={15}
                        outerRadius={30}
                        startAngle={90}
                        endAngle={450}
                        dataKey="value"
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">اتصالات دیتابیس</p>
                  <p className="text-2xl font-semibold text-gray-900">{systemMetrics.databaseConnections}</p>
                </div>
                <ServerIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">نرخ بازیابی کش</p>
                  <p className="text-2xl font-semibold text-green-600">{systemMetrics.cacheHitRate}%</p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <CogIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ترافیک ثانیه</p>
                  <p className="text-2xl font-semibold text-purple-600">{systemMetrics.throughput}</p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <TrendingUpIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Questions in Test UI Tab */}
      {activeTab === 'questions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نمایش سوالات در UI تست</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BeakerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">نمایش سوالات در حال توسعه</h4>
            <p className="text-gray-600 mb-4">
              این بخش برای نمایش سوالات در رابط کاربری تست‌های A/B طراحی شده و به زودی تکمیل خواهد شد.
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                مشاهده نمونه سوالات
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                تنظیمات نمایش
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScalabilityDashboard;