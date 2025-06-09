/**
 * Course Exam Controllers Index
 * صادرات تمام کنترلرهای درس-آزمون
 */

// Legacy compatibility - export as CourseExamController
export class CourseExamController {
  // TODO: Implement all methods after creating modular files
  static async getAllCourseExams(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async getCourseExamById(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async createCourseExam(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async updateCourseExam(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }

  static async deleteCourseExam(req: any, res: any): Promise<void> {
    res.status(501).json({
      status: 'error',
      statusCode: 501,
      message: 'این قابلیت در حال توسعه است'
    });
  }
} 