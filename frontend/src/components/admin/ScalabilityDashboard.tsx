'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Cell
} from 'recharts';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
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
  }[];
  metrics: {
    primaryMetric: string;
    significance: number;
    confidence: number;
  };
}

interface SystemMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
  serverLoad: number;
  memoryUsage: number;
}

const ScalabilityDashboard: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const queryClient = useQueryClient();

  // Mock data - در production باید از API واقعی بیاید
  const mockABTests: ABTestData[] = [
    {
      id: 'test-1',
      name: 'صفحه ورود نسخه جدید',
      status: 'running',
      startDate: '2024-01-15',
      variants: [
        { id: 'control', name: 'کنترل', traffic: 50, conversions: 120, participants: 1000, conversionRate: 12.0 },
        { id: 'variant-a', name: 'نسخه A', traffic: 50, conversions: 145, participants: 1020, conversionRate: 14.2 }
      ],
      metrics: { primaryMetric: 'نرخ تبدیل', significance: 0.85, confidence: 85 }
    },
    {
      id: 'test-2',
      name: 'دکمه پرداخت',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      variants: [
        { id: 'control', name: 'کنترل', traffic: 33, conversions: 89, participants: 800, conversionRate: 11.1 },
        { id: 'variant-a', name: 'سبز', traffic: 33, conversions: 97, participants: 810, conversionRate: 12.0 },
        { id: 'variant-b', name: 'آبی', traffic: 34, conversions: 108, participants: 820, conversionRate: 13.2 }
      ],
      metrics: { primaryMetric: 'نرخ پرداخت', significance: 0.92, confidence: 92 }
    }
  ];

  const mockSystemMetrics: SystemMetrics = {
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.12,
    activeUsers: 1847,
    serverLoad: 68,
    memoryUsage: 72
  };

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

  // Mutations for controlling tests
  const controlTestMutation = useMutation({
    mutationFn: async ({ testId, action }: { testId: string; action: 'start' | 'pause' | 'stop' }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { testId, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
    }
  });

  const getStatusColor = (status: ABTestData['status']) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد A/B Testing و مقیاس‌پذیری</h1>
        <div className="flex space-x-2 space-x-reverse">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="1h">یک ساعت گذشته</option>
            <option value="24h">24 ساعت گذشته</option>
            <option value="7d">7 روز گذشته</option>
            <option value="30d">30 روز گذشته</option>
          </select>
        </div>
      </div>

      {/* System Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">زمان پاسخ</p>
              <p className="text-2xl font-semibold text-gray-900">{systemMetrics.responseTime}ms</p>
            </div>
            <div className={`p-2 rounded-full ${systemMetrics.responseTime > 300 ? 'bg-red-100' : 'bg-green-100'}`}>
              <ChartBarIcon className={`w-6 h-6 ${systemMetrics.responseTime > 300 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کاربران فعال</p>
              <p className="text-2xl font-semibold text-gray-900">{systemMetrics.activeUsers.toLocaleString('fa-IR')}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">نرخ خطا</p>
              <p className="text-2xl font-semibold text-gray-900">%{systemMetrics.errorRate.toFixed(2)}</p>
            </div>
            <div className={`p-2 rounded-full ${systemMetrics.errorRate > 1 ? 'bg-red-100' : 'bg-green-100'}`}>
              <ExclamationTriangleIcon className={`w-6 h-6 ${systemMetrics.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">بار سرور</p>
              <p className="text-2xl font-semibold text-gray-900">%{systemMetrics.serverLoad}</p>
            </div>
            <div className={`p-2 rounded-full ${systemMetrics.serverLoad > 80 ? 'bg-red-100' : 'bg-green-100'}`}>
              <CogIcon className={`w-6 h-6 ${systemMetrics.serverLoad > 80 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* A/B Tests Overview */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">تست‌های A/B فعال</h2>
        </div>
        <div className="p-6">
          {testsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {abTests.map((test) => (
                <div
                  key={test.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTest === test.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 space-x-reverse ${getStatusColor(test.status)}`}>
                        {getStatusIcon(test.status)}
                        <span>{test.status === 'running' ? 'در حال اجرا' : test.status === 'paused' ? 'متوقف' : test.status === 'completed' ? 'تکمیل شده' : 'پیش‌نویس'}</span>
                      </span>
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm text-gray-600">
                        اطمینان: %{test.metrics.confidence}
                      </span>
                      {test.status === 'running' && (
                        <div className="flex space-x-1 space-x-reverse">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              controlTestMutation.mutate({ testId: test.id, action: 'pause' });
                            }}
                            className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                            disabled={controlTestMutation.isPending}
                          >
                            <PauseIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              controlTestMutation.mutate({ testId: test.id, action: 'stop' });
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            disabled={controlTestMutation.isPending}
                          >
                            <StopIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTest === test.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Variants Performance */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">عملکرد نسخه‌ها</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={test.variants}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip
                                labelFormatter={(value) => `نسخه: ${value}`}
                                formatter={(value, name) => [
                                  `${value}${name === 'conversionRate' ? '%' : ''}`,
                                  name === 'conversionRate' ? 'نرخ تبدیل' : name === 'participants' ? 'شرکت‌کنندگان' : 'تبدیل‌ها'
                                ]}
                              />
                              <Bar dataKey="conversionRate" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Traffic Distribution */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">توزیع ترافیک</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={test.variants}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="traffic"
                                label={({ name, traffic }) => `${name}: ${traffic}%`}
                              >
                                {test.variants.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Detailed Stats */}
                      <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {test.variants.map((variant) => (
                            <div key={variant.id} className="bg-gray-50 p-3 rounded">
                              <h5 className="font-medium text-gray-900">{variant.name}</h5>
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <div>شرکت‌کنندگان: {variant.participants.toLocaleString('fa-IR')}</div>
                                <div>تبدیل‌ها: {variant.conversions.toLocaleString('fa-IR')}</div>
                                <div>نرخ تبدیل: %{variant.conversionRate.toFixed(1)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">روند عملکرد سیستم</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { time: '00:00', responseTime: 220, activeUsers: 1200 },
              { time: '04:00', responseTime: 180, activeUsers: 800 },
              { time: '08:00', responseTime: 250, activeUsers: 1500 },
              { time: '12:00', responseTime: 280, activeUsers: 2000 },
              { time: '16:00', responseTime: 245, activeUsers: 1847 },
              { time: '20:00', responseTime: 190, activeUsers: 1300 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#EF4444" strokeWidth={2} name="زمان پاسخ (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} name="کاربران فعال" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">منابع سیستم</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>بار CPU</span>
                <span>%{systemMetrics.serverLoad}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${systemMetrics.serverLoad > 80 ? 'bg-red-500' : systemMetrics.serverLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${systemMetrics.serverLoad}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>استفاده از حافظه</span>
                <span>%{systemMetrics.memoryUsage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${systemMetrics.memoryUsage > 80 ? 'bg-red-500' : systemMetrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>توان عملیاتی</span>
                <span>{systemMetrics.throughput.toLocaleString('fa-IR')} req/min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(100, (systemMetrics.throughput / 2000) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScalabilityDashboard;