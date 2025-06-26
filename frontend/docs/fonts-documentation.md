# مستندات فونت‌های پروژه

## فونت اصلی: YekanBakh

فونت **YekanBakh** به عنوان فونت اصلی پروژه انتخاب شده است.

### فایل‌های فونت موجود:
- `YekanBakhFaNum-Light` (وزن: 300)
- `YekanBakhFaNum-Regular` (وزن: 400) - پیش‌فرض
- `YekanBakhFaNum-SemiBold` (وزن: 600)
- `YekanBakhFaNum-Bold` (وزن: 700)
- `YekanBakhFaNum-ExtraBold` (وزن: 800)
- `YekanBakhFaNum-ExtraBlack` (وزن: 900)

### مسیر فایل‌ها:
```
frontend/public/fonts/yekanbakh/
```

### تنظیمات در کد:

#### 1. globals.css
فونت‌ها در فایل `src/app/globals.css` تعریف شده‌اند:
```css
@font-face {
  font-family: 'YekanBakh';
  src: url('/fonts/yekanbakh/YekanBakhFaNum-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

#### 2. theme.ts
فونت‌ها در فایل `src/utils/theme.ts` معرفی شده‌اند:
```typescript
export const fonts = {
  primary: 'YekanBakh, IRANSans, Tahoma, Arial, sans-serif',
  secondary: 'IRANSans, Vazir, Tahoma, Arial, sans-serif',
  yekanbakh: 'YekanBakh, IRANSans, Tahoma, Arial, sans-serif',
};
```

#### 3. CSS Variables
متغیرهای CSS برای استفاده در Tailwind v4:
```css
--font-family-yekanbakh: "YekanBakh", "IRANSans", "Tahoma", "Arial", sans-serif;
```

### کلاس‌های Tailwind:
- `font-yekanbakh` - استفاده از فونت YekanBakh
- `font-iran-sans` - استفاده از فونت IRANSans (پشتیبان)

### فونت‌های پشتیبان:
1. **IRANSans** - فونت پشتیبان اصلی
2. **Tahoma** - فونت سیستمی
3. **Arial** - فونت عمومی
4. **sans-serif** - فونت پیش‌فرض بدون سریف

### نکات مهم:
- همه فونت‌ها با `font-display: swap` برای بهینه‌سازی عملکرد تنظیم شده‌اند
- فونت‌ها در فرمت‌های WOFF2 و WOFF برای پشتیبانی کامل موجودند
- فونت اصلی پروژه در `layout.tsx` تنظیم شده است

### استفاده در کامپوننت‌ها:
```jsx
// استفاده پیش‌فرض (YekanBakh)
<div className="font-yekanbakh">متن با فونت یکان‌باخ</div>

// استفاده از فونت پشتیبان
<div className="font-iran-sans">متن با فونت ایران‌سنس</div>
``` 