/**
 * Wallet Models and Types
 * مدل‌ها و انواع داده‌های کیف پول
 */
import { Permission } from './roles';
export declare enum TransactionType {
    CHARGE = "charge",// شارژ
    DEDUCT = "deduct",// کسر
    PURCHASE = "purchase",// خرید
    REFUND = "refund",// بازگشت وجه
    BONUS = "bonus",// جایزه
    PENALTY = "penalty"
}
export declare enum TransactionStatus {
    PENDING = "pending",// در انتظار
    COMPLETED = "completed",// تکمیل شده
    FAILED = "failed",// ناموفق
    CANCELLED = "cancelled"
}
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
export interface WalletStats {
    totalCharges: number;
    totalDeductions: number;
    pendingTransactions: number;
    netAmount: number;
}
export interface ChargeRequest {
    userId: string;
    amount: number;
    description: string;
    type: TransactionType.CHARGE | TransactionType.BONUS;
}
export interface DeductRequest {
    userId: string;
    amount: number;
    description: string;
    type: TransactionType.DEDUCT | TransactionType.PURCHASE | TransactionType.PENALTY;
}
export interface RefundRequest {
    transactionId: string;
    amount?: number;
    reason: string;
}
export interface BulkWalletOperation {
    userId: string;
    amount: number;
    type: TransactionType;
    description: string;
}
export interface TransactionFilters {
    page?: number;
    limit?: number;
    userId?: string;
    type?: TransactionType;
    status?: TransactionStatus;
    startDate?: string;
    endDate?: string;
}
export interface WalletAnalytics {
    period: string;
    startDate: Date;
    endDate: Date;
    summary: {
        totalTransactions: number;
        totalAmount: number;
        charges: {
            count: number;
            amount: number;
        };
        deductions: {
            count: number;
            amount: number;
        };
        refunds: {
            count: number;
            amount: number;
        };
    };
    byType: Array<{
        _id: TransactionType;
        totalAmount: number;
        count: number;
        avgAmount: number;
    }>;
}
export interface UserWalletBalance {
    userId: string;
    balance: number;
    userName: string;
    userEmail: string;
}
export interface TransactionResponse {
    transactions: WalletTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
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
export declare function hasPermission(userPermissions: Permission[], permission: Permission): boolean;
export declare function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean;
export declare function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean;
export declare const TRANSACTION_TYPE_DISPLAY_NAMES: Record<TransactionType, string>;
export declare const TRANSACTION_STATUS_DISPLAY_NAMES: Record<TransactionStatus, string>;
export declare const TRANSACTION_TYPE_COLORS: Record<TransactionType, string>;
export declare const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string>;
export declare function validateChargeRequest(request: ChargeRequest): string[];
export declare function validateDeductRequest(request: DeductRequest): string[];
export declare function validateRefundRequest(request: RefundRequest): string[];
export declare function formatCurrency(amount: number): string;
export declare function getTransactionTypeDisplayName(type: TransactionType): string;
export declare function getTransactionStatusDisplayName(status: TransactionStatus): string;
export declare function getTransactionTypeColor(type: TransactionType): string;
export declare function getTransactionStatusColor(status: TransactionStatus): string;
export declare function isChargeType(type: TransactionType): boolean;
export declare function isDeductType(type: TransactionType): boolean;
export declare const DEFAULT_TRANSACTION_FILTERS: TransactionFilters;
export declare const DEFAULT_WALLET_STATS: WalletStats;
export declare const MAX_TRANSACTION_AMOUNT = 100000000;
export declare const MIN_TRANSACTION_AMOUNT = 1000;
export declare const MAX_DESCRIPTION_LENGTH = 500;
export declare const MAX_EXPORT_RECORDS = 10000;
export declare const MAX_BULK_OPERATIONS = 100;
