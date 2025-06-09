'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  Search,
  RefreshCw,
  Bell
} from 'lucide-react';
import SupportTicket from '@/components/tickets/SupportTicket';
import NotificationBanner from '@/components/tickets/NotificationBanner';
import { contactService } from '@/services/api';

interface TicketFilters {
  status: 'all' | 'pending' | 'replied' | 'closed';
  category: 'all' | 'bug_report' | 'feature_request' | 'general' | 'support';
  search: string;
}

export default function SupportDashboardPage() {
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'all',
    category: 'all',
    search: ''
  });

  const [refreshInterval, setRefreshInterval] = useState(60000); // هر دقیقه

  // دریافت لیست تیکت‌ها با polling
  const { 
    data: ticketsData, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['support-tickets', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.category !== 'all') {
        params.category = filters.category;
      }

      return contactService.getMessages(params);
    },
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30 ثانیه
  });

  // دریافت آمار تیکت‌ها
  const { data: stats } = useQuery({
    queryKey: ['support-stats'],
    queryFn: contactService.getContactStats,
    refetchInterval: 60000, // هر دقیقه
  });

  // فیلتر کردن تیکت‌ها بر اساس جستجو
  const filteredTickets = React.useMemo(() => {
    if (!ticketsData?.messages) return [];
    
    let filtered = ticketsData.messages;
    
    // فیلتر جستجو
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.name.toLowerCase().includes(searchTerm) ||
        ticket.email.toLowerCase().includes(searchTerm) ||
        ticket.message.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [ticketsData, filters.search]);

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTicketUpdate = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">خطا در بارگذاری تیکت‌ها</h2>
            <p className="text-red-600 mb-4">امکان دریافت اطلاعات تیکت‌ها وجود ندارد</p>
            <button
              onClick={() => refetch()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر داشبورد */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Mail className="w-8 h-8 text-blue-600" />
                  داشبورد پشتیبانی
                </h1>
                <p className="text-gray-600 mt-1">مدیریت تیکت‌ها و درخواست‌های پشتیبانی</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* دکمه تازه‌سازی */}
                <button
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                  تازه‌سازی
                </button>
              </div>
            </div>

            {/* آمار کلی */}
            {stats && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm">کل تیکت‌ها</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm">در انتظار پاسخ</p>
                      <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm">پاسخ داده شده</p>
                      <p className="text-2xl font-bold text-green-800">{stats.replied}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">بسته شده</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.closed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* اعلان‌های جدید */}
      <NotificationBanner />

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* فیلتر و جستجو */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* جستجو */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در نام، ایمیل یا پیام..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* فیلتر وضعیت */}
            <div className="min-w-[200px]">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار پاسخ</option>
                <option value="replied">پاسخ داده شده</option>
                <option value="closed">بسته شده</option>
              </select>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="min-w-[200px]">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="support">پشتیبانی</option>
                <option value="bug_report">گزارش باگ</option>
                <option value="feature_request">درخواست قابلیت</option>
                <option value="general">عمومی</option>
              </select>
            </div>
          </div>
        </div>

        {/* لیست تیکت‌ها */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">تیکتی یافت نشد</h3>
              <p className="text-gray-500">
                {filters.search || filters.status !== 'all' || filters.category !== 'all' 
                  ? 'هیچ تیکتی با فیلترهای انتخابی یافت نشد' 
                  : 'هیچ تیکت پشتیبانی‌ای وجود ندارد'}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SupportTicket 
                    ticket={ticket} 
                    onUpdate={handleTicketUpdate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {ticketsData?.pagination && ticketsData.pagination.total > ticketsData.pagination.limit && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <p className="text-sm text-gray-600">
                نمایش {ticketsData.pagination.count} از {ticketsData.pagination.total} تیکت
              </p>
            </div>
          </div>
        )}
      </div>

      {/* تنظیمات خودکار تازه‌سازی */}
      <div className="fixed bottom-4 left-4">
        <div className="bg-white rounded-lg shadow-lg border p-4">
          <div className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">تازه‌سازی خودکار:</span>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1"
            >
              <option value={30000}>30 ثانیه</option>
              <option value={60000}>1 دقیقه</option>
              <option value={120000}>2 دقیقه</option>
              <option value={0}>غیرفعال</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 