'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Settings, Eye, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ParticipantsStep } from "./steps/ParticipantsStep";
import { SettingsStep } from "./steps/SettingsStep";
import { PreviewStep } from "./steps/PreviewStep";

const steps = [
  {
    id: 1,
    title: "اطلاعات کلی",
    description: "نام، توضیحات و تنظیمات اولیه",
    icon: BookOpen,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "شرکت‌کنندگان",
    description: "انتخاب فراگیران و مدرسان",
    icon: Users,
    color: "bg-indigo-500"
  },
  {
    id: 3,
    title: "تنظیمات آزمون",
    description: "زمان‌بندی و قوانین آزمون",
    icon: Settings,
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "پیش‌نمایش و تایید",
    description: "بررسی نهایی و انتشار",
    icon: Eye,
    color: "bg-green-500"
  }
];

export const CourseExamWizard = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleAutoSave = () => {
    setIsAutoSaving(true);
    setTimeout(() => setIsAutoSaving(false), 1500);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return <BasicInfoStep onAutoSave={handleAutoSave} />;
      case 2:
        return <ParticipantsStep onAutoSave={handleAutoSave} />;
      case 3:
        return <SettingsStep onAutoSave={handleAutoSave} />;
      case 4:
        return <PreviewStep />;
      default:
        return <BasicInfoStep onAutoSave={handleAutoSave} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isActive 
                    ? 'border-blue-500 shadow-blue-200/50 shadow-lg' 
                    : isCompleted 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-3 ${
                    isActive ? 'scale-110' : ''
                  } transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  {isCompleted && (
                    <Badge className="mt-2 bg-green-100 text-green-700">تکمیل شده</Badge>
                  )}
                  {isActive && (
                    <Badge className="mt-2 bg-blue-100 text-blue-700">در حال انجام</Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Auto-save Indicator */}
      <AnimatePresence>
        {isAutoSaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-6 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg z-50"
          >
            <Save className="w-4 h-4" />
            در حال ذخیره خودکار...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <Card className="glass border border-blue-200/50">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <div className={`w-8 h-8 rounded-full ${steps[activeStep - 1]?.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{activeStep}</span>
            </div>
            {steps[activeStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={activeStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          مرحله قبل
        </Button>

        <div className="flex items-center gap-2">
          {activeStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              مرحله بعد
              <ChevronLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => console.log('Creating exam...')}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              ایجاد آزمون
              <Save className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 