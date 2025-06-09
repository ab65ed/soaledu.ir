/**
 * کنترلر تماس با ما - Contact Controller
 * @description مدیریت پیام‌های تماس کاربران با Parse Server
 */

import { Request, Response } from 'express';
import Parse from 'parse/node';
import { z } from 'zod';

// Validation schemas
const contactCreateSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100, 'نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'),
  email: z.string().email('فرمت ایمیل صحیح نیست'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد').max(2000, 'پیام نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  userId: z.string().optional()
});

const contactUpdateSchema = z.object({
  status: z.enum(['pending', 'read', 'replied', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']).optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
  response: z.string().optional()
});

const contactQuerySchema = z.object({
  limit: z.string().transform(Number).optional(),
  skip: z.string().transform(Number).optional(),
  status: z.enum(['pending', 'read', 'replied', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']).optional(),
  search: z.string().optional()
});

// Helper functions
function autoCategorizeMessage(message: string): { category: string; priority: string } {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('خطا') || lowerMessage.includes('باگ') || lowerMessage.includes('مشکل')) {
    return { category: 'bug_report', priority: 'high' };
  } else if (lowerMessage.includes('قابلیت') || lowerMessage.includes('ویژگی') || lowerMessage.includes('پیشنهاد')) {
    return { category: 'feature_request', priority: 'medium' };
  } else if (lowerMessage.includes('فنی') || lowerMessage.includes('تکنیکال') || lowerMessage.includes('عملکرد')) {
    return { category: 'technical', priority: 'high' };
  } else if (lowerMessage.includes('پرداخت') || lowerMessage.includes('مالی') || lowerMessage.includes('کیف پول')) {
    return { category: 'billing', priority: 'high' };
  } else {
    return { category: 'general', priority: 'medium' };
  }
}

function autoPrioritizeMessage(message: string, currentPriority: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('فوری') || lowerMessage.includes('اضطراری') || lowerMessage.includes('مهم')) {
    return 'urgent';
  } else if (lowerMessage.includes('سریع') || lowerMessage.includes('خطا') || lowerMessage.includes('کار نمی‌کند')) {
    return 'high';
  } else if (lowerMessage.includes('وقت دارد') || lowerMessage.includes('عجله ندارد')) {
    return 'low';
  }
  
  return currentPriority;
}

/**
 * ایجاد پیام تماس جدید
 * POST /api/contact
 */
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validatedData = contactCreateSchema.parse(req.body);
    
    // Create new contact object
    const Contact = Parse.Object.extend('Contact');
    const contact = new Contact();
    
    // Set basic fields
    contact.set('name', validatedData.name);
    contact.set('email', validatedData.email);
    contact.set('message', validatedData.message);
    contact.set('status', 'pending');
    
    // Auto-categorize and prioritize
    const { category, priority } = autoCategorizeMessage(validatedData.message);
    contact.set('category', category);
    contact.set('priority', autoPrioritizeMessage(validatedData.message, priority));
    
    // Set optional fields
    if (validatedData.userAgent) contact.set('userAgent', validatedData.userAgent);
    if (validatedData.ipAddress) contact.set('ipAddress', validatedData.ipAddress);
    if (validatedData.userId) contact.set('userId', validatedData.userId);
    
    // Set default values
    contact.set('tags', []);
    
    // Save to Parse Server
    const savedContact = await contact.save();
    
    // Log security event
    console.log(`[SECURITY] New contact message created: ${savedContact.id} from ${validatedData.email}`);
    
    res.status(201).json({
      success: true,
      message: 'پیام شما با موفقیت ارسال شد',
      data: {
        id: savedContact.id,
        name: savedContact.get('name'),
        email: savedContact.get('email'),
        message: savedContact.get('message'),
        status: savedContact.get('status'),
        priority: savedContact.get('priority'),
        category: savedContact.get('category'),
        createdAt: savedContact.createdAt
      }
    });
    return;
    
  } catch (error) {
    console.error('[ERROR] Create contact failed:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید'
    });
    return;
  }
};

/**
 * دریافت لیست پیام‌های تماس
 * GET /api/contact
 */
export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const queryParams = contactQuerySchema.parse(req.query);
    
    // Create query
    const Contact = Parse.Object.extend('Contact');
    const query = new Parse.Query(Contact);
    
    // Apply filters
    if (queryParams.status) {
      query.equalTo('status', queryParams.status);
    }
    
    if (queryParams.priority) {
      query.equalTo('priority', queryParams.priority);
    }
    
    if (queryParams.category) {
      query.equalTo('category', queryParams.category);
    }
    
    // Search functionality
    if (queryParams.search) {
      const searchTerm = queryParams.search;
      const nameQuery = new Parse.Query(Contact);
      nameQuery.contains('name', searchTerm);
      
      const emailQuery = new Parse.Query(Contact);
      emailQuery.contains('email', searchTerm);
      
      const messageQuery = new Parse.Query(Contact);
      messageQuery.contains('message', searchTerm);
      
      query._orQuery([nameQuery, emailQuery, messageQuery]);
    }
    
    // Pagination
    if (queryParams.limit) {
      query.limit(queryParams.limit);
    } else {
      query.limit(20); // Default limit
    }
    
    if (queryParams.skip) {
      query.skip(queryParams.skip);
    }
    
    // Sort by creation date (newest first)
    query.descending('createdAt');
    
    // Execute query
    const contacts = await query.find();
    const total = await query.count();
    
    // Format response
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.get('name'),
      email: contact.get('email'),
      message: contact.get('message'),
      status: contact.get('status'),
      priority: contact.get('priority'),
      category: contact.get('category'),
      userAgent: contact.get('userAgent'),
      ipAddress: contact.get('ipAddress'),
      userId: contact.get('userId'),
      assignedTo: contact.get('assignedTo'),
      tags: contact.get('tags') || [],
      response: contact.get('response'),
      responseDate: contact.get('responseDate'),
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }));
    
    res.json({
      success: true,
      data: formattedContacts,
      pagination: {
        total,
        limit: queryParams.limit || 20,
        skip: queryParams.skip || 0,
        hasMore: (queryParams.skip || 0) + formattedContacts.length < total
      }
    });
    
  } catch (error) {
    console.error('[ERROR] Get contacts failed:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'پارامترهای جستجو نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام‌ها'
    });
    return;
  }
};

/**
 * دریافت پیام تماس بر اساس ID
 * GET /api/contact/:id
 */
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'شناسه پیام الزامی است'
      });
    }
    
    // Find contact by ID
    const Contact = Parse.Object.extend('Contact');
    const query = new Parse.Query(Contact);
    
    const contact = await query.get(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    // Mark as read if it's pending
    if (contact.get('status') === 'pending') {
      contact.set('status', 'read');
      await contact.save();
    }
    
    res.json({
      success: true,
      data: {
        id: contact.id,
        name: contact.get('name'),
        email: contact.get('email'),
        message: contact.get('message'),
        status: contact.get('status'),
        priority: contact.get('priority'),
        category: contact.get('category'),
        userAgent: contact.get('userAgent'),
        ipAddress: contact.get('ipAddress'),
        userId: contact.get('userId'),
        assignedTo: contact.get('assignedTo'),
        tags: contact.get('tags') || [],
        response: contact.get('response'),
        responseDate: contact.get('responseDate'),
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }
    });
    
  } catch (error) {
    console.error('[ERROR] Get contact by ID failed:', error);
    
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پیام'
    });
  }
};

/**
 * بروزرسانی پیام تماس
 * PUT /api/contact/:id
 */
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'شناسه پیام الزامی است'
      });
    }
    
    // Validate input
    const validatedData = contactUpdateSchema.parse(req.body);
    
    // Find contact by ID
    const Contact = Parse.Object.extend('Contact');
    const query = new Parse.Query(Contact);
    const contact = await query.get(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    // Update fields
    if (validatedData.status) contact.set('status', validatedData.status);
    if (validatedData.priority) contact.set('priority', validatedData.priority);
    if (validatedData.category) contact.set('category', validatedData.category);
    if (validatedData.assignedTo) contact.set('assignedTo', validatedData.assignedTo);
    if (validatedData.tags) contact.set('tags', validatedData.tags);
    
    // Handle response
    if (validatedData.response) {
      contact.set('response', validatedData.response);
      contact.set('responseDate', new Date());
      contact.set('status', 'replied');
    }
    
    // Save changes
    const updatedContact = await contact.save();
    
    // Log security event
    console.log(`[SECURITY] Contact message updated: ${updatedContact.id}`);
    
    res.json({
      success: true,
      message: 'پیام با موفقیت بروزرسانی شد',
      data: {
        id: updatedContact.id,
        name: updatedContact.get('name'),
        email: updatedContact.get('email'),
        message: updatedContact.get('message'),
        status: updatedContact.get('status'),
        priority: updatedContact.get('priority'),
        category: updatedContact.get('category'),
        userAgent: updatedContact.get('userAgent'),
        ipAddress: updatedContact.get('ipAddress'),
        userId: updatedContact.get('userId'),
        assignedTo: updatedContact.get('assignedTo'),
        tags: updatedContact.get('tags') || [],
        response: updatedContact.get('response'),
        responseDate: updatedContact.get('responseDate'),
        createdAt: updatedContact.createdAt,
        updatedAt: updatedContact.updatedAt
      }
    });
    
  } catch (error) {
    console.error('[ERROR] Update contact failed:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'داده‌های ورودی نامعتبر',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی پیام'
    });
  }
};

/**
 * حذف پیام تماس
 * DELETE /api/contact/:id
 */
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'شناسه پیام الزامی است'
      });
    }
    
    // Find contact by ID
    const Contact = Parse.Object.extend('Contact');
    const query = new Parse.Query(Contact);
    const contact = await query.get(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    // Delete contact
    await contact.destroy();
    
    // Log security event
    console.log(`[SECURITY] Contact message deleted: ${id}`);
    
    res.json({
      success: true,
      message: 'پیام با موفقیت حذف شد'
    });
    
  } catch (error) {
    console.error('[ERROR] Delete contact failed:', error);
    
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'پیام مورد نظر یافت نشد'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'خطا در حذف پیام'
    });
  }
};

/**
 * دریافت آمار پیام‌های تماس
 * GET /api/contact/stats
 */
export const getContactStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const Contact = Parse.Object.extend('Contact');
    
    // Total count
    const totalQuery = new Parse.Query(Contact);
    const total = await totalQuery.count();
    
    // Status counts
    const statusCounts = {
      pending: 0,
      read: 0,
      replied: 0,
      closed: 0
    };
    
    for (const status of Object.keys(statusCounts)) {
      const statusQuery = new Parse.Query(Contact);
      statusQuery.equalTo('status', status);
      statusCounts[status as keyof typeof statusCounts] = await statusQuery.count();
    }
    
    // Priority counts
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };
    
    for (const priority of Object.keys(priorityCounts)) {
      const priorityQuery = new Parse.Query(Contact);
      priorityQuery.equalTo('priority', priority);
      priorityCounts[priority as keyof typeof priorityCounts] = await priorityQuery.count();
    }
    
    // Category counts
    const categoryCounts = {
      general: 0,
      technical: 0,
      billing: 0,
      feature_request: 0,
      bug_report: 0
    };
    
    for (const category of Object.keys(categoryCounts)) {
      const categoryQuery = new Parse.Query(Contact);
      categoryQuery.equalTo('category', category);
      categoryCounts[category as keyof typeof categoryCounts] = await categoryQuery.count();
    }
    
    // Recent contacts (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentQuery = new Parse.Query(Contact);
    recentQuery.greaterThan('createdAt', weekAgo);
    const recentCount = await recentQuery.count();
    
    res.json({
      success: true,
      data: {
        total,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        byCategory: categoryCounts,
        recentCount,
        responseRate: total > 0 ? Math.round((statusCounts.replied / total) * 100) : 0
      }
    });
    return;
    
  } catch (error) {
    console.error('[ERROR] Get contact stats failed:', error);
    
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار'
    });
    return;
  }
}; 