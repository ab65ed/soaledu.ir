import Parse from 'parse/node';
import { z } from 'zod';
export declare enum TransactionType {
    EXAM_PURCHASE = "EXAM_PURCHASE",
    FLASHCARD_PURCHASE = "FLASHCARD_PURCHASE",
    DESIGNER_EARNING = "DESIGNER_EARNING",
    WITHDRAWAL_REQUEST = "WITHDRAWAL_REQUEST",
    WITHDRAWAL_APPROVED = "WITHDRAWAL_APPROVED",
    WITHDRAWAL_REJECTED = "WITHDRAWAL_REJECTED"
}
export declare enum WithdrawalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED"
}
export declare enum PaymentMethod {
    IBAN = "IBAN",
    CARD = "CARD",
    WALLET = "WALLET"
}
export declare enum NotificationFrequency {
    DISABLED = "DISABLED",
    EVERY_6_HOURS = "EVERY_6_HOURS",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY"
}
export interface PricingConfig {
    examPricing: {
        '10-20': number;
        '21-30': number;
        '31-50': number;
    };
    flashcardPricing: {
        defaultPrice: number;
        minPrice: number;
        maxPrice: number;
    };
    designerShare: number;
    platformFee: number;
}
export interface WalletData {
    userId: string;
    balance: number;
    totalEarnings: number;
    totalWithdrawals: number;
    pendingWithdrawals: number;
    lastUpdated: Date;
    freezeAmount: number;
    availableBalance: number;
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
    cardNumber: string;
    bankName: string;
}
export interface TransactionData {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    referenceId?: string;
    designerId?: string;
    designerShare?: number;
    platformFee?: number;
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
export declare const PricingConfigSchema: z.ZodObject<{
    examPricing: z.ZodObject<{
        '10-20': z.ZodNumber;
        '21-30': z.ZodNumber;
        '31-50': z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        '10-20'?: number;
        '21-30'?: number;
        '31-50'?: number;
    }, {
        '10-20'?: number;
        '21-30'?: number;
        '31-50'?: number;
    }>;
    flashcardPricing: z.ZodObject<{
        defaultPrice: z.ZodNumber;
        minPrice: z.ZodNumber;
        maxPrice: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        defaultPrice?: number;
        minPrice?: number;
        maxPrice?: number;
    }, {
        defaultPrice?: number;
        minPrice?: number;
        maxPrice?: number;
    }>;
    designerShare: z.ZodNumber;
    platformFee: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    examPricing?: {
        '10-20'?: number;
        '21-30'?: number;
        '31-50'?: number;
    };
    flashcardPricing?: {
        defaultPrice?: number;
        minPrice?: number;
        maxPrice?: number;
    };
    designerShare?: number;
    platformFee?: number;
}, {
    examPricing?: {
        '10-20'?: number;
        '21-30'?: number;
        '31-50'?: number;
    };
    flashcardPricing?: {
        defaultPrice?: number;
        minPrice?: number;
        maxPrice?: number;
    };
    designerShare?: number;
    platformFee?: number;
}>;
export declare const WithdrawalRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethod: z.ZodNativeEnum<typeof PaymentMethod>;
    accountDetails: z.ZodUnion<[z.ZodObject<{
        accountHolderName: z.ZodString;
        iban: z.ZodString;
        bankName: z.ZodString;
        accountNumber: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        accountHolderName?: string;
        iban?: string;
        bankName?: string;
        accountNumber?: string;
    }, {
        accountHolderName?: string;
        iban?: string;
        bankName?: string;
        accountNumber?: string;
    }>, z.ZodObject<{
        cardHolderName: z.ZodString;
        cardNumber: z.ZodString;
        bankName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bankName?: string;
        cardHolderName?: string;
        cardNumber?: string;
    }, {
        bankName?: string;
        cardHolderName?: string;
        cardNumber?: string;
    }>]>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description?: string;
    amount?: number;
    paymentMethod?: PaymentMethod;
    accountDetails?: {
        accountHolderName?: string;
        iban?: string;
        bankName?: string;
        accountNumber?: string;
    } | {
        bankName?: string;
        cardHolderName?: string;
        cardNumber?: string;
    };
}, {
    description?: string;
    amount?: number;
    paymentMethod?: PaymentMethod;
    accountDetails?: {
        accountHolderName?: string;
        iban?: string;
        bankName?: string;
        accountNumber?: string;
    } | {
        bankName?: string;
        cardHolderName?: string;
        cardNumber?: string;
    };
}>;
export declare const TransactionSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodNativeEnum<typeof TransactionType>;
    amount: z.ZodNumber;
    description: z.ZodString;
    referenceId: z.ZodOptional<z.ZodString>;
    designerId: z.ZodOptional<z.ZodString>;
    designerShare: z.ZodOptional<z.ZodNumber>;
    platformFee: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type?: TransactionType;
    description?: string;
    amount?: number;
    userId?: string;
    metadata?: Record<string, any>;
    designerShare?: number;
    platformFee?: number;
    referenceId?: string;
    designerId?: string;
}, {
    type?: TransactionType;
    description?: string;
    amount?: number;
    userId?: string;
    metadata?: Record<string, any>;
    designerShare?: number;
    platformFee?: number;
    referenceId?: string;
    designerId?: string;
}>;
export declare const NotificationSettingsSchema: z.ZodObject<{
    withdrawalNotifications: z.ZodDefault<z.ZodBoolean>;
    earningNotifications: z.ZodDefault<z.ZodBoolean>;
    frequency: z.ZodDefault<z.ZodNativeEnum<typeof NotificationFrequency>>;
    email: z.ZodOptional<z.ZodString>;
    pushNotifications: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string;
    frequency?: NotificationFrequency;
    withdrawalNotifications?: boolean;
    earningNotifications?: boolean;
    pushNotifications?: boolean;
}, {
    email?: string;
    frequency?: NotificationFrequency;
    withdrawalNotifications?: boolean;
    earningNotifications?: boolean;
    pushNotifications?: boolean;
}>;
export declare function calculateDesignerEarning(totalAmount: number, designerShare?: number): number;
export declare function calculatePlatformFee(totalAmount: number, platformFee?: number): number;
export declare function getExamPrice(questionCount: number): number;
export declare function getFlashcardPrice(customPrice?: number): number;
export declare function formatCurrency(amount: number): string;
export declare function generateTrackingNumber(): string;
export declare function canRequestWithdrawal(wallet: WalletData, requestAmount: number): boolean;
export declare function shouldSendNotification(settings: NotificationSettings): boolean;
export declare const DEFAULT_PRICING: PricingConfig;
export declare const WITHDRAWAL_LIMITS: {
    MIN_AMOUNT: number;
    MAX_AMOUNT: number;
    DAILY_LIMIT: number;
    MONTHLY_LIMIT: number;
};
export declare class WalletClass extends Parse.Object {
    constructor();
    get userId(): string;
    set userId(value: string);
    get balance(): number;
    set balance(value: number);
    get totalEarnings(): number;
    set totalEarnings(value: number);
    get totalWithdrawals(): number;
    set totalWithdrawals(value: number);
    get pendingWithdrawals(): number;
    set pendingWithdrawals(value: number);
    get freezeAmount(): number;
    set freezeAmount(value: number);
    get availableBalance(): number;
}
export declare class WithdrawalRequestClass extends Parse.Object {
    constructor();
    get userId(): string;
    set userId(value: string);
    get amount(): number;
    set amount(value: number);
    get paymentMethod(): PaymentMethod;
    set paymentMethod(value: PaymentMethod);
    get status(): WithdrawalStatus;
    set status(value: WithdrawalStatus);
    get trackingNumber(): string;
    set trackingNumber(value: string);
}
export declare class TransactionClass extends Parse.Object {
    constructor();
    get userId(): string;
    set userId(value: string);
    get type(): TransactionType;
    set type(value: TransactionType);
    get amount(): number;
    set amount(value: number);
    get description(): string;
    set description(value: string);
}
