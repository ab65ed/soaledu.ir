# 🎨 LOVABLE TO NEXT.JS CONVERTER

## 📋 دستورالعمل تبدیل

### 🔄 **حالت‌های مختلف تبدیل:**

#### 1️⃣ **کامپوننت منفرد (Simple Component)**
```
[کد کپی شده از Lovable را اینجا قرار دهید]
```

#### 2️⃣ **کامپوننت پیچیده با وابستگی‌ها (Complex Component)**
اگر کامپوننت شما از چندین کامپوننت دیگه import داره:

```
// کامپوننت اصلی
[کد کامپوننت اصلی]

// کامپوننت‌های وابسته
[کد کامپوننت 1]
[کد کامپوننت 2]
[کد کامپوننت 3]
...
```

**⚠️ مهم:** برای کامپوننت‌های پیچیده، لطفاً تمام کامپوننت‌های وابسته را همراه ارسال کنید تا dependency resolver بتواند ترتیب صحیح تبدیل را تشخیص دهد.

---

## 🎯 مشخصات تبدیل

### ✅ **الزامات فنی:**
- **Framework:** Next.js 15 با App Router
- **Language:** TypeScript کامل
- **Styling:** TailwindCSS با theme.ts پروژه
- **State Management:** Zustand + React Query
- **Animation:** Framer Motion
- **RTL:** پشتیبانی کامل فارسی
- **Performance:** React.memo, useMemo, useCallback
- **Architecture:** Atomic Design (atoms/molecules/organisms)

### 🎨 **Theme Integration:**
- استفاده از `theme.ts` موجود در `frontend/src/utils/theme.ts`
- تبدیل رنگ‌های Lovable:
  - `blue/indigo` → `secondary`
  - `purple` → `accent` 
  - `green` → `primary`
  - `yellow/orange` → `quaternary`
- فونت: `font-iran-sans` (IRANSans)
- Direction: `rtl`

### 🏗️ **ساختار خروجی:**

```
frontend/src/
├── components/
│   └── [atoms|molecules|organisms]/
│       └── [ComponentName]/
│           └── [ComponentName].tsx
├── hooks/
│   └── use[ComponentName].ts
├── services/
│   └── [componentName]Service.ts
├── stores/
│   └── [componentName]Store.ts
├── types/
│   └── [componentName].ts
└── __tests__/
    └── [ComponentName].test.tsx
```

### 🚀 **Performance Optimizations:**

```typescript
// 1. React.memo برای کامپوننت
export const Component = React.memo(({ props }) => {
  // ...
});

// 2. useMemo برای محاسبات سنگین
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 3. useCallback برای event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);

// 4. Dynamic imports برای code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
});
```

### 🔗 **Dependency Management:**

```typescript
// 1. تجزیه و تحلیل وابستگی‌ها
const dependencyResolver = new DependencyResolver();
const strategy = dependencyResolver.generateConversionStrategy(components);

// 2. ترتیب تبدیل بر اساس Atomic Design
Phase 1: Atoms (Button, Input, Icon) → 5-10 دقیقه
Phase 2: Molecules (Card, Modal, Form) → 15-20 دقیقه  
Phase 3: Organisms (Header, Sidebar) → 30-45 دقیقه
Phase 4: Templates (Layout, Page) → 45-60 دقیقه

// 3. مدیریت Circular Dependencies
if (cycles.length > 0) {
  // حل چرخه‌های وابستگی با refactoring
  // جداسازی shared interfaces
  // استفاده از forward refs
}
```

### 🗃️ **State Management Pattern:**

```typescript
// Zustand Store
interface ComponentStore {
  data: ComponentData[];
  isLoading: boolean;
  error: string | null;
  actions: {
    fetchData: () => Promise<void>;
    updateItem: (id: string, data: Partial<ComponentData>) => void;
    reset: () => void;
  };
}

// React Query Integration
const useComponentData = () => {
  return useQuery({
    queryKey: ['component-data'],
    queryFn: componentService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
```

### 🎭 **Animation Pattern:**

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="..."
>
  {children}
</motion.div>
```

### 🔧 **API Service Pattern:**

```typescript
class ComponentService {
  private baseUrl = `${API_BASE_URL}/component`;

  async getAll(): Promise<ComponentResponse> {
    return this.request<ComponentResponse>('');
  }

  async create(data: CreateComponentData): Promise<ComponentData> {
    return this.request<ComponentData>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Implementation with error handling and auth
  }
}
```

### 🧪 **Test Pattern:**

```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    await user.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

---

## 📝 **خروجی مورد انتظار:**

### 🎯 **برای کامپوننت منفرد:**
1. **کامپوننت اصلی** با TypeScript کامل
2. **Custom Hook** برای logic management
3. **Service** برای API calls
4. **Zustand Store** برای state management
5. **Types** برای TypeScript
6. **Test file** برای Jest
7. **گزارش تبدیل** با metrics

### 🎯 **برای کامپوننت‌های پیچیده:**
1. **Dependency Analysis Report** - تجزیه وابستگی‌ها
2. **Conversion Strategy** - استراتژی تبدیل مرحله‌ای
3. **Phase-by-Phase Implementation** - پیاده‌سازی مرحله‌ای:
   - Phase 1: Atoms
   - Phase 2: Molecules  
   - Phase 3: Organisms
   - Phase 4: Templates
4. **Build Order** - ترتیب ساخت بر اساس وابستگی‌ها
5. **Circular Dependency Resolution** - حل چرخه‌های وابستگی
6. **Complete File Structure** - ساختار کامل فایل‌ها
7. **Integration Guide** - راهنمای ادغام
8. **Performance Report** - گزارش عملکرد

## 🔍 **نکات مهم:**

- ✅ همه کدها باید RTL و فارسی باشند
- ✅ استفاده از `cn()` utility برای className ها
- ✅ Error boundaries و loading states
- ✅ Accessibility (WCAG 2.2)
- ✅ Mobile-first responsive design
- ✅ Performance monitoring
- ✅ SEO optimization

## 🚦 **مراحل اجرا:**

### 📋 **برای کامپوننت منفرد:**
1. **تجزیه کد Lovable** و شناسایی کامپوننت‌ها
2. **تبدیل به Next.js** با مشخصات فوق
3. **تولید فایل‌های جانبی** (hooks, services, stores)
4. **اجرای تست‌ها** و بررسی خطاها
5. **بیلد پروژه** و بررسی performance
6. **ارائه گزارش** نهایی

### 📋 **برای کامپوننت‌های پیچیده:**
1. **Dependency Analysis** - تجزیه وابستگی‌ها و ساخت گراف
2. **Strategy Generation** - تولید استراتژی تبدیل مرحله‌ای
3. **Cycle Detection** - تشخیص و حل چرخه‌های وابستگی
4. **Phase Execution** - اجرای مرحله‌ای:
   - ✅ Phase 1: Convert Atoms
   - ✅ Phase 2: Convert Molecules  
   - ✅ Phase 3: Convert Organisms
   - ✅ Phase 4: Convert Templates
5. **Integration Testing** - تست ادغام بین کامپوننت‌ها
6. **Performance Validation** - بررسی عملکرد نهایی
7. **Documentation** - مستندسازی کامل

---

## 🎯 **شروع تبدیل:**

### 🔥 **برای کامپوننت منفرد:**
لطفاً کد Lovable خود را در بالا قرار دهید و من آن را به Next.js تبدیل خواهم کرد.

### 🔥 **برای کامپوننت‌های پیچیده:**
1. **تمام کامپوننت‌های وابسته** را همراه ارسال کنید
2. **مشخص کنید کدام کامپوننت اصلی** است
3. **dependency resolver** خودکار ترتیب تبدیل را تشخیص می‌دهد
4. **تبدیل مرحله‌ای** با گزارش کامل انجام می‌شود

### 📊 **مثال کامپوننت پیچیده:**
```typescript
// Dashboard.tsx (کامپوننت اصلی)
import { Header } from './Header';
import { Sidebar } from './Sidebar';  
import { Card } from './Card';

// Header.tsx (وابستگی)
import { Button } from './Button';
import { Avatar } from './Avatar';

// Card.tsx (وابستگی)
import { Button } from './Button';

// Button.tsx (atom)
// Avatar.tsx (atom)  
// Sidebar.tsx (organism)
```

**🎯 نتیجه:** Dependency resolver ترتیب تبدیل را `Button → Avatar → Card → Header → Sidebar → Dashboard` تشخیص می‌دهد. 