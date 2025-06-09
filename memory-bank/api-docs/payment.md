# Payment System API Documentation

## Overview
The Payment System API provides comprehensive payment processing capabilities for the Exam-Edu platform, including ZarinPal integration, discount code validation, transaction management, and admin monitoring.

## Base URL
```
Production: https://api.exam-edu.com/api/payment
Development: http://localhost:5000/api/payment
```

## Authentication
All endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Initiate Payment

**POST** `/initiate`

Initiates a new payment transaction with ZarinPal gateway.

#### Request Body
```json
{
  "amount": 100000,
  "discountCode": "SAVE20"
}
```

#### Parameters
- `amount` (number, required): Payment amount in Tomans (min: 1000, max: 10000000)
- `discountCode` (string, optional): Discount code to apply

#### Response
```json
{
  "success": true,
  "data": {
    "paymentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "authority": "A00000000000000000000000000123456789",
    "gatewayUrl": "https://sandbox.zarinpal.com/pg/StartPay/A00000000000000000000000000123456789",
    "amount": 80000,
    "originalAmount": 100000,
    "discountAmount": 20000,
    "discountCode": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "code": "SAVE20"
    }
  }
}
```

#### Error Responses
```json
{
  "success": false,
  "message": "کد تخفیف نامعتبر است",
  "code": "INVALID_DISCOUNT_CODE"
}
```

### 2. Payment Callback

**GET** `/callback`

Handles ZarinPal payment callback and verifies transaction.

#### Query Parameters
- `Authority` (string, required): ZarinPal authority code
- `Status` (string, required): Payment status from ZarinPal
- `payment_id` (string, required): Internal payment ID

#### Response
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "refId": "123456789",
    "amount": 100000,
    "paymentId": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

### 3. Validate Discount Code

**POST** `/validate-discount`

Validates a discount code and calculates discount amount.

#### Request Body
```json
{
  "code": "SAVE20",
  "amount": 100000
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "discountCode": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "code": "SAVE20",
      "type": "percentage",
      "value": 20
    },
    "originalAmount": 100000,
    "discountAmount": 20000,
    "finalAmount": 80000
  }
}
```

### 4. Get Payment Status

**GET** `/status/:paymentId`

Retrieves current status of a payment transaction.

#### Parameters
- `paymentId` (string, required): Payment transaction ID

#### Response
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "completed",
    "amount": 100000,
    "authority": "A00000000000000000000000000123456789",
    "refId": "123456789",
    "createdAt": "2023-09-15T10:30:00.000Z",
    "completedAt": "2023-09-15T10:32:15.000Z"
  }
}
```

### 5. Get User Transactions

**GET** `/transactions`

Retrieves paginated list of user's payment transactions.

#### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 50)
- `status` (string, optional): Filter by status (pending, completed, failed, refunded)
- `type` (string, optional): Filter by type (wallet_charge, exam_purchase)
- `startDate` (string, optional): Start date filter (ISO format)
- `endDate` (string, optional): End date filter (ISO format)

#### Response
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "amount": 100000,
        "originalAmount": 120000,
        "discountAmount": 20000,
        "status": "completed",
        "type": "wallet_charge",
        "description": "شارژ کیف پول",
        "authority": "A00000000000000000000000000123456789",
        "refId": "123456789",
        "discountCode": {
          "code": "SAVE20"
        },
        "createdAt": "2023-09-15T10:30:00.000Z",
        "completedAt": "2023-09-15T10:32:15.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 6. Admin: Get All Transactions

**GET** `/admin/transactions`

Retrieves all payment transactions for admin monitoring (Admin only).

#### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `status` (string, optional): Filter by status
- `userId` (string, optional): Filter by user ID
- `startDate` (string, optional): Start date filter
- `endDate` (string, optional): End date filter
- `minAmount` (number, optional): Minimum amount filter
- `maxAmount` (number, optional): Maximum amount filter

#### Response
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "user": {
          "id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "احمد محمدی",
          "email": "ahmad@example.com"
        },
        "amount": 100000,
        "originalAmount": 120000,
        "discountAmount": 20000,
        "status": "completed",
        "type": "wallet_charge",
        "description": "شارژ کیف پول",
        "authority": "A00000000000000000000000000123456789",
        "refId": "123456789",
        "discountCode": {
          "code": "SAVE20"
        },
        "createdAt": "2023-09-15T10:30:00.000Z",
        "completedAt": "2023-09-15T10:32:15.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    },
    "statistics": {
      "totalAmount": 15000000,
      "totalTransactions": 150,
      "successfulTransactions": 142,
      "failedTransactions": 8,
      "successRate": 94.67,
      "averageAmount": 100000
    }
  }
}
```

### 7. Admin: Refund Payment

**POST** `/admin/refund/:paymentId`

Processes a refund for a completed payment (Admin only).

#### Parameters
- `paymentId` (string, required): Payment transaction ID

#### Request Body
```json
{
  "reason": "درخواست کاربر",
  "amount": 50000
}
```

#### Parameters
- `reason` (string, required): Refund reason
- `amount` (number, optional): Partial refund amount (default: full amount)

#### Response
```json
{
  "success": true,
  "data": {
    "refundId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "originalPaymentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "refundAmount": 50000,
    "status": "processing",
    "reason": "درخواست کاربر",
    "processedBy": "64f8a1b2c3d4e5f6a7b8c9d4",
    "createdAt": "2023-09-15T15:30:00.000Z"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_AMOUNT` | مبلغ نامعتبر است |
| `INVALID_DISCOUNT_CODE` | کد تخفیف نامعتبر است |
| `DISCOUNT_EXPIRED` | کد تخفیف منقضی شده است |
| `DISCOUNT_LIMIT_EXCEEDED` | کد تخفیف به حد مجاز رسیده است |
| `PAYMENT_NOT_FOUND` | تراکنش پیدا نشد |
| `PAYMENT_ALREADY_PROCESSED` | تراکنش قبلاً پردازش شده است |
| `GATEWAY_ERROR` | خطا در درگاه پرداخت |
| `INSUFFICIENT_PERMISSIONS` | دسترسی کافی ندارید |
| `REFUND_NOT_ALLOWED` | امکان بازگشت وجه وجود ندارد |

## Rate Limiting
- Payment initiation: 10 requests per minute per user
- Discount validation: 20 requests per minute per user
- Transaction queries: 100 requests per minute per user
- Admin endpoints: 200 requests per minute per admin

## Webhooks

### Payment Status Update
When a payment status changes, a webhook is sent to the configured endpoint:

```json
{
  "event": "payment.status_updated",
  "data": {
    "paymentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "status": "completed",
    "amount": 100000,
    "timestamp": "2023-09-15T10:32:15.000Z"
  }
}
```

## Testing

### Sandbox Credentials
```
Merchant ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Sandbox URL: https://sandbox.zarinpal.com/pg/rest/WebGate/
```

### Test Cards
- Successful payment: 4444-4444-4444-4444
- Failed payment: 4000-0000-0000-0002

### Test Discount Codes
- `TEST20`: 20% discount, max 10,000 Tomans
- `SAVE50`: 50,000 Tomans fixed discount
- `EXPIRED`: Expired discount code for testing
