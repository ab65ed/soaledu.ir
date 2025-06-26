# 🔐 راهنمای پیاده‌سازی سیستم لاگین/خروج - SoalEdu.ir

## 📋 خلاصه کامل

این مستند راهنمای کاملی برای پیاده‌سازی سیستم احراز هویت حرفه‌ای در پروژه SoalEdu.ir ارائه می‌دهد.

---

## 📁 فایل‌های ایجاد شده

### 1. **lovable-login-prompt.md**
- **مسیر**: `/lovable-login-prompt.md` (ریشه پروژه)
- **محتوا**: پرامپت کامل و حرفه‌ای برای Lovable
- **شامل**: تمام مشخصات فنی، UI/UX، امنیت، API ها، نقش‌ها

### 2. **component-report-template.md**
- **مسیر**: `/component-report-template.md` (ریشه پروژه)
- **محتوا**: template گزارش کامپوننت‌های ایجاد شده
- **شامل**: ساختار کامپوننت‌ها، dependencies، props، ویژگی‌ها

### 3. **login-logout-codes-template.txt**
- **مسیر**: `/login-logout-codes-template.txt` (ریشه پروژه)
- **محتوا**: template فایل کدها برای انتقال آسان
- **شامل**: ساختار منظم تمام کدهای تولید شده

---

## 🚀 نحوه استفاده

### مرحله 1: استفاده از پرامپت در Lovable

1. **کپی کردن پرامپت**:
   ```bash
   cat lovable-login-prompt.md
   ```

2. **ارسال به Lovable**:
   - کل محتوای فایل `lovable-login-prompt.md` را کپی کنید
   - در Lovable paste کنید
   - درخواست ایجاد کامپوننت‌ها را ارسال کنید

### مرحله 2: دریافت و سازماندهی کدها

1. **ذخیره کدها**:
   - کدهای تولید شده توسط Lovable را در فایل `login-logout-codes.txt` ذخیره کنید
   - از template موجود استفاده کنید

2. **تکمیل گزارش**:
   - فایل `component-report.md` را بر اساس template تکمیل کنید
   - جزئیات کامپوننت‌های ایجاد شده را ثبت کنید

### مرحله 3: انتقال به پروژه Next.js

1. **ساختار پوشه‌ها**:
   ```bash
   mkdir -p frontend/src/components/auth/{atoms,molecules,organisms}
   mkdir -p frontend/src/hooks/auth
   mkdir -p frontend/src/services/auth
   mkdir -p frontend/src/stores/auth
   mkdir -p frontend/src/types/auth
   ```

2. **کپی فایل‌ها**:
   - کامپوننت‌ها را به مسیرهای مناسب کپی کنید
   - Hook ها و service ها را در پوشه‌های مربوطه قرار دهید

---

## 🎯 نقش‌ها و مسیرهای هدایت

### نقش‌های پشتیبانی شده:
1. **Admin** → `/admin/dashboard`
2. **Designer** → `/designer/dashboard`
3. **Learner/Student** → `/learner/dashboard`
4. **Expert** → `/expert/dashboard`
5. **Support** → `/support/dashboard`

### API Endpoints موجود:
- `POST /api/v1/auth/login` - ورود کاربر
- `POST /api/v1/auth/logout` - خروج کاربر
- `GET /api/v1/auth/me` - دریافت پروفایل
- `POST /api/v1/auth/refresh-token` - تجدید توکن

---

## 🎨 مشخصات طراحی

### Theme:
- **فونت**: YekanBakh, IRANSans
- **رنگ اصلی**: #3B82F6 (آبی)
- **جهت**: RTL برای فارسی
- **انیمیشن**: Framer Motion

### Technology Stack:
- **Framework**: Next.js 15 + App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **API**: React Query
- **Form**: React Hook Form + Zod
- **Test**: Jest + Cypress

---

## 🔒 ویژگی‌های امنیتی

### پیاده‌سازی شده:
- **Rate Limiting**: 5 درخواست/دقیقه
- **XSS Prevention**: Sanitization
- **CSRF Protection**: توکن امن
- **Input Validation**: Zod schemas
- **Secure Storage**: httpOnly cookies

---

## 🧪 تست‌ها

### Unit Tests:
- `LoginForm.test.tsx`
- `LogoutModal.test.tsx`
- `authService.test.ts`
- `authStore.test.ts`
- `useAuth.test.ts`

### E2E Tests:
- `login-flow.cy.ts`
- `logout-flow.cy.ts`
- `role-redirection.cy.ts`
- `accessibility.cy.ts`

### Coverage Target: 85%+

---

## 📱 ویژگی‌های UI/UX

### Responsive Design:
- **Mobile First**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

### Accessibility:
- **WCAG 2.2**: تطبیق کامل
- **Keyboard Navigation**: پشتیبانی کامل
- **Screen Readers**: ARIA labels
- **Color Contrast**: 4.5:1

### Animations:
- **Page Transitions**: Smooth fade-in
- **Button Hover**: Scale + shadow
- **Modal**: Slide + fade
- **Loading**: Spinning indicator

---

## 🔄 جریان کار (Workflow)

### 1. Development:
```bash
# نصب dependencies
npm install

# اجرای development server
npm run dev

# اجرای تست‌ها
npm run test
npm run test:e2e
```

### 2. Testing:
```bash
# Unit tests
npm run test:unit

# E2E tests
npm run cypress:open

# Coverage report
npm run test:coverage
```

### 3. Build:
```bash
# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📊 معیارهای کیفیت

### Performance:
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: < 50KB

### Security:
- **No Vulnerabilities**: npm audit
- **OWASP Top 10**: تطبیق کامل
- **Security Headers**: CSP, HSTS

### Code Quality:
- **ESLint**: No errors
- **TypeScript**: Strict mode
- **Prettier**: Formatted
- **Test Coverage**: 85%+

---

## 🚀 Deployment

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://api.soaledu.ir
NEXT_PUBLIC_PARSE_APP_ID=your_app_id
NEXT_PUBLIC_PARSE_JS_KEY=your_js_key
```

### Build Commands:
```bash
# Production build
npm run build

# Start production server
npm start

# Health check
curl http://localhost:3000/api/health
```

---

## 📞 پشتیبانی و عیب‌یابی

### مشکلات متداول:

#### 1. خطای Authentication
- بررسی توکن در localStorage
- چک کردن API endpoint
- بررسی CORS settings

#### 2. مشکل Redirect
- بررسی نقش کاربر
- چک کردن route permissions
- بررسی router configuration

#### 3. مشکل UI
- بررسی RTL styles
- چک کردن responsive breakpoints
- بررسی animation conflicts

### Debug Commands:
```bash
# Clear browser cache
localStorage.clear()

# Check API calls
console.log(authStore.getState())

# Test endpoints
curl -X POST http://localhost:5000/api/v1/auth/login
```

---

## 📈 نظارت و Analytics

### Metrics to Monitor:
- Login success rate
- Failed login attempts
- Session duration
- User role distribution
- Page load times
- Error rates

### Logging:
- Authentication events
- Security incidents
- Performance issues
- User activities

---

## 🔮 آینده و بهبودها

### Phase 2 Features:
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, GitHub)
- [ ] Password strength meter
- [ ] Account lockout mechanism
- [ ] Login history
- [ ] Device management

### Performance Optimizations:
- [ ] Service Worker caching
- [ ] CDN integration
- [ ] Image optimization
- [ ] Code splitting optimization

---

## 📝 مستندات مرتبط

### Internal Docs:
- `/frontend/docs/progress-report.md`
- `/frontend/docs/issues-report.md`
- `/backend/docs/API-Documentation.md`
- `/backend/docs/ROLES_SYSTEM_DOCUMENTATION.md`

### External Resources:
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Guide](https://tanstack.com/query/latest)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**تاریخ ایجاد**: ۲۶ خرداد ۱۴۰۳  
**نسخه**: v1.0.0  
**وضعیت**: ✅ آماده برای پیاده‌سازی  
**مسئول**: تیم توسعه Frontend

---

🎉 **پروژه SoalEdu.ir آماده برای پیاده‌سازی سیستم لاگین/خروج حرفه‌ای است!** 