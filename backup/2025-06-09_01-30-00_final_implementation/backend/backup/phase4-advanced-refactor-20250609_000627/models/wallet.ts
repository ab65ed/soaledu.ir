/**
 * Wallet Models and Types
 * مدل‌ها و انواع داده‌های کیف پول
 */

import { Permission } from './roles';

// Transaction Types
export enum TransactionType {
  CHARGE = 'charge',      // شارژ
  DEDUCT = 'deduct',      // کسر
  PURCHASE = 'purchase',  // خرید
  REFUND = 'refund',      // بازگشت وجه
  BONUS = 'bonus',        // جایزه
  PENALTY = 'penalty'     // جریمه
}

// Transaction Status
export enum TransactionStatus {
  PENDING = 'pending',       // در انتظار
  COMPLETED = 'completed',   // تکمیل شده
  FAILED = 'failed',         // ناموفق
  CANCELLED = 'cancelled'    // لغو شده
}

// Wallet Transaction Interface
export interface WalletTransaction {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  processedBy?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Wallet Statistics Interface
export interface WalletStats {
  totalCharges: number;
  totalDeductions: number;
  pendingTransactions: number;
  netAmount: number;
}

// Charge Request Interface
export interface ChargeRequest {
  userId: string;
  amount: number;
  description: string;
  type: TransactionType.CHARGE | TransactionType.BONUS;
}

// Deduct Request Interface
export interface DeductRequest {
  userId: string;
  amount: number;
  description: string;
  type: TransactionType.DEDUCT | TransactionType.PURCHASE | TransactionType.PENALTY;
}

// Refund Request Interface
export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
}

// Bulk Operation Interface
export interface BulkWalletOperation {
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
}

// Transaction Filters Interface
export interface TransactionFilters {
  page?: number;
  limit?: number;
  userId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
}

// Wallet Analytics Interface
export interface WalletAnalytics {
  period: string;
  startDate: Date;
  endDate: Date;
  summary: {
    totalTransactions: number;
    totalAmount: number;
    charges: { count: number; amount: number };
    deductions: { count: number; amount: number };
    refunds: { count: number; amount: number };
  };
  byType: Array<{
    _id: TransactionType;
    totalAmount: number;
    count: number;
    avgAmount: number;
  }>;
}

// User Wallet Balance Interface
export interface UserWalletBalance {
  userId: string;
  balance: number;
  userName: string;
  userEmail: string;
}

// Transaction Response Interface
export interface TransactionResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Bulk Operation Result Interface
export interface BulkOperationResult {
  successful: Array<{
    userId: string;
    transactionId: string;
    type: TransactionType;
    amount: number;
    newBalance: number;
  }>;
  failed: Array<{
    userId: string;
    error: string;
    currentBalance?: number;
    requestedAmount?: number;
  }>;
  totalProcessed: number;
}

// Export Data Interface
export interface ExportData {
  'شناسه تراکنش': string;
  'شناسه کاربر': string;
  'نام کاربر': string;
  'ایمیل کاربر': string;
  'نوع تراکنش': TransactionType;
  'مبلغ (تومان)': number;
  'توضیحات': string;
  'وضعیت': TransactionStatus;
  'تاریخ ایجاد': string;
  'تاریخ به‌روزرسانی': string;
}

// Wallet Permission Helper Functions
export function hasPermission(userPermissions: Permission[], permission: Permission): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
  return permissions.some(permission => userPermissions.includes(permission));
}

export function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean {
  return permissions.every(permission => userPermissions.includes(permission));
}

// Transaction Type Display Names
export const TRANSACTION_TYPE_DISPLAY_NAMES: Record<TransactionType, string> = {
  [TransactionType.CHARGE]: 'شارژ',
  [TransactionType.DEDUCT]: 'کسر',
  [TransactionType.PURCHASE]: 'خرید',
  [TransactionType.REFUND]: 'بازگشت وجه',
  [TransactionType.BONUS]: 'جایزه',
  [TransactionType.PENALTY]: 'جریمه'
};

// Transaction Status Display Names
export const TRANSACTION_STATUS_DISPLAY_NAMES: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'در انتظار',
  [TransactionStatus.COMPLETED]: 'تکمیل شده',
  [TransactionStatus.FAILED]: 'ناموفق',
  [TransactionStatus.CANCELLED]: 'لغو شده'
};

// Transaction Type Colors
export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  [TransactionType.CHARGE]: 'text-green-600 bg-green-100',
  [TransactionType.BONUS]: 'text-green-600 bg-green-100',
  [TransactionType.DEDUCT]: 'text-red-600 bg-red-100',
  [TransactionType.PURCHASE]: 'text-blue-600 bg-blue-100',
  [TransactionType.PENALTY]: 'text-red-600 bg-red-100',
  [TransactionType.REFUND]: 'text-yellow-600 bg-yellow-100'
};

// Transaction Status Colors
export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
  [TransactionStatus.COMPLETED]: 'text-green-600 bg-green-100',
  [TransactionStatus.FAILED]: 'text-red-600 bg-red-100',
  [TransactionStatus.CANCELLED]: 'text-gray-600 bg-gray-100'
};

// Validation Functions
export function validateChargeRequest(request: ChargeRequest): string[] {
  const errors: string[] = [];

  if (!request.userId || request.userId.trim() === '') {
    errors.push('شناسه کاربر الزامی است');
  }

  if (!request.amount || request.amount <= 0) {
    errors.push('مبلغ باید بیشتر از صفر باشد');
  }

  if (request.amount > 100000000) {
    errors.push('مبلغ نمی‌تواند بیشتر از 100 میلیون تومان باشد');
  }

  if (!request.description || request.description.trim() === '') {
    errors.push('توضیحات الزامی است');
  }

  if (request.description && request.description.length > 500) {
    errors.push('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد');
  }

  if (!Object.values([TransactionType.CHARGE, TransactionType.BONUS]).includes(request.type)) {
    errors.push('نوع تراکنش برای شارژ معتبر نیست');
  }

  return errors;
}

export function validateDeductRequest(request: DeductRequest): string[] {
  const errors: string[] = [];

  if (!request.userId || request.userId.trim() === '') {
    errors.push('شناسه کاربر الزامی است');
  }

  if (!request.amount || request.amount <= 0) {
    errors.push('مبلغ باید بیشتر از صفر باشد');
  }

  if (request.amount > 100000000) {
    errors.push('مبلغ نمی‌تواند بیشتر از 100 میلیون تومان باشد');
  }

  if (!request.description || request.description.trim() === '') {
    errors.push('توضیحات الزامی است');
  }

  if (request.description && request.description.length > 500) {
    errors.push('توضیحات نمی‌تواند بیشتر از 500 کاراکتر باشد');
  }

  if (!Object.values([TransactionType.DEDUCT, TransactionType.PURCHASE, TransactionType.PENALTY]).includes(request.type)) {
    errors.push('نوع تراکنش برای کسر معتبر نیست');
  }

  return errors;
}

export function validateRefundRequest(request: RefundRequest): string[] {
  const errors: string[] = [];

  if (!request.transactionId || request.transactionId.trim() === '') {
    errors.push('شناسه تراکنش الزامی است');
  }

  if (request.amount && request.amount <= 0) {
    errors.push('مبلغ بازگشت باید بیشتر از صفر باشد');
  }

  if (!request.reason || request.reason.trim() === '') {
    errors.push('دلیل بازگشت وجه الزامی است');
  }

  if (request.reason && request.reason.length > 500) {
    errors.push('دلیل بازگشت وجه نمی‌تواند بیشتر از 500 کاراکتر باشد');
  }

  return errors;
}

// Utility Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export function getTransactionTypeDisplayName(type: TransactionType): string {
  return TRANSACTION_TYPE_DISPLAY_NAMES[type] || type;
}

export function getTransactionStatusDisplayName(status: TransactionStatus): string {
  return TRANSACTION_STATUS_DISPLAY_NAMES[status] || status;
}

export function getTransactionTypeColor(type: TransactionType): string {
  return TRANSACTION_TYPE_COLORS[type] || 'text-gray-600 bg-gray-100';
}

export function getTransactionStatusColor(status: TransactionStatus): string {
  return TRANSACTION_STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
}

export function isChargeType(type: TransactionType): boolean {
  return [TransactionType.CHARGE, TransactionType.BONUS, TransactionType.REFUND].includes(type);
}

export function isDeductType(type: TransactionType): boolean {
  return [TransactionType.DEDUCT, TransactionType.PURCHASE, TransactionType.PENALTY].includes(type);
}

// Default Values
export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  page: 1,
  limit: 20
};

export const DEFAULT_WALLET_STATS: WalletStats = {
  totalCharges: 0,
  totalDeductions: 0,
  pendingTransactions: 0,
  netAmount: 0
};

// Constants
export const MAX_TRANSACTION_AMOUNT = 100000000; // 100 million tomans
export const MIN_TRANSACTION_AMOUNT = 1000; // 1000 tomans
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_EXPORT_RECORDS = 10000;
export const MAX_BULK_OPERATIONS = 100; 