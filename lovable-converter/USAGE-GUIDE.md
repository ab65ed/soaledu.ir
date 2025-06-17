# 🎨 راهنمای استفاده از Lovable Converter

## 📋 مقدمه

این ماژول قدرتمند برای تبدیل خودکار کدهای Lovable به Next.js طراحی شده است. با پشتیبانی کامل از:

- ✅ **Next.js 15** با App Router
- ✅ **TypeScript** کامل
- ✅ **Zustand** برای state management
- ✅ **React Query** برای API management
- ✅ **Framer Motion** برای انیمیشن‌ها
- ✅ **RTL** و فونت فارسی
- ✅ **Performance Optimization**
- ✅ **Atomic Design**
- ✅ **تست‌های خودکار**

## 🚀 نصب و راه‌اندازی

### مرحله 1: دانلود ماژول

```bash
# کلون کردن یا دانلود ماژول در ریشه پروژه
git clone https://github.com/soaledu/lovable-converter.git
# یا
curl -L https://github.com/soaledu/lovable-converter/archive/main.zip -o lovable-converter.zip
unzip lovable-converter.zip
```

### مرحله 2: نصب dependencies

```bash
cd lovable-converter
npm install
npm run build
```

### مرحله 3: تست عملکرد

```bash
npm test
```

## 💡 روش‌های استفاده

### 1. استفاده از Prompt Template (توصیه شده)

```markdown
# در Cursor، از prompt زیر استفاده کنید:

🎨 LOVABLE TO NEXT.JS CONVERTER

کد Lovable زیر را به Next.js تبدیل کن:

```jsx
[کد کپی شده از Lovable را اینجا قرار دهید]
```

مشخصات تبدیل:
- استفاده از theme.ts موجود
- RTL و فارسی
- Zustand + React Query
- Framer Motion
- Performance optimization
- Atomic Design
- تست‌های کامل
```

### 2. استفاده از CLI

```bash
# تبدیل از فایل
./lovable-converter/cli.ts -i component.jsx -c MyComponent

# تبدیل با تست و بیلد
./lovable-converter/cli.ts -i component.jsx -t -b

# تبدیل از stdin
cat component.jsx | ./lovable-converter/cli.ts

# استفاده از config file
./lovable-converter/cli.ts -i component.jsx --config config.json
```

### 3. استفاده برنامه‌نویسی

```typescript
import { quickConvert, analyzeCode } from './lovable-converter';

// تبدیل سریع
const result = await quickConvert(lovableCode, 'MyComponent');

// تجزیه کد
const analysis = await analyzeCode(lovableCode);
```

## ⚙️ تنظیمات

### فایل config.json

```json
{
  "general": {
    "projectName": "SoalEdu.ir",
    "rtlSupport": true,
    "persianSupport": true
  },
  "performance": {
    "memoization": true,
    "codeSplitting": true,
    "imageOptimization": true,
    "bundleAnalysis": true
  },
  "testing": {
    "generateTests": true,
    "coverageThreshold": 80,
    "e2eTests": true
  },
  "build": {
    "autoTest": true,
    "autoBuild": false,
    "performanceCheck": true
  },
  "stateManagement": {
    "zustand": true,
    "reactQuery": true
  },
  "api": {
    "generateServices": true,
    "generateHooks": true,
    "generateTypes": true
  }
}
```

## 📁 ساختار خروجی

```
frontend/src/
├── components/
│   └── [atoms|molecules|organisms]/
│       └── [ComponentName]/
│           ├── [ComponentName].tsx
│           └── __tests__/
│               └── [ComponentName].test.tsx
├── hooks/
│   ├── use[ComponentName].ts
│   └── __tests__/
│       └── use[ComponentName].test.ts
├── services/
│   ├── [componentName]Service.ts
│   └── __tests__/
│       └── [componentName]Service.test.ts
├── stores/
│   ├── [componentName]Store.ts
│   └── __tests__/
│       └── [componentName]Store.test.ts
└── types/
    └── [componentName].ts
```

## 🎯 مثال‌های عملی

### مثال 1: تبدیل Card Component

**کد Lovable:**
```jsx
import React from 'react';

const ProductCard = ({ title, price, image, onBuy }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-green-600 text-lg font-semibold">${price}</p>
      <button 
        onClick={onBuy}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
```

**خروجی Next.js:**
```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  onBuy: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  title,
  price,
  image,
  onBuy,
  className
}) => {
  const handleBuy = React.useCallback(() => {
    onBuy();
  }, [onBuy]);

  return (
    <motion.div
      className={cn(
        "bg-white p-6 rounded-lg shadow-lg font-iran-sans",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image 
        src={image} 
        alt={title} 
        width={400}
        height={200}
        className="w-full h-48 object-cover rounded"
        loading="lazy"
        placeholder="blur"
      />
      <h3 className="text-xl font-bold mt-4 text-gray-900">{title}</h3>
      <p className="text-primary-600 text-lg font-semibold">
        {price.toLocaleString('fa-IR')} تومان
      </p>
      <button 
        onClick={handleBuy}
        className="bg-secondary-500 text-white px-4 py-2 rounded mt-4 hover:bg-secondary-600 transition-colors"
      >
        خرید کنید
      </button>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
```

### مثال 2: تبدیل با API Integration

**کد Lovable:**
```jsx
import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="p-4 border rounded">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
```

**خروجی Next.js (شامل Hook, Service, Store):**

1. **Component:**
```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUserList } from '@/hooks/useUserList';
import { cn } from '@/utils/cn';

export const UserList: React.FC = React.memo(() => {
  const { users, isLoading, error } = useUserList();

  return (
    <motion.div
      className="p-4 font-iran-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">کاربران</h2>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded mb-4">
          خطا در بارگذاری کاربران
        </div>
      )}
      
      {users && (
        <div className="grid gap-4">
          {users.map(user => (
            <motion.div 
              key={user.id} 
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

UserList.displayName = 'UserList';

export default UserList;
```

2. **Hook:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const useUserList = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
```

3. **Service:**
```typescript
class UserService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`;

  async getAll(): Promise<User[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('خطا در دریافت کاربران');
    }
    return response.json();
  }
}

export const userService = new UserService();
```

## 🧪 تست‌ها

### اجرای تست‌ها

```bash
# تست کامپوننت‌ها
npm run test

# تست با coverage
npm run test:coverage

# تست‌های E2E
npm run test:e2e
```

### مثال تست تولید شده

```typescript
describe('ProductCard', () => {
  it('renders correctly', () => {
    render(
      <ProductCard 
        title="محصول تست"
        price={100000}
        image="/test-image.jpg"
        onBuy={jest.fn()}
      />
    );
    
    expect(screen.getByText('محصول تست')).toBeInTheDocument();
    expect(screen.getByText('100,000 تومان')).toBeInTheDocument();
  });

  it('handles buy action', async () => {
    const mockBuy = jest.fn();
    const user = userEvent.setup();
    
    render(
      <ProductCard 
        title="محصول تست"
        price={100000}
        image="/test-image.jpg"
        onBuy={mockBuy}
      />
    );
    
    await user.click(screen.getByText('خرید کنید'));
    expect(mockBuy).toHaveBeenCalled();
  });
});
```

## 🚀 Performance Optimizations

### بهینه‌سازی‌های خودکار

1. **React.memo** برای کامپوننت‌ها
2. **useCallback** برای event handlers
3. **useMemo** برای محاسبات سنگین
4. **Dynamic imports** برای code splitting
5. **Image optimization** با Next.js Image
6. **React Query caching** برای API calls
7. **Zustand persistence** برای state management

### مثال خروجی بهینه شده

```typescript
export const OptimizedComponent = React.memo(({ data, onAction }) => {
  // Memoized computation
  const processedData = React.useMemo(() => {
    return data.filter(item => item.active).map(item => ({
      ...item,
      displayName: item.name.toUpperCase()
    }));
  }, [data]);

  // Memoized event handler
  const handleAction = React.useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  // Dynamic import for heavy component
  const HeavyChart = React.lazy(() => import('./HeavyChart'));

  return (
    <motion.div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleAction(item.id)}>
          {item.displayName}
        </div>
      ))}
      
      <React.Suspense fallback={<div>بارگذاری نمودار...</div>}>
        <HeavyChart data={processedData} />
      </React.Suspense>
    </motion.div>
  );
});
```

## 🔧 عیب‌یابی

### مشکلات رایج

1. **خطای TypeScript:**
   ```bash
   # بررسی types
   npm run type-check
   ```

2. **خطای Build:**
   ```bash
   # بیلد با جزئیات
   npm run build -- --verbose
   ```

3. **خطای Test:**
   ```bash
   # اجرای تست‌ها با debug
   npm run test -- --verbose
   ```

### لاگ‌های مفید

```typescript
// فعال کردن verbose logging
const converter = new LovableConverter({
  ...config,
  debug: true,
  verbose: true
});
```

## 🧹 پاک‌سازی

### حذف ماژول پس از استفاده

```bash
# پاک‌سازی معمولی (نگه داشتن prompt)
node lovable-converter/cleanup.ts

# حذف کامل
node lovable-converter/cleanup.ts --all

# نگه داشتن config
node lovable-converter/cleanup.ts --keep-config
```

## 📞 پشتیبانی

- **مستندات:** [GitHub Wiki](https://github.com/soaledu/lovable-converter/wiki)
- **Issues:** [GitHub Issues](https://github.com/soaledu/lovable-converter/issues)
- **Discussions:** [GitHub Discussions](https://github.com/soaledu/lovable-converter/discussions)

## 📝 نکات مهم

1. **همیشه backup بگیرید** قبل از تبدیل
2. **تست‌ها را اجرا کنید** پس از تبدیل
3. **Theme.ts را بررسی کنید** برای سازگاری رنگ‌ها
4. **Performance metrics را مانیتور کنید**
5. **از prompt template استفاده کنید** برای بهترین نتایج

---

**🎉 موفق باشید در استفاده از Lovable Converter!** 