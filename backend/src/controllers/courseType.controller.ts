/**
 * CourseType Controller
 * کنترلر انواع درس
 */

import { Request, Response } from 'express';
import CourseType from '../models/CourseType';
import mongoose from 'mongoose';

/**
 * GET /api/v1/course-types
 * دریافت لیست کامل انواع درس
 */
export const getCourseTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseTypes = await CourseType.find({ isActive: true })
      .select('value label description examples usage')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'لیست انواع درس با موفقیت دریافت شد',
      data: {
        courseTypes: courseTypes.map(type => ({
          value: type.value,
          label: type.label,
          description: type.description,
          examples: type.examples,
          usage: type.usage
        })),
        total: courseTypes.length
      }
    });
  } catch (error) {
    console.error('Error in getCourseTypes:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست انواع درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * GET /api/v1/course-types/:value
 * دریافت اطلاعات یک نوع درس خاص
 */
export const getCourseTypeByValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value } = req.params;

    const courseType = await CourseType.findOne({ value, isActive: true })
      .select('value label description examples usage');

    if (!courseType) {
      res.status(404).json({
        success: false,
        message: 'نوع درس مورد نظر یافت نشد'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'اطلاعات نوع درس با موفقیت دریافت شد',
      data: { courseType }
    });
  } catch (error) {
    console.error('Error in getCourseTypeByValue:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات نوع درس',
      error: error instanceof Error ? error.message : 'خطای نامشخص'
    });
  }
};

/**
 * Test database connection
 */
export const testDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    const dbName = db?.databaseName;
    const collections = await db?.listCollections().toArray();
    const collectionNames = collections?.map(c => c.name);
    
    console.log('🔍 Database name:', dbName);
    console.log('🔍 Collections:', collectionNames);
    
    res.status(200).json({
      success: true,
      data: {
        databaseName: dbName,
        collections: collectionNames
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 