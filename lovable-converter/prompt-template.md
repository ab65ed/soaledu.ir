# 🎨 LOVABLE TO NEXT.JS CONVERTER

## 📋 دستورالعمل تبدیل

کد Lovable زیر را به Next.js با مشخصات پروژه SoalEdu.ir تبدیل کن:

```
[کد کپی شده از Lovable را اینجا قرار دهید]
```

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

1. **کامپوننت اصلی** با TypeScript کامل
2. **Custom Hook** برای logic management
3. **Service** برای API calls
4. **Zustand Store** برای state management
5. **Types** برای TypeScript
6. **Test file** برای Jest
7. **گزارش تبدیل** با metrics

## 🔍 **نکات مهم:**

- ✅ همه کدها باید RTL و فارسی باشند
- ✅ استفاده از `cn()` utility برای className ها
- ✅ Error boundaries و loading states
- ✅ Accessibility (WCAG 2.2)
- ✅ Mobile-first responsive design
- ✅ Performance monitoring
- ✅ SEO optimization

## 🚦 **مراحل اجرا:**

1. **تجزیه کد Lovable** و شناسایی کامپوننت‌ها
2. **تبدیل به Next.js** با مشخصات فوق
3. **تولید فایل‌های جانبی** (hooks, services, stores)
4. **اجرای تست‌ها** و بررسی خطاها
5. **بیلد پروژه** و بررسی performance
6. **ارائه گزارش** نهایی

---

## 🎯 **شروع تبدیل:**

لطفاً کد Lovable خود را در بالا قرار دهید و من آن را به Next.js تبدیل خواهم کرد. 