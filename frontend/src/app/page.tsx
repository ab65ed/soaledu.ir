/**
 * Home Page - صفحه خانه
 * صفحه اصلی سامانه آزمون‌های آنلاین با کامپوننت‌های اصلی
 */

'use client';

import React from 'react';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturedCourses from '@/components/organisms/FeaturedCourses';
import Testimonials from '@/components/molecules/Testimonials';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* بخش اصلی با CTA */}
      <HeroSection />
      
      {/* درس-آزمون‌های محبوب */}
      <FeaturedCourses />
      
      {/* نظرات کاربران */}
      <Testimonials />
    </main>
  );
}
