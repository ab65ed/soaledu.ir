"use strict";
/**
 * Grades Validation Tests
 * تست‌های اعتبارسنجی مقاطع تحصیلی
 */
Object.defineProperty(exports, "__esModule", { value: true });
const courseExamValidation_1 = require("../validations/courseExamValidation");
describe('Grades Validation Tests', () => {
    describe('GRADES Constants', () => {
        test('should contain all expected grade options', () => {
            expect(courseExamValidation_1.GRADES).toContain('elementary');
            expect(courseExamValidation_1.GRADES).toContain('middle-school');
            expect(courseExamValidation_1.GRADES).toContain('high-school');
            expect(courseExamValidation_1.GRADES).toContain('associate-degree');
            expect(courseExamValidation_1.GRADES).toContain('bachelor-degree');
            expect(courseExamValidation_1.GRADES).toContain('master-degree');
            expect(courseExamValidation_1.GRADES).toContain('doctorate-degree');
        });
        test('should have exactly 7 grades', () => {
            expect(courseExamValidation_1.GRADES.length).toBe(7);
        });
        test('should not contain old grade formats', () => {
            expect(courseExamValidation_1.GRADES).not.toContain('elementary-1');
            expect(courseExamValidation_1.GRADES).not.toContain('middle-school-1');
            expect(courseExamValidation_1.GRADES).not.toContain('high-school-10');
            expect(courseExamValidation_1.GRADES).not.toContain('university');
            expect(courseExamValidation_1.GRADES).not.toContain('konkur');
        });
    });
    describe('GRADE_LABELS Constants', () => {
        test('should have Persian labels for all grades', () => {
            expect(courseExamValidation_1.GRADE_LABELS.elementary).toBe('مقطع ابتدایی');
            expect(courseExamValidation_1.GRADE_LABELS['middle-school']).toBe('مقطع متوسطه اول');
            expect(courseExamValidation_1.GRADE_LABELS['high-school']).toBe('مقطع متوسطه دوم');
            expect(courseExamValidation_1.GRADE_LABELS['associate-degree']).toBe('کاردانی');
            expect(courseExamValidation_1.GRADE_LABELS['bachelor-degree']).toBe('کارشناسی');
            expect(courseExamValidation_1.GRADE_LABELS['master-degree']).toBe('کارشناسی ارشد');
            expect(courseExamValidation_1.GRADE_LABELS['doctorate-degree']).toBe('دکتری');
        });
        test('should have labels for all grades', () => {
            courseExamValidation_1.GRADES.forEach(grade => {
                expect(courseExamValidation_1.GRADE_LABELS[grade]).toBeDefined();
                expect(courseExamValidation_1.GRADE_LABELS[grade]).not.toBe('');
            });
        });
    });
    describe('CreateCourseExamSchema with new grades', () => {
        const validBaseData = {
            title: 'آزمون تست جدید',
            courseType: 'academic',
            description: 'این یک آزمون تست است که با مقاطع تحصیلی جدید کار می‌کند.'
        };
        test('should accept valid new grades', () => {
            const testCases = [
                'elementary',
                'middle-school',
                'high-school',
                'associate-degree',
                'bachelor-degree',
                'master-degree',
                'doctorate-degree'
            ];
            testCases.forEach(grade => {
                const validData = {
                    ...validBaseData,
                    grade: grade
                };
                const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(validData);
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data.grade).toBe(grade);
                }
            });
        });
        test('should reject old grade formats', () => {
            const oldGrades = [
                'elementary-1',
                'elementary-6',
                'middle-school-7',
                'high-school-10',
                'university',
                'konkur'
            ];
            oldGrades.forEach(grade => {
                const invalidData = {
                    ...validBaseData,
                    grade: grade
                };
                const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(invalidData);
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            path: ['grade'],
                            message: 'مقطع تحصیلی معتبر نیست'
                        })
                    ]));
                }
            });
        });
        test('should reject invalid grades', () => {
            const invalidData = {
                ...validBaseData,
                grade: 'invalid-grade'
            };
            const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        path: ['grade'],
                        message: 'مقطع تحصیلی معتبر نیست'
                    })
                ]));
            }
        });
    });
    describe('UpdateCourseExamSchema with new grades', () => {
        test('should accept valid new grades in update', () => {
            const updateData = {
                grade: 'bachelor-degree'
            };
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(updateData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.grade).toBe('bachelor-degree');
            }
        });
        test('should accept empty update object', () => {
            const updateData = {};
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(updateData);
            expect(result.success).toBe(true);
        });
        test('should reject old grade formats in update', () => {
            const invalidUpdateData = {
                grade: 'elementary-1'
            };
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(invalidUpdateData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        path: ['grade'],
                        message: 'مقطع تحصیلی معتبر نیست'
                    })
                ]));
            }
        });
    });
    describe('Grade Categories', () => {
        test('should categorize school levels correctly', () => {
            const schoolLevels = ['elementary', 'middle-school', 'high-school'];
            schoolLevels.forEach(grade => {
                expect(courseExamValidation_1.GRADES).toContain(grade);
            });
        });
        test('should categorize university levels correctly', () => {
            const universityLevels = ['associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'];
            universityLevels.forEach(grade => {
                expect(courseExamValidation_1.GRADES).toContain(grade);
            });
        });
        test('should have logical progression', () => {
            const expectedOrder = [
                'elementary',
                'middle-school',
                'high-school',
                'associate-degree',
                'bachelor-degree',
                'master-degree',
                'doctorate-degree'
            ];
            expectedOrder.forEach((grade, index) => {
                expect(courseExamValidation_1.GRADES[index]).toBe(grade);
            });
        });
    });
    describe('Grade Level Validation', () => {
        test('should validate elementary level', () => {
            const elementaryData = {
                title: 'آزمون ابتدایی',
                courseType: 'academic',
                grade: 'elementary',
                description: 'آزمون ریاضی برای دانش‌آموزان ابتدایی'
            };
            const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(elementaryData);
            expect(result.success).toBe(true);
        });
        test('should validate university levels', () => {
            const universityLevels = ['associate-degree', 'bachelor-degree', 'master-degree', 'doctorate-degree'];
            universityLevels.forEach(level => {
                const universityData = {
                    title: `آزمون ${courseExamValidation_1.GRADE_LABELS[level]}`,
                    courseType: 'specialized',
                    grade: level,
                    description: `آزمون تخصصی برای مقطع ${courseExamValidation_1.GRADE_LABELS[level]}`
                };
                const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(universityData);
                expect(result.success).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=grades.test.js.map