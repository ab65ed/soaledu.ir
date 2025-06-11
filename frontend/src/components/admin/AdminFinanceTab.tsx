'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  GiftIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserGroupIcon,
  CalendarIcon,
  ArchiveBoxIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  WalletIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  
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

// انواع داده‌ها برای مدیریت مالی
interface FinanceOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  totalGifts: number;
  monthlyGifts: number;
  activeUsers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  giftGrowth: number;
}

interface GiftTransaction {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  message?: string;
  type: 'question_gift' | 'course_gift' | 'appreciation_gift' | 'achievement_gift';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  relatedItemId?: string;
  relatedItemTitle?: string;
}

interface RevenueData {
  date: string;
  revenue: number;
  gifts: number;
  users: number;
  orders: number;
}

interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
  count: number;
}

interface AdminFinanceTabProps {
  dateRange?: { start: string; end: string };
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockFinanceOverview: FinanceOverview = {
  totalRevenue: 125750000,
  monthlyRevenue: 18650000,
  totalGifts: 12450000,
  monthlyGifts: 2340000,
  activeUsers: 1247,
  averageOrderValue: 185000,
  revenueGrowth: 15.3,
  giftGrowth: 8.7
};

const mockGiftTransactions: GiftTransaction[] = [
  {
    id: 'gift-001',
    fromUserId: 'user-123',
    fromUserName: 'علی احمدی',
    toUserId: 'designer-001',
    toUserName: 'مریم حسینی',
    amount: 50000,
    message: 'سپاس از سوال عالی',
    type: 'question_gift',
    date: '1403/10/22 14:30',
    status: 'completed',
    relatedItemId: 'question-001',
    relatedItemTitle: 'سوال ریاضی فصل اول'
  },
  {
    id: 'gift-002',
    fromUserId: 'user-124',
    fromUserName: 'فاطمه رضایی',
    toUserId: 'designer-002',
    toUserName: 'احمد محمدی',
    amount: 100000,
    message: 'درس-آزمون بسیار مفید بود',
    type: 'course_gift',
    date: '1403/10/21 16:15',
    status: 'completed',
    relatedItemId: 'course-001',
    relatedItemTitle: 'درس فیزیک مکانیک'
  },
  {
    id: 'gift-003',
    fromUserId: 'user-125',
    fromUserName: 'رضا مرادی',
    toUserId: 'expert-001',
    toUserName: 'دکتر کریمی',
    amount: 75000,
    message: 'تشکر از راهنمایی',
    type: 'appreciation_gift',
    date: '1403/10/20 10:45',
    status: 'completed'
  },
  {
    id: 'gift-004',
    fromUserId: 'system',
    fromUserName: 'سیستم',
    toUserId: 'user-126',
    toUserName: 'سارا کریمی',
    amount: 25000,
    type: 'achievement_gift',
    date: '1403/10/19 12:00',
    status: 'completed',
    relatedItemTitle: 'تکمیل 10 آزمون'
  }
];

const mockRevenueData: RevenueData[] = [
  { date: '1403/10/15', revenue: 2450000, gifts: 180000, users: 45, orders: 32 },
  { date: '1403/10/16', revenue: 2680000, gifts: 220000, users: 52, orders: 38 },
  { date: '1403/10/17', revenue: 2340000, gifts: 195000, users: 48, orders: 29 },
  { date: '1403/10/18', revenue: 2890000, gifts: 250000, users: 58, orders: 42 },
  { date: '1403/10/19', revenue: 3120000, gifts: 275000, users: 61, orders: 47 },
  { date: '1403/10/20', revenue: 2750000, gifts: 230000, users: 55, orders: 39 },
  { date: '1403/10/21', revenue: 3240000, gifts: 290000, users: 64, orders: 51 },
  { date: '1403/10/22', revenue: 2980000, gifts: 260000, users: 59, orders: 44 }
];

const mockPaymentMethods: PaymentMethod[] = [
  { method: 'کیف پول', amount: 8750000, percentage: 47.2, count: 156 },
  { method: 'کارت بانکی', amount: 6420000, percentage: 34.6, count: 89 },
  { method: 'اینترنت بانک', amount: 2340000, percentage: 12.6, count: 34 },
  { method: 'موجودی هدیه', amount: 1040000, percentage: 5.6, count: 67 }
];

const AdminFinanceTab: React.FC<AdminFinanceTabProps> = ({
  dateRange,
  className = ''
}) => {
  const [financeOverview, setFinanceOverview] = useState<FinanceOverview>(mockFinanceOverview);
  const [giftTransactions, setGiftTransactions] = useState<GiftTransaction[]>(mockGiftTransactions);
  const [revenueData, setRevenueData] = useState<RevenueData[]>(mockRevenueData);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'gifts' | 'revenue' | 'payments'>('overview');
  const [filterPeriod, setFilterPeriod] = useState('7d');

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        // شبیه‌سازی فراخوانی API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // در اینجا داده‌ها بر اساس dateRange فیلتر می‌شوند
        setFinanceOverview(mockFinanceOverview);
        setGiftTransactions(mockGiftTransactions);
        setRevenueData(mockRevenueData);
        setPaymentMethods(mockPaymentMethods);
      } catch (error) {
        console.error('خطا در دریافت داده‌های مالی:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [dateRange, filterPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getGiftTypeIcon = (type: GiftTransaction['type']) => {
    switch (type) {
      case 'question_gift':
        return <DocumentChartBarIcon className="w-4 h-4" />;
      case 'course_gift':
        return <ArchiveBoxIcon className="w-4 h-4" />;
      case 'appreciation_gift':
        return <GiftIcon className="w-4 h-4" />;
      case 'achievement_gift':
        return <CurrencyDollarIcon className="w-4 h-4" />;
      default:
        return <GiftIcon className="w-4 h-4" />;
    }
  };

  const getGiftTypeText = (type: GiftTransaction['type']) => {
    switch (type) {
      case 'question_gift':
        return 'هدیه سوال';
      case 'course_gift':
        return 'هدیه درس';
      case 'appreciation_gift':
        return 'هدیه قدردانی';
      case 'achievement_gift':
        return 'هدیه دستاورد';
      default:
        return 'هدیه';
    }
  };

  const getStatusColor = (status: GiftTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 0) return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">مدیریت مالی</h3>
              <p className="text-sm text-gray-600">نظارت بر درآمد، هدایا و تراکنش‌ها</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            >
              <option value="1d">امروز</option>
              <option value="7d">7 روز اخیر</option>
              <option value="30d">30 روز اخیر</option>
              <option value="90d">3 ماه اخیر</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 space-x-reverse border-b border-gray-200 mt-4">
          {[
            { id: 'overview', name: 'نمای کلی', icon: PresentationChartLineIcon },
            { id: 'gifts', name: 'گزارش هدایا', icon: GiftIcon },
            { id: 'revenue', name: 'تحلیل درآمد', icon: TrendingUpIcon },
            { id: 'payments', name: 'روش‌های پرداخت', icon: CreditCardIcon }
          ].map((tab) => (
            <button
              key={tab.id}
                                          onClick={() => setActiveTab(tab.id as 'overview' | 'transactions' | 'gifts' | 'analytics')}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-100 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* آمار کلی */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">کل درآمد</p>
                    <p className="text-xl font-bold text-green-800">
                      {formatCurrency(financeOverview.totalRevenue)}
                    </p>
                  </div>
                  <BanknotesIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2 flex items-center">
                  {getTrendIcon(financeOverview.revenueGrowth)}
                  <span className="text-xs text-green-700 mr-1">
                    +{financeOverview.revenueGrowth}% این ماه
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">کل هدایا</p>
                    <p className="text-xl font-bold text-purple-800">
                      {formatCurrency(financeOverview.totalGifts)}
                    </p>
                  </div>
                  <GiftIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-2 flex items-center">
                  {getTrendIcon(financeOverview.giftGrowth)}
                  <span className="text-xs text-purple-700 mr-1">
                    +{financeOverview.giftGrowth}% این ماه
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">کاربران فعال</p>
                    <p className="text-xl font-bold text-blue-800">
                      {financeOverview.activeUsers.toLocaleString('fa-IR')}
                    </p>
                  </div>
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-blue-700">این ماه</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">میانگین سفارش</p>
                    <p className="text-xl font-bold text-orange-800">
                      {formatCurrency(financeOverview.averageOrderValue)}
                    </p>
                  </div>
                  <ShoppingCartIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-orange-700">هر سفارش</span>
                </div>
              </div>
            </div>

            {/* نمودار درآمد و هدایا */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">روند درآمد و هدایا</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === 'revenue' ? 'درآمد' : 'هدایا'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="gifts"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* آمار سریع */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">عملکرد ماهانه</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">درآمد ماهانه:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(financeOverview.monthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">هدایای ماهانه:</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(financeOverview.monthlyGifts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نسبت هدایا به درآمد:</span>
                    <span className="font-semibold text-blue-600">
                      {((financeOverview.monthlyGifts / financeOverview.monthlyRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">پیش‌بینی</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">درآمد پیش‌بینی شده:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(financeOverview.monthlyRevenue * 1.15)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">هدایای پیش‌بینی شده:</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(financeOverview.monthlyGifts * 1.09)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">کاربران جدید:</span>
                    <span className="font-semibold text-blue-600">+85 نفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gifts Tab */}
        {activeTab === 'gifts' && (
          <div className="space-y-6">
            {/* آمار هدایا */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <GiftIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">
                  {giftTransactions.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-purple-600">هدایای تکمیل شده</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(giftTransactions.reduce((sum, t) => sum + t.amount, 0))}
                </div>
                <div className="text-sm text-green-600">مجموع هدایا</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <UserGroupIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">
                  {new Set(giftTransactions.map(t => t.fromUserId)).size}
                </div>
                <div className="text-sm text-blue-600">هدیه دهندگان</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <WalletIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">
                  {(giftTransactions.reduce((sum, t) => sum + t.amount, 0) / giftTransactions.length).toLocaleString('fa-IR')}
                </div>
                <div className="text-sm text-orange-600">میانگین هدیه</div>
              </div>
            </div>

            {/* لیست تراکنش‌های هدیه */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">آخرین تراکنش‌های هدیه</h4>
              <div className="space-y-3">
                {giftTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                          {getGiftTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {getGiftTypeText(transaction.type)}
                          </h5>
                          <p className="text-sm text-gray-600">
                            از {transaction.fromUserName} به {transaction.toUserName}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' ? 'تکمیل شده' :
                           transaction.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{transaction.date}</span>
                      </div>
                      {transaction.relatedItemTitle && (
                        <span className="text-blue-600">مرتبط با: {transaction.relatedItemTitle}</span>
                      )}
                    </div>
                    
                    {transaction.message && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>پیام:</strong> {transaction.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* نمودار تحلیل درآمد */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">تحلیل درآمد روزانه</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'درآمد' : name === 'users' ? 'کاربران' : 'سفارشات'
                    ]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* جزئیات درآمد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">منابع درآمد</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">درس-آزمون:</span>
                    <span className="font-semibold text-green-600">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">آزمون تستی:</span>
                    <span className="font-semibold text-blue-600">32%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">فلش‌کارت:</span>
                    <span className="font-semibold text-purple-600">23%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">مقایسه با ماه قبل</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">درآمد:</span>
                    <span className="font-semibold text-green-600">+15.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد سفارش:</span>
                    <span className="font-semibold text-blue-600">+8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">میانگین سفارش:</span>
                    <span className="font-semibold text-orange-600">+6.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* نمودار روش‌های پرداخت */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4">توزیع روش‌های پرداخت</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ method, percentage }) => `${method}: ${percentage}%`}
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4">جزئیات روش‌های پرداخت</h4>
                <div className="space-y-3">
                  {paymentMethods.map((method, index) => (
                    <div key={method.method} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-900">{method.method}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(method.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.count} تراکنش
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* هشدارها و اعلان‌ها */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2 space-x-reverse">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">نکات مهم مالی</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• تراکنش‌های معلق بررسی شوند</li>
                    <li>• گزارش مالی ماهانه آماده سازی شود</li>
                    <li>• روش‌های پرداخت جدید بررسی شوند</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminFinanceTab; 