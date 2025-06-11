'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  BanknotesIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpOnSquareIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// انواع داده‌ها برای کیف پول طراح
interface DesignerWalletData {
  totalBalance: number;
  availableBalance: number;
  pendingEarnings: number;
  monthlyEarnings: number;
  totalWithdrawn: number;
  withdrawalRequests: WithdrawalRequest[];
  recentEarnings: EarningHistory[];
  statistics: WalletStatistics;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  bankAccount: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  processDate?: string;
}

interface EarningHistory {
  id: string;
  source: 'question_sale' | 'course_exam' | 'flashcard' | 'bonus';
  amount: number;
  description: string;
  date: string;
  studentName?: string;
}

interface WalletStatistics {
  totalSales: number;
  questionsSold: number;
  courseExamsSold: number;
  flashcardsSold: number;
  averageDailyEarning: number;
  conversionRate: number;
}

interface DesignerWalletCardProps {
  designerId: string;
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockWalletData: DesignerWalletData = {
  totalBalance: 2750000,
  availableBalance: 2200000,
  pendingEarnings: 550000,
  monthlyEarnings: 1850000,
  totalWithdrawn: 5200000,
  withdrawalRequests: [
    {
      id: 'req-001',
      amount: 500000,
      bankAccount: '****1234',
      requestDate: '1403/10/20',
      status: 'pending'
    },
    {
      id: 'req-002',
      amount: 300000,
      bankAccount: '****5678',
      requestDate: '1403/10/15',
      status: 'approved',
      processDate: '1403/10/16',
      adminNote: 'پرداخت انجام شد'
    }
  ],
  recentEarnings: [
    {
      id: 'earn-001',
      source: 'question_sale',
      amount: 50000,
      description: 'فروش سوال ریاضی',
      date: '1403/10/22',
      studentName: 'علی احمدی'
    },
    {
      id: 'earn-002',
      source: 'course_exam',
      amount: 75000,
      description: 'فروش درس-آزمون فیزیک',
      date: '1403/10/21',
      studentName: 'مریم حسینی'
    },
    {
      id: 'earn-003',
      source: 'flashcard',
      amount: 25000,
      description: 'فروش فلش‌کارت شیمی',
      date: '1403/10/20',
      studentName: 'رضا مرادی'
    }
  ],
  statistics: {
    totalSales: 127,
    questionsSold: 85,
    courseExamsSold: 32,
    flashcardsSold: 47,
    averageDailyEarning: 45000,
    conversionRate: 15.5
  }
};

const DesignerWalletCard: React.FC<DesignerWalletCardProps> = ({
  designerId,
  className = ''
}) => {
  const [walletData, setWalletData] = useState<DesignerWalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        // شبیه‌سازی فراخوانی API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWalletData(mockWalletData);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات کیف پول:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [designerId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'در انتظار';
      case 'approved':
        return 'تایید شده';
      case 'rejected':
        return 'رد شده';
      default:
        return 'نامشخص';
    }
  };

  const getSourceIcon = (source: EarningHistory['source']) => {
    switch (source) {
      case 'question_sale':
        return <ChartBarIcon className="w-4 h-4" />;
      case 'course_exam':
        return <BanknotesIcon className="w-4 h-4" />;
      case 'flashcard':
        return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'bonus':
        return <TrendingUpIcon className="w-4 h-4" />;
      default:
        return <WalletIcon className="w-4 h-4" />;
    }
  };

  const handleWithdrawalRequest = async () => {
    if (!withdrawalAmount || !bankAccount) return;

    try {
      // ارسال درخواست برداشت به API
      console.log('درخواست برداشت:', {
        amount: parseInt(withdrawalAmount),
        bankAccount,
        designerId
      });
      
      // بستن مودال و ری‌ست کردن فرم
      setShowWithdrawalModal(false);
      setWithdrawalAmount('');
      setBankAccount('');
      
      // نمایش پیام موفقیت
      alert('درخواست برداشت شما ثبت شد و پس از بررسی پرداخت خواهد شد.');
    } catch (error) {
      console.error('خطا در ثبت درخواست برداشت:', error);
      alert('خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
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

  if (!walletData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="text-center text-gray-500">
          <WalletIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>خطا در بارگذاری اطلاعات کیف پول</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-lg shadow-sm border ${className}`}
        dir="rtl"
      >
        {/* هدر */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-green-100 rounded-lg">
                <WalletIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">کیف پول طراح</h3>
                <p className="text-sm text-gray-600">مدیریت درآمد و برداشت</p>
              </div>
            </div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowUpOnSquareIcon className="w-4 h-4" />
              <span>درخواست برداشت</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* اطلاعات اصلی کیف پول */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">موجودی کل</p>
                  <p className="text-xl font-bold text-green-800">
                    {formatCurrency(walletData.totalBalance)}
                  </p>
                </div>
                <BanknotesIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">قابل برداشت</p>
                  <p className="text-xl font-bold text-blue-800">
                    {formatCurrency(walletData.availableBalance)}
                  </p>
                </div>
                <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">در انتظار</p>
                  <p className="text-xl font-bold text-orange-800">
                    {formatCurrency(walletData.pendingEarnings)}
                  </p>
                </div>
                <ClockIcon className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">درآمد ماهانه</p>
                  <p className="text-xl font-bold text-purple-800">
                    {formatCurrency(walletData.monthlyEarnings)}
                  </p>
                </div>
                <TrendingUpIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* آمار عملکرد */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">آمار عملکرد</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {walletData.statistics.totalSales}
                </div>
                <div className="text-sm text-gray-600">کل فروش</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {walletData.statistics.questionsSold}
                </div>
                <div className="text-sm text-gray-600">سوالات فروخته شده</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(walletData.statistics.averageDailyEarning)}
                </div>
                <div className="text-sm text-gray-600">میانگین درآمد روزانه</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {walletData.statistics.conversionRate}%
                </div>
                <div className="text-sm text-gray-600">نرخ تبدیل</div>
              </div>
            </div>
          </div>

          {/* درخواست‌های برداشت */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">درخواست‌های برداشت</h4>
            <div className="space-y-3">
              {walletData.withdrawalRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(request.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.requestDate} - {request.bankAccount}
                      </p>
                    </div>
                  </div>
                  {request.status === 'approved' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  )}
                  {request.status === 'rejected' && (
                    <XCircleIcon className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* درآمدهای اخیر */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">درآمدهای اخیر</h4>
            <div className="space-y-3">
              {walletData.recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      {getSourceIcon(earning.source)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{earning.description}</p>
                      <p className="text-sm text-gray-600">
                        {earning.date} {earning.studentName && `- ${earning.studentName}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">
                    +{formatCurrency(earning.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* مودال درخواست برداشت */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">درخواست برداشت</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ برداشت (تومان)
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مبلغ مورد نظر را وارد کنید"
                max={walletData.availableBalance}
              />
              <p className="text-xs text-gray-500 mt-1">
                حداکثر قابل برداشت: {formatCurrency(walletData.availableBalance)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره حساب
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="شماره حساب بانکی"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 space-x-reverse">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleWithdrawalRequest}
                disabled={!withdrawalAmount || !bankAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                ثبت درخواست
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DesignerWalletCard; 