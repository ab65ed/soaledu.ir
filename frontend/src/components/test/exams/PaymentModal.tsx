'use client';

import React, { useState } from 'react';
import { X, CreditCard, Wallet } from 'lucide-react';

interface TestExam {
  id: string;
  title: string;
  questionsCount: number;
  timeLimit: number;
  difficulty: string;
}

interface PaymentModalProps {
  exam: TestExam;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ exam, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // شبیه‌سازی پردازش پرداخت
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
    } catch {
      setError('خطا در پردازش پرداخت');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateDifficultyDistribution = (totalQuestions: number) => {
    const easy = Math.floor(totalQuestions * 0.2);
    const medium = Math.floor(totalQuestions * 0.3);
    const hard = totalQuestions - easy - medium;
    return { easy, medium, hard };
  };

  const difficultyDistribution = calculateDifficultyDistribution(exam.questionsCount);
  const basePrice = 880;
  const finalPrice = Math.round((basePrice / 100) * exam.questionsCount);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              خرید آزمون تستی
            </h2>
            <p className="text-gray-600 mt-1">
              تکمیل فرآیند پرداخت برای شروع آزمون
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="بستن"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* اطلاعات آزمون */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {exam.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{exam.timeLimit} دقیقه</span>
              <span>{exam.questionsCount} سوال</span>
              <span>{exam.difficulty}</span>
            </div>

            {/* توزیع سختی سوالات */}
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-3">توزیع سختی سوالات:</div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>آسان: {difficultyDistribution.easy} سوال</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>متوسط: {difficultyDistribution.medium} سوال</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>سخت: {difficultyDistribution.hard} سوال</span>
                </div>
              </div>
            </div>
          </div>

          {/* قیمت‌گذاری */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              جزئیات قیمت
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">قیمت:</span>
                <span className="font-medium text-lg">
                  {finalPrice.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                {Math.round(finalPrice / exam.questionsCount).toLocaleString('fa-IR')} تومان/سوال
              </div>
            </div>
          </div>

          {/* روش پرداخت */}
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              روش پرداخت
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">کارت بانکی</div>
                <div className="text-xs text-gray-600">پرداخت آنلاین</div>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">کیف پول</div>
                <div className="text-xs text-gray-600">پرداخت سریع</div>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'در حال پردازش...' : `پرداخت ${finalPrice.toLocaleString('fa-IR')} تومان`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 