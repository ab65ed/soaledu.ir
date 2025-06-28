/**
 * Course Selector Component
 * کامپوننت انتخاب درس با جستجو و tooltip
 */

'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  AlertTriangle,
  BookOpen,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courseService, Course } from '@/services/courseService';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface CourseSelectorProps {
  value?: string;
  onChange: (courseId: string, course: Course | null) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  courseType?: string;
  grade?: string;
  group?: string;
  className?: string;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  value,
  onChange,
  placeholder = "انتخاب درس...",
  disabled = false,
  required = false,
  error,
  courseType,
  grade,
  group,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Query for courses with search and filters
  const {
    data: coursesData,
    isLoading,
    error: queryError
  } = useQuery({
    queryKey: ['courses', debouncedSearch, courseType, grade, group],
    queryFn: () => courseService.getCourses({
      search: debouncedSearch || undefined,
      courseType,
      grade,
      group,
      isActive: true,
      limit: 50
    }),
    enabled: isOpen || !!debouncedSearch,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const courses = coursesData?.courses || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get selected course details
  useEffect(() => {
    if (value && !selectedCourse) {
      const course = courses.find(c => c.id === value);
      if (course) {
        setSelectedCourse(course);
      } else if (value) {
        // Fetch course details if not in current list
        courseService.getCourseById(value)
          .then(setSelectedCourse)
          .catch(() => setSelectedCourse(null));
      }
    }
  }, [value, courses, selectedCourse]);

  const handleSelect = useCallback((course: Course) => {
    setSelectedCourse(course);
    onChange(course.id, course);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  const handleClear = useCallback(() => {
    setSelectedCourse(null);
    onChange('', null);
    setSearchQuery('');
  }, [onChange]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const hasError = !!error || !!queryError;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">
          عنوان درس
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        
        {/* Help Tooltip */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-gray-400 hover:text-blue-600"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 mt-1 z-50 max-w-xs p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg"
              >
                درس مورد نظر را از لیست انتخاب کنید. 
                در صورتی که درس شما در لیست موجود نیست، 
                لطفاً با ادمین تماس بگیرید.
                <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between text-right h-11",
            hasError && "border-red-500 focus:ring-red-500",
            !selectedCourse && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {selectedCourse ? selectedCourse.title : placeholder}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {selectedCourse && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center border-b px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="جستجو در دروس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm outline-none placeholder:text-gray-400 text-right"
                />
              </div>
              
              {/* Course List */}
              <div className="max-h-64 overflow-y-auto">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    <span className="text-sm text-gray-500">
                      در حال بارگذاری...
                    </span>
                  </div>
                )}
                
                {!isLoading && filteredCourses.length === 0 && (
                  <div className="py-6 text-center text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-orange-400" />
                      <div>
                        <p className="font-medium">درسی یافت نشد</p>
                        <p className="text-xs text-gray-500 mt-1">
                          درس مورد نظر شما در سیستم موجود نیست
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          با ادمین تماس بگیرید
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isLoading && filteredCourses.length > 0 && (
                  <div className="p-1">
                    <AnimatePresence>
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelect(course)}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-md"
                        >
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {course.title}
                            </p>
                            {course.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {course.description}
                              </p>
                            )}
                          </div>
                          {value === course.id && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          {error || 'خطا در بارگذاری دروس'}
        </motion.p>
      )}

      {/* Selected Course Info */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">
              درس انتخاب شده:
            </span>
            <span className="text-blue-700">
              {selectedCourse.title}
            </span>
          </div>
          {selectedCourse.description && (
            <p className="text-xs text-blue-600 mt-1 line-clamp-2">
              {selectedCourse.description}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}; 