# 🎨 ماژول تبدیل Lovable به Next.js

## 📋 توضیحات

این ماژول قدرتمند برای تبدیل خودکار کدهای Lovable (React + Vite) به Next.js با پشتیبانی کامل از:

- ✅ **Next.js 15** با App Router
- ✅ **TypeScript** کامل
- ✅ **Zustand** برای مدیریت state
- ✅ **React Query** برای مدیریت کش حرفه‌ای
- ✅ **Atomic Design** (atoms, molecules, organisms)
- ✅ **RTL** و فونت فارسی
- ✅ **Framer Motion** برای انیمیشن‌ها
- ✅ **Custom Hooks** و Services
- ✅ **Performance Optimization** با memoization
- ✅ **Theme System** سازگار با پروژه

## 🚀 نحوه استفاده

### 1. کپی کردن کد از Lovable

کد مورد نظر خود را از Lovable کپی کنید و در prompt زیر قرار دهید:

```
🎨 LOVABLE TO NEXT.JS CONVERTER

کد Lovable زیر را به Next.js تبدیل کن:

[کد کپی شده از Lovable]

مشخصات تبدیل:
- استفاده از theme.ts موجود
- RTL و فارسی
- Zustand + React Query
- Performance optimization
- تست‌های کامل
```

### 2. نتیجه تبدیل

ماژول به صورت خودکار:
- کد را تبدیل می‌کند
- API های لازم را ایجاد می‌کند
- Custom Hooks می‌سازد
- Zustand Store اضافه می‌کند
- React Query setup می‌کند
- تست‌ها را می‌نویسد
- بیلد می‌گیرد

## 📁 ساختار خروجی

```
frontend/src/
├── components/
│   ├── atoms/
│   │   └── [ComponentName]/
│   ├── molecules/
│   │   └── [ComponentName]/
│   └── organisms/
│       └── [ComponentName]/
├── hooks/
│   └── use[ComponentName].ts
├── services/
│   └── [componentName]Service.ts
├── stores/
│   └── [componentName]Store.ts
└── types/
    └── [componentName].ts
```

## 🎯 ویژگی‌های کلیدی

### Performance Optimization
- React.memo برای کامپوننت‌ها
- useMemo و useCallback
- مدیریت کش هوشمند
- Lazy Loading
- Code Splitting

### State Management
- Zustand stores
- React Query integration
- Optimistic updates
- Error handling
- Loading states

### Design System
- Theme-based colors
- Atomic components
- RTL support
- Persian typography
- Responsive design

## 🔧 تنظیمات

فایل تنظیمات در `lovable-converter/config.ts` قرار دارد.

## 📝 مثال کامل

Input (Lovable):
```jsx
const MyComponent = () => {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1>Hello World</h1>
    </div>
  );
};
```

Output (Next.js):
```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MyComponentProps {
  className?: string;
}

export const MyComponent: React.FC<MyComponentProps> = React.memo(({ 
  className 
}) => {
  return (
    <motion.div
      className={cn(
        "bg-primary-500 text-white p-4 font-iran-sans",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-xl font-bold">سلام دنیا</h1>
    </motion.div>
  );
});

MyComponent.displayName = 'MyComponent';
export default MyComponent;
```

## 🧪 تست و بیلد

ماژول به صورت خودکار:
1. تست‌های Jest ایجاد می‌کند
2. بیلد می‌گیرد
3. خطاها را گزارش می‌دهد
4. Performance metrics ارائه می‌دهد

## 🗑️ پاک‌سازی

بعد از اتمام کار، فولدر `lovable-converter` را پاک کنید:

```bash
rm -rf lovable-converter
``` 