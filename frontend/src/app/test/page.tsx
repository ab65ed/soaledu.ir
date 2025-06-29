'use client';

import React, { useState } from 'react';
import { CourseSelector } from '@/components/shared/CourseSelector';
import { Course } from '@/services/courseService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function TestPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseChange = (courseId: string, course: Course | null) => {
    console.log('Course changed:', { courseId, course });
    setSelectedCourseId(courseId);
    setSelectedCourse(course);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">تست CourseSelector</h1>
      
      <div className="max-w-md">
        <CourseSelector
          value={selectedCourseId}
          onChange={handleCourseChange}
          placeholder="انتخاب درس..."
          required
        />
      </div>

      {selectedCourse && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold">درس انتخاب شده:</h3>
          <p><strong>ID:</strong> {selectedCourse.id}</p>
          <p><strong>عنوان:</strong> {selectedCourse.title}</p>
          <p><strong>توضیحات:</strong> {selectedCourse.description}</p>
          <p><strong>دسته‌بندی:</strong> {selectedCourse.category}</p>
          <p><strong>نوع:</strong> {selectedCourse.courseType}</p>
          <p><strong>مقطع:</strong> {selectedCourse.grade}</p>
          <p><strong>گروه:</strong> {selectedCourse.group}</p>
        </div>
      )}
    </div>
  );
}

export default function TestPageWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestPage />
    </QueryClientProvider>
  );
} 