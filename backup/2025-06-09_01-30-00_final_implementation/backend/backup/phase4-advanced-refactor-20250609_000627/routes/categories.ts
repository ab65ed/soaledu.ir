/**
 * Category Management Routes
 *
 * Handles hierarchical category operations for question organization
 */

import express, { Request, Response, NextFunction } from 'express';
import { protectRoute as auth } from '../middlewares/auth';
import Category from '../models/category.model'; // Changed to less strict import for now
import Question from '../models/question.model'; 
import { RequestWithUser } from '../types'; 

const router = express.Router();

// Get all categories with hierarchy support
router.get('/', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      flat = 'false', 
      parentId = null,
      level,
      keyword,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
    } = req.query;

    let categories;
    // Cast Category to any to bypass specific static method checks until category.model.ts is typed
    const CategoryModel = Category as any;

    if (flat === 'true') {
      categories = await CategoryModel.getFlatHierarchy();
    } else if (keyword) {
      categories = await CategoryModel.searchCategories({
        keyword: keyword as string,
        level: level ? parseInt(level as string) : undefined,
        parentId: parentId as string | null,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc', 
      });
    } else {
      categories = await CategoryModel.getCategoryTree(parentId as string | null);
    }

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
});

// Get category tree structure
router.get('/tree', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { parent = null } = req.query;
    const CategoryModel = Category as any;
    const categories = await CategoryModel.getCategoryTree(parent as string | null);
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Get single category by ID
router.get('/:id', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Cast req.params.id to any to bypass ObjectId type error for now
    const category = await Category.findById(req.params.id as any) 
      .populate('parent', 'name path level')
      .populate('createdBy', 'name email');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'دسته‌بندی پیدا نشد'
      });
      return;
    }
    const breadcrumb = await (category as any).getBreadcrumb(); 
    res.json({
      success: true,
      data: {
        ...(category.toObject ? category.toObject() : category), 
        breadcrumb
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get category breadcrumb
router.get('/:id/breadcrumb', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id as any);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'دسته‌بندی پیدا نشد'
      });
      return;
    }
    const breadcrumb = await (category as any).getBreadcrumb();
    res.json({
      success: true,
      data: breadcrumb
    });
  } catch (error) {
    next(error);
  }
});

// Create new category
router.post('/create', auth, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
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
      const parentCategory = await Category.findById(parent as any); 
      if (!parentCategory) {
        res.status(400).json({ success: false, message: 'دسته‌بندی والد معتبر نیست' });
        return;
      }
      if ((parentCategory as any).level >= 2) { 
        res.status(400).json({ success: false, message: 'حداکثر عمق دسته‌بندی ۳ سطح است' });
        return;
      }
    }
    const newCategory = new (Category as any)({
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
  } catch (error: any) { 
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
router.put('/:id', auth, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryToUpdate = await Category.findById(req.params.id as any);
    if (!categoryToUpdate) {
      res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
      return;
    }
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const isCreator = (categoryToUpdate as any).createdBy?.toString() === req.user.id; 
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
    if (updateData.parent && updateData.parent !== (categoryToUpdate as any).parent?.toString()) {
      const newParent = await Category.findById(updateData.parent as any);
      if (!newParent) {
        res.status(400).json({ success: false, message: 'دسته‌بندی والد معتبر نیست' });
        return;
      }
      if ((newParent as any).path && (categoryToUpdate as any).path && (newParent as any).path.includes((categoryToUpdate as any).path)) { 
        res.status(400).json({ success: false, message: 'نمی‌توان دسته‌بندی را زیرمجموعه خودش قرار داد' });
        return;
      }
      if ((newParent as any).level >= 2) {
        res.status(400).json({ success: false, message: 'حداکثر عمق دسته‌بندی ۳ سطح است' });
        return;
      }
    }
    Object.assign(categoryToUpdate, updateData);
    await (categoryToUpdate as any).save();
    const CategoryModel = Category as any;
    await CategoryModel.updateQuestionCounts();
    await (categoryToUpdate as any).populate('parent', 'name path level');
    await (categoryToUpdate as any).populate('createdBy', 'name email');
    res.json({
      success: true,
      message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
      data: categoryToUpdate
    });
  } catch (error: any) { 
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
router.delete('/:id', auth, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryToDelete = await Category.findById(req.params.id as any);
    if (!categoryToDelete) {
      res.status(404).json({ success: false, message: 'دسته‌بندی پیدا نشد' });
      return;
    }
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const isCreator = (categoryToDelete as any).createdBy?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isCreator && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'فقط سازنده دسته‌بندی یا ادمین می‌تواند آن را حذف کند'
      });
      return;
    }
    const hasChildren = await Category.findOne({ parent: (categoryToDelete as any)._id, isActive: true });
    if (hasChildren) {
      res.status(400).json({
        success: false,
        message: 'نمی‌توان دسته‌بندی دارای زیرمجموعه را حذف کرد'
      });
      return;
    }
    const hasQuestions = await Question.findOne({ category: (categoryToDelete as any)._id, isActive: true });
    if (hasQuestions) {
      res.status(400).json({
        success: false,
        message: 'نمی‌توان دسته‌بندی دارای سوال را حذف کرد'
      });
      return;
    }
    (categoryToDelete as any).isActive = false;
    await (categoryToDelete as any).save();
    res.json({
      success: true,
      message: 'دسته‌بندی با موفقیت حذف شد'
    });
  } catch (error) {
    next(error);
  }
});

// Search categories
router.get('/search', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { keyword, level, parentId, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const CategoryModel = Category as any;
    const categories = await CategoryModel.searchCategories({
      keyword: keyword as string,
      level: level ? parseInt(level as string) : undefined,
      parentId: parentId as string | null,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Update question counts for all categories
router.post('/update-counts', auth, async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'فقط ادمین می‌تواند شمارش سوالات را به‌روزرسانی کند'
      });
      return;
    }
    const CategoryModel = Category as any;
    await CategoryModel.updateQuestionCounts();
    res.json({
      success: true,
      message: 'شمارش سوالات با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 