/**
 * FlashCard Atom Component
 * کامپوننت اتم فلش‌کارت
 * 
 * @component FlashCard
 * @description کامپوننت پایه فلش‌کارت با انیمیشن چرخش سه‌بعدی
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface FlashCardProps {
  question: string;
  answer: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'study';
}

const sizeClasses = {
  sm: 'w-48 h-32',
  md: 'w-64 h-40',
  lg: 'w-80 h-48'
};

const difficultyColors = {
  easy: 'from-green-100 to-green-200 border-green-300',
  medium: 'from-yellow-100 to-yellow-200 border-yellow-300',
  hard: 'from-red-100 to-red-200 border-red-300'
};

/**
 * کامپوننت فلش‌کارت با انیمیشن چرخش
 */
export const FlashCard: React.FC<FlashCardProps> = ({
  question,
  answer,
  category,
  difficulty = 'medium',
  isFlipped = false,
  onFlip,
  className,
  size = 'md'
}) => {
  const [isLocalFlipped, setIsLocalFlipped] = React.useState(isFlipped);

  React.useEffect(() => {
    setIsLocalFlipped(isFlipped);
  }, [isFlipped]);

  const handleFlip = () => {
    const newFlipped = !isLocalFlipped;
    setIsLocalFlipped(newFlipped);
    onFlip?.();
  };

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <div 
      className={cn(
        'relative cursor-pointer perspective-1000',
        sizeClasses[size],
        className
      )}
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      {/* کارت جلو - سوال */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl border-2 p-4 shadow-lg bg-gradient-to-br',
          difficultyColors[difficulty],
          'backface-hidden',
          isLocalFlipped && 'pointer-events-none'
        )}
        variants={cardVariants}
        animate={isLocalFlipped ? "back" : "front"}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {category && (
              <span className="text-xs bg-white/70 text-gray-700 px-2 py-1 rounded-full font-medium">
                {category}
              </span>
            )}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    i < (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3)
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-800 text-center font-medium leading-relaxed">
              {question}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              کلیک کنید تا پاسخ را ببینید
            </p>
          </div>
        </div>
      </motion.div>

      {/* کارت پشت - پاسخ */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl border-2 p-4 shadow-lg bg-gradient-to-br',
          'from-blue-100 to-blue-200 border-blue-300',
          'backface-hidden',
          !isLocalFlipped && 'pointer-events-none'
        )}
        variants={cardVariants}
        animate={isLocalFlipped ? "front" : "back"}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs bg-white/70 text-blue-700 px-2 py-1 rounded-full font-medium">
              پاسخ
            </span>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-blue-900 text-center font-medium leading-relaxed">
              {answer}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-blue-700">
              کلیک کنید تا سوال را ببینید
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashCard; 