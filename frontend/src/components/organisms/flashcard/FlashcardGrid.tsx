/**
 * FlashcardGrid Organism Component
 * کامپوننت ارگانیزم گرید فلش‌کارت‌ها
 * 
 * @component FlashcardGrid
 * @description نمایش فلش‌کارت‌ها در قالب گرید واکنش‌گرا
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FlashCard } from '@/components/atoms/flashcard/FlashCard';
import { Heart, Share2, ShoppingCart, Eye } from 'lucide-react';

// Mock interface برای فلش‌کارت
interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  price: number;
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;
  isPurchased?: boolean;
}

export interface FlashcardGridProps {
  flashcards?: FlashcardData[];
  isLoading?: boolean;
  searchTerm?: string;
  activeCategory?: string;
  onFlashcardClick?: (flashcard: FlashcardData) => void;
  onLike?: (flashcardId: string) => void;
  onShare?: (flashcard: FlashcardData) => void;
  onPurchase?: (flashcard: FlashcardData) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

/**
 * کامپوننت گرید فلش‌کارت‌ها
 */
export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  flashcards = [],
  isLoading = false,
  searchTerm = '',
  activeCategory = '',
  onFlashcardClick,
  onLike,
  onShare,
  onPurchase
}) => {
  // Mock data اگر فلش‌کارت‌ها خالی باشد
  const mockFlashcards: FlashcardData[] = React.useMemo(() => [
    {
      id: '1',
      question: 'پایتخت ایران کدام شهر است؟',
      answer: 'تهران',
      category: 'جغرافیا',
      difficulty: 'easy',
      price: 200,
      likeCount: 45,
      viewCount: 234,
      isLiked: false,
      isPurchased: false
    },
    {
      id: '2',
      question: 'فرمول محاسبه مساحت دایره چیست؟',
      answer: 'π × r²',
      category: 'ریاضی',
      difficulty: 'medium',
      price: 200,
      likeCount: 67,
      viewCount: 456,
      isLiked: true,
      isPurchased: false
    },
    {
      id: '3',
      question: 'کدام عنصر شیمیایی نماد Au دارد؟',
      answer: 'طلا (Gold)',
      category: 'شیمی',
      difficulty: 'medium',
      price: 200,
      likeCount: 23,
      viewCount: 189,
      isLiked: false,
      isPurchased: true
    },
    {
      id: '4',
      question: 'نویسنده کتاب "گلستان" کیست؟',
      answer: 'سعدی شیرازی',
      category: 'ادبیات',
      difficulty: 'easy',
      price: 200,
      likeCount: 89,
      viewCount: 567,
      isLiked: false,
      isPurchased: false
    },
    {
      id: '5',
      question: 'قانون دوم نیوتن چگونه بیان می‌شود؟',
      answer: 'F = ma (نیرو = جرم × شتاب)',
      category: 'فیزیک',
      difficulty: 'hard',
      price: 200,
      likeCount: 34,
      viewCount: 298,
      isLiked: true,
      isPurchased: false
    },
    {
      id: '6',
      question: 'اولین پادشاه ساسانی کیست؟',
      answer: 'اردشیر بابکان',
      category: 'تاریخ',
      difficulty: 'hard',
      price: 200,
      likeCount: 12,
      viewCount: 145,
      isLiked: false,
      isPurchased: false
    }
  ], []);

  const displayFlashcards = flashcards.length > 0 ? flashcards : mockFlashcards;

  // فیلتر کردن فلش‌کارت‌ها بر اساس جستجو و دسته‌بندی
  const filteredFlashcards = React.useMemo(() => {
    return displayFlashcards.filter(flashcard => {
      const matchesSearch = !searchTerm || 
        flashcard.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !activeCategory || 
        flashcard.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [displayFlashcards, searchTerm, activeCategory]);

  const handleLike = (flashcardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onLike?.(flashcardId);
  };

  const handleShare = (flashcard: FlashcardData, event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(flashcard);
  };

  const handlePurchase = (flashcard: FlashcardData, event: React.MouseEvent) => {
    event.stopPropagation();
    onPurchase?.(flashcard);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-40 w-full"></div>
            <div className="mt-3 space-y-2">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredFlashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          فلش‌کارتی یافت نشد
        </h3>
        <p className="text-gray-500">
          {searchTerm || activeCategory 
            ? 'فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید'
            : 'هنوز فلش‌کارتی ایجاد نشده است'
          }
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredFlashcards.map((flashcard) => (
        <motion.div
          key={flashcard.id}
          variants={itemVariants}
          className="group relative"
        >
          {/* فلش‌کارت اصلی */}
          <div 
            className="relative cursor-pointer"
            onClick={() => onFlashcardClick?.(flashcard)}
          >
            <FlashCard
              question={flashcard.question}
              answer={flashcard.answer}
              category={flashcard.category}
              difficulty={flashcard.difficulty}
              size="md"
              className="transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* نشان خرید */}
            {flashcard.isPurchased && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                خریداری شده
              </div>
            )}
          </div>

          {/* اطلاعات اضافی */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {flashcard.category}
              </span>
              <span className="text-sm text-blue-600 font-semibold">
                {flashcard.price.toLocaleString()} تومان
              </span>
            </div>

            {/* آمار و اکشن‌ها */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {flashcard.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className={`h-3 w-3 ${flashcard.isLiked ? 'text-red-500 fill-current' : ''}`} />
                  {flashcard.likeCount}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleLike(flashcard.id, e)}
                  className={`p-1 rounded-full transition-colors ${
                    flashcard.isLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${flashcard.isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={(e) => handleShare(flashcard, e)}
                  className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                
                {!flashcard.isPurchased && (
                  <button
                    onClick={(e) => handlePurchase(flashcard, e)}
                    className="p-1 rounded-full text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FlashcardGrid; 