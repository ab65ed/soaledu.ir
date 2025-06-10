'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/api';

interface Transaction {
  id: string;
  type: 'sale' | 'refund' | 'discount' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletData {
  balance: number;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingAmount: number;
  transactions: Transaction[];
}

interface WalletCardProps {
  designerId?: string;
  showTransactions?: boolean;
  className?: string;
}

export default function WalletCard({ 
  designerId, 
  showTransactions = true, 
  className = '' 
}: WalletCardProps) {
  const [showBalance, setShowBalance] = React.useState(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState<'week' | 'month' | 'year'>('month');

  // دریافت اطلاعات مالی
  const { 
    data: financeData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['designerWallet', designerId, selectedPeriod],
    queryFn: () => adminService.getFinanceData(),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
  });

  // محاسبه آمار کیف پول
  const walletStats = React.useMemo(() => {
    if (!financeData) return null;

    const mockWalletData: WalletData = {
      balance: 2450000, // 2,450,000 تومان
      totalEarnings: 15680000, // 15,680,000 تومان
      monthlyEarnings: 3200000, // 3,200,000 تومان
      pendingAmount: 450000, // 450,000 تومان
      transactions: [
        {
          id: '1',
          type: 'sale',
          amount: 150000,
          description: 'فروش درس-آزمون ریاضی پایه نهم',
          date: '1403/10/25',
          status: 'completed'
        },
        {
          id: '2',
          type: 'sale',
          amount: 200000,
          description: 'فروش فلش‌کارت فیزیک',
          date: '1403/10/24',
          status: 'completed'
        },
        {
          id: '3',
          type: 'withdrawal',
          amount: -500000,
          description: 'برداشت از کیف پول',
          date: '1403/10/23',
          status: 'pending'
        },
        {
          id: '4',
          type: 'sale',
          amount: 120000,
          description: 'فروش آزمون تستی شیمی',
          date: '1403/10/22',
          status: 'completed'
        },
        {
          id: '5',
          type: 'refund',
          amount: -80000,
          description: 'بازگشت وجه آزمون ریاضی',
          date: '1403/10/21',
          status: 'completed'
        }
      ]
    };

    return mockWalletData;
  }, [financeData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowDownLeft className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-orange-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return 'text-green-600';
      case 'withdrawal':
      case 'refund':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !walletStats) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <div className="text-center text-red-500">
          خطا در بارگذاری اطلاعات کیف پول
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              کیف پول طراح
            </h3>
          </div>
          
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={showBalance ? 'مخفی کردن موجودی' : 'نمایش موجودی'}
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-gray-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* موجودی اصلی */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">موجودی فعلی</p>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(walletStats.balance) : '••••••••'}
            </p>
          </div>

          {/* آمار سریع */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">درآمد ماهانه</span>
              </div>
              <p className="text-sm font-semibold text-green-800">
                {showBalance ? formatCurrency(walletStats.monthlyEarnings) : '••••••'}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-700">در انتظار تسویه</span>
              </div>
              <p className="text-sm font-semibold text-orange-800">
                {showBalance ? formatCurrency(walletStats.pendingAmount) : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* تراکنش‌های اخیر */}
      {showTransactions && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              تراکنش‌های اخیر
            </h4>
            
            {/* فیلتر دوره زمانی */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedPeriod === period
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period === 'week' ? 'هفته' : period === 'month' ? 'ماه' : 'سال'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {walletStats.transactions.slice(0, 5).map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {transaction.date}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status === 'completed' ? 'تکمیل شده' :
                         transaction.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* دکمه مشاهده همه */}
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              مشاهده همه تراکنش‌ها
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
} 