/**
 * Institution Routes
 * 
 * مسیرهای API برای مدیریت نهادهای آموزشی
 */

import express from 'express';
import {
  getInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution,
  getInstitutionStats,
  getInstitutionStudents,
  getInstitutionByEnrollmentCode
} from '../controllers/institutionController';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Institution
 *   description: مدیریت نهادهای آموزشی
 */

// مسیرهای عمومی (برای یافتن نهاد با کد ثبت‌نام)
router.get('/enrollment-code/:code', getInstitutionByEnrollmentCode);

// آمار کلی نهادها
router.get('/stats', authenticateToken, requireRole('admin'), getInstitutionStats);

/**
 * @swagger
 * /api/institutions:
 *   get:
 *     summary: لیست نهادهای آموزشی
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
 */
router.get('/', authenticateToken, requireRole('admin'), getInstitutions);

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
 *             type: object
 *             required:
 *               - name
 *               - uniqueId
 *               - type
 *               - defaultDiscountSettings
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام نهاد
 *               uniqueId:
 *                 type: string
 *                 description: شناسه یکتای نهاد
 *               type:
 *                 type: string
 *                 enum: [school, educational_center, university, other]
 *                 description: نوع نهاد
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   contactPerson:
 *                     type: string
 *                   contactPersonTitle:
 *                     type: string
 *               defaultDiscountSettings:
 *                 type: object
 *                 required:
 *                   - isActive
 *                 properties:
 *                   discountPercentage:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 100
 *                   discountAmount:
 *                     type: number
 *                     minimum: 1000
 *                   isActive:
 *                     type: boolean
 *               enrollmentCode:
 *                 type: string
 *                 description: کد ثبت‌نام اختیاری
 *               contractStartDate:
 *                 type: string
 *                 format: date
 *               contractEndDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: نهاد با موفقیت ایجاد شد
 *       400:
 *         description: داده‌های ورودی نامعتبر
 */
router.post('/', authenticateToken, requireRole('admin'), createInstitution);

/**
 * @swagger
 * /api/institutions/{id}:
 *   get:
 *     summary: دریافت جزئیات نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه نهاد
 *     responses:
 *       200:
 *         description: جزئیات نهاد
 *       404:
 *         description: نهاد یافت نشد
 */
router.get('/:id', authenticateToken, requireRole('admin'), getInstitutionById);

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
 *         required: true
 *         schema:
 *           type: string
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
router.put('/:id', authenticateToken, requireRole('admin'), updateInstitution);

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
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه نهاد
 *     responses:
 *       200:
 *         description: نهاد با موفقیت حذف شد
 *       400:
 *         description: نهاد دارای دانش‌آموز است و قابل حذف نیست
 *       404:
 *         description: نهاد یافت نشد
 */
router.delete('/:id', authenticateToken, requireRole('admin'), deleteInstitution);

/**
 * @swagger
 * /api/institutions/{id}/students:
 *   get:
 *     summary: لیست دانش‌آموزان نهاد
 *     tags: [Institution]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       404:
 *         description: نهاد یافت نشد
 */
router.get('/:id/students', authenticateToken, requireRole('admin'), getInstitutionStudents);

export default router; 