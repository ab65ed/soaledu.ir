# مستندات سیستم تماس با ما - Contact System Documentation

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [معماری سیستم](#معماری-سیستم)
3. [کامپوننت‌های Frontend](#کامپوننتهای-frontend)
4. [API Backend](#api-backend)
5. [مدیریت State](#مدیریت-state)
6. [اعتبارسنجی و امنیت](#اعتبارسنجی-و-امنیت)
7. [تست‌ها](#تستها)
8. [استقرار](#استقرار)
9. [نکات عملکرد](#نکات-عملکرد)

---

## 🎯 معرفی

سیستم تماس با ما یک راه‌حل کامل و حرفه‌ای برای مدیریت ارتباطات کاربران با پلتفرم آموزشی Exam-Edu است. این سیستم شامل فرم تماس، بخش سوالات متداول (FAQ)، و پنل مدیریت پیام‌ها می‌باشد.

### ویژگی‌های کلیدی:
- ✅ فرم تماس با اعتبارسنجی فارسی کامل
- ✅ سیستم FAQ آکاردئونی با انیمیشن
- ✅ دسته‌بندی خودکار پیام‌ها
- ✅ اولویت‌بندی هوشمند
- ✅ پشتیبانی کامل RTL
- ✅ طراحی واکنش‌گرا
- ✅ مدیریت state با React Query
- ✅ ذخیره محلی به عنوان fallback
- ✅ انیمیشن‌های Framer Motion

---

## 🏗️ معماری سیستم

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                   │
├─────────────────────────────────────────────────────────────┤
│ Contact Page (/app/contact/page.tsx)                        │
│ ├── ContactForm (molecules)                                 │
│ ├── FAQAccordion (organisms)                               │
│ └── Contact Info Cards                                      │
├─────────────────────────────────────────────────────────────┤
│ Hooks & Services                                            │
│ ├── useContactForm.ts                                       │
│ └── contactApi.ts                                           │
├─────────────────────────────────────────────────────────────┤
│ State Management                                            │
│ ├── React Query                                             │
│ └── localStorage Fallback                                   │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP/REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Express.js + Parse)                 │
├─────────────────────────────────────────────────────────────┤
│ Contact Routes (/api/contact)                               │
│ ├── POST /          (ایجاد پیام)                           │
│ ├── GET /stats      (آمار پیام‌ها)                          │
│ └── Protected Routes (اضافه خواهد شد)                       │
├─────────────────────────────────────────────────────────────┤
│ Contact Controller                                          │
│ ├── createContact                                           │
│ ├── getContacts                                             │
│ ├── getContactById                                          │
│ ├── updateContact                                           │
│ ├── deleteContact                                           │
│ └── getContactStats                                         │
├─────────────────────────────────────────────────────────────┤
│ Contact Model (Parse Object)                                │
│ ├── Auto-categorization                                     │
│ ├── Priority Management                                     │
│ └── CRUD Operations                                         │
└─────────────────────────────────────────────────────────────┘
                               │
                               │ Parse SDK
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Parse Server / Back4App                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 کامپوننت‌های Frontend

### 1. ContactForm Component

**مسیر:** `frontend/src/components/molecules/ContactForm.tsx`

```typescript
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

**ویژگی‌ها:**
- اعتبارسنجی فارسی real-time
- ذخیره خودکار محلی
- انیمیشن‌های Framer Motion
- حالت‌های loading و error
- پشتیبانی RTL کامل

**استفاده:**
```tsx
import { ContactForm } from '@/components/molecules/ContactForm';

<ContactForm 
  onSubmit={submitContactFormAsync}
  isLoading={isLoading}
/>
```

### 2. FAQAccordion Component

**مسیر:** `frontend/src/components/organisms/FAQAccordion.tsx`

```typescript
interface FAQAccordionProps {
  faqs: FAQItem[];
  defaultOpen?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
```

**ویژگی‌ها:**
- دسته‌بندی سوالات
- انیمیشن expand/collapse
- امکان باز بودن چندین آیتم همزمان
- سوالات پیش‌فرض

**استفاده:**
```tsx
import { FAQAccordion } from '@/components/organisms/FAQAccordion';

<FAQAccordion 
  faqs={customFAQs}
  defaultOpen="1"
/>
```

### 3. Contact Page

**مسیر:** `frontend/src/app/contact/page.tsx`

صفحه کامل تماس با ما شامل:
- Header اطلاعاتی
- کارت‌های اطلاعات تماس
- فرم تماس
- بخش FAQ
- انیمیشن‌های صفحه

---

## 🔧 API Backend

### Endpoints

#### 1. ایجاد پیام تماس
```http
POST /api/contact
Content-Type: application/json

{
  "name": "علی احمدی",
  "email": "ali@example.com",
  "message": "سلام، سوال در مورد...",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "userId": "optional-user-id"
}
```

**پاسخ موفق:**
```json
{
  "success": true,
  "message": "پیام شما با موفقیت ارسال شد",
  "data": {
    "id": "contact_id",
    "name": "علی احمدی",
    "email": "ali@example.com",
    "message": "سلام، سوال در مورد...",
    "status": "pending",
    "priority": "medium",
    "category": "general",
    "createdAt": "2025-01-27T..."
  }
}
```

#### 2. دریافت آمار پیام‌ها
```http
GET /api/contact/stats
```

**پاسخ:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "read": 50,
    "replied": 60,
    "closed": 15,
    "byPriority": {
      "low": 30,
      "medium": 80,
      "high": 35,
      "urgent": 5
    },
    "byCategory": {
      "general": 60,
      "technical": 40,
      "billing": 25,
      "feature_request": 15,
      "bug_report": 10
    }
  }
}
```

### دسته‌بندی خودکار

سیستم بر اساس کلمات کلیدی موجود در پیام، آن را دسته‌بندی می‌کند:

- **bug_report**: خطا، باگ، مشکل → اولویت بالا
- **feature_request**: قابلیت، ویژگی، پیشنهاد → اولویت متوسط
- **technical**: فنی، تکنیکال، عملکرد → اولویت بالا
- **billing**: پرداخت، مالی، کیف پول → اولویت بالا
- **general**: سایر موارد → اولویت متوسط

### اولویت‌بندی هوشمند

- **urgent**: فوری، اضطراری، مهم
- **high**: سریع، خطا، کار نمی‌کند
- **low**: وقت دارد، عجله ندارد
- **medium**: پیش‌فرض

---

## 📊 مدیریت State

### React Query Integration

```typescript
// هوک ارسال فرم
export function useContactForm() {
  const submitContactForm = useMutation<ContactSubmissionResponse, Error, ContactFormData>({
    mutationFn: async (data: ContactFormData) => {
      return await contactApi.submitContactForm(data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      queryClient.setQueryData(['contact', 'recent'], (oldData: any) => {
        if (!oldData) return [response];
        return [response, ...oldData.slice(0, 9)];
      });
    }
  });

  return {
    submitContactFormAsync: submitContactForm.mutateAsync,
    isLoading: submitContactForm.isPending,
    isError: submitContactForm.isError,
    error: submitContactForm.error,
  };
}
```

### localStorage Fallback

```typescript
// ذخیره محلی در صورت عدم دسترسی به سرور
private storeContactSubmissionLocally(data: ContactFormData): string {
  const submissions = this.getContactSubmissionsFromStorage();
  const newSubmission = {
    id: `local_${Date.now()}`,
    ...data,
    timestamp: new Date().toISOString(),
    synced: false
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  
  return newSubmission.id;
}
```

---

## 🔒 اعتبارسنجی و امنیت

### اعتبارسنجی Frontend

```typescript
// اعتبارسنجی نام فارسی
const validatePersianTitle = (title: string): PersianValidationResult => {
  const errors: string[] = [];
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    errors.push('نام نمی‌تواند خالی باشد');
  } else if (trimmedTitle.length < 2) {
    errors.push('نام باید حداقل ۲ کاراکتر باشد');
  } else if (trimmedTitle.length > 100) {
    errors.push('نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد');
  }

  return { isValid: errors.length === 0, errors };
};

// اعتبارسنجی ایمیل
const validateEmail = (email: string): PersianValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('ایمیل نمی‌تواند خالی باشد');
  } else if (!emailRegex.test(email)) {
    errors.push('فرمت ایمیل صحیح نیست');
  }

  return { isValid: errors.length === 0, errors };
};
```

### اعتبارسنجی Backend (Zod)

```typescript
const contactCreateSchema = z.object({
  name: z.string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(100, 'نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'),
  email: z.string().email('فرمت ایمیل صحیح نیست'),
  message: z.string()
    .min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(2000, 'پیام نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  userId: z.string().optional()
});
```

### امنیت

- **Rate Limiting**: محدودیت تعداد درخواست
- **Input Sanitization**: پاک‌سازی ورودی‌ها
- **Security Logging**: ثبت رویدادهای امنیتی
- **CORS Protection**: حفاظت از درخواست‌های cross-origin

---

## 🧪 تست‌ها

### Unit Tests

```typescript
describe('ContactForm Component', () => {
  it('اعتبارسنجی فیلدهای خالی', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ContactForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /ارسال پیام/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('نام نمی‌تواند خالی باشد')).toBeInTheDocument();
      expect(screen.getByText('ایمیل نمی‌تواند خالی باشد')).toBeInTheDocument();
      expect(screen.getByText('پیام نمی‌تواند خالی باشد')).toBeInTheDocument();
    });
  });

  it('ارسال موفق فرم با داده‌های معتبر', async () => {
    const user = userEvent.setup();
    mockSubmit.mockResolvedValue(undefined);

    renderWithQueryClient(<ContactForm onSubmit={mockSubmit} />);

    await user.type(screen.getByPlaceholderText('نام خود را وارد کنید'), 'علی احمدی');
    await user.type(screen.getByPlaceholderText('ایمیل خود را وارد کنید'), 'ali@example.com');
    await user.type(screen.getByPlaceholderText('پیام خود را بنویسید...'), 'پیام تست کامل');

    await user.click(screen.getByRole('button', { name: /ارسال پیام/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'علی احمدی',
        email: 'ali@example.com',
        message: 'پیام تست کامل'
      });
    });
  });
});
```

### Integration Tests

```typescript
describe('Contact Page Integration', () => {
  it('تعامل بین کامپوننت‌های مختلف صفحه', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<ContactPage />);

    // تست فرم تماس
    const nameInput = screen.getByPlaceholderText('نام خود را وارد کنید');
    await user.type(nameInput, 'کاربر تست');
    expect(nameInput).toHaveValue('کاربر تست');

    // تست FAQ
    const faqQuestion = screen.getByText(/چگونه می‌توانم در آزمون‌ها شرکت کنم؟/);
    await user.click(faqQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/برای شرکت در آزمون‌ها، ابتدا باید در سامانه ثبت‌نام کنید/))
        .toBeInTheDocument();
    });
  });
});
```

### اجرای تست‌ها

```bash
# تست‌های unit
npm run test -- --testPathPattern=contact.test.tsx

# تست‌های integration
npm run test:integration

# تست‌های e2e با Cypress
npm run cypress:run -- --spec="cypress/e2e/contact.cy.ts"
```

---

## 🚀 استقرار

### متغیرهای محیطی

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.exam-edu.ir

# Backend (.env)
PARSE_APP_ID=your-parse-app-id
PARSE_MASTER_KEY=your-master-key
PARSE_SERVER_URL=https://parseapi.back4app.com
```

### Docker Deployment

```dockerfile
# Dockerfile برای production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name exam-edu.ir;

    location /api/contact {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Rate limiting
        limit_req zone=contact_limit burst=5 nodelay;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ⚡ نکات عملکرد

### Optimization استراتژی‌ها

1. **React.memo** برای جلوگیری از re-render غیرضروری:
```typescript
export const ContactForm = React.memo<ContactFormProps>(({ onSubmit, isLoading }) => {
  // Component implementation
});
```

2. **useCallback** برای memoization توابع:
```typescript
const handleSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  try {
    await onSubmit(formData);
    // Success handling
  } catch (error) {
    // Error handling
  }
}, [formData, onSubmit, validateForm]);
```

3. **React Query** برای cache management:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['contact', 'recent'],
  queryFn: () => contactApi.getRecentSubmissions(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

### Bundle Size Optimization

```bash
# تحلیل bundle size
npm run analyze

# نتایج مورد انتظار:
# ContactForm: ~15KB gzipped
# FAQAccordion: ~12KB gzipped
# Contact Page: ~25KB gzipped
```

---

## 📈 آمار و نظارت

### Performance Monitoring

```typescript
// Performance tracking
const trackContactFormSubmission = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_submit', {
      event_category: 'engagement',
      event_label: 'contact_form',
      value: 1
    });
  }
};
```

### Error Tracking

```typescript
// Error logging
const logContactError = (error: Error, context: string) => {
  console.error(`[CONTACT_ERROR] ${context}:`, error);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (e.g., Sentry)
    Sentry.captureException(error, {
      tags: {
        component: 'contact_system',
        context
      }
    });
  }
};
```

---

## 🔮 آینده‌نگری

### ویژگی‌های پیشنهادی

1. **Real-time Notifications**: اعلان‌های فوری برای ادمین
2. **File Upload**: امکان ضمیمه کردن فایل
3. **Chatbot Integration**: ربات پاسخگو هوشمند
4. **Multi-language Support**: پشتیبانی از زبان‌های متعدد
5. **Advanced Analytics**: تحلیل‌های پیشرفته‌تر

### Technical Debt

- [ ] اضافه کردن middleware احراز هویت کامل
- [ ] پیاده‌سازی WebSocket برای real-time updates
- [ ] بهینه‌سازی بیشتر برای mobile performance
- [ ] اضافه کردن Progressive Web App features

---

## 📞 پشتیبانی

برای سوالات فنی یا گزارش مشکلات:

- **Email**: dev@exam-edu.ir
- **GitHub**: [exam-edu/contact-system](https://github.com/exam-edu/contact-system)
- **Documentation**: [docs.exam-edu.ir/contact](https://docs.exam-edu.ir/contact)

---

*آخرین بروزرسانی: ۲۷ دی ۱۴۰۳ - نسخه ۱.۶.۰* 