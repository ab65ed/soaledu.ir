declare const CourseExam: any;
declare const Parse: any;
declare class CourseExamController {
    /**
     * Create a new course exam
     */
    static createCourseExam(req: any, res: any): Promise<any>;
    /**
     * Get course exam by ID
     */
    static getCourseExam(req: any, res: any): Promise<any>;
    /**
     * Update course exam
     */
    static updateCourseExam(req: any, res: any): Promise<any>;
    /**
     * Delete course exam
     */
    static deleteCourseExam(req: any, res: any): Promise<any>;
    /**
     * List course exams with filtering and pagination
     */
    static listCourseExams(req: any, res: any): Promise<void>;
    /**
     * Search course exams by text
     */
    static searchCourseExams(req: any, res: any): Promise<any>;
    /**
     * Publish course exam
     */
    static publishCourseExam(req: any, res: any): Promise<any>;
    /**
     * Unpublish course exam
     */
    static unpublishCourseExam(req: any, res: any): Promise<any>;
    /**
     * Auto-save course exam (for draft functionality)
     */
    static autoSaveCourseExam(req: any, res: any): Promise<any>;
    /**
     * Get course exam statistics
     */
    static getCourseExamStats(req: any, res: any): Promise<void>;
    /**
     * Record a sale for course exam
     */
    static recordSale(req: any, res: any): Promise<any>;
    /**
     * Add rating to course exam
     */
    static addRating(req: any, res: any): Promise<any>;
    /**
     * Get available tags
     */
    static getAvailableTags(req: any, res: any): Promise<void>;
}
