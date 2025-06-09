/**
 * Ticket Routes
 *
 * Handles all ticket-related operations including CRUD, file uploads, and status management
 */

// @ts-nocheck
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protectRoute as auth } from '../middlewares/auth';
import Ticket from '../models/ticket.model';
import User from '../models/user.model';
import { RequestWithUser, TicketStatus, TicketPriority, TicketCategory, asyncHandler } from '../types/index';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/tickets');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فرمت فایل مجاز نیست. فقط PDF، PNG و JPG پذیرفته می‌شود.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3 // Maximum 3 files per ticket
  }
});

interface CreateTicketBody {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

interface TicketQuery {
  page?: string;
  limit?: string;
  status?: TicketStatus;
  category?: TicketCategory;
  priority?: TicketPriority;
}

interface AddResponseBody {
  message: string;
}

// Create new ticket
router.post('/create', auth, upload.array('attachments', 3), async (req: RequestWithUser<{}, any, CreateTicketBody>, res: Response) => {
  try {
    const { title, description, category, priority } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      res.status(400).json({
        success: false,
        message: 'عنوان، توضیحات و دسته‌بندی الزامی است'
      });
      return;
    }

    // Process attachments
    const attachments: any[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        });
      });
    }

    // Create ticket
    const ticket = new Ticket({
      user: req.user?.id,
      subject: title,
      message: description,
      category,
      priority: priority || 'low',
      attachments
    });

    await ticket.save();

    // Populate user information
    await ticket.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'تیکت با موفقیت ایجاد شد',
      data: ticket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);

    // Clean up uploaded files if ticket creation fails
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد تیکت'
    });
  }
});

// Get user's tickets
router.get('/my-tickets', auth, async (req: Request<{}, any, any, TicketQuery> & RequestWithUser, res: Response) => {
  try {
    const { page = '1', limit = '10', status, category, priority } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter: any = { user: req.user?.id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role')
      .populate('responses.user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Ticket.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تیکت‌ها'
    });
  }
});

// Get single ticket details
router.get('/:id', auth, async (req: RequestWithUser, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role')
      .populate('responses.user', 'name email role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'تیکت پیدا نشد'
      });
    }

    // Check if user owns the ticket or is admin/support
    if ((ticket as any).user._id.toString() !== req.user?.id &&
        !['admin', 'support'].includes(req.user?.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تیکت'
    });
  }
});

// Add response to ticket
router.post('/:id/response', auth, async (req: RequestWithUser<{ id: string }, any, AddResponseBody>, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'پیام نمی‌تواند خالی باشد'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'تیکت پیدا نشد'
      });
    }

    // Check if user owns the ticket or is admin/support
    if ((ticket as any).user.toString() !== req.user?.id &&
        !['admin', 'support'].includes(req.user?.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    // Add response using the model method
    await (ticket as any).addResponse(req.user?.id, message);

    // Populate the updated ticket
    await ticket.populate('user', 'name email');
    await ticket.populate('assignedTo', 'name email role');
    await ticket.populate('responses.user', 'name email role');

    res.json({
      success: true,
      message: 'پاسخ با موفقیت اضافه شد',
      data: ticket
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن پاسخ'
    });
  }
});

// Update ticket status (Admin/Support only)
router.patch('/:id/status', auth, async (req: RequestWithUser<{ id: string }, any, { status: TicketStatus }>, res: Response) => {
  try {
    if (!['admin', 'support'].includes(req.user?.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'فقط ادمین و پشتیبان می‌توانند وضعیت تیکت را تغییر دهند'
      });
    }

    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت معتبر نیست'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'تیکت پیدا نشد'
      });
    }

    // Update status using the model method
    await (ticket as any).updateStatus(status);

    res.json({
      success: true,
      message: 'وضعیت تیکت با موفقیت به‌روزرسانی شد',
      data: ticket
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی وضعیت تیکت'
    });
  }
});

// Assign ticket to support staff (Admin only)
router.patch('/:id/assign', auth, async (req: RequestWithUser<{ id: string }, any, { assignedTo: string }>, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'فقط ادمین می‌تواند تیکت را واگذار کند'
      });
    }

    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'شناسه کاربر برای واگذاری الزامی است'
      });
    }

    // Verify the assigned user exists and has appropriate role
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['admin', 'support'].includes((assignedUser as any).role)) {
      return res.status(400).json({
        success: false,
        message: 'کاربر انتخاب شده معتبر نیست یا نقش مناسب ندارد'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'تیکت پیدا نشد'
      });
    }

    // Assign ticket using the model method
    await (ticket as any).assignTo(assignedTo);

    // Populate the updated ticket
    await ticket.populate('assignedTo', 'name email role');

    res.json({
      success: true,
      message: 'تیکت با موفقیت واگذار شد',
      data: ticket
    });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در واگذاری تیکت'
    });
  }
});

// Get all tickets (Admin/Support only)
router.get('/admin/all', auth, async (req: Request<{}, any, any, TicketQuery> & RequestWithUser, res: Response) => {
  try {
    if (!['admin', 'support'].includes(req.user?.role || '')) {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    const { page = '1', limit = '10', status, category, priority } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Support staff can only see assigned tickets
    if (req.user?.role === 'support') {
      filter.assignedTo = req.user.id;
    }

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Ticket.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تیکت‌ها'
    });
  }
});

// Get ticket statistics (Admin only)
router.get('/admin/stats', auth, async (req: RequestWithUser, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز'
      });
    }

    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });

    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const ticketsByPriority = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalTickets,
        statusBreakdown: {
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
          closed: closedTickets
        },
        categoryBreakdown: ticketsByCategory,
        priorityBreakdown: ticketsByPriority
      }
    });
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار تیکت‌ها'
    });
  }
});

export default router; 