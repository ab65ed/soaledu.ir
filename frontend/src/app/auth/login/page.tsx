"use client"

import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { Card, CardContent } from "@/components/ui/card";

/**
 * صفحه لاگین - صفحه اصلی ورود کاربران
 * 
 * ویژگی‌ها:
 * - پشتیبانی از تمام نقش‌های کاربری (Admin, Designer, Learner, Expert, Support)
 * - طراحی ریسپانسیو و RTL
 * - انیمیشن‌های جذاب با Framer Motion
 * - اعتبارسنجی کامل با Zod
 * - امنیت بالا با Rate Limiting
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* هدر صفحه */}
        <LoginHeader />
        
        {/* کارت اصلی فرم */}
        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
          <CardContent className="p-8">
            <LoginForm />
          </CardContent>
        </Card>
        
        {/* فوتر صفحه */}
        <LoginFooter />
      </div>
      
      {/* بک‌گراند دکوراتیو */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-floating" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-floating" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-pulse" />
      </div>
    </div>
  );
} 