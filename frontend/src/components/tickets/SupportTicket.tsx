'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Phone,
  Clock,
  CheckCircle,
  X,
  Send,
  AlertCircle,
  Globe
} from 'lucide-react';
import { z } from 'zod';
import { ContactMessage, contactService } from '@/services/api';

interface SupportTicketProps {
  ticket: ContactMessage;
  onUpdate?: () => void;
}

// اعتبارسنجی پاسخ تیکت با Zod
const responseSchema = z.object({
  response: z.string()
    .min(10, 'پاسخ باید حداقل ۱۰ کاراکتر باشد')
    .max(2000, 'پاسخ نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'),
  status: z.enum(['replied', 'closed'], {
    errorMap: () => ({ message: 'وضعیت انتخابی معتبر نیست' })
  })
});

type ResponseFormData = z.infer<typeof responseSchema>;

const SupportTicket: React.FC<SupportTicketProps> = ({ ticket, onUpdate }) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [formData, setFormData] = useState<ResponseFormData>({
    response: '',
    status: 'replied'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // تبدیل دسته‌بندی به فارسی
  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'bug_report': return 'گزارش باگ';
      case 'feature_request': return 'درخواست قابلیت';
      case 'support': return 'پشتیبانی';
      case 'general': return 'عمومی';
      default: return 'نامشخص';
    }
  };

  // تبدیل وضعیت به فارسی
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending': return 'در انتظار پاسخ';
      case 'replied': return 'پاسخ داده شده';
      case 'closed': return 'بسته شده';
      default: return 'نامشخص';
    }
  };

  // رنگ‌بندی وضعیت
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // رنگ‌بندی دسته‌بندی
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'bug_report': return 'bg-red-100 text-red-800 border-red-200';
      case 'feature_request': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'support': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'general': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ارسال پاسخ تیکت
  const respondMutation = useMutation({
    mutationFn: async (data: ResponseFormData) => {
      if (!ticket.id) throw new Error('شناسه تیکت موجود نیست');
      
      // ارسال پاسخ تیکت با API مخصوص
      return contactService.respondToTicket(ticket.id, data.response, data.status);
    },
    onSuccess: () => {
      setShowResponseModal(false);
      setFormData({ response: '', status: 'replied' });
      setFormErrors({});
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-stats'] });
      onUpdate?.();
    },
    onError: (error) => {
      console.error('خطا در ارسال پاسخ:', error);
      setFormErrors({ submit: 'خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید.' });
    }
  });

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const validData = responseSchema.parse(formData);
      respondMutation.mutate(validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  const handleInputChange = (field: keyof ResponseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          {/* هدر تیکت */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{ticket.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${ticket.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {ticket.email}
                  </a>
                </div>
                {ticket.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <a 
                      href={`tel:${ticket.phone}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {ticket.phone}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {ticket.createdAt 
                      ? new Date(ticket.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'تاریخ نامشخص'
                    }
                  </span>
                </div>
                
                {ticket.userAgent && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{ticket.userAgent}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* دسته‌بندی */}
              {ticket.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(ticket.category)}`}>
                  <Tag className="w-3 h-3 inline ml-1" />
                  {getCategoryLabel(ticket.category)}
                </span>
              )}
              
              {/* وضعیت */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status === 'pending' && <Clock className="w-3 h-3 inline ml-1" />}
                {ticket.status === 'replied' && <CheckCircle className="w-3 h-3 inline ml-1" />}
                {ticket.status === 'closed' && <CheckCircle className="w-3 h-3 inline ml-1" />}
                {getStatusLabel(ticket.status)}
              </span>
            </div>
          </div>

          {/* متن پیام */}
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>
          </div>

          {/* دکمه‌های عمل */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {ticket.ipAddress && (
                <span>IP: {ticket.ipAddress}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              {ticket.status === 'pending' && (
                <button
                  onClick={() => setShowResponseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  پاسخ دادن
                </button>
              )}
              
              {ticket.status === 'replied' && (
                <button
                  onClick={() => setShowResponseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  بستن تیکت
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* مودال پاسخ */}
      <AnimatePresence>
        {showResponseModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowResponseModal(false);
              }
            }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                {/* هدر مودال */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    پاسخ به تیکت {ticket.name}
                  </h3>
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* نمایش پیام اصلی */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">پیام اصلی:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {ticket.message}
                    </p>
                  </div>
                </div>

                {/* فرم پاسخ */}
                <form onSubmit={handleResponseSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      پاسخ شما:
                    </label>
                    <textarea
                      value={formData.response}
                      onChange={(e) => handleInputChange('response', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        formErrors.response ? 'border-red-300' : 'border-gray-300'
                      }`}
                      rows={8}
                      placeholder="پاسخ خود را اینجا بنویسید..."
                      disabled={respondMutation.isPending}
                    />
                    {formErrors.response && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.response}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وضعیت جدید:
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.status ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={respondMutation.isPending}
                    >
                      <option value="replied">پاسخ داده شده</option>
                      <option value="closed">بسته شده</option>
                    </select>
                    {formErrors.status && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.status}
                      </p>
                    )}
                  </div>

                  {formErrors.submit && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {formErrors.submit}
                      </p>
                    </div>
                  )}

                  {/* دکمه‌های عمل */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowResponseModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={respondMutation.isPending}
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      disabled={respondMutation.isPending}
                    >
                      {respondMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          ارسال پاسخ
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportTicket; 