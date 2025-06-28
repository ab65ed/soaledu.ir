'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { CourseSelector } from "@/components/shared/CourseSelector";
import { Course } from "@/services/courseService";

interface BasicInfoStepProps {
  onAutoSave: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onAutoSave }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    duration: '',
    category: ''
  });

  const [errors, setErrors] = useState({
    courseId: '',
    duration: '',
    category: ''
  });

  const handleCourseChange = (courseId: string, course: Course | null) => {
    setFormData(prev => ({
      ...prev,
      courseId,
      category: course?.courseType || prev.category
    }));
    
    setErrors(prev => ({ ...prev, courseId: '' }));
    onAutoSave();
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, duration: value }));
    setErrors(prev => ({ ...prev, duration: '' }));
    onAutoSave();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, category: value }));
    setErrors(prev => ({ ...prev, category: '' }));
    onAutoSave();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">اطلاعات کلی درس-آزمون</h3>
        <p className="text-blue-700">لطفاً مشخصات اولیه درس-آزمون خود را وارد کنید</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Selection */}
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BookOpen className="w-5 h-5" />
                انتخاب درس
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CourseSelector
                value={formData.courseId}
                onChange={handleCourseChange}
                placeholder="درس مورد نظر را انتخاب کنید..."
                required
                error={errors.courseId}
              />
            </CardContent>
          </Card>

          {/* Duration Field */}
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Clock className="w-5 h-5" />
                مدت زمان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  مدت زمان (دقیقه)
                </label>
                <Input
                  placeholder="۹۰"
                  type="number"
                  value={formData.duration}
                  onChange={handleDurationChange}
                  className="border-slate-300 focus:border-blue-500 text-right"
                />
                {errors.duration && (
                  <p className="text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Field */}
        <Card className="border border-blue-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              دسته‌بندی درس-آزمون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                انتخاب دسته
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-right bg-white"
              >
                <option value="">انتخاب کنید...</option>
                <option value="mathematics">ریاضی</option>
                <option value="physics">فیزیک</option>
                <option value="chemistry">شیمی</option>
                <option value="biology">زیست‌شناسی</option>
                <option value="literature">ادبیات</option>
                <option value="history">تاریخ</option>
                <option value="geography">جغرافیا</option>
                <option value="english">انگلیسی</option>
                <option value="arabic">عربی</option>
                <option value="other">سایر</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 