'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Building, FolderOpen, HelpCircle } from "lucide-react";
import { CourseSelector } from "@/components/shared/CourseSelector";
import { Course } from "@/services/courseService";
import { getCourseTypes, getGrades, getFieldsOfStudy, getCourseCategories } from "@/services/metadataService";
import type { CourseType, Grade, FieldOfStudy } from "@/types/metadata";
import { motion } from "framer-motion";

interface BasicInfoStepProps {
  onAutoSave: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onAutoSave }) => {
  const [formData, setFormData] = useState({
    courseType: '',
    grade: '',
    fieldOfStudy: '',
    category: '',
    courseId: ''
  });

  const [errors, setErrors] = useState({
    courseType: '',
    grade: '',
    fieldOfStudy: '',
    category: '',
    courseId: ''
  });

  // State for dropdown options
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState<FieldOfStudy[]>([]);
  const [courseCategories] = useState(getCourseCategories());

  // Loading states
  const [loading, setLoading] = useState({
    courseTypes: false,
    grades: false,
    fieldsOfStudy: false
  });

  // Load course types on component mount
  useEffect(() => {
    loadCourseTypes();
  }, []);

  const loadCourseTypes = async () => {
    try {
      setLoading(prev => ({ ...prev, courseTypes: true }));
      const types = await getCourseTypes();
      setCourseTypes(types);
    } catch (error) {
      console.error('Error loading course types:', error);
    } finally {
      setLoading(prev => ({ ...prev, courseTypes: false }));
    }
  };

  const loadGrades = async (courseType: string) => {
    if (!courseType) {
      setGrades([]);
      return;
    }
    try {
      setLoading(prev => ({ ...prev, grades: true }));
      const gradesData = await getGrades(courseType);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading grades:', error);
      setGrades([]);
    } finally {
      setLoading(prev => ({ ...prev, grades: false }));
    }
  };

  const loadFieldsOfStudy = async (courseType: string) => {
    if (!courseType) {
      setFieldsOfStudy([]);
      return;
    }
    try {
      setLoading(prev => ({ ...prev, fieldsOfStudy: true }));
      const fields = await getFieldsOfStudy(courseType);
      setFieldsOfStudy(fields);
    } catch (error) {
      console.error('Error loading fields of study:', error);
      setFieldsOfStudy([]);
    } finally {
      setLoading(prev => ({ ...prev, fieldsOfStudy: false }));
    }
  };

  const handleCourseTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      courseType: value,
      grade: '',
      fieldOfStudy: '',
      category: '',
      courseId: ''
    }));
    setErrors(prev => ({ ...prev, courseType: '' }));
    
    loadGrades(value);
    loadFieldsOfStudy(value);
    
    onAutoSave();
  };

  const handleGradeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      grade: value,
      category: '',
      courseId: ''
    }));
    setErrors(prev => ({ ...prev, grade: '' }));
    onAutoSave();
  };

  const handleFieldOfStudyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      fieldOfStudy: value,
      courseId: ''
    }));
    setErrors(prev => ({ ...prev, fieldOfStudy: '' }));
    onAutoSave();
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      courseId: ''
    }));
    setErrors(prev => ({ ...prev, category: '' }));
    onAutoSave();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCourseChange = (courseId: string, _course: Course | null) => {
    setFormData(prev => ({ ...prev, courseId }));
    setErrors(prev => ({ ...prev, courseId: '' }));
    onAutoSave();
  };

  const isFieldEnabled = (field: string): boolean => {
    switch (field) {
      case 'courseType':
        return true;
      case 'grade':
      case 'fieldOfStudy':
        return !!formData.courseType;
      case 'category':
        return !!formData.fieldOfStudy;
      case 'courseId':
        return !!formData.category;
      default:
        return false;
    }
  };

  const getTooltipText = (field: string): string => {
    switch (field) {
      case 'grade':
        return 'ابتدا نوع درس را انتخاب کنید';
      case 'fieldOfStudy':
        return 'ابتدا نوع درس را انتخاب کنید';
      case 'category':
        return 'ابتدا رشته تحصیلی را انتخاب کنید';
      case 'courseId':
        return 'ابتدا دسته‌بندی را انتخاب کنید';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">اطلاعات کلی درس-آزمون</h3>
        <p className="text-blue-700">لطفاً مشخصات اولیه درس-آزمون خود را وارد کنید</p>
      </div>

      <div className="space-y-6">
        {/* Course Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BookOpen className="w-5 h-5" />
                نوع درس
                <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.courseType}
                onChange={(e) => handleCourseTypeChange(e.target.value)}
                disabled={loading.courseTypes}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-right bg-white disabled:bg-gray-100"
              >
                <option value="">انتخاب کنید...</option>
                {courseTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.courseType && (
                <p className="text-sm text-red-600 mt-2">{errors.courseType}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <GraduationCap className="w-5 h-5" />
                مقطع تحصیلی
                <span className="text-red-500">*</span>
                {!isFieldEnabled('grade') && (
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltipText('grade')}
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={loading.grades || !isFieldEnabled('grade')}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-right bg-white disabled:bg-gray-100"
              >
                <option value="">انتخاب کنید...</option>
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <p className="text-sm text-red-600 mt-2">{errors.grade}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Field of Study Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Building className="w-5 h-5" />
                رشته تحصیلی
                <span className="text-red-500">*</span>
                {!isFieldEnabled('fieldOfStudy') && (
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltipText('fieldOfStudy')}
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.fieldOfStudy}
                onChange={(e) => handleFieldOfStudyChange(e.target.value)}
                disabled={loading.fieldsOfStudy || !isFieldEnabled('fieldOfStudy')}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-right bg-white disabled:bg-gray-100"
              >
                <option value="">انتخاب کنید...</option>
                {fieldsOfStudy.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
              {errors.fieldOfStudy && (
                <p className="text-sm text-red-600 mt-2">{errors.fieldOfStudy}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FolderOpen className="w-5 h-5" />
                دسته‌بندی
                <span className="text-red-500">*</span>
                {!isFieldEnabled('category') && (
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltipText('category')}
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={!isFieldEnabled('category')}
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-right bg-white disabled:bg-gray-100"
              >
                <option value="">انتخاب کنید...</option>
                {courseCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-2">{errors.category}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border border-blue-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BookOpen className="w-5 h-5" />
                انتخاب درس
                <span className="text-red-500">*</span>
                {!isFieldEnabled('courseId') && (
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {getTooltipText('courseId')}
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CourseSelector
                value={formData.courseId}
                onChange={handleCourseChange}
                placeholder="درس مورد نظر را انتخاب یا جستجو کنید..."
                required
                disabled={!isFieldEnabled('courseId')}
                error={errors.courseId}
                courseType={formData.courseType}
                grade={formData.grade}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}; 