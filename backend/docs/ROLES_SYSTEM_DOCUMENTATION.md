# مستندات سیستم نقش‌ها و مجوزها - SoalEdu.ir

## 📋 **خلاصه سیستم (آپدیت: ۲۶ خرداد ۱۴۰۳)**

### ✅ **وضعیت فعلی**
- **وضعیت**: فعال و عملیاتی ✅
- **تست‌ها**: 4/4 موفق (100%) ✅
- **API Endpoints**: 3 endpoint آماده ✅
- **مستندات**: کامل و به‌روز ✅

### 🎯 **ویژگی‌های کلیدی**
- **مدیریت نقش‌ها**: تعریف و مدیریت نقش‌های مختلف
- **سیستم مجوزها**: کنترل دسترسی‌های دقیق
- **داشبورد نقش‌محور**: محتوای متناسب با نقش کاربر
- **سلسله مراتب**: ساختار سازمانی نقش‌ها
- **آمار و گزارش**: نظارت بر عملکرد نقش‌ها

---

## 🔗 **API Endpoints**

### 1. دریافت لیست نقش‌ها
```http
GET /api/v1/roles
```

**Query Parameters:**
- `active` (boolean): فقط نقش‌های فعال
- `level` (string): سطح نقش (admin, manager, user)
- `department` (string): بخش سازمانی

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "role_admin",
      "name": "admin",
      "displayName": "مدیر سیستم",
      "description": "دسترسی کامل به همه بخش‌های سیستم",
      "level": "admin",
      "permissions": [
        "users.read",
        "users.write",
        "users.delete",
        "exams.read",
        "exams.write",
        "exams.delete",
        "questions.read",
        "questions.write",
        "questions.delete",
        "blog.read",
        "blog.write",
        "blog.delete",
        "contact.read",
        "contact.write",
        "contact.delete",
        "roles.read",
        "roles.write",
        "system.settings"
      ],
      "userCount": 3,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "role_designer",
      "name": "designer",
      "displayName": "طراح سوال",
      "description": "طراحی و مدیریت سوالات آزمون",
      "level": "manager",
      "permissions": [
        "questions.read",
        "questions.write",
        "exams.read",
        "exams.write",
        "finance.designer.read"
      ],
      "userCount": 12,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "role_student",
      "name": "student",
      "displayName": "دانش‌آموز",
      "description": "شرکت در آزمون‌ها و مشاهده نتایج",
      "level": "user",
      "permissions": [
        "exams.participate",
        "results.read",
        "profile.read",
        "profile.write"
      ],
      "userCount": 1250,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "role_expert",
      "name": "expert",
      "displayName": "کارشناس پشتیبانی",
      "description": "پاسخ‌گویی به سوالات و پشتیبانی کاربران",
      "level": "manager",
      "permissions": [
        "contact.read",
        "contact.write",
        "users.read",
        "exams.read",
        "questions.read"
      ],
      "userCount": 8,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "message": "لیست نقش‌ها"
}
```

### 2. دریافت لیست مجوزها
```http
GET /api/v1/roles/permissions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "users",
        "displayName": "مدیریت کاربران",
        "permissions": [
          {
            "key": "users.read",
            "name": "مشاهده کاربران",
            "description": "مشاهده لیست و جزئیات کاربران"
          },
          {
            "key": "users.write",
            "name": "ویرایش کاربران",
            "description": "ایجاد و ویرایش اطلاعات کاربران"
          },
          {
            "key": "users.delete",
            "name": "حذف کاربران",
            "description": "حذف کاربران از سیستم"
          }
        ]
      },
      {
        "name": "exams",
        "displayName": "مدیریت آزمون‌ها",
        "permissions": [
          {
            "key": "exams.read",
            "name": "مشاهده آزمون‌ها",
            "description": "مشاهده لیست و جزئیات آزمون‌ها"
          },
          {
            "key": "exams.write",
            "name": "ایجاد/ویرایش آزمون",
            "description": "ایجاد آزمون جدید و ویرایش آزمون‌های موجود"
          },
          {
            "key": "exams.delete",
            "name": "حذف آزمون",
            "description": "حذف آزمون‌ها از سیستم"
          },
          {
            "key": "exams.participate",
            "name": "شرکت در آزمون",
            "description": "شرکت در آزمون‌های منتشر شده"
          }
        ]
      },
      {
        "name": "questions",
        "displayName": "مدیریت سوالات",
        "permissions": [
          {
            "key": "questions.read",
            "name": "مشاهده سوالات",
            "description": "مشاهده بانک سوالات"
          },
          {
            "key": "questions.write",
            "name": "ایجاد/ویرایش سوال",
            "description": "ایجاد سوال جدید و ویرایش سوالات موجود"
          },
          {
            "key": "questions.delete",
            "name": "حذف سوال",
            "description": "حذف سوالات از بانک سوالات"
          }
        ]
      },
      {
        "name": "blog",
        "displayName": "مدیریت وبلاگ",
        "permissions": [
          {
            "key": "blog.read",
            "name": "مشاهده مقالات",
            "description": "مشاهده مقالات وبلاگ"
          },
          {
            "key": "blog.write",
            "name": "نوشتن مقاله",
            "description": "ایجاد و ویرایش مقالات"
          },
          {
            "key": "blog.delete",
            "name": "حذف مقاله",
            "description": "حذف مقالات از وبلاگ"
          }
        ]
      },
      {
        "name": "contact",
        "displayName": "مدیریت تماس‌ها",
        "permissions": [
          {
            "key": "contact.read",
            "name": "مشاهده پیام‌ها",
            "description": "مشاهده پیام‌های تماس"
          },
          {
            "key": "contact.write",
            "name": "پاسخ به پیام‌ها",
            "description": "پاسخ‌دهی به پیام‌های کاربران"
          },
          {
            "key": "contact.delete",
            "name": "حذف پیام",
            "description": "حذف پیام‌های تماس"
          }
        ]
      },
      {
        "name": "finance",
        "displayName": "مدیریت مالی",
        "permissions": [
          {
            "key": "finance.read",
            "name": "مشاهده گزارش‌های مالی",
            "description": "دسترسی به گزارش‌های مالی"
          },
          {
            "key": "finance.write",
            "name": "مدیریت مالی",
            "description": "ایجاد و ویرایش تراکنش‌های مالی"
          },
          {
            "key": "finance.designer.read",
            "name": "مشاهده درآمد طراح",
            "description": "مشاهده درآمد و آمار طراحان"
          }
        ]
      },
      {
        "name": "system",
        "displayName": "مدیریت سیستم",
        "permissions": [
          {
            "key": "system.settings",
            "name": "تنظیمات سیستم",
            "description": "دسترسی به تنظیمات کلی سیستم"
          },
          {
            "key": "roles.read",
            "name": "مشاهده نقش‌ها",
            "description": "مشاهده نقش‌ها و مجوزها"
          },
          {
            "key": "roles.write",
            "name": "مدیریت نقش‌ها",
            "description": "ایجاد و ویرایش نقش‌ها"
          }
        ]
      }
    ]
  },
  "message": "لیست مجوزها"
}
```

### 3. آمار داشبورد بر اساس نقش
```http
GET /api/v1/roles/dashboard-stats
```

**Headers:**
```
Authorization: Bearer <USER_TOKEN>
```

**Response (برای Admin):**
```json
{
  "success": true,
  "data": {
    "userRole": "admin",
    "dashboardType": "admin",
    "stats": {
      "totalUsers": 1273,
      "activeExams": 45,
      "totalQuestions": 2847,
      "pendingContacts": 12,
      "blogPosts": 156,
      "monthlyRevenue": 45000000,
      "systemHealth": "excellent"
    },
    "recentActivities": [
      {
        "type": "user_registration",
        "message": "کاربر جدید ثبت‌نام کرد",
        "timestamp": "2024-06-16T10:30:00Z"
      },
      {
        "type": "exam_created",
        "message": "آزمون جدید ایجاد شد",
        "timestamp": "2024-06-16T09:15:00Z"
      }
    ],
    "quickActions": [
      {
        "title": "مدیریت کاربران",
        "url": "/admin/users",
        "icon": "users"
      },
      {
        "title": "ایجاد آزمون",
        "url": "/admin/exams/create",
        "icon": "plus"
      }
    ]
  },
  "message": "آمار داشبورد مدیر"
}
```

**Response (برای Designer):**
```json
{
  "success": true,
  "data": {
    "userRole": "designer",
    "dashboardType": "designer",
    "stats": {
      "myQuestions": 234,
      "approvedQuestions": 198,
      "pendingQuestions": 36,
      "monthlyEarnings": 2500000,
      "averageRating": 4.7,
      "totalExams": 23
    },
    "recentActivities": [
      {
        "type": "question_approved",
        "message": "سوال شما تأیید شد",
        "timestamp": "2024-06-16T11:00:00Z"
      }
    ],
    "quickActions": [
      {
        "title": "ایجاد سوال جدید",
        "url": "/designer/questions/create",
        "icon": "plus"
      },
      {
        "title": "مشاهده درآمد",
        "url": "/designer/earnings",
        "icon": "money"
      }
    ]
  },
  "message": "آمار داشبورد طراح"
}
```

**Response (برای Student):**
```json
{
  "success": true,
  "data": {
    "userRole": "student",
    "dashboardType": "student",
    "stats": {
      "completedExams": 12,
      "averageScore": 78.5,
      "totalStudyTime": "45 ساعت",
      "rank": 156,
      "certificates": 3,
      "nextExam": "آزمون ریاضی - فردا"
    },
    "recentActivities": [
      {
        "type": "exam_completed",
        "message": "آزمون فیزیک را تکمیل کردید",
        "timestamp": "2024-06-16T08:30:00Z"
      }
    ],
    "quickActions": [
      {
        "title": "شروع آزمون جدید",
        "url": "/student/exams",
        "icon": "play"
      },
      {
        "title": "مشاهده نتایج",
        "url": "/student/results",
        "icon": "chart"
      }
    ]
  },
  "message": "آمار داشبورد دانش‌آموز"
}
```

---

## 🧪 **تست‌های سیستم**

### تست‌های موجود (4/4 موفق)

#### 1. تست دریافت لیست نقش‌ها
```javascript
test('should get roles list', async () => {
  const response = await request(app)
    .get('/api/v1/roles');
  
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(Array.isArray(response.body.data)).toBe(true);
  expect(response.body.data.length).toBeGreaterThan(0);
});
```

#### 2. تست دریافت لیست مجوزها
```javascript
test('should get permissions list', async () => {
  const response = await request(app)
    .get('/api/v1/roles/permissions');
  
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.categories).toBeDefined();
  expect(Array.isArray(response.body.data.categories)).toBe(true);
});
```

#### 3. تست آمار داشبورد
```javascript
test('should get dashboard stats', async () => {
  const response = await request(app)
    .get('/api/v1/roles/dashboard-stats');
  
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.stats).toBeDefined();
  expect(response.body.data.userRole).toBeDefined();
});
```

#### 4. تست مدیریت مجوزهای نقش
```javascript
test('should handle role permissions', async () => {
  const response = await request(app)
    .get('/api/v1/roles');
  
  const adminRole = response.body.data.find(role => role.name === 'admin');
  expect(adminRole).toBeDefined();
  expect(adminRole.permissions).toContain('users.read');
  expect(adminRole.permissions).toContain('system.settings');
});
```

---

## 🎯 **ماتریس نقش‌ها و مجوزها**

### جدول دسترسی‌ها

| مجوز / نقش | Admin | Designer | Student | Expert |
|------------|-------|----------|---------|--------|
| **کاربران** |
| users.read | ✅ | ❌ | ❌ | ✅ |
| users.write | ✅ | ❌ | ❌ | ❌ |
| users.delete | ✅ | ❌ | ❌ | ❌ |
| **آزمون‌ها** |
| exams.read | ✅ | ✅ | ❌ | ✅ |
| exams.write | ✅ | ✅ | ❌ | ❌ |
| exams.delete | ✅ | ❌ | ❌ | ❌ |
| exams.participate | ❌ | ❌ | ✅ | ❌ |
| **سوالات** |
| questions.read | ✅ | ✅ | ❌ | ✅ |
| questions.write | ✅ | ✅ | ❌ | ❌ |
| questions.delete | ✅ | ❌ | ❌ | ❌ |
| **وبلاگ** |
| blog.read | ✅ | ❌ | ❌ | ❌ |
| blog.write | ✅ | ❌ | ❌ | ❌ |
| blog.delete | ✅ | ❌ | ❌ | ❌ |
| **تماس** |
| contact.read | ✅ | ❌ | ❌ | ✅ |
| contact.write | ✅ | ❌ | ❌ | ✅ |
| contact.delete | ✅ | ❌ | ❌ | ❌ |
| **مالی** |
| finance.read | ✅ | ❌ | ❌ | ❌ |
| finance.write | ✅ | ❌ | ❌ | ❌ |
| finance.designer.read | ✅ | ✅ | ❌ | ❌ |
| **سیستم** |
| system.settings | ✅ | ❌ | ❌ | ❌ |
| roles.read | ✅ | ❌ | ❌ | ❌ |
| roles.write | ✅ | ❌ | ❌ | ❌ |

---

## 🔒 **امنیت و کنترل دسترسی**

### Middleware بررسی مجوز
```typescript
const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userPermissions = getRolePermissions(userRole);
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: 'دسترسی مجاز نیست',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};
```

### استفاده در Routes
```typescript
// فقط ادمین‌ها می‌توانند کاربران را حذف کنند
router.delete('/users/:id', 
  authenticateToken,
  checkPermission('users.delete'),
  deleteUser
);

// طراحان می‌توانند سوال ایجاد کنند
router.post('/questions',
  authenticateToken,
  checkPermission('questions.write'),
  createQuestion
);
```

---

## 📊 **آمار و گزارش‌گیری**

### آمار نقش‌ها
```json
{
  "roleStats": {
    "admin": {
      "count": 3,
      "percentage": 0.2,
      "lastActivity": "2024-06-16T12:00:00Z"
    },
    "designer": {
      "count": 12,
      "percentage": 0.9,
      "lastActivity": "2024-06-16T11:30:00Z"
    },
    "student": {
      "count": 1250,
      "percentage": 98.2,
      "lastActivity": "2024-06-16T12:15:00Z"
    },
    "expert": {
      "count": 8,
      "percentage": 0.6,
      "lastActivity": "2024-06-16T10:45:00Z"
    }
  }
}
```

### گزارش فعالیت‌ها
- **ورود کاربران** بر اساس نقش
- **استفاده از مجوزها** و دسترسی‌ها
- **عملکرد هر نقش** در سیستم
- **تحلیل رفتار کاربری** بر اساس نقش

---

## 🚀 **آمادگی Production**

### ✅ **چک‌لیست آمادگی**
- [x] **Role Definition** تعریف شده
- [x] **Permission System** پیاده‌سازی شده
- [x] **Access Control** اعمال شده
- [x] **Dashboard Integration** آماده
- [x] **Testing** 100% موفق
- [x] **Documentation** کامل

### 🔧 **تنظیمات Production**
1. **Database Roles**: ذخیره نقش‌ها در دیتابیس
2. **Cache Permissions**: کش کردن مجوزها برای سرعت
3. **Audit Logging**: ثبت تمام تغییرات نقش‌ها
4. **Role Hierarchy**: پیاده‌سازی سلسله مراتب
5. **Dynamic Permissions**: مجوزهای پویا

---

## 📋 **نقشه راه توسعه**

### مرحله بعدی (Frontend Integration)
- [ ] **Role-based Components**: کامپوننت‌های نقش‌محور
- [ ] **Permission Guards**: محافظ‌های دسترسی
- [ ] **Dynamic Menus**: منوهای پویا بر اساس نقش
- [ ] **Role Management UI**: رابط مدیریت نقش‌ها

### ویژگی‌های آتی
- [ ] **Custom Roles**: نقش‌های سفارشی
- [ ] **Temporary Permissions**: مجوزهای موقت
- [ ] **Role Templates**: قالب‌های نقش
- [ ] **Advanced Hierarchy**: سلسله مراتب پیشرفته

---

**آخرین به‌روزرسانی**: ۲۶ خرداد ۱۴۰۳  
**وضعیت**: ✅ **فعال و آماده استفاده**  
**مرحله بعدی**: 🎨 **پیاده‌سازی در Frontend** 