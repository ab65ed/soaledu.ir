/**
 * Institution Controller
 *
 * کنترلر مدیریت نهادهای آموزشی (مدارس/مجموعه‌ها)
 */
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
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
export declare const getInstitutions: (req: Request, res: Response) => Promise<void>;
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
export declare const getInstitutionById: (req: Request, res: Response) => Promise<void>;
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
export declare const createInstitution: (req: AuthenticatedRequest, res: Response) => Promise<void>;
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
export declare const updateInstitution: (req: AuthenticatedRequest, res: Response) => Promise<void>;
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
export declare const deleteInstitution: (req: AuthenticatedRequest, res: Response) => Promise<void>;
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
export declare const getInstitutionStats: (req: Request, res: Response) => Promise<void>;
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
export declare const getInstitutionStudents: (req: Request, res: Response) => Promise<void>;
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
export declare const getInstitutionByEnrollmentCode: (req: Request, res: Response) => Promise<void>;
/**
 * بازیابی نهاد (فعال کردن مجدد)
 * PATCH /api/admin/institutions/:id/restore
 */
export declare const restoreInstitution: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * جستجو در نهادها با کد ثبت‌نام
 * GET /api/institutions/search/:enrollmentCode
 */
export declare const findByEnrollmentCode: (req: Request, res: Response) => Promise<void>;
