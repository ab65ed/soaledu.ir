/**
 * Institutional Discount Controller
 * 
 * کنترلر مدیریت تخفیف‌های سازمانی برای بارگذاری و پردازش فایل‌های اکسل
 */

import { Request, Response } from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import InstitutionalDiscountGroup, { IInstitutionalDiscountGroup } from '../models/InstitutionalDiscountGroup';
import User, { IUser } from '../models/user.model';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import WalletTransaction from '../models/walletTransaction.model';
import { AuthenticatedRequest } from '../middlewares/auth';
import logger from '../config/logger';

// تنظیمات multer برای بارگذاری فایل
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/institutional-discounts');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'discount-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // فقط فایل‌های اکسل مجاز هستند
  const allowedTypes = ['.xlsx', '.xls'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های اکسل (.xlsx, .xls) مجاز هستند'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// Interface برای داده‌های خوانده شده از فایل اکسل
interface ExcelRowData {
  nationalCode?: string;
  phoneNumber?: string;
  rowIndex: number;
}

// Interface برای نتیجه پردازش
interface ProcessingResult {
  totalRows: number;
  matchedUsers: IUser[];
  unmatchedRows: ExcelRowData[];
  invalidRows: Array<{ data: ExcelRowData; error: string }>;
}

/**
 * اعتبارسنجی کد ملی ایرانی
 */
function validateNationalCode(nationalCode: string): boolean {
  if (!nationalCode || nationalCode.length !== 10) return false;
  
  const code = nationalCode.toString();
  const check = parseInt(code[9]);
  const sum = code.split('').slice(0, 9).reduce((acc, x, i) => acc + parseInt(x) * (10 - i), 0) % 11;
  
  return (sum < 2) ? (check === sum) : (check === 11 - sum);
}

/**
 * اعتبارسنجی شماره تلفن
 */
function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;
  const phoneRegex = /^(09\d{9}|9\d{9})$/;
  return phoneRegex.test(phoneNumber);
}

/**
 * خواندن و تجزیه فایل اکسل
 */
function parseExcelFile(filePath: string): ExcelRowData[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // تبدیل به JSON
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  const rows: ExcelRowData[] = [];
  
  // فرض می‌کنیم ردیف اول هدر است و از ردیف دوم شروع می‌کنیم
  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i] as any[];
    if (row && row.length >= 2) {
      rows.push({
        nationalCode: row[0]?.toString().trim(),
        phoneNumber: row[1]?.toString().trim(),
        rowIndex: i + 1,
      });
    }
  }
  
  return rows;
}

/**
 * پردازش داده‌های اکسل و تطبیق با کاربران
 */
async function processExcelData(rows: ExcelRowData[]): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    totalRows: rows.length,
    matchedUsers: [],
    unmatchedRows: [],
    invalidRows: [],
  };

  for (const row of rows) {
    // اعتبارسنجی داده‌ها
    if (!row.nationalCode && !row.phoneNumber) {
      result.invalidRows.push({
        data: row,
        error: 'کد ملی و شماره تلفن هر دو خالی هستند',
      });
      continue;
    }

    if (row.nationalCode && !validateNationalCode(row.nationalCode)) {
      result.invalidRows.push({
        data: row,
        error: 'کد ملی نامعتبر است',
      });
      continue;
    }

    if (row.phoneNumber && !validatePhoneNumber(row.phoneNumber)) {
      result.invalidRows.push({
        data: row,
        error: 'شماره تلفن نامعتبر است',
      });
      continue;
    }

    // جستجوی کاربر در پایگاه داده
    try {
      const searchQuery: any = {};
      
      if (row.nationalCode) {
        searchQuery.nationalCode = row.nationalCode;
      }
      
      if (row.phoneNumber) {
        if (searchQuery.nationalCode) {
          searchQuery.$or = [
            { nationalCode: row.nationalCode },
            { phoneNumber: row.phoneNumber }
          ];
          delete searchQuery.nationalCode;
        } else {
          searchQuery.phoneNumber = row.phoneNumber;
        }
      }

      const user = await User.findOne(searchQuery);
      
      if (user) {
        result.matchedUsers.push(user);
      } else {
        result.unmatchedRows.push(row);
      }
    } catch (error) {
      result.invalidRows.push({
        data: row,
        error: 'خطا در جستجوی کاربر: ' + (error as Error).message,
      });
    }
  }

  return result;
}

/**
 * بارگذاری فایل اکسل تخفیف‌های سازمانی
 * POST /api/admin/institutional-discounts/upload
 */
export const uploadInstitutionalDiscountList = async (req: Request, res: Response): Promise<void> => {
  try {
    // بررسی وجود فایل
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'فایل اکسل ارسال نشده است',
      });
      return;
    }

    const { groupName, discountPercentage, discountAmount } = req.body;
    const userId = (req as any).user?.id;

    // اعتبارسنجی نوع تخفیف
    if (!discountPercentage && !discountAmount) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        success: false,
        message: 'باید یکی از فیلدهای درصد تخفیف یا مبلغ تخفیف را وارد کنید',
      });
      return;
    }

    // ایجاد رکورد گروه تخفیف جدید
    const discountGroup = new InstitutionalDiscountGroup({
      groupName: groupName || `گروه تخفیف ${new Date().toLocaleDateString('fa-IR')}`,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
      discountAmount: discountAmount ? parseFloat(discountAmount) : undefined,
      uploadedBy: userId,
      fileName: req.file.originalname,
      totalUsersInFile: 0, // موقتاً صفر، بعداً به‌روزرسانی می‌شود
      status: 'processing',
    });

    const savedGroup = await discountGroup.save();

    // پردازش ناهمزمان فایل
    processFileAsync(req.file.path, savedGroup._id.toString());

    res.status(201).json({
      success: true,
      message: 'فایل با موفقیت بارگذاری شد و در حال پردازش است',
      data: {
        groupId: savedGroup._id,
        status: savedGroup.status,
        fileName: savedGroup.fileName,
      },
    });

  } catch (error) {
    console.error('خطا در بارگذاری فایل تخفیف‌های سازمانی:', error);
    
    // حذف فایل در صورت خطا
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'خطا در بارگذاری فایل',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * پردازش ناهمزمان فایل
 */
async function processFileAsync(filePath: string, groupId: string) {
  try {
    const discountGroup = await InstitutionalDiscountGroup.findById(groupId);
    if (!discountGroup) {
      throw new Error('گروه تخفیف یافت نشد');
    }

    // خواندن فایل اکسل
    const excelRows = parseExcelFile(filePath);
    
    // به‌روزرسانی تعداد کل ردیف‌ها
    discountGroup.totalUsersInFile = excelRows.length;
    await discountGroup.save();

    // پردازش داده‌ها
    const result = await processExcelData(excelRows);

    // اعمال تخفیف به کاربران تطبیق‌یافته
    const updatePromises = result.matchedUsers.map(async (user) => {
      user.institutionalDiscountPercentage = discountGroup.discountPercentage || 0;
      user.institutionalDiscountGroupId = discountGroup._id as any;
      return user.save();
    });

    await Promise.all(updatePromises);

    // به‌روزرسانی آمار گروه تخفیف
    discountGroup.matchedUsersCount = result.matchedUsers.length;
    discountGroup.unmatchedUsersCount = result.unmatchedRows.length;
    discountGroup.invalidDataCount = result.invalidRows.length;
    discountGroup.status = 'completed';
    
    // ثبت خطاها
    const errorMessages = result.invalidRows.map(item => 
      `ردیف ${item.data.rowIndex}: ${item.error}`
    );
    discountGroup.errorLog = errorMessages;

    await discountGroup.save();

    // حذف فایل پس از پردازش
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`پردازش فایل تخفیف ${groupId} با موفقیت کامل شد`);

  } catch (error) {
    console.error('خطا در پردازش فایل:', error);
    
    // به‌روزرسانی وضعیت به خطا
    try {
      const discountGroup = await InstitutionalDiscountGroup.findById(groupId);
      if (discountGroup) {
        discountGroup.status = 'failed';
        discountGroup.errorLog.push('خطا در پردازش فایل: ' + (error as Error).message);
        await discountGroup.save();
      }
    } catch (updateError) {
      console.error('خطا در به‌روزرسانی وضعیت:', updateError);
    }

    // حذف فایل در صورت خطا
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * دریافت لیست گروه‌های تخفیف سازمانی
 * GET /api/admin/institutional-discounts/groups
 */
export const getInstitutionalDiscountGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    // ساخت فیلتر جستجو
    const filter: any = {};
    if (status && ['pending', 'processing', 'completed', 'failed'].includes(status)) {
      filter.status = status;
    }

    // شمارش کل رکوردها
    const total = await InstitutionalDiscountGroup.countDocuments(filter);

    // دریافت داده‌ها
    const groups = await InstitutionalDiscountGroup.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-errorLog'); // حذف errorLog از لیست کلی

    res.json({
      success: true,
      data: {
        groups,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
    });

  } catch (error) {
    console.error('خطا در دریافت لیست گروه‌های تخفیف:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست گروه‌های تخفیف',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * دریافت جزئیات یک گروه تخفیف
 * GET /api/admin/institutional-discounts/groups/:id
 */
export const getInstitutionalDiscountGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await InstitutionalDiscountGroup.findById(id)
      .populate('uploadedBy', 'name email');

    if (!group) {
      res.status(404).json({
        success: false,
        message: 'گروه تخفیف یافت نشد',
      });
      return;
    }

    res.json({
      success: true,
      data: group,
    });

  } catch (error) {
    console.error('خطا در دریافت جزئیات گروه تخفیف:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت جزئیات گروه تخفیف',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * حذف گروه تخفیف (غیرفعال کردن)
 * DELETE /api/admin/institutional-discounts/groups/:id
 */
export const deleteInstitutionalDiscountGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await InstitutionalDiscountGroup.findById(id);
    if (!group) {
      res.status(404).json({
        success: false,
        message: 'گروه تخفیف یافت نشد',
      });
      return;
    }

    // غیرفعال کردن گروه به جای حذف کامل
    group.isActive = false;
    await group.save();

    // غیرفعال کردن تخفیف کاربران مرتبط
    await User.updateMany(
      { institutionalDiscountGroupId: id },
      { 
        $unset: { 
          institutionalDiscountPercentage: "",
          institutionalDiscountGroupId: ""
        }
      }
    );

    res.json({
      success: true,
      message: 'گروه تخفیف با موفقیت غیرفعال شد',
    });

  } catch (error) {
    console.error('خطا در حذف گروه تخفیف:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف گروه تخفیف',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * گزارش استفاده از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/usage
 */
export const getUsageReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { 
      groupId, 
      institutionId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 20,
      sortBy = 'usageCount',
      sortOrder = 'desc'
    } = req.query;

    // ایجاد pipeline برای aggregation
    const pipeline: any[] = [
      // مرحله اول: فیلتر کردن تراکنش‌های مربوط به تخفیف سازمانی
      {
        $match: {
          isInstitutionalDiscount: true,
          status: 'COMPLETED',
          ...(groupId && { institutionalDiscountGroupId: groupId }),
          ...(institutionId && { institutionId }),
          ...(startDate && endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string)
            }
          })
        }
      },
      
      // مرحله دوم: گروه‌بندی بر اساس گروه تخفیف
      {
        $group: {
          _id: {
            groupId: '$institutionalDiscountGroupId',
            institutionId: '$institutionId'
          },
          usageCount: { $sum: 1 },
          totalDiscountAmount: { $sum: '$discountAmount' },
          totalOriginalAmount: { $sum: '$originalAmount' },
          totalPaidAmount: { $sum: '$amount' },
          uniqueUsers: { $addToSet: '$userId' },
          avgDiscountPercentage: { $avg: '$discountPercentage' }
        }
      },
      
      // مرحله سوم: افزودن تعداد کاربران منحصر به فرد
      {
        $addFields: {
          uniqueUsersCount: { $size: '$uniqueUsers' }
        }
      },
      
      // مرحله چهارم: join کردن با جدول گروه‌های تخفیف
      {
        $lookup: {
          from: 'institutionaldiscountgroups',
          localField: '_id.groupId',
          foreignField: '_id',
          as: 'groupInfo'
        }
      },
      
      // مرحله پنجم: join کردن با جدول سازمان‌ها
      {
        $lookup: {
          from: 'institutions',
          localField: '_id.institutionId',
          foreignField: '_id',
          as: 'institutionInfo'
        }
      },
      
      // مرحله ششم: شکل‌دهی نهایی داده‌ها
      {
        $project: {
          _id: 0,
          groupId: '$_id.groupId',
          institutionId: '$_id.institutionId',
          groupName: { $arrayElemAt: ['$groupInfo.groupName', 0] },
          institutionName: { $arrayElemAt: ['$institutionInfo.name', 0] },
          usageCount: 1,
          uniqueUsersCount: 1,
          totalDiscountAmount: 1,
          totalOriginalAmount: 1,
          totalPaidAmount: 1,
          avgDiscountPercentage: { $round: ['$avgDiscountPercentage', 2] },
          savingsPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$totalDiscountAmount', '$totalOriginalAmount'] },
                  100
                ]
              },
              2
            ]
          },
          conversionRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$uniqueUsersCount', '$usageCount'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      
      // مرحله هفتم: مرتب‌سازی
      {
        $sort: {
          [sortBy as string]: sortOrder === 'desc' ? -1 : 1
        }
      }
    ];

    // اجرای aggregation برای شمردن کل
    const countPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await WalletTransaction.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    // اجرای aggregation اصلی با pagination
    const skip = (Number(page) - 1) * Number(limit);
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });
    
    const reports = await WalletTransaction.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit)
        }
      },
      message: 'گزارش استفاده از تخفیف‌های سازمانی با موفقیت بازیابی شد'
    });

  } catch (error: any) {
    logger.error('خطا در بازیابی گزارش استفاده:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بازیابی گزارش استفاده از تخفیف‌های سازمانی',
      error: error.message
    });
  }
};

/**
 * گزارش درآمد از تخفیف‌های سازمانی
 * GET /api/admin/institutional-discounts/reports/revenue
 */
export const getRevenueReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { 
      groupId, 
      institutionId, 
      startDate, 
      endDate, 
      period = 'monthly' // daily, weekly, monthly, yearly
    } = req.query;

    // تعریف گروه‌بندی بر اساس دوره زمانی
    const getDateGrouping = (period: string) => {
      switch (period) {
        case 'daily':
          return {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          };
        case 'weekly':
          return {
            year: { $year: '$createdAt' },
            week: { $week: '$createdAt' }
          };
        case 'yearly':
          return {
            year: { $year: '$createdAt' }
          };
        default: // monthly
          return {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          };
      }
    };

    const pipeline: any[] = [
      // مرحله اول: فیلتر کردن تراکنش‌های مربوط به تخفیف سازمانی
      {
        $match: {
          isInstitutionalDiscount: true,
          status: 'COMPLETED',
          ...(groupId && { institutionalDiscountGroupId: groupId }),
          ...(institutionId && { institutionId }),
          ...(startDate && endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lte: new Date(endDate as string)
            }
          })
        }
      },
      
      // مرحله دوم: گروه‌بندی بر اساس دوره زمانی
      {
        $group: {
          _id: getDateGrouping(period as string),
          totalRevenue: { $sum: '$amount' },
          totalDiscountGiven: { $sum: '$discountAmount' },
          totalOriginalAmount: { $sum: '$originalAmount' },
          transactionCount: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          avgTransactionAmount: { $avg: '$amount' }
        }
      },
      
      // مرحله سوم: افزودن محاسبات اضافی
      {
        $addFields: {
          uniqueUsersCount: { $size: '$uniqueUsers' },
          discountRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$totalDiscountGiven', '$totalOriginalAmount'] },
                  100
                ]
              },
              2
            ]
          },
          revenuePerUser: {
            $round: [
              { $divide: ['$totalRevenue', { $size: '$uniqueUsers' }] },
              0
            ]
          }
        }
      },
      
      // مرحله چهارم: مرتب‌سازی بر اساس تاریخ
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 }
      }
    ];

    const revenueData = await WalletTransaction.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        period,
        revenueData,
        summary: {
          totalPeriods: revenueData.length,
          totalRevenue: revenueData.reduce((sum, item) => sum + item.totalRevenue, 0),
          totalDiscountGiven: revenueData.reduce((sum, item) => sum + item.totalDiscountGiven, 0),
          totalTransactions: revenueData.reduce((sum, item) => sum + item.transactionCount, 0),
          avgRevenuePerPeriod: revenueData.length > 0 
            ? Math.round(revenueData.reduce((sum, item) => sum + item.totalRevenue, 0) / revenueData.length)
            : 0
        }
      },
      message: 'گزارش درآمد از تخفیف‌های سازمانی با موفقیت بازیابی شد'
    });

  } catch (error: any) {
    logger.error('خطا در بازیابی گزارش درآمد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بازیابی گزارش درآمد از تخفیف‌های سازمانی',
      error: error.message
    });
  }
};

/**
 * گزارش نرخ تبدیل (Conversion Rate)
 * GET /api/admin/institutional-discounts/reports/conversion
 */
export const getConversionReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { groupId, institutionId, startDate, endDate } = req.query;

    const pipeline: any[] = [
      // مرحله اول: join کردن کاربران با گروه‌های تخفیف
      {
        $lookup: {
          from: 'users',
          let: { groupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$institutionalDiscountGroupId', '$$groupId'] },
                ...(institutionId && { institutionId })
              }
            }
          ],
          as: 'eligibleUsers'
        }
      },
      
      // مرحله دوم: join کردن با تراکنش‌های مربوط به تخفیف
      {
        $lookup: {
          from: 'wallettransactions',
          let: { groupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$institutionalDiscountGroupId', '$$groupId'] },
                isInstitutionalDiscount: true,
                status: 'COMPLETED',
                ...(startDate && endDate && {
                  createdAt: {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string)
                  }
                })
              }
            }
          ],
          as: 'transactions'
        }
      },
      
      // مرحله سوم: محاسبه آمارها
      {
        $project: {
          groupName: 1,
          discountPercentage: 1,
          discountAmount: 1,
          totalEligibleUsers: { $size: '$eligibleUsers' },
          totalTransactions: { $size: '$transactions' },
          uniqueUsers: {
            $size: {
              $setUnion: [
                { $map: { input: '$transactions', as: 'transaction', in: '$$transaction.userId' } },
                []
              ]
            }
          },
          totalRevenue: { $sum: '$transactions.amount' },
          totalDiscountGiven: { $sum: '$transactions.discountAmount' }
        }
      },
      
      // مرحله چهارم: محاسبه نرخ تبدیل
      {
        $addFields: {
          conversionRate: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalEligibleUsers', 0] },
                  {
                    $multiply: [
                      { $divide: ['$uniqueUsers', '$totalEligibleUsers'] },
                      100
                    ]
                  },
                  0
                ]
              },
              2
            ]
          },
          avgTransactionsPerUser: {
            $round: [
              {
                $cond: [
                  { $gt: ['$uniqueUsers', 0] },
                  { $divide: ['$totalTransactions', '$uniqueUsers'] },
                  0
                ]
              },
              2
            ]
          },
          avgRevenuePerUser: {
            $round: [
              {
                $cond: [
                  { $gt: ['$uniqueUsers', 0] },
                  { $divide: ['$totalRevenue', '$uniqueUsers'] },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      
      // مرحله پنجم: فیلتر کردن گروه‌های فعال
      {
        $match: {
          isActive: true,
          ...(groupId && { _id: new mongoose.Types.ObjectId(groupId as string) })
        }
      },
      
      // مرحله ششم: مرتب‌سازی بر اساس نرخ تبدیل
      {
        $sort: { conversionRate: -1 }
      }
    ];

    const conversionData = await InstitutionalDiscountGroup.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        conversionData,
        summary: {
          totalGroups: conversionData.length,
          avgConversionRate: conversionData.length > 0 
            ? Math.round(conversionData.reduce((sum, item) => sum + item.conversionRate, 0) / conversionData.length * 100) / 100
            : 0,
          bestPerforming: conversionData[0] || null,
          totalEligibleUsers: conversionData.reduce((sum, item) => sum + item.totalEligibleUsers, 0),
          totalActiveUsers: conversionData.reduce((sum, item) => sum + item.uniqueUsers, 0)
        }
      },
      message: 'گزارش نرخ تبدیل با موفقیت بازیابی شد'
    });

  } catch (error: any) {
    logger.error('خطا در بازیابی گزارش نرخ تبدیل:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بازیابی گزارش نرخ تبدیل',
      error: error.message
    });
  }
};

/**
 * گزارش مقایسه‌ای گروه‌های تخفیف
 * GET /api/admin/institutional-discounts/reports/comparison
 */
export const getComparisonReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, metric = 'revenue' } = req.query;

    const pipeline: any[] = [
      // مرحله اول: فیلتر کردن گروه‌های فعال
      {
        $match: {
          isActive: true,
          status: 'completed'
        }
      },
      
      // مرحله دوم: join کردن با تراکنش‌ها
      {
        $lookup: {
          from: 'wallettransactions',
          let: { groupId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$institutionalDiscountGroupId', '$$groupId'] },
                isInstitutionalDiscount: true,
                status: 'COMPLETED',
                ...(startDate && endDate && {
                  createdAt: {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string)
                  }
                })
              }
            }
          ],
          as: 'transactions'
        }
      },
      
      // مرحله سوم: join کردن با کاربران واجد شرایط
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'institutionalDiscountGroupId',
          as: 'eligibleUsers'
        }
      },
      
      // مرحله چهارم: محاسبه متریک‌ها
      {
        $project: {
          groupName: 1,
          discountPercentage: 1,
          discountAmount: 1,
          uploadDate: 1,
          fileName: 1,
          totalEligibleUsers: { $size: '$eligibleUsers' },
          totalTransactions: { $size: '$transactions' },
          uniqueUsers: {
            $size: {
              $setUnion: [
                { $map: { input: '$transactions', as: 'transaction', in: '$$transaction.userId' } },
                []
              ]
            }
          },
          totalRevenue: { $sum: '$transactions.amount' },
          totalDiscountGiven: { $sum: '$transactions.discountAmount' },
          totalOriginalAmount: { $sum: '$transactions.originalAmount' }
        }
      },
      
      // مرحله پنجم: محاسبه KPI های نهایی
      {
        $addFields: {
          conversionRate: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalEligibleUsers', 0] },
                  { $multiply: [{ $divide: ['$uniqueUsers', '$totalEligibleUsers'] }, 100] },
                  0
                ]
              },
              2
            ]
          },
          avgRevenuePerUser: {
            $round: [
              {
                $cond: [
                  { $gt: ['$uniqueUsers', 0] },
                  { $divide: ['$totalRevenue', '$uniqueUsers'] },
                  0
                ]
              },
              0
            ]
          },
          discountEfficiency: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalDiscountGiven', 0] },
                  { $divide: ['$totalRevenue', '$totalDiscountGiven'] },
                  0
                ]
              },
              2
            ]
          },
          roi: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalDiscountGiven', 0] },
                  {
                    $multiply: [
                      { $divide: [
                        { $subtract: ['$totalRevenue', '$totalDiscountGiven'] },
                        '$totalDiscountGiven'
                      ] },
                      100
                    ]
                  },
                  0
                ]
              },
              2
            ]
          }
        }
      },
      
      // مرحله ششم: مرتب‌سازی بر اساس متریک انتخابی
      {
        $sort: {
          [metric as string]: -1
        }
      }
    ];

    const comparisonData = await InstitutionalDiscountGroup.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: {
        comparisonData,
        summary: {
          totalGroups: comparisonData.length,
          topPerformer: comparisonData[0] || null,
          totalRevenue: comparisonData.reduce((sum, item) => sum + item.totalRevenue, 0),
          totalDiscountGiven: comparisonData.reduce((sum, item) => sum + item.totalDiscountGiven, 0),
          avgConversionRate: comparisonData.length > 0 
            ? Math.round(comparisonData.reduce((sum, item) => sum + item.conversionRate, 0) / comparisonData.length * 100) / 100
            : 0,
          totalEligibleUsers: comparisonData.reduce((sum, item) => sum + item.totalEligibleUsers, 0),
          totalActiveUsers: comparisonData.reduce((sum, item) => sum + item.uniqueUsers, 0)
        }
      },
      message: 'گزارش مقایسه‌ای گروه‌های تخفیف با موفقیت بازیابی شد'
    });

  } catch (error: any) {
    logger.error('خطا در بازیابی گزارش مقایسه‌ای:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بازیابی گزارش مقایسه‌ای گروه‌های تخفیف',
      error: error.message
    });
  }
}; 