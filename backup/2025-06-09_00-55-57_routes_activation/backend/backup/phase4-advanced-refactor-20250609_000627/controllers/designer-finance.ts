import { Request, Response } from 'express';
import Parse from 'parse/node';
import { 
  WalletData, 
  WithdrawalRequest, 
  TransactionData, 
  FinancialReport,
  NotificationSettings,
  WithdrawalRequestSchema,
  NotificationSettingsSchema,
  TransactionType,
  WithdrawalStatus,
  PaymentMethod,
  NotificationFrequency,
  calculateDesignerEarning,
  calculatePlatformFee,
  formatCurrency,
  generateTrackingNumber,
  canRequestWithdrawal,
  shouldSendNotification,
  DEFAULT_PRICING,
  WITHDRAWAL_LIMITS,
  WalletClass,
  WithdrawalRequestClass,
  TransactionClass
} from '../models/finance';

// Types
interface AuthenticatedRequest extends Request {
  user?: Parse.User;
  userId?: string;
}

interface ValidationError extends Error {
  details?: Array<{
    path: string[];
    message: string;
  }>;
}

// Helper Functions
async function getUserWallet(userId: string): Promise<WalletData> {
  const query = new Parse.Query('Wallet');
  query.equalTo('userId', userId);
  
  try {
    const wallet = await query.first({ useMasterKey: true });
    
    if (!wallet) {
      // ایجاد کیف پول جدید
      const newWallet = new WalletClass();
      newWallet.userId = userId;
      newWallet.balance = 0;
      newWallet.totalEarnings = 0;
      newWallet.totalWithdrawals = 0;
      newWallet.pendingWithdrawals = 0;
      newWallet.freezeAmount = 0;
      newWallet.set('lastUpdated', new Date());
      
      await newWallet.save(null, { useMasterKey: true });
      
      return {
        userId,
        balance: 0,
        totalEarnings: 0,
        totalWithdrawals: 0,
        pendingWithdrawals: 0,
        lastUpdated: new Date(),
        freezeAmount: 0,
        availableBalance: 0
      };
    }
    
    const data = wallet.toJSON() as any;
    return {
      userId: data.userId,
      balance: data.balance || 0,
      totalEarnings: data.totalEarnings || 0,
      totalWithdrawals: data.totalWithdrawals || 0,
      pendingWithdrawals: data.pendingWithdrawals || 0,
      lastUpdated: data.lastUpdated || new Date(),
      freezeAmount: data.freezeAmount || 0,
      availableBalance: (data.balance || 0) - (data.freezeAmount || 0) - (data.pendingWithdrawals || 0)
    };
  } catch (error) {
    console.error('Error getting user wallet:', error);
    throw new Error('خطا در بازیابی کیف پول کاربر');
  }
}

async function updateWalletBalance(userId: string, amount: number, type: 'ADD' | 'SUBTRACT'): Promise<void> {
  const query = new Parse.Query('Wallet');
  query.equalTo('userId', userId);
  
  try {
    let wallet = await query.first({ useMasterKey: true });
    
    if (!wallet) {
      wallet = new WalletClass();
      wallet.userId = userId;
      wallet.balance = 0;
      wallet.totalEarnings = 0;
      wallet.totalWithdrawals = 0;
      wallet.pendingWithdrawals = 0;
      wallet.freezeAmount = 0;
    }
    
    const currentBalance = wallet.get('balance') || 0;
    const newBalance = type === 'ADD' ? currentBalance + amount : currentBalance - amount;
    
    wallet.set('balance', Math.max(0, newBalance));
    wallet.set('lastUpdated', new Date());
    
    if (type === 'ADD') {
      const currentEarnings = wallet.get('totalEarnings') || 0;
      wallet.set('totalEarnings', currentEarnings + amount);
    } else {
      const currentWithdrawals = wallet.get('totalWithdrawals') || 0;
      wallet.set('totalWithdrawals', currentWithdrawals + amount);
    }
    
    await wallet.save(null, { useMasterKey: true });
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw new Error('خطا در به‌روزرسانی موجودی کیف پول');
  }
}

async function createTransaction(data: Omit<TransactionData, 'id' | 'date' | 'status'>): Promise<string> {
  const transaction = new TransactionClass();
  
  transaction.set('userId', data.userId);
  transaction.set('type', data.type);
  transaction.set('amount', data.amount);
  transaction.set('description', data.description);
  transaction.set('status', 'COMPLETED');
  transaction.set('date', new Date());
  
  if (data.referenceId) transaction.set('referenceId', data.referenceId);
  if (data.designerId) transaction.set('designerId', data.designerId);
  if (data.designerShare) transaction.set('designerShare', data.designerShare);
  if (data.platformFee) transaction.set('platformFee', data.platformFee);
  if (data.metadata) transaction.set('metadata', data.metadata);
  
  try {
    await transaction.save(null, { useMasterKey: true });
    return transaction.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('خطا در ایجاد تراکنش');
  }
}

// Controllers

// دریافت اطلاعات کیف پول
export const getWallet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const wallet = await getUserWallet(userId);
    
    res.json({
      success: true,
      data: {
        ...wallet,
        formattedBalance: formatCurrency(wallet.balance),
        formattedTotalEarnings: formatCurrency(wallet.totalEarnings),
        formattedAvailableBalance: formatCurrency(wallet.availableBalance)
      }
    });
  } catch (error) {
    console.error('Error in getWallet:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// ثبت درآمد طراح (هنگام فروش آزمون یا فلش‌کارت)
export const recordDesignerEarning = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { designerId, totalAmount, itemType, itemId, itemTitle } = req.body;
    
    if (!designerId || !totalAmount || !itemType || !itemId) {
      res.status(400).json({ 
        success: false, 
        message: 'اطلاعات ناقص ارسال شده است' 
      });
      return;
    }
    
    const designerShare = calculateDesignerEarning(totalAmount);
    const platformFee = calculatePlatformFee(totalAmount);
    
    // به‌روزرسانی کیف پول طراح
    await updateWalletBalance(designerId, designerShare, 'ADD');
    
    // ثبت تراکنش
    await createTransaction({
      userId: designerId,
      type: TransactionType.DESIGNER_EARNING,
      amount: designerShare,
      description: `درآمد از فروش ${itemType === 'EXAM' ? 'آزمون' : 'فلش‌کارت'}: ${itemTitle}`,
      referenceId: itemId,
      designerId,
      designerShare,
      platformFee,
      metadata: {
        itemType,
        itemTitle,
        totalAmount,
        designerSharePercentage: DEFAULT_PRICING.designerShare
      }
    });
    
    res.json({
      success: true,
      message: 'درآمد طراح با موفقیت ثبت شد',
      data: {
        designerShare,
        platformFee,
        formattedDesignerShare: formatCurrency(designerShare)
      }
    });
  } catch (error) {
    console.error('Error in recordDesignerEarning:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// درخواست برداشت وجه
export const requestWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    // اعتبارسنجی داده‌ها
    const validationResult = WithdrawalRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        message: 'اطلاعات ارسال شده نامعتبر است',
        errors
      });
      return;
    }
    
    const { amount, paymentMethod, accountDetails, description } = validationResult.data;
    
    // بررسی موجودی کیف پول
    const wallet = await getUserWallet(userId);
    
    if (!canRequestWithdrawal(wallet, amount)) {
      res.status(400).json({
        success: false,
        message: 'موجودی کافی برای برداشت وجود ندارد یا مبلغ کمتر از حداقل مجاز است',
        data: {
          availableBalance: wallet.availableBalance,
          minAmount: WITHDRAWAL_LIMITS.MIN_AMOUNT,
          formattedAvailableBalance: formatCurrency(wallet.availableBalance)
        }
      });
      return;
    }
    
    // بررسی محدودیت‌های روزانه/ماهانه (اختیاری)
    // این قسمت می‌تواند بعداً پیاده‌سازی شود
    
    // ایجاد درخواست برداشت
    const withdrawal = new WithdrawalRequestClass();
    withdrawal.userId = userId;
    withdrawal.amount = amount;
    withdrawal.paymentMethod = paymentMethod;
    withdrawal.set('accountDetails', accountDetails);
    withdrawal.status = WithdrawalStatus.PENDING;
    withdrawal.set('requestDate', new Date());
    withdrawal.trackingNumber = generateTrackingNumber();
    
    if (description) {
      withdrawal.set('description', description);
    }
    
    await withdrawal.save(null, { useMasterKey: true });
    
    // مسدود کردن مبلغ در کیف پول
    const query = new Parse.Query('Wallet');
    query.equalTo('userId', userId);
    const walletObj = await query.first({ useMasterKey: true });
    
    if (walletObj) {
      const currentPending = walletObj.get('pendingWithdrawals') || 0;
      walletObj.set('pendingWithdrawals', currentPending + amount);
      await walletObj.save(null, { useMasterKey: true });
    }
    
    // ثبت تراکنش
    await createTransaction({
      userId,
      type: TransactionType.WITHDRAWAL_REQUEST,
      amount,
      description: `درخواست برداشت وجه - شماره پیگیری: ${withdrawal.trackingNumber}`,
      referenceId: withdrawal.id,
      metadata: {
        trackingNumber: withdrawal.trackingNumber,
        paymentMethod,
        accountDetails
      }
    });
    
    res.json({
      success: true,
      message: 'درخواست برداشت وجه با موفقیت ثبت شد',
      data: {
        trackingNumber: withdrawal.trackingNumber,
        amount,
        formattedAmount: formatCurrency(amount),
        status: WithdrawalStatus.PENDING,
        requestDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in requestWithdrawal:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// دریافت لیست درخواست‌های برداشت
export const getWithdrawals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = new Parse.Query('WithdrawalRequest');
    query.equalTo('userId', userId);
    query.descending('createdAt');
    query.skip(skip);
    query.limit(Number(limit));
    
    if (status && Object.values(WithdrawalStatus).includes(status as WithdrawalStatus)) {
      query.equalTo('status', status);
    }
    
    const [withdrawals, total] = await Promise.all([
      query.find({ useMasterKey: true }),
      query.count({ useMasterKey: true })
    ]);
    
    const formattedWithdrawals = withdrawals.map(w => {
      const data = w.toJSON() as any;
      return {
        id: w.id,
        amount: data.amount,
        formattedAmount: formatCurrency(data.amount),
        status: data.status,
        paymentMethod: data.paymentMethod,
        requestDate: data.requestDate,
        processedDate: data.processedDate,
        trackingNumber: data.trackingNumber,
        description: data.description,
        rejectionReason: data.rejectionReason
      };
    });
    
    res.json({
      success: true,
      data: {
        withdrawals: formattedWithdrawals,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getWithdrawals:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// دریافت تاریخچه تراکنش‌ها
export const getTransactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const { page = 1, limit = 10, type, startDate, endDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const query = new Parse.Query('Transaction');
    query.equalTo('userId', userId);
    query.descending('createdAt');
    query.skip(skip);
    query.limit(Number(limit));
    
    if (type && Object.values(TransactionType).includes(type as TransactionType)) {
      query.equalTo('type', type);
    }
    
    if (startDate) {
      query.greaterThanOrEqualTo('createdAt', new Date(startDate as string));
    }
    
    if (endDate) {
      query.lessThanOrEqualTo('createdAt', new Date(endDate as string));
    }
    
    const [transactions, total] = await Promise.all([
      query.find({ useMasterKey: true }),
      query.count({ useMasterKey: true })
    ]);
    
    const formattedTransactions = transactions.map(t => {
      const data = t.toJSON() as any;
      return {
        id: t.id,
        type: data.type,
        amount: data.amount,
        formattedAmount: formatCurrency(data.amount),
        description: data.description,
        date: data.createdAt,
        status: data.status,
        referenceId: data.referenceId,
        metadata: data.metadata
      };
    });
    
    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// دریافت گزارش مالی
export const getFinancialReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const { period = 'MONTHLY', startDate, endDate } = req.query;
    
    let start: Date;
    let end: Date = new Date();
    
    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    } else {
      // محاسبه خودکار بازه بر اساس period
      switch (period) {
        case 'DAILY':
          start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'WEEKLY':
          start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'YEARLY':
          start = new Date(end.getFullYear(), 0, 1);
          break;
        default: // MONTHLY
          start = new Date(end.getFullYear(), end.getMonth(), 1);
      }
    }
    
    // دریافت تراکنش‌های درآمدی
    const earningsQuery = new Parse.Query('Transaction');
    earningsQuery.equalTo('userId', userId);
    earningsQuery.equalTo('type', TransactionType.DESIGNER_EARNING);
    earningsQuery.greaterThanOrEqualTo('createdAt', start);
    earningsQuery.lessThanOrEqualTo('createdAt', end);
    
    // دریافت تراکنش‌های برداشت
    const withdrawalsQuery = new Parse.Query('Transaction');
    withdrawalsQuery.equalTo('userId', userId);
    withdrawalsQuery.containedIn('type', [
      TransactionType.WITHDRAWAL_REQUEST,
      TransactionType.WITHDRAWAL_APPROVED
    ]);
    withdrawalsQuery.greaterThanOrEqualTo('createdAt', start);
    withdrawalsQuery.lessThanOrEqualTo('createdAt', end);
    
    const [earnings, withdrawals] = await Promise.all([
      earningsQuery.find({ useMasterKey: true }),
      withdrawalsQuery.find({ useMasterKey: true })
    ]);
    
    const totalEarnings = earnings.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
    
    // تحلیل پرفروش‌ترین آیتم‌ها
    const itemSales: Record<string, any> = {};
    earnings.forEach(t => {
      const metadata = t.get('metadata') || {};
      const itemId = t.get('referenceId');
      const itemType = metadata.itemType;
      const itemTitle = metadata.itemTitle;
      const amount = t.get('amount') || 0;
      
      if (itemId && itemType && itemTitle) {
        if (!itemSales[itemId]) {
          itemSales[itemId] = {
            itemId,
            itemType,
            itemTitle,
            sales: 0,
            revenue: 0
          };
        }
        itemSales[itemId].sales += 1;
        itemSales[itemId].revenue += amount;
      }
    });
    
    const topSellingItems = Object.values(itemSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
    
    // درآمد روزانه
    const dailyEarningsMap: Record<string, number> = {};
    earnings.forEach(t => {
      const date = t.get('createdAt') || new Date();
      const dateKey = date.toISOString().split('T')[0];
      const amount = t.get('amount') || 0;
      
      dailyEarningsMap[dateKey] = (dailyEarningsMap[dateKey] || 0) + amount;
    });
    
    const dailyEarnings = Object.entries(dailyEarningsMap).map(([date, amount]) => ({
      date,
      amount
    }));
    
    const report: FinancialReport = {
      userId,
      period: period as any,
      startDate: start,
      endDate: end,
      totalEarnings,
      totalWithdrawals,
      transactionCount: earnings.length + withdrawals.length,
      topSellingItems,
      dailyEarnings
    };
    
    res.json({
      success: true,
      data: {
        ...report,
        formattedTotalEarnings: formatCurrency(totalEarnings),
        formattedTotalWithdrawals: formatCurrency(totalWithdrawals),
        netIncome: totalEarnings - totalWithdrawals,
        formattedNetIncome: formatCurrency(totalEarnings - totalWithdrawals)
      }
    });
  } catch (error) {
    console.error('Error in getFinancialReport:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// تنظیمات نوتیفیکیشن
export const getNotificationSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const query = new Parse.Query('NotificationSettings');
    query.equalTo('userId', userId);
    
    let settings = await query.first({ useMasterKey: true });
    
    if (!settings) {
      // ایجاد تنظیمات پیش‌فرض
      settings = new Parse.Object('NotificationSettings');
      settings.set('userId', userId);
      settings.set('withdrawalNotifications', true);
      settings.set('earningNotifications', true);
      settings.set('frequency', NotificationFrequency.EVERY_6_HOURS);
      settings.set('pushNotifications', true);
      
      await settings.save(null, { useMasterKey: true });
    }
    
    const data = settings.toJSON() as any;
    
    res.json({
      success: true,
      data: {
        userId: data.userId,
        withdrawalNotifications: data.withdrawalNotifications,
        earningNotifications: data.earningNotifications,
        frequency: data.frequency,
        email: data.email,
        pushNotifications: data.pushNotifications,
        lastNotificationSent: data.lastNotificationSent
      }
    });
  } catch (error) {
    console.error('Error in getNotificationSettings:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// به‌روزرسانی تنظیمات نوتیفیکیشن
export const updateNotificationSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    // اعتبارسنجی داده‌ها
    const validationResult = NotificationSettingsSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        message: 'اطلاعات ارسال شده نامعتبر است',
        errors
      });
      return;
    }
    
    const updateData = validationResult.data;
    
    const query = new Parse.Query('NotificationSettings');
    query.equalTo('userId', userId);
    
    let settings = await query.first({ useMasterKey: true });
    
    if (!settings) {
      settings = new Parse.Object('NotificationSettings');
      settings.set('userId', userId);
    }
    
    // به‌روزرسانی تنظیمات
    Object.entries(updateData).forEach(([key, value]) => {
      settings!.set(key, value);
    });
    
    await settings.save(null, { useMasterKey: true });
    
    res.json({
      success: true,
      message: 'تنظیمات نوتیفیکیشن با موفقیت به‌روزرسانی شد',
      data: settings.toJSON()
    });
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// دریافت آمار کلی داشبورد
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
      return;
    }
    
    const [wallet, recentTransactions, pendingWithdrawals] = await Promise.all([
      getUserWallet(userId),
      
      // تراکنش‌های اخیر
      (async () => {
        const query = new Parse.Query('Transaction');
        query.equalTo('userId', userId);
        query.descending('createdAt');
        query.limit(5);
        const transactions = await query.find({ useMasterKey: true });
        return transactions.map(t => ({
          id: t.id,
          type: t.get('type'),
          amount: t.get('amount'),
          formattedAmount: formatCurrency(t.get('amount')),
          description: t.get('description'),
          date: t.get('createdAt')
        }));
      })(),
      
      // درخواست‌های برداشت در انتظار
      (async () => {
        const query = new Parse.Query('WithdrawalRequest');
        query.equalTo('userId', userId);
        query.equalTo('status', WithdrawalStatus.PENDING);
        return await query.count({ useMasterKey: true });
      })()
    ]);
    
    // محاسبه درآمد ماه جاری
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const earningsQuery = new Parse.Query('Transaction');
    earningsQuery.equalTo('userId', userId);
    earningsQuery.equalTo('type', TransactionType.DESIGNER_EARNING);
    earningsQuery.greaterThanOrEqualTo('createdAt', startOfMonth);
    
    const monthlyTransactions = await earningsQuery.find({ useMasterKey: true });
    const monthlyEarnings = monthlyTransactions.reduce((sum, t) => sum + (t.get('amount') || 0), 0);
    
    res.json({
      success: true,
      data: {
        wallet: {
          ...wallet,
          formattedBalance: formatCurrency(wallet.balance),
          formattedAvailableBalance: formatCurrency(wallet.availableBalance),
          formattedTotalEarnings: formatCurrency(wallet.totalEarnings)
        },
        monthlyEarnings,
        formattedMonthlyEarnings: formatCurrency(monthlyEarnings),
        recentTransactions,
        pendingWithdrawals,
        canWithdraw: wallet.availableBalance >= WITHDRAWAL_LIMITS.MIN_AMOUNT
      }
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};

// Admin Functions (برای مدیریت درخواست‌های برداشت)
export const approveWithdrawal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { withdrawalId } = req.params;
    const { adminNotes } = req.body;
    
    // بررسی مجوز ادمین
    const user = req.user;
    if (!user || !user.get('isAdmin')) {
      res.status(403).json({ success: false, message: 'دسترسی مجاز نیست' });
      return;
    }
    
    const withdrawal = await new Parse.Query('WithdrawalRequest').get(withdrawalId, { useMasterKey: true });
    
    if (!withdrawal) {
      res.status(404).json({ success: false, message: 'درخواست برداشت یافت نشد' });
      return;
    }
    
    if (withdrawal.get('status') !== WithdrawalStatus.PENDING) {
      res.status(400).json({ success: false, message: 'درخواست قبلاً پردازش شده است' });
      return;
    }
    
    const userId = withdrawal.get('userId');
    const amount = withdrawal.get('amount');
    
    // به‌روزرسانی وضعیت درخواست
    withdrawal.set('status', WithdrawalStatus.APPROVED);
    withdrawal.set('processedDate', new Date());
    withdrawal.set('adminNotes', adminNotes);
    
    await withdrawal.save(null, { useMasterKey: true });
    
    // به‌روزرسانی کیف پول
    await updateWalletBalance(userId, amount, 'SUBTRACT');
    
    // کاهش مبلغ pending
    const walletQuery = new Parse.Query('Wallet');
    walletQuery.equalTo('userId', userId);
    const walletObj = await walletQuery.first({ useMasterKey: true });
    
    if (walletObj) {
      const currentPending = walletObj.get('pendingWithdrawals') || 0;
      walletObj.set('pendingWithdrawals', Math.max(0, currentPending - amount));
      await walletObj.save(null, { useMasterKey: true });
    }
    
    // ثبت تراکنش تایید
    await createTransaction({
      userId,
      type: TransactionType.WITHDRAWAL_APPROVED,
      amount,
      description: `تایید برداشت وجه - شماره پیگیری: ${withdrawal.get('trackingNumber')}`,
      referenceId: withdrawal.id,
      metadata: {
        trackingNumber: withdrawal.get('trackingNumber'),
        adminNotes
      }
    });
    
    res.json({
      success: true,
      message: 'درخواست برداشت با موفقیت تایید شد'
    });
  } catch (error) {
    console.error('Error in approveWithdrawal:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'خطای داخلی سرور' 
    });
  }
};