# API Documentation - Exam-Edu Backend

## Overview

This document provides comprehensive documentation for all API endpoints in the Exam-Edu backend system. The API follows RESTful conventions and uses JSON for data exchange.

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://your-domain.com/api/v1
```

## API Documentation UI

Interactive API documentation is available at:
```
Development: http://localhost:5000/api-docs
Production: https://your-domain.com/api-docs
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## New Routes Added

The following new routes have been added and are fully functional:

### 🚀 Contact Management Routes (`/api/v1/contact`)
- **GET** `/` - List contacts with pagination and filtering
- **POST** `/` - Create new contact
- **GET** `/:id` - Get contact by ID
- **PUT** `/:id` - Update contact
- **DELETE** `/:id` - Delete contact
- **GET** `/search` - Advanced contact search

### 📊 Performance Monitoring Routes (`/api/v1/performance`)
- **GET** `/overview` - System performance overview
- **GET** `/metrics` - Detailed performance metrics
- **GET** `/database` - Database performance statistics
- **GET** `/memory` - Memory usage statistics
- **GET** `/health` - System health check

### 🧪 A/B Testing Routes (`/api/v1/ab-test`)
- **GET** `/experiments` - List all experiments
- **POST** `/experiments` - Create new experiment
- **GET** `/experiments/:id` - Get experiment details
- **PUT** `/experiments/:id` - Update experiment
- **DELETE** `/experiments/:id` - Delete experiment
- **POST** `/experiments/:id/start` - Start experiment
- **POST** `/experiments/:id/stop` - Stop experiment
- **GET** `/experiments/:id/results` - Get experiment results
- **GET** `/stats` - A/B testing statistics
- **POST** `/assign` - Assign user to variant
- **POST** `/track` - Track conversion event
- **GET** `/active` - Get active experiments

### 🗃️ Cache Management Routes (`/api/v1/cache`)
- **GET** `/stats` - Cache statistics and overview
- **POST** `/clear` - Clear specific cache
- **POST** `/clear-all` - Clear all caches
- **GET** `/keys` - List cache keys
- **GET** `/memory` - Cache memory usage
- **GET** `/performance` - Cache performance metrics

### ⚡ Scalability Routes (`/api/v1/scalability`)
- **GET** `/overview` - Database scalability overview
- **GET** `/indexes` - List database indexes
- **POST** `/indexes` - Create new index
- **DELETE** `/indexes/:id` - Delete index
- **GET** `/suggestions` - Optimization suggestions
- **POST** `/suggestions/:id/implement` - Implement suggestion
- **POST** `/suggestions/:id/reject` - Reject suggestion
- **POST** `/suggestions/generate` - Generate new suggestions
- **GET** `/metrics` - Performance metrics

### 💬 Parse Server Integration

Parse Server is now integrated and accessible at:
```
http://localhost:1337/parse
```

Parse Dashboard (if enabled) available at:
```
http://localhost:1337/dashboard
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "error": {} // Error details (if applicable)
}
```

## Security Features

### Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per minute  
- Contact endpoints: 50 requests per 15 minutes

### JWT Authentication
- Token expires in 24 hours
- Supports both header and cookie authentication
- Automatic token refresh on valid requests

### CORS Configuration
- Configured for frontend domains
- Supports credentials
- Methods: GET, POST, PUT, DELETE, OPTIONS

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional, defaults to "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت ثبت نام شد",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ورود موفقیت‌آمیز",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "خروج موفقیت‌آمیز"
}
```

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ایمیل بازیابی ارسال شد"
}
```

### POST /auth/reset-password
Reset password using token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "رمز عبور با موفقیت تغییر یافت"
}
```

---

## User Management Endpoints

### GET /users/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "avatar": "new_avatar_url"
}
```

### GET /users (Admin only)
Get all users with pagination.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role
- `search` (string): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

---

## Exam Management Endpoints

### GET /exams
Get all available exams.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "exams": [
      {
        "id": "exam_id",
        "title": "Math Test",
        "description": "Basic math exam",
        "category": "mathematics",
        "difficulty": "medium",
        "duration": 3600,
        "totalQuestions": 20,
        "passingScore": 70,
        "isActive": true
      }
    ],
    "pagination": {...}
  }
}
```

### GET /exams/:id
Get specific exam details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "exam_id",
    "title": "Math Test",
    "description": "Basic math exam",
    "instructions": "Read carefully...",
    "category": "mathematics",
    "difficulty": "medium",
    "duration": 3600,
    "totalQuestions": 20,
    "passingScore": 70,
    "questions": [...] // Only included when starting exam
  }
}
```

### POST /exams (Admin only)
Create new exam.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "New Exam",
  "description": "Exam description",
  "category": "science",
  "difficulty": "hard",
  "duration": 7200,
  "passingScore": 80,
  "questions": ["question_id1", "question_id2"]
}
```

### PUT /exams/:id (Admin only)
Update exam.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** Same as POST /exams

### DELETE /exams/:id (Admin only)
Delete exam.

**Headers:** `Authorization: Bearer <admin_token>`

---

## Question Bank Endpoints

### GET /questions (Admin only)
Get all questions with filtering.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty
- `type` (string): Filter by question type
- `page` (number): Page number
- `limit` (number): Items per page

### POST /questions (Admin only)
Create new question.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "text": "What is 2 + 2?",
  "type": "multiple_choice",
  "category": "mathematics",
  "difficulty": "easy",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false }
  ],
  "explanation": "Basic addition",
  "points": 1
}
```

---

## Results and Analytics Endpoints

### GET /results/user/:userId
Get user's exam results.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "result_id",
      "exam": {
        "id": "exam_id",
        "title": "Math Test"
      },
      "score": 85,
      "percentage": 85,
      "isPassed": true,
      "completedAt": "2024-01-01T00:00:00.000Z",
      "duration": 1800
    }
  ]
}
```

### GET /results/exam/:examId/user/:userId
Get specific exam result for user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "result_id",
    "score": 85,
    "percentage": 85,
    "correctAnswers": 17,
    "incorrectAnswers": 3,
    "unansweredQuestions": 0,
    "answers": [
      {
        "questionId": "q1",
        "selectedAnswer": "option_b",
        "isCorrect": true,
        "timeSpent": 45
      }
    ],
    "analytics": {
      "averageTimePerQuestion": 90,
      "categoryPerformance": [...]
    }
  }
}
```

### GET /results/analytics/exam/:examId (Admin only)
Get exam analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAttempts": 150,
    "averageScore": 78.5,
    "passRate": 0.82,
    "averageDuration": 2100,
    "scoreDistribution": [...],
    "questionAnalytics": [...],
    "recentActivity": [...]
  }
}
```

### GET /results/analytics/overall (Admin only)
Get overall system analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `dateRange` (string): Date range (e.g., "30d", "7d")

**Response:**
```json
{
  "success": true,
  "data": {
    "totalExams": 25,
    "totalAttempts": 1250,
    "totalUsers": 300,
    "averageScore": 76.8,
    "popularExams": [...],
    "recentActivity": [...],
    "topPerformers": [...]
  }
}
```

### POST /results/export (Admin only)
Export exam results.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "examId": "exam_id",
  "format": "csv", // or "json"
  "includeAnswers": true
}
```

**Response:** CSV or JSON file download

---

## Payment System Endpoints

### GET /payments/wallet
Get user's wallet information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 50000,
    "currency": "IRR",
    "transactions": [...]
  }
}
```

### POST /payments/charge
Charge wallet.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 100000,
  "description": "Wallet charge"
}
```

### GET /payments/transactions
Get payment transactions.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status

---

## Support Ticket Endpoints

### GET /tickets
Get user's support tickets.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ticket_id",
      "subject": "Login Issue",
      "description": "Cannot login to account",
      "status": "open",
      "priority": "medium",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "responses": [...]
    }
  ]
}
```

### POST /tickets
Create new support ticket.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject": "Technical Issue",
  "description": "Detailed description of the issue",
  "priority": "high",
  "category": "technical"
}
```

---

## Blog Management Endpoints

### GET /blog/posts
Get published blog posts.

**Query Parameters:**
- `category` (string): Filter by category
- `search` (string): Search in title and content
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "Blog Post Title",
        "slug": "blog-post-title",
        "excerpt": "Post excerpt...",
        "content": "Full content...",
        "author": {
          "name": "Author Name"
        },
        "category": {
          "name": "Category Name"
        },
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "readTime": 5
      }
    ],
    "pagination": {...}
  }
}
```

### GET /blog/posts/:slug
Get specific blog post by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post_id",
    "title": "Blog Post Title",
    "content": "Full content...",
    "author": {...},
    "category": {...},
    "tags": [...],
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "comments": [...]
  }
}
```

### POST /blog/posts (Admin only)
Create new blog post.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Post content...",
  "excerpt": "Post excerpt...",
  "categoryId": "category_id",
  "tags": ["tag1", "tag2"],
  "status": "published",
  "featuredImage": "image_url"
}
```

---

## File Upload Endpoints

### POST /upload/image
Upload image file.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
- `image` (file): Image file (PNG, JPG, JPEG, max 5MB)
- `type` (string): Upload type ("avatar", "blog", "lesson")

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

---

## Pagination

Paginated endpoints support these query parameters:

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Searching

Many endpoints support filtering and searching:

- Use query parameters for filtering (e.g., `?category=math&difficulty=easy`)
- Use `search` parameter for text search
- Use `dateFrom` and `dateTo` for date range filtering

## WebSocket Events (Future Implementation)

Real-time events will be implemented using WebSocket:

- `exam:started` - User started an exam
- `exam:completed` - User completed an exam
- `ticket:updated` - Support ticket status changed
- `notification:new` - New notification for user

---

## Error Handling

Common error responses:

### Validation Error (422)
```json
{
  "success": false,
  "message": "خطای اعتبارسنجی",
  "errors": [
    {
      "field": "email",
      "message": "ایمیل معتبر نیست"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "دسترسی غیرمجاز"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "منبع یافت نشد"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "خطای داخلی سرور"
}
```

---

## Development Notes

- All dates are in ISO 8601 format
- All text responses support Persian (RTL) content
- File uploads are processed asynchronously
- Database queries are optimized with proper indexing
- All endpoints include proper error handling and logging

For more information or support, contact the development team.
