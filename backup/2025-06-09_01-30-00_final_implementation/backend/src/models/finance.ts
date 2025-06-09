import Parse from 'parse/node';
import { z } from 'zod';

// Types and Enums
export enum TransactionType {
  EXAM_PURCHASE = 'EXAM_PURCHASE',
  FLASHCARD_PURCHASE = 'FLASHCARD_PURCHASE', 
  DESIGNER_EARNING = 'DESIGNER_EARNING',
  WITHDRAWAL_REQUEST = 'WITHDRAWAL_REQUEST',
  WITHDRAWAL_APPROVED = 'WITHDRAWAL_APPROVED',
  WITHDRAWAL_REJECTED = 'WITHDRAWAL_REJECTED'
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED'
}

export enum PaymentMethod {
  IBAN = 'IBAN',
  CARD = 'CARD',
  WALLET = 'WALLET'
}

export enum NotificationFrequency {
  DISABLED = 'DISABLED',
  EVERY_6_HOURS = 'EVERY_6_HOURS',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

// Interfaces
export interface PricingConfig {
  examPricing: {
    '10-20': number; // 800 تومان
    '21-30': number; // 1000 تومان
    '31-50': number; // 1200 تومان
  };
  flashcardPricing: {
    defaultPrice: number; // 200 تومان
    minPrice: number; // 100 تومان
    maxPrice: number; // 500 تومان
  };
  designerShare: number; // 55% سود طراح
  platformFee: number; // 45% کارمزد پلتفرم
}

export interface WalletData {
  userId: string;
  balance: number; // موجودی کیف پول
  totalEarnings: number; // کل درآمد
  totalWithdrawals: number; // کل برداشت‌ها
  pendingWithdrawals: number; // برداشت‌های در انتظار
  lastUpdated: Date;
  freezeAmount: number; // مبلغ مسدود شده
  availableBalance: number; // موجودی قابل برداشت
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  accountDetails: BankAccountDetails | CardDetails;
  status: WithdrawalStatus;
  requestDate: Date;
  processedDate?: Date;
  description?: string;
  rejectionReason?: string;
  adminNotes?: string;
  trackingNumber?: string;
}

export interface BankAccountDetails {
  accountHolderName: string;
  iban: string;
  bankName: string;
  accountNumber?: string;
}

export interface CardDetails {
  cardHolderName: string;
  cardNumber: string; // رمزگذاری شده
  bankName: string;
}

export interface TransactionData {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  referenceId?: string; // آیدی آزمون یا فلش‌کارت
  designerId?: string; // آیدی طراح (در صورت وجود)
  designerShare?: number; // سهم طراح
  platformFee?: number; // کارمزد پلتفرم
  date: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  metadata?: Record<string, any>;
}

export interface FinancialReport {
  userId: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: Date;
  endDate: Date;
  totalEarnings: number;
  totalWithdrawals: number;
  transactionCount: number;
  topSellingItems: Array<{
    itemId: string;
    itemType: 'EXAM' | 'FLASHCARD';
    itemTitle: string;
    sales: number;
    revenue: number;
  }>;
  dailyEarnings: Array<{
    date: string;
    amount: number;
  }>;
}

export interface NotificationSettings {
  userId: string;
  withdrawalNotifications: boolean;
  earningNotifications: boolean;
  frequency: NotificationFrequency;
  lastNotificationSent?: Date;
  email?: string;
  pushNotifications: boolean;
}

// Validation Schemas
export const PricingConfigSchema = z.object({
  examPricing: z.object({
    '10-20': z.number().min(0),
    '21-30': z.number().min(0),
    '31-50': z.number().min(0)
  }),
  flashcardPricing: z.object({
    defaultPrice: z.number().min(0),
    minPrice: z.number().min(0),
    maxPrice: z.number().min(0)
  }),
  designerShare: z.number().min(0).max(100),
  platformFee: z.number().min(0).max(100)
});

export const WithdrawalRequestSchema = z.object({
  amount: z.number().min(1000, 'حداقل مبلغ برداشت 1000 تومان است'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  accountDetails: z.union([
    z.object({
      accountHolderName: z.string().min(2, 'نام صاحب حساب الزامی است'),
      iban: z.string().regex(/^IR[0-9]{24}$/, 'شماره شبا نامعتبر است'),
      bankName: z.string().min(2, 'نام بانک الزامی است'),
      accountNumber: z.string().optional()
    }),
    z.object({
      cardHolderName: z.string().min(2, 'نام صاحب کارت الزامی است'),
      cardNumber: z.string().regex(/^[0-9]{16}$/, 'شماره کارت نامعتبر است'),
      bankName: z.string().min(2, 'نام بانک الزامی است')
    })
  ]),
  description: z.string().optional()
});

export const TransactionSchema = z.object({
  userId: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  amount: z.number().min(0),
  description: z.string().min(1),
  referenceId: z.string().optional(),
  designerId: z.string().optional(),
  designerShare: z.number().optional(),
  platformFee: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

export const NotificationSettingsSchema = z.object({
  withdrawalNotifications: z.boolean().default(true),
  earningNotifications: z.boolean().default(true),
  frequency: z.nativeEnum(NotificationFrequency).default(NotificationFrequency.EVERY_6_HOURS),
  email: z.string().email().optional(),
  pushNotifications: z.boolean().default(true)
});

// Utility Functions
export function calculateDesignerEarning(totalAmount: number, designerShare: number = 55): number {
  return Math.round(totalAmount * (designerShare / 100));
}

export function calculatePlatformFee(totalAmount: number, platformFee: number = 45): number {
  return Math.round(totalAmount * (platformFee / 100));
}

export function getExamPrice(questionCount: number): number {
  if (questionCount >= 10 && questionCount <= 20) return 800;
  if (questionCount >= 21 && questionCount <= 30) return 1000;
  if (questionCount >= 31 && questionCount <= 50) return 1200;
  return 800; // پیش‌فرض
}

export function getFlashcardPrice(customPrice?: number): number {
  const defaultPrice = 200;
  const minPrice = 100;
  const maxPrice = 500;
  
  if (customPrice && customPrice >= minPrice && customPrice <= maxPrice) {
    return customPrice;
  }
  return defaultPrice;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function generateTrackingNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `WD${timestamp.slice(-6)}${random}`.toUpperCase();
}

export function canRequestWithdrawal(wallet: WalletData, requestAmount: number): boolean {
  return wallet.availableBalance >= requestAmount && requestAmount >= 1000;
}

export function shouldSendNotification(settings: NotificationSettings): boolean {
  if (settings.frequency === NotificationFrequency.DISABLED) return false;
  
  if (!settings.lastNotificationSent) return true;
  
  const now = new Date();
  const lastSent = new Date(settings.lastNotificationSent);
  const diffHours = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
  
  switch (settings.frequency) {
    case NotificationFrequency.EVERY_6_HOURS:
      return diffHours >= 6;
    case NotificationFrequency.DAILY:
      return diffHours >= 24;
    case NotificationFrequency.WEEKLY:
      return diffHours >= 168;
    default:
      return false;
  }
}

// Constants
export const DEFAULT_PRICING: PricingConfig = {
  examPricing: {
    '10-20': 800,
    '21-30': 1000,
    '31-50': 1200
  },
  flashcardPricing: {
    defaultPrice: 200,
    minPrice: 100,
    maxPrice: 500
  },
  designerShare: 50,
  platformFee: 50
};

export const WITHDRAWAL_LIMITS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 10000000, // 10 میلیون تومان
  DAILY_LIMIT: 5000000, // 5 میلیون تومان در روز
  MONTHLY_LIMIT: 50000000 // 50 میلیون تومان در ماه
};

// Parse Classes (اختیاری - برای مدیریت Parse Objects)
export class WalletClass extends Parse.Object {
  constructor() {
    super('Wallet');
  }

  get userId(): string { return this.get('userId'); }
  set userId(value: string) { this.set('userId', value); }

  get balance(): number { return this.get('balance') || 0; }
  set balance(value: number) { this.set('balance', value); }

  get totalEarnings(): number { return this.get('totalEarnings') || 0; }
  set totalEarnings(value: number) { this.set('totalEarnings', value); }

  get totalWithdrawals(): number { return this.get('totalWithdrawals') || 0; }
  set totalWithdrawals(value: number) { this.set('totalWithdrawals', value); }

  get pendingWithdrawals(): number { return this.get('pendingWithdrawals') || 0; }
  set pendingWithdrawals(value: number) { this.set('pendingWithdrawals', value); }

  get freezeAmount(): number { return this.get('freezeAmount') || 0; }
  set freezeAmount(value: number) { this.set('freezeAmount', value); }

  get availableBalance(): number { 
    return this.balance - this.freezeAmount - this.pendingWithdrawals; 
  }
}

export class WithdrawalRequestClass extends Parse.Object {
  constructor() {
    super('WithdrawalRequest');
  }

  get userId(): string { return this.get('userId'); }
  set userId(value: string) { this.set('userId', value); }

  get amount(): number { return this.get('amount'); }
  set amount(value: number) { this.set('amount', value); }

  get paymentMethod(): PaymentMethod { return this.get('paymentMethod'); }
  set paymentMethod(value: PaymentMethod) { this.set('paymentMethod', value); }

  get status(): WithdrawalStatus { return this.get('status'); }
  set status(value: WithdrawalStatus) { this.set('status', value); }

  get trackingNumber(): string { return this.get('trackingNumber'); }
  set trackingNumber(value: string) { this.set('trackingNumber', value); }
}

export class TransactionClass extends Parse.Object {
  constructor() {
    super('Transaction');
  }

  get userId(): string { return this.get('userId'); }
  set userId(value: string) { this.set('userId', value); }

  get type(): TransactionType { return this.get('type'); }
  set type(value: TransactionType) { this.set('type', value); }

  get amount(): number { return this.get('amount'); }
  set amount(value: number) { this.set('amount', value); }

  get description(): string { return this.get('description'); }
  set description(value: string) { this.set('description', value); }
}