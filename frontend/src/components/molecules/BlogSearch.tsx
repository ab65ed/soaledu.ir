'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
  debounceMs?: number;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  placeholder = "جستجو در مقالات...",
  initialValue = "",
  isLoading = false,
  recentSearches = [],
  onClearRecentSearches,
  debounceMs = 300
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle clear search
  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (recentSearches.length > 0 && !query) {
      setShowSuggestions(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex items-center",
            "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
            "rounded-lg overflow-hidden",
            isFocused && "border-blue-500 dark:border-blue-400"
          )}
        >
          {/* Search Icon */}
          <div className="absolute right-3 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className={cn(
              "w-full py-3 pr-12 pl-4 text-sm",
              "bg-transparent text-gray-900 dark:text-white",
              "placeholder-gray-500 dark:placeholder-gray-400",
              "focus:outline-none",
              "text-right" // RTL support
            )}
            dir="rtl"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute left-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                "rounded-lg shadow-lg overflow-hidden"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    جستجوهای اخیر
                  </span>
                </div>
                
                {onClearRecentSearches && (
                  <button
                    onClick={onClearRecentSearches}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    پاک کردن همه
                  </button>
                )}
              </div>

              {/* Recent Searches */}
              <div className="max-h-48 overflow-y-auto">
                {recentSearches.map((searchTerm, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleRecentSearchClick(searchTerm)}
                    className={cn(
                      "w-full px-4 py-3 text-right",
                      "text-sm text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-50 dark:hover:bg-gray-700",
                      "transition-colors duration-150",
                      "border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 truncate">{searchTerm}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Status */}
      <AnimatePresence>
        {query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-xs text-gray-500 dark:text-gray-400"
          >
            {isLoading ? (
              <span>در حال جستجو...</span>
            ) : (
                             <span>جستجو برای: &ldquo;{query}&rdquo;</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearch; 