/**
 * Institution Controller
 * 
 * کنترلر مدیریت نهادهای آموزشی (مدارس/مجموعه‌ها)
 */

import { Request, Response } from 'express';
import Institution, { IInstitution } from '../models/Institution';
import User from '../models/user.model';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middlewares/auth';

// Interface برای پیگینیشن
interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  type?: 'school' | 'educational_center' | 'university' | 'other';
  isActive?: string;
  contractStatus?: 'active' | 'expired' | 'expiring_soon';
}

// Interface برای آمار
interface InstitutionStats {
  totalInstitutions: number;
  activeInstitutions: number;
  inactiveInstitutions: number;
  totalStudents: number;
  activeStudents: number;
  contractsExpiring: number;
  byType: {
    school: number;
    educational_center: number;
    university: number;
    other: number;
  };
}

/**
 * @swagger
 * /api/institutions:
 *   get:
 *     summary: لیست نهادهای آموزشی با فیلتر و جستجو
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: تعداد نتایج در هر صفحه
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: جستجو در نام یا شناسه نهاد
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [school, educational_center, university, other]
 *         description: نوع نهاد
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *       - in: query
 *         name: contractStatus
 *         schema:
 *           type: string
 *           enum: [active, expired, expiring_soon]
 *         description: وضعیت قرارداد
 *     responses:
 *       200:
 *         description: لیست نهادها
 *       401:
 *         description: عدم احراز هویت
 *       403:
 *         description: عدم دسترسی
 */
export const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      type,
      isActive,
      contractStatus
    } = req.query as PaginationQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // ساخت فیلتر پیشرفته
    const filter: any = {};

    // جستجوی متنی
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { uniqueId: { $regex: search, $options: 'i' } },
        { 'contactInfo.contactPerson': { $regex: search, $options: 'i' } }
      ];
    }

    // فیلتر نوع
    if (type) {
      filter.type = type;
    }

    // فیلتر وضعیت فعال
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // فیلتر وضعیت قرارداد
    if (contractStatus) {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      switch (contractStatus) {
        case 'active':
          filter.contractEndDate = { $gte: now };
          break;
        case 'expired':
          filter.contractEndDate = { $lt: now };
          break;
        case 'expiring_soon':
          filter.contractEndDate = { 
            $gte: now, 
            $lte: thirtyDaysFromNow 
          };
          break;
      }
    }

    // اجرای کوئری با populate
    const [institutions, total] = await Promise.all([
      Institution.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Institution.countDocuments(filter)
    ]);

    // محاسبه اطلاعات پیگینیشن
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: {
        institutions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error: any) {
    console.error('خطا در دریافت لیست نهادها:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست نهادها',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/institutions/{id}:
 *   get:
 *     summary: دریافت جزئیات یک نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: شناسه نهاد
 *     responses:
 *       200:
 *         description: جزئیات نهاد
 *       404:
 *         description: نهاد یافت نشد
 */
export const getInstitutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'شناسه نهاد نامعتبر است'
      });
      return;
    }

    const institution = await Institution.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'نهاد مورد نظر یافت نشد'
      });
      return;
    }

    // دریافت آمار دانش‌آموزان
    const studentsStats = await User.aggregate([
      { $match: { institutionId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          activeStudents: {
            $sum: {
              $cond: [
                { $ne: ['$institutionalDiscountPercentage', 0] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // بروزرسانی آمار در صورت نیاز
    if (studentsStats.length > 0) {
      const stats = studentsStats[0];
      if (institution.totalStudents !== stats.totalStudents || 
          institution.activeStudents !== stats.activeStudents) {
        await Institution.findByIdAndUpdate(id, {
          totalStudents: stats.totalStudents,
          activeStudents: stats.activeStudents
        });
        
        institution.totalStudents = stats.totalStudents;
        institution.activeStudents = stats.activeStudents;
      }
    }

    res.status(200).json({
      success: true,
      data: institution
    });

  } catch (error: any) {
    console.error('خطا در دریافت جزئیات نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت جزئیات نهاد',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/institutions:
 *   post:
 *     summary: ایجاد نهاد جدید
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institution'
 *     responses:
 *       201:
 *         description: نهاد با موفقیت ایجاد شد
 *       400:
 *         description: داده‌های ورودی نامعتبر
 */
export const createInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      nameEn,
      type,
      description,
      contactInfo,
      defaultDiscountSettings,
      enrollmentSettings,
      establishedYear,
      logo,
      features,
      contractStartDate,
      contractEndDate,
      contractTerms,
      notes,
    } = req.body;

    // اعتبارسنجی فیلدهای ضروری
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'نام نهاد الزامی است',
      });
      return;
    }

    if (!type) {
      res.status(400).json({
        success: false,
        message: 'نوع نهاد الزامی است',
      });
      return;
    }

    if (!contactInfo || !contactInfo.email || !contactInfo.phone) {
      res.status(400).json({
        success: false,
        message: 'اطلاعات تماس (ایمیل و شماره تلفن) الزامی است',
      });
      return;
    }

    // بررسی تکراری نبودن نام
    const existingInstitution = await Institution.findOne({ 
      name: new RegExp(`^${name}$`, 'i'),
      isActive: true 
    });

    if (existingInstitution) {
      res.status(400).json({
        success: false,
        message: 'نهادی با این نام قبلاً ثبت شده است',
      });
      return;
    }

    // بررسی تکراری نبودن کد ثبت‌نام
    if (enrollmentSettings?.enrollmentCode) {
      const existingCode = await Institution.findOne({
        'enrollmentSettings.enrollmentCode': enrollmentSettings.enrollmentCode.toUpperCase(),
        isActive: true,
      });

      if (existingCode) {
        res.status(400).json({
          success: false,
          message: 'کد ثبت‌نام قبلاً استفاده شده است',
        });
        return;
      }
    }

    // ایجاد نهاد جدید
    const newInstitution = new Institution({
      name,
      nameEn,
      type,
      description,
      contactInfo,
      defaultDiscountSettings: {
        defaultDiscountPercentage: defaultDiscountSettings?.defaultDiscountPercentage || 0,
        defaultDiscountAmount: defaultDiscountSettings?.defaultDiscountAmount || 0,
        maxDiscountPercentage: defaultDiscountSettings?.maxDiscountPercentage || 50,
        allowCustomDiscounts: defaultDiscountSettings?.allowCustomDiscounts ?? true,
        discountValidityDays: defaultDiscountSettings?.discountValidityDays || 365,
      },
      enrollmentSettings: {
        enrollmentCode: enrollmentSettings?.enrollmentCode || '', // خودکار تولید می‌شود
        codeExpirationDate: enrollmentSettings?.codeExpirationDate,
        maxStudents: enrollmentSettings?.maxStudents,
        autoApproveStudents: enrollmentSettings?.autoApproveStudents || false,
        requireApproval: enrollmentSettings?.requireApproval ?? true,
      },
      establishedYear,
      logo,
      features: features || [],
      contractStartDate,
      contractEndDate,
      contractTerms,
      notes,
      createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    const savedInstitution = await newInstitution.save();

    res.status(201).json({
      success: true,
      message: 'نهاد با موفقیت ایجاد شد',
      data: savedInstitution,
    });

  } catch (error) {
    console.error('خطا در ایجاد نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد نهاد',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * @swagger
 * /api/institutions/{id}:
 *   put:
 *     summary: بروزرسانی نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: شناسه نهاد
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Institution'
 *     responses:
 *       200:
 *         description: نهاد با موفقیت بروزرسانی شد
 *       404:
 *         description: نهاد یافت نشد
 */
export const updateInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // حذف فیلدهایی که نباید به‌روزرسانی شوند
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData._id;

    // اضافه کردن شناسه کاربر ویرایش‌کننده
    updateData.lastModifiedBy = new mongoose.Types.ObjectId(req.user._id);

    // بررسی وجود نهاد
    const existingInstitution = await Institution.findById(id);
    if (!existingInstitution) {
      res.status(404).json({
        success: false,
        message: 'نهاد یافت نشد',
      });
      return;
    }

    // بررسی تکراری نبودن نام (در صورت تغییر)
    if (updateData.name && updateData.name !== existingInstitution.name) {
      const duplicateName = await Institution.findOne({
        name: new RegExp(`^${updateData.name}$`, 'i'),
        _id: { $ne: id },
        isActive: true,
      });

      if (duplicateName) {
        res.status(400).json({
          success: false,
          message: 'نهادی با این نام قبلاً ثبت شده است',
        });
        return;
      }
    }

    // بررسی تکراری نبودن کد ثبت‌نام (در صورت تغییر)
    if (updateData.enrollmentSettings?.enrollmentCode) {
      const newCode = updateData.enrollmentSettings.enrollmentCode.toUpperCase();
      if (newCode !== existingInstitution.enrollmentSettings.enrollmentCode) {
        const duplicateCode = await Institution.findOne({
          'enrollmentSettings.enrollmentCode': newCode,
          _id: { $ne: id },
          isActive: true,
        });

        if (duplicateCode) {
          res.status(400).json({
            success: false,
            message: 'کد ثبت‌نام قبلاً استفاده شده است',
          });
          return;
        }
      }
    }

    // به‌روزرسانی نهاد
    const updatedInstitution = await Institution.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy lastModifiedBy', 'name email');

    res.json({
      success: true,
      message: 'نهاد با موفقیت به‌روزرسانی شد',
      data: updatedInstitution,
    });

  } catch (error) {
    console.error('خطا در به‌روزرسانی نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی نهاد',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * @swagger
 * /api/institutions/{id}:
 *   delete:
 *     summary: حذف نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: شناسه نهاد
 *     responses:
 *       200:
 *         description: نهاد با موفقیت حذف شد
 *       404:
 *         description: نهاد یافت نشد
 */
export const deleteInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'نهاد یافت نشد',
      });
      return;
    }

    // بررسی وجود دانش‌آموزان مرتبط
    const studentsCount = await User.countDocuments({
      institutionId: id,
      role: 'student',
    });

    if (studentsCount > 0) {
      res.status(400).json({
        success: false,
        message: `امکان حذف وجود ندارد. ${studentsCount} دانش‌آموز با این نهاد مرتبط هستند`,
        data: { studentsCount },
      });
      return;
    }

    // غیرفعال کردن نهاد
    institution.isActive = false;
    institution.lastModifiedBy = new mongoose.Types.ObjectId(req.user._id);
    await institution.save();

    res.json({
      success: true,
      message: 'نهاد با موفقیت غیرفعال شد',
    });

  } catch (error) {
    console.error('خطا در حذف نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف نهاد',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * @swagger
 * /api/institutions/stats:
 *   get:
 *     summary: آمار کلی نهادها
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: آمار نهادها
 */
export const getInstitutionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalInstitutions = await Institution.countDocuments();
    const activeInstitutions = await Institution.countDocuments({ isActive: true });
    const inactiveInstitutions = totalInstitutions - activeInstitutions;

    // آمار بر اساس نوع
    const typeStats = await Institution.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // آمار تعداد دانش‌آموزان
    const studentsStats = await User.aggregate([
      { $match: { role: 'student', institutionId: { $exists: true } } },
      { $group: { _id: '$institutionId', studentCount: { $sum: 1 } } },
      { $group: { 
        _id: null, 
        totalStudents: { $sum: '$studentCount' },
        avgStudentsPerInstitution: { $avg: '$studentCount' },
        maxStudentsPerInstitution: { $max: '$studentCount' },
        minStudentsPerInstitution: { $min: '$studentCount' }
      }},
    ]);

    // نهادهای اخیراً ایجاد شده
    const recentInstitutions = await Institution.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name type createdAt studentCount')
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: {
        overview: {
          total: totalInstitutions,
          active: activeInstitutions,
          inactive: inactiveInstitutions,
        },
        typeDistribution: typeStats,
        studentsStatistics: studentsStats[0] || {
          totalStudents: 0,
          avgStudentsPerInstitution: 0,
          maxStudentsPerInstitution: 0,
          minStudentsPerInstitution: 0,
        },
        recentInstitutions,
      },
    });

  } catch (error) {
    console.error('خطا در دریافت آمار نهادها:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار نهادها',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * @swagger
 * /api/institutions/{id}/students:
 *   get:
 *     summary: لیست دانش‌آموزان یک نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: شناسه نهاد
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: تعداد نتایج در هر صفحه
 *     responses:
 *       200:
 *         description: لیست دانش‌آموزان
 */
export const getInstitutionStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'شناسه نهاد نامعتبر است'
      });
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // بررسی وجود نهاد
    const institution = await Institution.findById(id);
    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'نهاد مورد نظر یافت نشد'
      });
      return;
    }

    const [students, total] = await Promise.all([
      User.find({ institutionId: id })
        .select('name email nationalCode phoneNumber institutionalDiscountPercentage institutionalDiscountAmount enrollmentCode createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments({ institutionId: id })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        students,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        institution: {
          name: institution.name,
          uniqueId: institution.uniqueId
        }
      }
    });

  } catch (error: any) {
    console.error('خطا در دریافت لیست دانش‌آموزان نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست دانش‌آموزان',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/institutions/enrollment-code/{code}:
 *   get:
 *     summary: یافتن نهاد با کد ثبت‌نام
 *     tags: [Institution]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: کد ثبت‌نام
 *     responses:
 *       200:
 *         description: اطلاعات نهاد
 *       404:
 *         description: کد ثبت‌نام یافت نشد
 */
export const getInstitutionByEnrollmentCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const institution = await Institution.findOne({
      enrollmentCode: code.toUpperCase(),
      isActive: true,
      'defaultDiscountSettings.isActive': true
    }).select('name uniqueId type defaultDiscountSettings enrollmentCode contractEndDate');

    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'کد ثبت‌نام نامعتبر یا منقضی است'
      });
      return;
    }

    // بررسی انقضای قرارداد
    if (institution.contractEndDate && institution.contractEndDate < new Date()) {
      res.status(400).json({
        success: false,
        message: 'قرارداد این نهاد به پایان رسیده است'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        institutionId: institution._id,
        name: institution.name,
        type: institution.type,
        discountPercentage: institution.defaultDiscountSettings.discountPercentage || 0,
        discountAmount: institution.defaultDiscountSettings.discountAmount || 0
      }
    });

  } catch (error: any) {
    console.error('خطا در یافتن نهاد با کد ثبت‌نام:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در یافتن نهاد',
      error: error.message
    });
  }
};

/**
 * بازیابی نهاد (فعال کردن مجدد)
 * PATCH /api/admin/institutions/:id/restore
 */
export const restoreInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'نهاد یافت نشد',
      });
      return;
    }

    // فعال کردن مجدد نهاد
    institution.isActive = true;
    institution.lastModifiedBy = new mongoose.Types.ObjectId(req.user._id);
    await institution.save();

    res.json({
      success: true,
      message: 'نهاد با موفقیت بازیابی شد',
      data: institution,
    });

  } catch (error) {
    console.error('خطا در بازیابی نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بازیابی نهاد',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

/**
 * جستجو در نهادها با کد ثبت‌نام
 * GET /api/institutions/search/:enrollmentCode
 */
export const findByEnrollmentCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentCode } = req.params;

    if (!enrollmentCode) {
      res.status(400).json({
        success: false,
        message: 'کد ثبت‌نام الزامی است',
      });
      return;
    }

    const institution = await Institution.findByEnrollmentCode(enrollmentCode);

    if (!institution) {
      res.status(404).json({
        success: false,
        message: 'نهادی با این کد ثبت‌نام یافت نشد',
      });
      return;
    }

    // بررسی اعتبار ثبت‌نام
    if (!institution.isEnrollmentValid()) {
      res.status(400).json({
        success: false,
        message: 'کد ثبت‌نام منقضی شده یا نهاد غیرفعال است',
      });
      return;
    }

    // بررسی ظرفیت
    if (!institution.canAcceptMoreStudents()) {
      res.status(400).json({
        success: false,
        message: 'ظرفیت نهاد تکمیل شده است',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: institution._id,
        name: institution.name,
        type: institution.type,
        enrollmentSettings: institution.enrollmentSettings,
        defaultDiscountSettings: institution.defaultDiscountSettings,
      },
    });

  } catch (error) {
    console.error('خطا در جستجوی نهاد:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در جستجوی نهاد',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
}; 