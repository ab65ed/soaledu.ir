/**
 * مسیرهای API تماس با ما - Contact Routes
 * @description تعریف مسیرهای API برای مدیریت پیام‌های تماس
 */

import express, { Request, Response, RequestHandler } from 'express';
import Contact, { ContactCreateData, ContactUpdateData } from '../models/contact';

const router = express.Router();

/**
 * Public Routes
 */

// دریافت آمار پیام‌ها (باید قبل از /:id باشد)
const getStats: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Contact.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار'
    });
  }
};

// ایجاد پیام تماس جدید (عمومی)
const createContact: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

    const contactData: ContactCreateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      userAgent: userAgent || req.get('User-Agent'),
      ipAddress: ipAddress || req.ip,
      userId: userId || undefined
    };

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد',
      data: contact.toContactData()
    });

  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال پیام'
    });
  }
};

// دریافت لیست پیام‌ها (عمومی برای تست)
const getContacts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority, 
      category 
    } = req.query;

    const options = {
      limit: Math.min(Number(limit), 100), // حداکثر 100
      skip: (Number(page) - 1) * Number(limit),
      status: status as any,
      priority: priority as any,
      category: category as any
    };

    const contacts = await Contact.findAll(options);
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

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام‌ها'
    });
  }
};

// دریافت پیام بر اساس ID
const getContactById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

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

  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام'
    });
  }
};

// بروزرسانی پیام
const updateContact: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: ContactUpdateData = req.body;

    const contact = await Contact.findById(id);
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

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی پیام'
    });
  }
};

// حذف پیام
const deleteContact: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

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

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف پیام'
    });
  }
};

// پاسخ به پیام تماس
const replyToContact: RequestHandler = async (req: Request, res: Response): Promise<void> => {
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

    const contact = await Contact.findById(id);
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

  } catch (error) {
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

export default router; 