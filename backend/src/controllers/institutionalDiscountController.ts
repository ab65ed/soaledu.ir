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