# Blog System Implementation Guide

## نمای کلی سیستم وبلاگ

سیستم وبلاگ پلتفرم Exam-Edu با استفاده از معماری مدرن و پشتیبانی کامل از زبان فارسی و RTL طراحی شده است.

## ویژگی‌های کلیدی

### Frontend Features
- ✅ **BlogGrid Component**: نمایش مقالات با استفاده از Magic UI BentoGrid
- ✅ **CategoryFilter Component**: فیلتر پیشرفته دسته‌بندی‌ها
- ✅ **RTL Support**: پشتیبانی کامل از راست به چپ
- ✅ **Persian UI**: رابط کاربری فارسی
- ✅ **Responsive Design**: طراحی واکنش‌گرا
- ✅ **Performance Optimization**: بهینه‌سازی با React.memo

### Backend Features
- ✅ **RESTful API**: API کامل برای مدیریت مقالات
- ✅ **Authentication**: احراز هویت و مجوزدهی
- ✅ **Comment System**: سیستم نظرات با مدیریت
- ✅ **Category Management**: مدیریت دسته‌بندی‌ها
- ✅ **Persian Validation**: اعتبارسنجی فارسی

## ساختار فایل‌ها

### Frontend Structure
```
frontend/src/
├── components/
│   ├── organisms/
│   │   ├── BlogGrid.tsx           # نمایش شبکه‌ای مقالات
│   │   ├── BlogPostForm.tsx       # فرم ایجاد/ویرایش مقاله
│   │   └── BlogPostList.tsx       # لیست مقالات
│   ├── molecules/
│   │   ├── CategoryFilter.tsx     # فیلتر دسته‌بندی
│   │   ├── BlogSearchFilter.tsx   # جستجوی پیشرفته
│   │   └── BlogFilter.tsx         # فیلتر عمومی
│   └── ui/
│       ├── bento-grid.tsx         # Magic UI BentoGrid
│       └── marquee.tsx            # Magic UI Marquee
├── hooks/
│   └── useBlog.ts                 # React Query hooks
├── services/
│   └── api.ts                     # API endpoints
└── app/blog/
    └── page.tsx                   # صفحه اصلی وبلاگ
```

### Backend Structure
```
backend/src/
├── controllers/
│   └── blogController.ts          # کنترلرهای وبلاگ
├── models/
│   ├── BlogPost.ts               # مدل مقاله
│   └── BlogCategory.ts           # مدل دسته‌بندی
├── routes/
│   └── blogRoutes.ts             # مسیرهای API
├── middleware/
│   └── blogMiddleware.ts         # میدل‌ویرهای وبلاگ
└── types/
    └── index.ts                  # تایپ‌های TypeScript
```

## API Endpoints

### Public Endpoints
```typescript
GET /api/blog/posts              # دریافت مقالات
GET /api/blog/posts/:slug        # دریافت مقاله با slug
GET /api/blog/categories         # دریافت دسته‌بندی‌ها
```

### Protected Endpoints
```typescript
POST /api/blog/posts/:id/comments    # افزودن نظر
```

### Admin Endpoints
```typescript
POST /api/blog/posts                 # ایجاد مقاله
PUT /api/blog/posts/:id              # ویرایش مقاله
DELETE /api/blog/posts/:id           # حذف مقاله
POST /api/blog/categories            # ایجاد دسته‌بندی
```

## استفاده از کامپوننت‌ها

### BlogGrid Component

```tsx
import { BlogGrid } from '@/components/organisms/BlogGrid';

function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <BlogGrid
      posts={posts || []}
      isLoading={isLoading}
      onPostClick={(post) => router.push(`/blog/${post.slug}`)}
      className="my-8"
    />
  );
}
```

### CategoryFilter Component

```tsx
import { CategoryFilter } from '@/components/molecules/CategoryFilter';

function BlogFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: categories } = useBlogCategories();

  return (
    <CategoryFilter
      categories={categories || []}
      selectedCategories={selectedCategories}
      onCategoryChange={setSelectedCategories}
      showPostCount={true}
      maxVisible={5}
    />
  );
}
```

## React Query Integration

### useBlog Hook

```typescript
// دریافت مقالات
const { data, isLoading, error } = useBlogPosts({
  page: 1,
  limit: 10,
  category: 'technology',
  search: 'ری‌اکت'
});

// دریافت مقاله واحد
const { data: post } = useBlogPost('post-slug');

// دریافت دسته‌بندی‌ها
const { data: categories } = useBlogCategories();

// ایجاد مقاله (Admin)
const createMutation = useCreateBlogPost();
```

## Performance Optimization

### Memoization
```typescript
// BlogGrid با React.memo
export const BlogGrid = memo(BlogGridComponent);

// CategoryFilter با React.memo
export const CategoryFilter = memo(CategoryFilterComponent);
```

### Caching Strategy
```typescript
// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## Testing

### Unit Tests
```bash
# اجرای تست‌های کامپوننت
npm run test:components

# اجرای تست‌های hook
npm run test:hooks

# اجرای تست‌های API
npm run test:api
```

### E2E Tests
```bash
# اجرای تست‌های Cypress
npm run cypress:open
```

## Deployment

### Frontend Build
```bash
npm run build
npm run start
```

### Backend Deployment
```bash
npm run build
npm run start:prod
```

## Security Considerations

### Input Validation
- اعتبارسنجی محتوای فارسی
- محدودیت طول متن
- فیلتر کردن HTML خطرناک

### Authentication
- JWT tokens
- Role-based access control
- Rate limiting for comments

### Data Protection
- Sanitization of user input
- XSS protection
- CSRF protection

## Performance Monitoring

### Metrics
- Page load times
- API response times
- Cache hit rates
- User engagement

### Tools
- React DevTools
- Lighthouse
- Web Vitals
- Custom analytics

## Troubleshooting

### Common Issues

1. **RTL Layout Problems**
   ```css
   /* اطمینان از تنظیم صحیح RTL */
   [dir="rtl"] {
     text-align: right;
   }
   ```

2. **Persian Font Loading**
   ```css
   /* بارگذاری فونت IRANSans */
   @font-face {
     font-family: 'IRANSans';
     src: url('/fonts/IRANSans.woff2') format('woff2');
   }
   ```

3. **API Connection Issues**
   ```typescript
   // بررسی تنظیمات CORS
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

## Future Enhancements

### Planned Features
- [ ] Advanced search with Elasticsearch
- [ ] Real-time comments with WebSocket
- [ ] Social media integration
- [ ] Newsletter subscription
- [ ] Content recommendation engine
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)

### Performance Improvements
- [ ] Image optimization with Next.js Image
- [ ] Code splitting optimization
- [ ] Service Worker implementation
- [ ] CDN integration

## Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Write tests
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Persian comment standards

## Support

برای پشتیبانی و سوالات:
- ایمیل: support@exam-edu.com
- مستندات: /docs
- GitHub Issues: /issues

---

**نسخه:** 1.0.0  
**آخرین به‌روزرسانی:** دی ۱۴۰۳  
**نویسنده:** تیم توسعه Exam-Edu 