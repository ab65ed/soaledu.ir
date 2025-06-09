/**
 * Card Component - کامپوننت کارت
 * کارت برای نمایش محتوا با انیمیشن و RTL
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingVariants = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md',
  onClick,
}) => {
  const MotionComponent = onClick ? motion.button : motion.div;

  return (
    <MotionComponent
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        'transition-all duration-200',
        hover && 'hover:shadow-md hover:border-gray-300',
        onClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500',
        paddingVariants[padding],
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </MotionComponent>
  );
};

export default Card; 