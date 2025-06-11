'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon,
  WalletIcon,
  CreditCardIcon,
  
  ArrowRightIcon,
  ArrowLeftIcon,
  StarIcon,
      ArrowPathIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// انواع داده‌ها برای فلش‌کارت
interface FlashcardQuestion {
  id: string;
  questionText: string;
  answer: string;
  explanation?: string;
  subject: string;
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  category: string;
  tags: string[];
  imageUrl?: string;
  isPremium: boolean;
  price: number; // قیمت به تومان
}

interface UserWallet {
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
  flashcardId?: string;
}

interface FlashcardQuestionDisplayProps {
  subjectId: string;
  userId: string;
  initialQuestions?: FlashcardQuestion[];
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockQuestions: FlashcardQuestion[] = [
  {
    id: 'fc-001',
    questionText: 'فرمول مساحت دایره چیست؟',
    answer: 'π × r²',
    explanation: 'در این فرمول، π (پی) عددی ثابت برابر با 3.14159 و r شعاع دایره است.',
    subject: 'ریاضی',
    difficulty: 'آسان',
    category: 'هندسه',
    tags: ['دایره', 'مساحت', 'فرمول'],
    isPremium: false,
    price: 0
  },
  {
    id: 'fc-002',
    questionText: 'قانون اول نیوتن چیست؟',
    answer: 'قانون اینرسی (لختی): جسم در حالت سکون یا حرکت یکنواخت باقی می‌ماند مگر نیرویی خارجی بر آن وارد شود.',
    explanation: 'این قانون بیان می‌کند که اجسام مقاومت در برابر تغییر حالت حرکتی خود دارند.',
    subject: 'فیزیک',
    difficulty: 'متوسط',
    category: 'مکانیک',
    tags: ['نیوتن', 'اینرسی', 'حرکت'],
    isPremium: true,
    price: 200
  },
  {
    id: 'fc-003',
    questionText: 'واکنش تنفس سلولی را بنویسید.',
    answer: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
    explanation: 'در این فرآیند، گلوکز با اکسیژن ترکیب شده و انرژی (ATP)، دی اکسید کربن و آب تولید می‌کند.',
    subject: 'زیست‌شناسی',
    difficulty: 'سخت',
    category: 'متابولیسم',
    tags: ['تنفس سلولی', 'گلوکز', 'ATP'],
    isPremium: true,
    price: 200
  },
  {
    id: 'fc-004',
    questionText: 'عدد اتم چیست؟',
    answer: 'تعداد پروتون‌های موجود در هسته اتم که مشخص‌کننده نوع عنصر است.',
    explanation: 'عدد اتمی در جدول تناوبی نشان داده می‌شود و برای هر عنصر منحصر به فرد است.',
    subject: 'شیمی',
    difficulty: 'آسان',
    category: 'ساختار اتم',
    tags: ['عدد اتمی', 'پروتون', 'هسته'],
    isPremium: false,
    price: 0
  }
];

const mockWallet: UserWallet = {
  balance: 1500,
  transactions: [
    {
      id: 'tx-001',
      type: 'purchase',
      amount: 200,
      description: 'خرید فلش‌کارت فیزیک',
      date: '1403/10/22'
    }
  ]
};

const FlashcardQuestionDisplay: React.FC<FlashcardQuestionDisplayProps> = ({
          // subjectId,
  userId,
  initialQuestions = mockQuestions,
  className = ''
}) => {
  const [questions, setQuestions] = useState<FlashcardQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userWallet, setUserWallet] = useState<UserWallet>(mockWallet);
  const [purchasedQuestions, setPurchasedQuestions] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedQuestionForPurchase, setSelectedQuestionForPurchase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // شبیه‌سازی بارگذاری سوالات خریداری شده
    const purchased = new Set(['fc-002']); // نمونه: کاربر فلش‌کارت فیزیک را خریده
    setPurchasedQuestions(purchased);
  }, [userId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getDifficultyColor = (difficulty: FlashcardQuestion['difficulty']) => {
    switch (difficulty) {
      case 'آسان':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'متوسط':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'سخت':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const canViewQuestion = (question: FlashcardQuestion) => {
    return !question.isPremium || purchasedQuestions.has(question.id);
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsShuffled(true);
  };

  const resetOrder = () => {
    setQuestions(initialQuestions);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsShuffled(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handlePurchaseRequest = (questionId: string) => {
    setSelectedQuestionForPurchase(questionId);
    setShowPaymentModal(true);
  };

  const processPurchase = async () => {
    if (!selectedQuestionForPurchase) return;

    const question = questions.find(q => q.id === selectedQuestionForPurchase);
    if (!question) return;

    if (userWallet.balance < question.price) {
      alert('موجودی کیف پول شما کافی نیست. لطفاً کیف پول خود را شارژ کنید.');
      return;
    }

    setLoading(true);

    try {
      // شبیه‌سازی پردازش پرداخت
      await new Promise(resolve => setTimeout(resolve, 2000));

      // بروزرسانی کیف پول
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'purchase',
        amount: question.price,
        description: `خرید فلش‌کارت ${question.subject}`,
        date: new Date().toLocaleDateString('fa-IR'),
        flashcardId: question.id
      };

      setUserWallet(prev => ({
        balance: prev.balance - question.price,
        transactions: [newTransaction, ...prev.transactions]
      }));

      // اضافه کردن سوال به لیست خریداری شده
      setPurchasedQuestions(prev => new Set([...prev, question.id]));

      setShowPaymentModal(false);
      setSelectedQuestionForPurchase(null);

      alert('خرید با موفقیت انجام شد! اکنون می‌توانید سوال را مشاهده کنید.');
    } catch (error) {
      console.error('خطا در پردازش پرداخت:', error);
      alert('خطا در پردازش پرداخت. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="text-center text-gray-500">
          <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>هیچ فلش‌کارتی برای نمایش وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">فلش‌کارت</h3>
                <p className="text-sm text-gray-600">
                  {currentIndex + 1} از {questions.length} - {currentQuestion.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </div>
              <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-600">
                <WalletIcon className="w-4 h-4" />
                <span>{formatCurrency(userWallet.balance)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* کنترل‌ها */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={isShuffled ? resetOrder : shuffleQuestions}
                className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {isShuffled ? <RefreshIcon className="w-4 h-4" /> : <ShuffleIcon className="w-4 h-4" />}
                <span>{isShuffled ? 'ترتیب اصلی' : 'مخلوط کردن'}</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {questions.length}
              </span>
              <button
                onClick={nextQuestion}
                disabled={currentIndex === questions.length - 1}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* کارت سوال */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 min-h-[300px] border border-blue-200">
                {/* محتوای سوال */}
                {canViewQuestion(currentQuestion) ? (
                  <div className="h-full flex flex-col">
                    {/* برچسب‌های سوال */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {currentQuestion.category}
                        </span>
                        {currentQuestion.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {currentQuestion.isPremium && (
                        <div className="flex items-center space-x-1 space-x-reverse text-xs text-purple-600">
                          <StarIcon className="w-4 h-4" />
                          <span>ویژه</span>
                        </div>
                      )}
                    </div>

                    {/* متن سوال */}
                    <div className="flex-1 flex items-center justify-center text-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          {showAnswer ? 'پاسخ:' : 'سوال:'}
                        </h4>
                        <p className="text-xl text-gray-800 leading-relaxed">
                          {showAnswer ? currentQuestion.answer : currentQuestion.questionText}
                        </p>
                        {showAnswer && currentQuestion.explanation && (
                          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800 leading-relaxed">
                              <strong>توضیح:</strong> {currentQuestion.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* دکمه نمایش پاسخ */}
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {showAnswer ? 'نمایش سوال' : 'نمایش پاسخ'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // نمایش برای سوالات پریمیوم قفل شده
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <LockClosedIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      این فلش‌کارت ویژه است
                    </h4>
                    <p className="text-gray-600 mb-4">
                      برای دسترسی به این سوال، باید آن را خریداری کنید.
                    </p>
                    <div className="flex items-center space-x-2 space-x-reverse mb-4">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-semibold text-green-600">
                        {formatCurrency(currentQuestion.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchaseRequest(currentQuestion.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      خرید فلش‌کارت
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* مودال پرداخت */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تایید خرید</h3>
            
            {selectedQuestionForPurchase && (
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">جزئیات خرید:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">موضوع:</span>
                      <span className="font-medium">
                        {questions.find(q => q.id === selectedQuestionForPurchase)?.subject}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">قیمت:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(questions.find(q => q.id === selectedQuestionForPurchase)?.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <WalletIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">موجودی کیف پول</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">موجودی فعلی:</span>
                    <span className="font-semibold text-blue-900">
                      {formatCurrency(userWallet.balance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-blue-700">موجودی پس از خرید:</span>
                    <span className="font-semibold text-blue-900">
                      {formatCurrency(userWallet.balance - (questions.find(q => q.id === selectedQuestionForPurchase)?.price || 0))}
                    </span>
                  </div>
                </div>

                {userWallet.balance < (questions.find(q => q.id === selectedQuestionForPurchase)?.price || 0) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-700">
                        موجودی کیف پول شما کافی نیست. لطفاً ابتدا کیف پول خود را شارژ کنید.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 space-x-reverse">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedQuestionForPurchase(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                انصراف
              </button>
              <button
                onClick={processPurchase}
                disabled={
                  loading || 
                  !selectedQuestionForPurchase || 
                  userWallet.balance < (questions.find(q => q.id === selectedQuestionForPurchase)?.price || 0)
                }
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-4 h-4" />
                    <span>تایید و پرداخت</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FlashcardQuestionDisplay; 