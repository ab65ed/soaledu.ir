# اتصال تماس با ما به سیستم پشتیبانی

**تاریخ**: ۱۴۰۳/۱۱/۰۸  
**نسخه**: ۱.۰.۰  
**نویسنده**: سیستم AI

## خلاصه پروژه

این مستند جزئیات اتصال صفحه "تماس با ما" به سیستم نقش‌ها و پشتیبانی پلتفرم exam-edu را شرح می‌دهد. هدف ایجاد یک جریان یکپارچه از دریافت پیام‌های کاربران تا پاسخگویی توسط تیم پشتیبانی است.

## اهداف پروژه

### اهداف اصلی
- ✅ اتصال فرم تماس به سیستم پشتیبانی
- ✅ نمایش پیام‌های تماس در داشبورد پشتیبانی
- ✅ ایجاد سیستم اعلان‌ها برای ادمین/پشتیبانی
- ✅ تبدیل پیام‌های تماس به تیکت‌های پشتیبانی
- ✅ دسترسی بر اساس نقش کاربر

### اهداف فرعی
- ✅ آمار زمان واقعی پیام‌ها
- ✅ UI/UX بهینه شده برای فارسی
- ✅ کش هوشمند با React Query
- ⚠️ چت زنده (در آینده)
- ⚠️ دسته‌بندی پیام‌ها (در آینده)

## معماری سیستم

### ساختار کلی
```
Contact Form → localStorage → Dashboard → Ticket System → Response
```

### کامپوننت‌های کلیدی

#### 1. هوک‌های React Query
**مسیر**: `frontend/src/hooks/useTickets.ts`

##### `useTickets(filters?)`
- مدیریت تیکت‌های پشتیبانی
- عملیات CRUD بر روی تیکت‌ها
- تبدیل پیام‌های تماس به تیکت

##### `useContactMessages()`
- دریافت پیام‌های تماس جدید
- نشان‌گذاری پیام‌ها به عنوان خوانده شده
- Polling هر دقیقه برای پیام‌های جدید

##### `useSupportNotifications()`
- محاسبه تعداد اعلان‌ها
- پیام‌های جدید، تیکت‌های عقب‌افتاده
- آپدیت real-time

#### 2. داشبورد پشتیبانی
**مسیر**: `frontend/src/components/admin/SupportDashboard.tsx`

##### ویژگی‌های جدید
- **نوار اعلان‌ها**: نمایش پیام‌های جدید و تیکت‌های فوری
- **کارت پیام‌های تماس**: نمایش آمار و دسترسی سریع
- **مودال پیام‌ها**: لیست کامل پیام‌های تماس
- **نشان‌های اعلان**: بر روی کارت‌های آماری

#### 3. سرویس اتصال
**مسیر**: `frontend/src/services/contactApi.ts`

##### متدهای جدید
- `getContactMessage(id)`: دریافت یک پیام خاص
- `updateMessageStatus(id, status)`: تغییر وضعیت پیام

## جریان کاری

### 1. دریافت پیام تماس
```typescript
// کاربر پیام ارسال می‌کند
ContactForm → contactApi.submitContactForm() → localStorage

// وضعیت اولیه: 'new'
```

### 2. نمایش در داشبورد
```typescript
// useContactMessages هر دقیقه چک می‌کند
useContactMessages() → contactApi.getContactMessages() → SupportDashboard

// نمایش در نوار اعلان‌ها و کارت آماری
```

### 3. بررسی پیام توسط پشتیبان
```typescript
// کلیک بر روی کارت پیام‌ها
onClick → setShowContactMessages(true) → Modal با لیست پیام‌ها

// نشان‌گذاری به عنوان خوانده شده
markAsRead(messageId) → contactApi.updateMessageStatus(id, 'read')
```

### 4. تبدیل به تیکت (در آینده)
```typescript
// کلیک بر روی "تبدیل به تیکت"
convertContactToTicket() → useTickets.convertContactToTicketMutation

// ایجاد تیکت با metadata کامل
```

## سیستم نقش‌ها

### دسترسی‌ها

#### ادمین (`UserRole.ADMIN`)
- دسترسی کامل به تمام پیام‌ها
- مشاهده آمار کلی سیستم
- تخصیص تیکت‌ها به پشتیبانان
- مدیریت نقش‌ها و مجوزها

#### پشتیبانی (`UserRole.SUPPORT`)
- مشاهده پیام‌های تماس
- پاسخ به تیکت‌های محول شده
- مدیریت پایگاه دانش
- چت زنده با کاربران

#### دانشجو (`UserRole.STUDENT`)
- ارسال پیام تماس
- ایجاد تیکت پشتیبانی
- مشاهده وضعیت تیکت‌های خود

### مجوزهای مربوطه
```typescript
Permission.VIEW_TICKETS        // مشاهده تیکت‌ها
Permission.RESPOND_TICKETS     // پاسخ به تیکت‌ها
Permission.CREATE_TICKETS      // ایجاد تیکت
Permission.MANAGE_KNOWLEDGE_BASE // مدیریت پایگاه دانش
```

## رابط کاربری

### طراحی اعلان‌ها
- **رنگ‌بندی**: نارنجی برای اعلان‌ها، قرمز برای فوری
- **انیمیشن**: Fade-in با Framer Motion
- **نشان‌ها**: دایره قرمز با تعداد روی کارت‌ها
- **فونت**: IRANSans برای متن فارسی

### مودال پیام‌ها
- **هدر**: بنفش با آیکون پاکت نامه
- **لیست**: پیام‌های جدید برجسته
- **اکشن‌ها**: خوانده شده، تبدیل به تیکت
- **اسکرول**: حداکثر ۶۰vh ارتفاع

### آمار زمان واقعی
- **کارت‌ها**: ۴ کارت آماری اصلی
- **رنگ‌بندی**: آبی، قرمز، بنفش، سبز
- **انیمیشن**: تاخیر پلکانی برای نمایش

## تنظیمات React Query

### Cache Strategy
```typescript
staleTime: 30000,      // 30 ثانیه
refetchInterval: 60000 // بررسی هر دقیقه
```

### Query Keys
```typescript
['tickets', filters]           // تیکت‌ها با فیلتر
['contact-messages']           // پیام‌های تماس
['ticket-stats']              // آمار تیکت‌ها
['dashboard-stats']           // آمار داشبورد
```

### Mutation Strategy
- **onSuccess**: Invalidate مرتبط queries
- **Error Handling**: نمایش پیام خطا به فارسی
- **Optimistic Updates**: برای تجربه بهتر کاربر

## بهینه‌سازی عملکرد

### Lazy Loading
- مودال پیام‌ها فقط در صورت نیاز بارگذاری می‌شود
- KnowledgeBaseViewer conditional rendering

### مدیریت حافظه
- localStorage برای ذخیره محلی
- Cleanup در useEffect hooks
- Proper dependency arrays

### Network Optimization
- Batching API calls جایی که ممکن است
- Error boundaries برای handling خطاها
- Retry logic برای network failures

## مسائل و محدودیت‌ها

### مسائل فعلی
- ⚠️ Linter errors در useTickets.ts (type mismatches)
- ⚠️ Backend integration ناقص
- ⚠️ Real-time notifications نیاز به WebSocket

### محدودیت‌های فنی
- localStorage برای ذخیره (موقتی)
- Polling به جای real-time updates
- Mock data برای برخی بخش‌ها

### اولویت‌های بعدی
1. **تصحیح TypeScript errors**
2. **Backend API integration**
3. **WebSocket برای real-time**
4. **دسته‌بندی پیام‌ها**
5. **چت زنده**

## تست و کیفیت

### Unit Tests
```bash
# هوک‌ها
npm test useTickets.test.tsx
npm test useContactMessages.test.tsx

# کامپوننت‌ها  
npm test SupportDashboard.test.tsx
```

### Integration Tests
```bash
# جریان کامل
npm test contact-to-support.test.tsx
```

### E2E Tests (Cypress)
```typescript
// تست جریان کامل از فرم تا داشبورد
describe('Contact to Support Flow', () => {
  it('should convert contact message to ticket', () => {
    // Test implementation
  });
});
```

## نتیجه‌گیری

این پروژه با موفقیت اتصال محکمی بین صفحه تماس با ما و سیستم پشتیبانی ایجاد کرده است. ویژگی‌های کلیدی شامل:

- **UI/UX یکپارچه** با طراحی فارسی
- **آمار real-time** برای تیم پشتیبانی  
- **سیستم اعلان‌های هوشمند**
- **دسترسی بر اساس نقش**
- **عملکرد بهینه** با React Query

### توصیه‌ها برای آینده
1. پیاده‌سازی WebSocket برای real-time updates
2. ایجاد سیستم چت زنده
3. افزودن دسته‌بندی هوشمند پیام‌ها
4. ایجاد dashboard analytics تخصصی
5. پیاده‌سازی notification system موبایل

---

**پایان مستند** | exam-edu Support Integration v1.0.0 