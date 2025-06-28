'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Calendar, Clock, Shield, Eye } from "lucide-react";

const settingsSchema = z.object({
  startDate: z.string().min(1, 'تاریخ شروع الزامی است'),
  endDate: z.string().min(1, 'تاریخ پایان الزامی است'),
  startTime: z.string().min(1, 'زمان شروع الزامی است'),
  endTime: z.string().min(1, 'زمان پایان الزامی است'),
  allowRetake: z.boolean(),
  showResults: z.boolean(),
  randomizeQuestions: z.boolean(),
  requirePassword: z.boolean(),
  examPassword: z.string().optional(),
  maxAttempts: z.string().min(1, 'تعداد تلاش حداکثر الزامی است')
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsStepProps {
  onAutoSave: () => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({ onAutoSave }) => {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      allowRetake: false,
      showResults: true,
      randomizeQuestions: false,
      requirePassword: false,
      examPassword: '',
      maxAttempts: '1'
    }
  });

  const requirePassword = form.watch('requirePassword');

  React.useEffect(() => {
    const subscription = form.watch(() => {
      onAutoSave();
    });
    return () => subscription.unsubscribe();
  }, [form, onAutoSave]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">تنظیمات آزمون</h3>
        <p className="text-blue-700">زمان‌بندی و قوانین آزمون را مشخص کنید</p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {/* Date and Time Settings */}
          <Card className="border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="w-5 h-5" />
                زمان‌بندی آزمون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">تاریخ شروع</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-slate-300 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">تاریخ پایان</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-slate-300 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">زمان شروع</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className="border-slate-300 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">زمان پایان</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          className="border-slate-300 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Rules */}
          <Card className="border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Settings className="w-5 h-5" />
                قوانین آزمون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maxAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">حداکثر تعداد تلاش</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="۱"
                          className="border-slate-300 focus:border-blue-500 text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="allowRetake"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <FormLabel className="text-slate-800 font-medium">امکان تکرار آزمون</FormLabel>
                        <p className="text-sm text-slate-600">آیا فراگیران بتوانند آزمون را مجدداً بگذرانند؟</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showResults"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <FormLabel className="text-slate-800 font-medium">نمایش نتایج</FormLabel>
                        <p className="text-sm text-slate-600">نتایج بلافاصله پس از اتمام آزمون نمایش داده شود</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="randomizeQuestions"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <FormLabel className="text-slate-800 font-medium">ترتیب تصادفی سوالات</FormLabel>
                        <p className="text-sm text-slate-600">سوالات به صورت تصادفی برای هر فراگیر نمایش داده شود</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="w-5 h-5" />
                تنظیمات امنیتی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="requirePassword"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <FormLabel className="text-slate-800 font-medium">نیاز به رمز عبور</FormLabel>
                      <p className="text-sm text-slate-600">برای شروع آزمون رمز عبور مورد نیاز باشد</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {requirePassword && (
                <FormField
                  control={form.control}
                  name="examPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">رمز عبور آزمون</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="رمز عبور مورد نظر را وارد کنید"
                          className="border-slate-300 focus:border-blue-500 text-right"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}; 