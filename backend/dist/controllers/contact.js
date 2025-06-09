"use strict";
/**
 * کنترلر تماس با ما - Contact Controller
 * @description مدیریت پیام‌های تماس کاربران با Parse Server
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactStats = exports.deleteContact = exports.updateContact = exports.getContactById = exports.getContacts = exports.createContact = void 0;
const node_1 = __importDefault(require("parse/node"));
const zod_1 = require("zod");
const errorHandler_1 = require("../middlewares/errorHandler");
// Validation schemas
const contactCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').max(100, 'نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد'),
    email: zod_1.z.string().email('فرمت ایمیل صحیح نیست'),
    message: zod_1.z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد').max(2000, 'پیام نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'),
    userAgent: zod_1.z.string().optional(),
    ipAddress: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional()
});
const contactUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'read', 'replied', 'closed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    category: zod_1.z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']).optional(),
    assignedTo: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    response: zod_1.z.string().optional()
});
const contactQuerySchema = zod_1.z.object({
    limit: zod_1.z.string().transform(Number).optional(),
    skip: zod_1.z.string().transform(Number).optional(),
    status: zod_1.z.enum(['pending', 'read', 'replied', 'closed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    category: zod_1.z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']).optional(),
    search: zod_1.z.string().optional()
});
// Helper functions
function autoCategorizeMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('خطا') || lowerMessage.includes('باگ') || lowerMessage.includes('مشکل')) {
        return { category: 'bug_report', priority: 'high' };
    }
    else if (lowerMessage.includes('قابلیت') || lowerMessage.includes('ویژگی') || lowerMessage.includes('پیشنهاد')) {
        return { category: 'feature_request', priority: 'medium' };
    }
    else if (lowerMessage.includes('فنی') || lowerMessage.includes('تکنیکال') || lowerMessage.includes('عملکرد')) {
        return { category: 'technical', priority: 'high' };
    }
    else if (lowerMessage.includes('پرداخت') || lowerMessage.includes('مالی') || lowerMessage.includes('کیف پول')) {
        return { category: 'billing', priority: 'high' };
    }
    else {
        return { category: 'general', priority: 'medium' };
    }
}
function autoPrioritizeMessage(message, currentPriority) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('فوری') || lowerMessage.includes('اضطراری') || lowerMessage.includes('مهم')) {
        return 'urgent';
    }
    else if (lowerMessage.includes('سریع') || lowerMessage.includes('خطا') || lowerMessage.includes('کار نمی‌کند')) {
        return 'high';
    }
    else if (lowerMessage.includes('وقت دارد') || lowerMessage.includes('عجله ندارد')) {
        return 'low';
    }
    return currentPriority;
}
/**
 * ایجاد پیام تماس جدید
 * POST /api/contact
 */
const createContact = async (req, res) => {
    try {
        // Validate input
        const validatedData = contactCreateSchema.parse(req.body);
        // Create new contact object
        const Contact = node_1.default.Object.extend('Contact');
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
        if (validatedData.userAgent)
            contact.set('userAgent', validatedData.userAgent);
        if (validatedData.ipAddress)
            contact.set('ipAddress', validatedData.ipAddress);
        if (validatedData.userId)
            contact.set('userId', validatedData.userId);
        // Set default values
        contact.set('tags', []);
        // Save to Parse Server
        const savedContact = await contact.save();
        // Log security event
        console.log(`[SECURITY] New contact message created: ${savedContact.id} from ${validatedData.email}`);
        const responseData = {
            id: savedContact.id,
            name: savedContact.get('name'),
            email: savedContact.get('email'),
            message: savedContact.get('message'),
            status: savedContact.get('status'),
            priority: savedContact.get('priority'),
            category: savedContact.get('category'),
            createdAt: savedContact.createdAt
        };
        res.status(201).json((0, errorHandler_1.createSuccessResponse)(responseData, 'پیام شما با موفقیت ارسال شد'));
    }
    catch (error) {
        console.error('[ERROR] Create contact failed:', error);
        if (error instanceof zod_1.z.ZodError) {
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
    }
};
exports.createContact = createContact;
/**
 * دریافت لیست پیام‌های تماس
 * GET /api/contact
 */
const getContacts = async (req, res) => {
    try {
        // Validate query parameters
        const queryParams = contactQuerySchema.parse(req.query);
        // Create query
        const Contact = node_1.default.Object.extend('Contact');
        let query = new node_1.default.Query(Contact);
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
            const nameQuery = new node_1.default.Query(Contact);
            nameQuery.contains('name', searchTerm);
            const emailQuery = new node_1.default.Query(Contact);
            emailQuery.contains('email', searchTerm);
            const messageQuery = new node_1.default.Query(Contact);
            messageQuery.contains('message', searchTerm);
            query = node_1.default.Query.or(nameQuery, emailQuery, messageQuery);
        }
        // Pagination
        if (queryParams.limit) {
            query.limit(queryParams.limit);
        }
        else {
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
                count: contacts.length,
                limit: queryParams.limit || 20,
                skip: queryParams.skip || 0
            }
        });
    }
    catch (error) {
        console.error('[ERROR] Get contacts failed:', error);
        if (error instanceof zod_1.z.ZodError) {
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
    }
};
exports.getContacts = getContacts;
/**
 * دریافت پیام تماس بر اساس ID
 * GET /api/contact/:id
 */
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'شناسه پیام الزامی است'
            });
            return;
        }
        // Find contact by ID
        const Contact = node_1.default.Object.extend('Contact');
        const query = new node_1.default.Query(Contact);
        const contact = await query.get(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
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
    }
    catch (error) {
        console.error('[ERROR] Get contact by ID failed:', error);
        if (error.code === node_1.default.Error.OBJECT_NOT_FOUND) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت پیام'
        });
    }
};
exports.getContactById = getContactById;
/**
 * بروزرسانی پیام تماس
 * PUT /api/contact/:id
 */
const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'شناسه پیام الزامی است'
            });
            return;
        }
        // Validate input
        const validatedData = contactUpdateSchema.parse(req.body);
        // Find contact by ID
        const Contact = node_1.default.Object.extend('Contact');
        const query = new node_1.default.Query(Contact);
        const contact = await query.get(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
        }
        // Update fields
        if (validatedData.status)
            contact.set('status', validatedData.status);
        if (validatedData.priority)
            contact.set('priority', validatedData.priority);
        if (validatedData.category)
            contact.set('category', validatedData.category);
        if (validatedData.assignedTo)
            contact.set('assignedTo', validatedData.assignedTo);
        if (validatedData.tags)
            contact.set('tags', validatedData.tags);
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
    }
    catch (error) {
        console.error('[ERROR] Update contact failed:', error);
        if (error instanceof zod_1.z.ZodError) {
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
        if (error.code === node_1.default.Error.OBJECT_NOT_FOUND) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'خطا در بروزرسانی پیام'
        });
    }
};
exports.updateContact = updateContact;
/**
 * حذف پیام تماس
 * DELETE /api/contact/:id
 */
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'شناسه پیام الزامی است'
            });
            return;
        }
        // Find contact by ID
        const Contact = node_1.default.Object.extend('Contact');
        const query = new node_1.default.Query(Contact);
        const contact = await query.get(id);
        if (!contact) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
        }
        // Delete contact
        await contact.destroy();
        // Log security event
        console.log(`[SECURITY] Contact message deleted: ${id}`);
        res.json({
            success: true,
            message: 'پیام با موفقیت حذف شد'
        });
    }
    catch (error) {
        console.error('[ERROR] Delete contact failed:', error);
        if (error.code === node_1.default.Error.OBJECT_NOT_FOUND) {
            res.status(404).json({
                success: false,
                message: 'پیام مورد نظر یافت نشد'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'خطا در حذف پیام'
        });
    }
};
exports.deleteContact = deleteContact;
/**
 * دریافت آمار پیام‌های تماس
 * GET /api/contact/stats
 */
const getContactStats = async (req, res) => {
    try {
        const Contact = node_1.default.Object.extend('Contact');
        // Count by status
        const pendingQuery = new node_1.default.Query(Contact);
        pendingQuery.equalTo('status', 'pending');
        const pendingCount = await pendingQuery.count();
        const readQuery = new node_1.default.Query(Contact);
        readQuery.equalTo('status', 'read');
        const readCount = await readQuery.count();
        const repliedQuery = new node_1.default.Query(Contact);
        repliedQuery.equalTo('status', 'replied');
        const repliedCount = await repliedQuery.count();
        const closedQuery = new node_1.default.Query(Contact);
        closedQuery.equalTo('status', 'closed');
        const closedCount = await closedQuery.count();
        // Count by priority
        const lowQuery = new node_1.default.Query(Contact);
        lowQuery.equalTo('priority', 'low');
        const lowCount = await lowQuery.count();
        const mediumQuery = new node_1.default.Query(Contact);
        mediumQuery.equalTo('priority', 'medium');
        const mediumCount = await mediumQuery.count();
        const highQuery = new node_1.default.Query(Contact);
        highQuery.equalTo('priority', 'high');
        const highCount = await highQuery.count();
        const urgentQuery = new node_1.default.Query(Contact);
        urgentQuery.equalTo('priority', 'urgent');
        const urgentCount = await urgentQuery.count();
        // Total count
        const totalQuery = new node_1.default.Query(Contact);
        const totalCount = await totalQuery.count();
        res.json({
            success: true,
            data: {
                total: totalCount,
                byStatus: {
                    pending: pendingCount,
                    read: readCount,
                    replied: repliedCount,
                    closed: closedCount
                },
                byPriority: {
                    low: lowCount,
                    medium: mediumCount,
                    high: highCount,
                    urgent: urgentCount
                }
            }
        });
    }
    catch (error) {
        console.error('[ERROR] Get contact stats failed:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت آمار'
        });
    }
};
exports.getContactStats = getContactStats;
//# sourceMappingURL=contact.js.map