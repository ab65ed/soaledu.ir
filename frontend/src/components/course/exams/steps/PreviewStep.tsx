'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Check, Calendar, Clock, Users, Shield, Settings } from "lucide-react";

export const PreviewStep: React.FC = () => {
  const examData = {
    title: "آزمون نهایی ریاضی پایه دهم",
    description: "آزمون جامع ریاضی شامل موضوعات هندسه، جبر و آمار",
    duration: "90",
    category: "ریاضی",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    startTime: "09:00",
    endTime: "17:00",
    participants: 25,
    instructors: 2,
    settings: {
      allowRetake: false,
      showResults: true,
      randomizeQuestions: true,
      requirePassword: true,
      maxAttempts: 1
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">پیش‌نمایش و تایید نهایی</h3>
        <p className="text-blue-700">تمام اطلاعات آزمون را بررسی کرده و در صورت صحت، تایید نمایید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Eye className="w-5 h-5" />
              اطلاعات کلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">عنوان آزمون</h4>
              <p className="text-slate-600">{examData.title}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">توضیحات</h4>
              <p className="text-slate-600">{examData.description}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">مدت زمان</h4>
                <p className="text-slate-600">{examData.duration} دقیقه</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">دسته‌بندی</h4>
                <Badge className="bg-blue-100 text-blue-700">{examData.category}</Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              ویرایش اطلاعات کلی
            </Button>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              زمان‌بندی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">تاریخ شروع</h4>
                <p className="text-slate-600">{examData.startDate}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">تاریخ پایان</h4>
                <p className="text-slate-600">{examData.endDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">ساعت شروع</h4>
                <p className="text-slate-600">{examData.startTime}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">ساعت پایان</h4>
                <p className="text-slate-600">{examData.endTime}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              ویرایش زمان‌بندی
            </Button>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="w-5 h-5" />
              شرکت‌کنندگان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{examData.participants}</div>
                <div className="text-sm text-slate-600">فراگیر</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{examData.instructors}</div>
                <div className="text-sm text-slate-600">مدرس</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{examData.participants + examData.instructors}</div>
                <div className="text-sm text-slate-600">کل</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              ویرایش شرکت‌کنندگان
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Settings className="w-5 h-5" />
              تنظیمات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-700">امکان تکرار آزمون</span>
              <Badge variant={examData.settings.allowRetake ? "default" : "secondary"}>
                {examData.settings.allowRetake ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-700">نمایش نتایج</span>
              <Badge variant={examData.settings.showResults ? "default" : "secondary"}>
                {examData.settings.showResults ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-700">ترتیب تصادفی</span>
              <Badge variant={examData.settings.randomizeQuestions ? "default" : "secondary"}>
                {examData.settings.randomizeQuestions ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700">رمز عبور</span>
              <Badge variant={examData.settings.requirePassword ? "destructive" : "secondary"}>
                {examData.settings.requirePassword ? "مورد نیاز" : "غیرفعال"}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              ویرایش تنظیمات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Final Confirmation */}
      <Card className="border border-green-200/50 bg-green-50/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-800">آماده برای ایجاد آزمون</h3>
            <p className="text-green-700">
              تمام اطلاعات آزمون بررسی شده و آماده ثبت نهایی است. 
              با کلیک بر دکمه "ایجاد آزمون"، آزمون شما در سیستم ثبت خواهد شد.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                بازگشت برای ویرایش
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-8"
              >
                <Check className="w-4 h-4" />
                ایجاد آزمون
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 