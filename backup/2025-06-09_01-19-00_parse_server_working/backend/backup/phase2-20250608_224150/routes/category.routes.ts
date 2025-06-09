/**
 * Category routes
 * 
 * This file defines routes for categories (educational groups).
 */

import express, { Request, Response } from 'express';
import { protectRoute, restrictTo } from '../middlewares/auth';
import { RequestWithUser } from '../types';

// Define controller with typed request and response
const categoryController = {
  getCategories: (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'This endpoint will return all categories',
    });
  },
  getCategory: (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: `This endpoint will return category with ID: ${req.params.id}`,
    });
  },
  createCategory: (req: RequestWithUser, res: Response) => {
    res.status(201).json({
      status: 'success',
      message: 'This endpoint will create a new category',
    });
  },
  updateCategory: (req: RequestWithUser, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: `This endpoint will update category with ID: ${req.params.id}`,
    });
  },
  deleteCategory: (req: RequestWithUser, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: `This endpoint will delete category with ID: ${req.params.id}`,
    });
  },
};

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController.getCategory);

// Admin-only routes
router.use(protectRoute);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/', categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Category not found
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Category not found
 */
router.delete('/:id', categoryController.deleteCategory);

export default router; 