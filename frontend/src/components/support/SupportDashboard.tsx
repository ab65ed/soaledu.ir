'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  ArrowRightIcon,
  BellIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  BellIcon as BellIconSolid
} from '@heroicons/react/24/solid';

// انواع داده‌ها برای پیام‌های پشتیبانی
interface SupportMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nationalId?: string;
  subject: string;
  message: string;
  category: 'general' | 'support' | 'bug_report' | 'feature_request' | 'partnership' | 'complaint';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  isStudent: boolean;
  submittedAt: string;
  lastUpdatedAt: string;
  assignedTo?: string;
  tags: string[];
  responseCount: number;
  responses: SupportResponse[];
}

interface SupportResponse {
  id: string;
  messageId: string;
  responderId: string;
  responderName: string;
  responderRole: 'admin' | 'support' | 'expert';
  content: string;
  isInternal: boolean; // پیام داخلی یا برای کاربر
  sentAt: string;
}

interface SupportDashboardProps {
  userRole: 'admin' | 'support';
  userId: string;
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockMessages: SupportMessage[] = [
  {
    id: 'msg-001',
    name: 'علی احمدی',
    email: 'ali.ahmadi@email.com',
    phone: '09123456789',
    subject: 'مشکل در بارگذاری ویدئو',
    message: 'سلام. من در حین تماشای ویدئوهای آموزشی با مشکل بارگذاری مواجه می‌شوم. ویدئو متوقف می‌شود و دوباره از ابتدا شروع می‌کند. لطفاً راهنمایی کنید.',
    category: 'support',
    priority: 'medium',
    status: 'new',
    isStudent: true,
    submittedAt: '1403/10/22 14:30',
    lastUpdatedAt: '1403/10/22 14:30',
    tags: ['ویدئو', 'بارگذاری', 'مشکل فنی'],
    responseCount: 0,
    responses: []
  },
  {
    id: 'msg-002',
    name: 'فاطمه رضایی',
    email: 'fateme.rezaei@email.com',
    subject: 'درخواست همکاری',
    message: 'با سلام. من استاد ریاضی هستم و علاقه‌مند به همکاری با پلتفرم شما هستم. آیا امکان ایجاد دوره‌های آموزشی وجود دارد؟',
    category: 'partnership',
    priority: 'high',
    status: 'in_progress',
    isStudent: false,
    submittedAt: '1403/10/21 16:15',
    lastUpdatedAt: '1403/10/22 09:20',
    assignedTo: 'support-001',
    tags: ['همکاری', 'استاد', 'دوره'],
    responseCount: 2,
    responses: [
      {
        id: 'resp-001',
        messageId: 'msg-002',
        responderId: 'support-001',
        responderName: 'مریم کریمی',
        responderRole: 'support',
        content: 'سلام و وقت بخیر. درخواست شما به تیم همکاری‌ها ارجاع داده شد.',
        isInternal: false,
        sentAt: '1403/10/21 18:30'
      }
    ]
  },
  {
    id: 'msg-003',
    name: 'رضا مرادی',
    email: 'reza.moradi@email.com',
    nationalId: '1234567890',
    subject: 'گزارش باگ در آزمون',
    message: 'هنگام پاسخ دادن به سوال شماره 15 در آزمون ریاضی، صفحه قفل شد و نتوانستم ادامه دهم. این مشکل چندین بار تکرار شده.',
    category: 'bug_report',
    priority: 'urgent',
    status: 'resolved',
    isStudent: true,
    submittedAt: '1403/10/20 11:45',
    lastUpdatedAt: '1403/10/21 14:20',
    assignedTo: 'admin-001',
    tags: ['باگ', 'آزمون', 'قفل شدن'],
    responseCount: 3,
    responses: [
      {
        id: 'resp-002',
        messageId: 'msg-003',
        responderId: 'admin-001',
        responderName: 'احمد محمدی',
        responderRole: 'admin',
        content: 'مشکل شناسایی و برطرف شد. لطفاً دوباره آزمون دهید.',
        isInternal: false,
        sentAt: '1403/10/21 14:20'
      }
    ]
  }
];

const SupportDashboard: React.FC<SupportDashboardProps> = ({
  userRole,
  userId,
  className = ''
}) => {
  const [messages, setMessages] = useState<SupportMessage[]>(mockMessages);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // شبیه‌سازی بارگذاری پیام‌ها
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // فیلتر کردن پیام‌ها
  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // مرتب‌سازی پیام‌ها
  const sortedMessages = filteredMessages.sort((a, b) => {
    // ابتدا بر اساس اولویت
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // سپس بر اساس وضعیت (جدید اول)
    const statusOrder = { new: 4, in_progress: 3, resolved: 2, closed: 1 };
    const statusDiff = statusOrder[b.status] - statusOrder[a.status];
    if (statusDiff !== 0) return statusDiff;
    
    // در نهایت بر اساس تاریخ
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const getStatusColor = (status: SupportMessage['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: SupportMessage['status']) => {
    switch (status) {
      case 'new': return 'جدید';
      case 'in_progress': return 'در حال بررسی';
      case 'resolved': return 'حل شده';
      case 'closed': return 'بسته شده';
      default: return status;
    }
  };

  const getPriorityColor = (priority: SupportMessage['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-orange-600';
      case 'high':
        return 'text-red-600';
      case 'urgent':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: SupportMessage['priority']) => {
    switch (priority) {
      case 'low': return 'کم';
      case 'medium': return 'متوسط';
      case 'high': return 'زیاد';
      case 'urgent': return 'فوری';
      default: return priority;
    }
  };

  const getCategoryText = (category: SupportMessage['category']) => {
    switch (category) {
      case 'general': return 'عمومی';
      case 'support': return 'پشتیبانی';
      case 'bug_report': return 'گزارش باگ';
      case 'feature_request': return 'درخواست قابلیت';
      case 'partnership': return 'همکاری';
      case 'complaint': return 'شکایت';
      default: return category;
    }
  };

  const getCategoryIcon = (category: SupportMessage['category']) => {
    switch (category) {
      case 'general':
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
      case 'support':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'bug_report':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'feature_request':
        return <TagIcon className="w-4 h-4" />;
      case 'partnership':
        return <UserIcon className="w-4 h-4" />;
      case 'complaint':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
    }
  };

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChatBubbleLeftRightIconSolid className="w-6 h-6 text-blue-600" />
              </div>
              {newMessagesCount > 0 && (
                <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {newMessagesCount}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                داشبورد پشتیبانی
              </h3>
              <p className="text-sm text-gray-600">
                مدیریت پیام‌ها و درخواست‌های کاربران
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-600">
              <BellIconSolid className="w-4 h-4 text-orange-500" />
              <span>{newMessagesCount} پیام جدید</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* ساید بار فیلترها */}
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            className="border-l border-gray-200 p-4 bg-gray-50 overflow-y-auto"
          >
            <h4 className="font-medium text-gray-900 mb-4">فیلتر و جستجو</h4>
            
            {/* جستجو */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جستجو
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="جستجو در پیام‌ها..."
                />
              </div>
            </div>

            {/* فیلتر وضعیت */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وضعیت
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="new">جدید</option>
                <option value="in_progress">در حال بررسی</option>
                <option value="resolved">حل شده</option>
                <option value="closed">بسته شده</option>
              </select>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="general">عمومی</option>
                <option value="support">پشتیبانی</option>
                <option value="bug_report">گزارش باگ</option>
                <option value="feature_request">درخواست قابلیت</option>
                <option value="partnership">همکاری</option>
                <option value="complaint">شکایت</option>
              </select>
            </div>

            {/* فیلتر اولویت */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اولویت
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">همه اولویت‌ها</option>
                <option value="urgent">فوری</option>
                <option value="high">زیاد</option>
                <option value="medium">متوسط</option>
                <option value="low">کم</option>
              </select>
            </div>

            {/* آمار */}
            <div className="mt-6 p-3 bg-white rounded-lg border">
              <h5 className="text-sm font-medium text-gray-900 mb-2">آمار کلی</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">کل پیام‌ها:</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">جدید:</span>
                  <span className="font-medium text-blue-600">{messages.filter(m => m.status === 'new').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">در حال بررسی:</span>
                  <span className="font-medium text-orange-600">{messages.filter(m => m.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حل شده:</span>
                  <span className="font-medium text-green-600">{messages.filter(m => m.status === 'resolved').length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* لیست پیام‌ها */}
        <div className="flex-1 flex">
          <div className="w-1/2 border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-600">
                {sortedMessages.length} پیام یافت شد
              </div>
              
              <div className="space-y-2">
                {sortedMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="p-1 bg-gray-100 rounded">
                          {getCategoryIcon(message.category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {message.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {message.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(message.status)}`}>
                          {getStatusText(message.status)}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {getPriorityText(message.priority)}
                        </span>
                      </div>
                    </div>
                    
                    <h5 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {message.subject}
                    </h5>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{message.submittedAt}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <ChatBubbleLeftRightIcon className="w-3 h-3" />
                        <span>{message.responseCount} پاسخ</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* جزئیات پیام */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* هدر پیام */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(selectedMessage.status)}`}>
                        {getStatusText(selectedMessage.status)}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {getPriorityText(selectedMessage.priority)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">نام:</span>
                      <span className="mr-2 font-medium">{selectedMessage.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ایمیل:</span>
                      <span className="mr-2 font-medium">{selectedMessage.email}</span>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <span className="text-gray-600">تلفن:</span>
                        <span className="mr-2 font-medium">{selectedMessage.phone}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">دسته‌بندی:</span>
                      <span className="mr-2 font-medium">{getCategoryText(selectedMessage.category)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">تاریخ ارسال:</span>
                      <span className="mr-2 font-medium">{selectedMessage.submittedAt}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">نوع کاربر:</span>
                      <span className="mr-2 font-medium">
                        {selectedMessage.isStudent ? 'دانش‌آموز' : 'سایر'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* متن پیام */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">متن پیام:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* برچسب‌ها */}
                {selectedMessage.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">برچسب‌ها:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* پاسخ‌ها */}
                {selectedMessage.responses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">پاسخ‌ها:</h4>
                    <div className="space-y-3">
                      {selectedMessage.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-3 rounded-lg ${
                            response.isInternal
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-green-50 border border-green-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="font-medium text-sm">
                                {response.responderName}
                              </span>
                              <span className="text-xs text-gray-600">
                                ({response.responderRole === 'admin' ? 'ادمین' : 
                                  response.responderRole === 'support' ? 'پشتیبانی' : 'کارشناس'})
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {response.sentAt}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {response.content}
                          </p>
                          {response.isInternal && (
                            <div className="mt-2 text-xs text-yellow-700">
                              • پیام داخلی (نمایش داده نمی‌شود)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* دکمه‌های عملیات */}
                <div className="flex items-center space-x-2 space-x-reverse pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-1 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowRightIcon className="w-4 h-4" />
                    <span>پاسخ دادن</span>
                  </button>
                  <button className="flex items-center space-x-1 space-x-reverse px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <TagIcon className="w-4 h-4" />
                    <span>تغییر وضعیت</span>
                  </button>
                  <button className="flex items-center space-x-1 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    <span>ثبت یادداشت</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <EyeIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>پیامی را انتخاب کنید تا جزئیات نمایش داده شود</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportDashboard; 