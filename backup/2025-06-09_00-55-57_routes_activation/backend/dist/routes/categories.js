"use strict";
/**
 * Category Management Routes
 *
 * Handles hierarchical category operations for question organization
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const category_model_1 = __importDefault(require("../models/category.model")); // Changed to less strict import for now
const question_model_1 = __importDefault(require("../models/question.model"));
const router = express_1.default.Router();
// Get all categories with hierarchy support
router.get('/', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { flat = 'false', parentId = null, level, keyword, sortBy = 'sortOrder', sortOrder = 'asc', } = req.query;
        let categories;
        // Cast Category to any to bypass specific static method checks until category.model.ts is typed
        const CategoryModel = category_model_1.default;
        if (flat === 'true') {
            categories = await CategoryModel.getFlatHierarchy();
        }
        else if (keyword) {
            categories = await CategoryModel.searchCategories({
                keyword: keyword,
                level: level ? parseInt(level) : undefined,
                parentId: parentId,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
        }
        else {
            categories = await CategoryModel.getCategoryTree(parentId);
        }
        res.json({
            success: true,
            data: { categories },
        });
    }
    catch (error) {
        next(error);
    }
});
// Get category tree structure
router.get('/tree', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { parent = null } = req.query;
        const CategoryModel = category_model_1.default;
        const categories = await CategoryModel.getCategoryTree(parent);
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        next(error);
    }
});
// Get single category by ID
router.get('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        // Cast req.params.id to any to bypass ObjectId type error for now
        const category = await category_model_1.default.findById(req.params.id)
            .populate('parent', 'name path level')
            .populate('createdBy', 'name email');
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'دسته‌بندی پیدا نشد'
            });
            return;
        }
        const breadcrumb = await category.getBreadcrumb();
        res.json({
            success: true,
            data: {
                ...(category.toObject ? category.toObject() : category),
                breadcrumb
            }
        });
    }
    catch (error) {
        next(error);
    }
});
// Get category breadcrumb
router.get('/:id/breadcrumb', auth_1.protectRoute, async (req, res, next) => {
    try {
        const category = await category_model_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'دسته‌بندی پیدا نشد'
            });
            return;
        }
        const breadcrumb = await category.getBreadcrumb();
        res.json({
            success: true,
            data: breadcrumb
        });
    }
    catch (error) {
        next(error);
    }
});
// Create new category
router.post('/create', auth_1.protectRoute, async (req, res, next) => {
    try {
        if (!req.user || !['admin'].includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'فقط ادمین می‌توانند دسته‌بندی ایجاد کنند'
            });
            return;
        }
        const { name, description, parent, icon, color, sortOrder } = req.body;
        if (!name) {
            res.status(400).json({ success: false, message: 'نام دسته‌بندی الزامی است' });
            return;
        }
        if (parent) {
            const parentCategory = await category_model_1.default.findById(parent);
            if (!parentCategory) {
                res.status(400).json({ success: false, message: 'دسته‌بندی والد معتبر نیست' });
                return;
            }
            if (parentCategory.level >= 2) {
                res.status(400).json({ success: false, message: 'حداکثر عمق دسته‌بندی ۳ سطح است' });
                return;
            }
        }
        const newCategory = new category_model_1.default({
            name,
            description,
            parent: parent || null,
            icon,
            color: color || '#547792',
            sortOrder: sortOrder || 0,
            createdBy: req.user.id
        });
        await newCategory.save();
        await newCategory.populate('parent', 'name path level');
        await newCategory.populate('createdBy', 'name email');
        res.status(201).json({
            success: true,
            message: 'دسته‌بندی با موفقیت ایجاد شد',
            data: newCategory
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'نام دسته‌بندی در این سطح تکراری است'
            });
            return;
        }
        next(error);
    }
});
// Update category
router.put('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        const categoryToUpdate = await category_model_1.default.findById(req.params.id);
        if (!categoryToUpdate) {
            res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = categoryToUpdate.createdBy?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({
                success: false,
                message: 'فقط سازنده دسته‌بندی یا ادمین می‌تواند آن را ویرایش کند'
            });
            return;
        }
        const updateData = { ...req.body };
        delete updateData.createdBy;
        delete updateData.level;
        delete updateData.path;
        if (updateData.parent && updateData.parent !== categoryToUpdate.parent?.toString()) {
            const newParent = await category_model_1.default.findById(updateData.parent);
            if (!newParent) {
                res.status(400).json({ success: false, message: 'دسته‌بندی والد معتبر نیست' });
                return;
            }
            if (newParent.path && categoryToUpdate.path && newParent.path.includes(categoryToUpdate.path)) {
                res.status(400).json({ success: false, message: 'نمی‌توان دسته‌بندی را زیرمجموعه خودش قرار داد' });
                return;
            }
            if (newParent.level >= 2) {
                res.status(400).json({ success: false, message: 'حداکثر عمق دسته‌بندی ۳ سطح است' });
                return;
            }
        }
        Object.assign(categoryToUpdate, updateData);
        await categoryToUpdate.save();
        const CategoryModel = category_model_1.default;
        await CategoryModel.updateQuestionCounts();
        await categoryToUpdate.populate('parent', 'name path level');
        await categoryToUpdate.populate('createdBy', 'name email');
        res.json({
            success: true,
            message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
            data: categoryToUpdate
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'نام دسته‌بندی در این سطح تکراری است'
            });
            return;
        }
        next(error);
    }
});
// Delete category (soft delete)
router.delete('/:id', auth_1.protectRoute, async (req, res, next) => {
    try {
        const categoryToDelete = await category_model_1.default.findById(req.params.id);
        if (!categoryToDelete) {
            res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
            return;
        }
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const isCreator = categoryToDelete.createdBy?.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            res.status(403).json({
                success: false,
                message: 'فقط سازنده دسته‌بندی یا ادمین می‌تواند آن را حذف کند'
            });
            return;
        }
        const hasChildren = await category_model_1.default.findOne({ parent: categoryToDelete._id, isActive: true });
        if (hasChildren) {
            res.status(400).json({
                success: false,
                message: 'نمی‌توان دسته‌بندی دارای زیرمجموعه را حذف کرد'
            });
            return;
        }
        const hasQuestions = await question_model_1.default.findOne({ category: categoryToDelete._id, isActive: true });
        if (hasQuestions) {
            res.status(400).json({
                success: false,
                message: 'نمی‌توان دسته‌بندی دارای سوال را حذف کرد'
            });
            return;
        }
        categoryToDelete.isActive = false;
        await categoryToDelete.save();
        res.json({
            success: true,
            message: 'دسته‌بندی با موفقیت حذف شد'
        });
    }
    catch (error) {
        next(error);
    }
});
// Search categories
router.get('/search', auth_1.protectRoute, async (req, res, next) => {
    try {
        const { keyword, level, parentId, sortBy = 'name', sortOrder = 'asc' } = req.query;
        const CategoryModel = category_model_1.default;
        const categories = await CategoryModel.searchCategories({
            keyword: keyword,
            level: level ? parseInt(level) : undefined,
            parentId: parentId,
            sortBy: sortBy,
            sortOrder: sortOrder
        });
        res.json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        next(error);
    }
});
// Update question counts for all categories
router.post('/update-counts', auth_1.protectRoute, async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'فقط ادمین می‌تواند شمارش سوالات را به‌روزرسانی کند'
            });
            return;
        }
        const CategoryModel = category_model_1.default;
        await CategoryModel.updateQuestionCounts();
        res.json({
            success: true,
            message: 'شمارش سوالات با موفقیت به‌روزرسانی شد'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=categories.js.map