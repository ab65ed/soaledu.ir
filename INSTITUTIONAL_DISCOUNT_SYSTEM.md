# سیستم مدیریت تخفیف‌های سازمانی

## نمای کلی

سیستم مدیریت تخفیف‌های سازمانی امکان اعطای تخفیف‌های گروهی به دانش‌آموزان نهادهای آموزشی قراردادی را فراهم می‌کند. این سیستم از طریق بارگذاری فایل‌های اکسل شامل اطلاعات دانش‌آموزان، تخفیف‌ها را به صورت خودکار اعمال می‌کند.

## ویژگی‌های کلیدی

### ✅ Backend (Node.js/Express/MongoDB)
- ✅ **مدل کاربر بروزرسانی شده**: اضافه شدن فیلدهای `nationalCode`, `phoneNumber`, `institutionalDiscountPercentage`, `institutionalDiscountGroupId`
- ✅ **مدل گروه تخفیف**: `InstitutionalDiscountGroup` با مدیریت کامل metadata
- ✅ **کنترلر تخفیف سازمانی**: پردازش فایل اکسل، اعمال تخفیف، CRUD عملیات
- ✅ **مسیرهای API**: endpoints کامل با احراز هویت admin
- ✅ **پردازش ناهمزمان**: async processing فایل‌ها
- ✅ **اعتبارسنجی**: کد ملی ایرانی و شماره تلفن
- ✅ **ایمنی**: محدودیت حجم فایل، نوع فایل، sanitization

### ✅ Frontend (Next.js/React/TypeScript)
- ✅ **Types**: تعریف کامل انواع داده‌ها
- ✅ **Service Layer**: تعامل با API
- ✅ **Custom Hooks**: مدیریت state
- ✅ **کامپوننت آپلود فایل**: drag & drop، progress bar، validation
- ✅ **لیست گروه‌ها**: pagination، filtering، مدیریت
- ✅ **صفحه admin**: dashboard کامل با آمار
- ✅ **RTL Support**: پشتیبانی کامل از راست‌چین

## ساختار فایل‌ها

### Backend
```
backend/src/
├── models/
│   ├── user.model.ts                    # مدل کاربر با فیلدهای تخفیف
│   └── InstitutionalDiscountGroup.ts    # مدل گروه تخفیف
├── controllers/
│   └── institutionalDiscountController.ts  # کنترلر اصلی
├── routes/
│   ├── institutionalDiscountRoutes.ts   # مسیرهای API
│   └── index.ts                         # integration مسیرها
└── uploads/
    └── institutional-discounts/         # پوشه موقت فایل‌ها
```

### Frontend
```
frontend/src/
├── types/
│   └── institutionalDiscount.ts         # تعریف types
├── services/
│   └── institutionalDiscountService.ts  # API calls
├── hooks/
│   └── useInstitutionalDiscount.ts      # custom hooks
├── components/admin/institutional-discount/
│   ├── FileUploadForm.tsx               # فرم آپلود
│   └── DiscountGroupsList.tsx           # لیست گروه‌ها
└── app/admin/
    └── institutional-discounts/
        └── page.tsx                     # صفحه اصلی
```

## نصب و راه‌اندازی

### Backend Dependencies
```bash
cd backend
npm install xlsx multer express-validator
npm install @types/multer --save-dev
```

### Frontend Dependencies
فایل `package.json` frontend شامل تمام وابستگی‌های مورد نیاز است.

### متغیرهای محیطی
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/soaledu
JWT_SECRET=your-jwt-secret
NODE_ENV=development

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## استفاده

### 1. بارگذاری فایل اکسل
1. وارد صفحه admin شوید: `/admin/institutional-discounts`
2. فایل اکسل شامل ستون‌های `nationalCode` و `phoneNumber` را آماده کنید
3. نوع و مقدار تخفیف را تعیین کنید (درصدی یا مبلغ ثابت)
4. فایل را بارگذاری کنید

### 2. فرمت فایل اکسل
```
| nationalCode | phoneNumber |
|--------------|-------------|
| 1234567890   | 09123456789 |
| 0987654321   | 09987654321 |
```

### 3. مراحل پردازش
1. **آپلود**: فایل بارگذاری و اعتبارسنجی اولیه
2. **پردازش**: تطبیق داده‌ها با کاربران موجود
3. **اعمال**: اعمال تخفیف به کاربران تطبیق‌یافته
4. **گزارش**: نمایش نتایج و خطاها

## API Endpoints

### مسیرهای اصلی
```
POST   /api/admin/institutional-discounts/upload      # بارگذاری فایل
GET    /api/admin/institutional-discounts/groups      # لیست گروه‌ها
GET    /api/admin/institutional-discounts/groups/:id  # جزئیات گروه
DELETE /api/admin/institutional-discounts/groups/:id  # حذف گروه
GET    /api/admin/institutional-discounts/stats       # آمار کلی
```

### نمونه درخواست بارگذاری
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('groupName', 'دانش‌آموزان مدرسه البرز');
formData.append('discountPercentage', '15');

fetch('/api/admin/institutional-discounts/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

## امنیت

### احراز هویت
- تمام endpoints نیاز به احراز هویت admin دارند
- استفاده از JWT token

### اعتبارسنجی
- **حجم فایل**: حداکثر 5MB
- **نوع فایل**: فقط .xlsx و .xls
- **کد ملی**: اعتبارسنجی کامل کد ملی ایرانی
- **شماره تلفن**: فرمت شماره موبایل ایران

### Input Sanitization
- تمام ورودی‌ها sanitize می‌شوند
- محافظت در برابر حملات injection

## عملکرد

### بهینه‌سازی‌ها
- **Async Processing**: پردازش فایل در background
- **Batch Updates**: به‌روزرسانی گروهی کاربران
- **Indexing**: ایندکس‌های MongoDB برای جستجوی سریع
- **Pagination**: صفحه‌بندی در لیست گروه‌ها

### Cache Strategy
- آمار کلی: 5 دقیقه cache
- لیست گروه‌ها: real-time
- جزئیات گروه: 10 دقیقه cache

## مانیتورینگ و لاگ‌ها

### لاگ‌گیری
- تمام عملیات مهم log می‌شوند
- خطاهای پردازش در `errorLog` گروه ذخیره می‌شوند
- Activity logs در سطح application

### آمار و گزارش‌ها
- تعداد کل گروه‌ها
- تعداد کاربران تخفیف‌دار
- گروه‌های در حال پردازش
- گروه‌های با خطا

## مسائل شناخته شده

### محدودیت‌ها
- حداکثر حجم فایل: 5MB
- فقط فرمت Excel پشتیبانی می‌شود
- تطبیق فقط بر اساس کد ملی و شماره تلفن

### بهبودهای آینده
- پشتیبانی از فرمت‌های بیشتر (CSV, JSON)
- امکان ویرایش گروه‌های موجود
- scheduled tasks برای انقضای تخفیف‌ها
- integration با سیستم پیامک

## تست

### تست Backend
```bash
cd backend
npm test
```

### تست Frontend
```bash
cd frontend
npm test
```

### نمونه داده‌های تست
فایل‌های نمونه در پوشه `test-data/` موجود است.

## Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
```

## پشتیبانی

برای گزارش مشکلات یا پیشنهادات:
- ایجاد issue در repository
- تماس با تیم توسعه

---

**نسخه**: 1.0.0  
**تاریخ آخرین بروزرسانی**: ۱۹ دی ۱۴۰۳  
**توسعه‌دهنده**: تیم فنی سوال ادو 