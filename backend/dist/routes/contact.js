"use strict";
/**
 * مسیرهای API تماس با ما - Contact Routes
 * @description تعریف مسیرهای API برای مدیریت پیام‌های تماس
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contact_1 = __importDefault(require("../models/contact"));
const router = express_1.default.Router();
/**
 * Public Routes
 */
// دریافت آمار پیام‌ها (باید قبل از /:id باشد)
const getStats = async (req, res) => {
    try {
        const stats = await contact_1.default.getStats();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching contact stats:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار'
        });
    }
};
// ایجاد پیام تماس جدید (عمومی)
const createContact = async (req, res) => {
    try {
        const { name, email, message, userAgent, ipAddress, userId } = req.body;
        // Validation
        if (!name || !email || !message) {
            res.status(400).json({
                success: false,
                message: 'نام، ایمیل و پیام الزامی هستند'
            });
            return;
        }
        const contactData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            userAgent: userAgent || req.get('User-Agent'),
            ipAddress: ipAddress || req.ip,
            userId: userId || undefined
        };
        const contact = await contact_1.default.create(contactData);
        res.status(201).json({
            success: true,
            message: 'پیام شما با موفقیت ارسال شد',
            data: contact.toContactData()
        });
    }
    catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در ارسال پیام'
        });
    }
};
// دریافت لیست پیام‌ها (عمومی برای تست)
const getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, priority, category } = req.query;
        const options = {
            limit: Math.min(Number(limit), 100), // حداکثر 100
            skip: (Number(page) - 1) * Number(limit),
            status: status,
            priority: priority,
            category: category
        };
        const contacts = await contact_1.default.findAll(options);
        const contactsData = contacts.map(contact => contact.toContactData());
        res.json({
            success: true,
            data: contactsData,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: contactsData.length
            }
        });
    }
    catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت پیام‌ها'
        });
    }
};
// دریافت پیام بر اساس ID
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contact_1.default.findById(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام یافت نشد'
            });
            return;
        }
        // Mark as read
        contact.markAsRead();
        await contact.save();
        res.json({
            success: true,
            data: contact.toContactData()
        });
    }
    catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت پیام'
        });
    }
};
// بروزرسانی پیام
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const contact = await contact_1.default.findById(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام یافت نشد'
            });
            return;
        }
        await contact.updateContact(updateData);
        res.json({
            success: true,
            message: 'پیام با موفقیت به‌روزرسانی شد',
            data: contact.toContactData()
        });
    }
    catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در به‌روزرسانی پیام'
        });
    }
};
// حذف پیام
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await contact_1.default.findById(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام یافت نشد'
            });
            return;
        }
        await contact.destroy();
        res.json({
            success: true,
            message: 'پیام با موفقیت حذف شد'
        });
    }
    catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در حذف پیام'
        });
    }
};
// پاسخ به پیام تماس
const replyToContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { response, assignedTo } = req.body;
        if (!response) {
            res.status(400).json({
                success: false,
                message: 'متن پاسخ الزامی است'
            });
            return;
        }
        const contact = await contact_1.default.findById(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام یافت نشد'
            });
            return;
        }
        contact.markAsReplied(response, assignedTo);
        await contact.save();
        res.json({
            success: true,
            message: 'پاسخ با موفقیت ارسال شد',
            data: contact.toContactData()
        });
    }
    catch (error) {
        console.error('Error replying to contact:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در ارسال پاسخ'
        });
    }
};
// تعریف routes
router.get('/stats', getStats);
router.post('/', createContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.post('/:id/reply', replyToContact);
exports.default = router;
//# sourceMappingURL=contact.js.map