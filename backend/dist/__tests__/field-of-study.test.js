"use strict";
/**
 * Field of Study Validation Tests
 * تست‌های اعتبارسنجی رشته تحصیلی
 */
Object.defineProperty(exports, "__esModule", { value: true });
const courseExamValidation_1 = require("../validations/courseExamValidation");
describe('Field of Study Validation Tests', () => {
    describe('FIELD_OF_STUDY Constants', () => {
        test('should contain all expected field of study options', () => {
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('computer-engineering');
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('medicine');
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('pure-mathematics'); // تصحیح: mathematics -> pure-mathematics
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('law');
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('math-physics');
            expect(courseExamValidation_1.FIELD_OF_STUDY).toContain('other');
        });
        test('should have reasonable number of options', () => {
            expect(courseExamValidation_1.FIELD_OF_STUDY.length).toBeGreaterThan(20);
            expect(courseExamValidation_1.FIELD_OF_STUDY.length).toBeLessThan(60); // تصحیح: 50 -> 60 (ما 52 رشته داریم)
        });
    });
    describe('CreateCourseExamSchema with fieldOfStudy', () => {
        const validBaseData = {
            title: 'آزمون تست ریاضی',
            courseType: 'academic',
            grade: 'high-school',
            description: 'این یک آزمون تست برای ریاضی است که شامل مباحث مختلف می‌باشد.'
        };
        test('should accept valid fieldOfStudy', () => {
            const validData = {
                ...validBaseData,
                fieldOfStudy: 'computer-engineering'
            };
            const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.fieldOfStudy).toBe('computer-engineering');
            }
        });
        test('should accept undefined fieldOfStudy (optional field)', () => {
            const validData = {
                ...validBaseData
                // fieldOfStudy is optional
            };
            const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.fieldOfStudy).toBeUndefined();
            }
        });
        test('should reject invalid fieldOfStudy', () => {
            const invalidData = {
                ...validBaseData,
                fieldOfStudy: 'invalid-field'
            };
            const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        path: ['fieldOfStudy'],
                        message: 'رشته تحصیلی معتبر نیست'
                    })
                ]));
            }
        });
        test('should work with different valid field of study options', () => {
            const testCases = [
                'medicine',
                'law',
                'pure-mathematics',
                'experimental-sciences',
                'fine-arts',
                'agriculture',
                'other'
            ];
            testCases.forEach(fieldOfStudy => {
                const validData = {
                    ...validBaseData,
                    fieldOfStudy: fieldOfStudy
                };
                const result = courseExamValidation_1.CreateCourseExamSchema.safeParse(validData);
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data.fieldOfStudy).toBe(fieldOfStudy);
                }
            });
        });
    });
    describe('UpdateCourseExamSchema with fieldOfStudy', () => {
        test('should accept valid fieldOfStudy in update', () => {
            const updateData = {
                fieldOfStudy: 'electrical-engineering'
            };
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(updateData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.fieldOfStudy).toBe('electrical-engineering');
            }
        });
        test('should accept empty update object', () => {
            const updateData = {};
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(updateData);
            expect(result.success).toBe(true);
        });
        test('should reject invalid fieldOfStudy in update', () => {
            const invalidUpdateData = {
                fieldOfStudy: 'non-existent-field'
            };
            const result = courseExamValidation_1.UpdateCourseExamSchema.safeParse(invalidUpdateData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        path: ['fieldOfStudy'],
                        message: 'رشته تحصیلی معتبر نیست'
                    })
                ]));
            }
        });
    });
    describe('Field of Study Categories', () => {
        test('should contain high school fields', () => {
            const highSchoolFields = ['math-physics', 'experimental-sciences', 'humanities', 'technical-vocational'];
            highSchoolFields.forEach(field => {
                expect(courseExamValidation_1.FIELD_OF_STUDY).toContain(field);
            });
        });
        test('should contain engineering fields', () => {
            const engineeringFields = [
                'computer-engineering',
                'electrical-engineering',
                'mechanical-engineering',
                'civil-engineering',
                'chemical-engineering'
            ];
            engineeringFields.forEach(field => {
                expect(courseExamValidation_1.FIELD_OF_STUDY).toContain(field);
            });
        });
        test('should contain medical fields', () => {
            const medicalFields = ['medicine', 'dentistry', 'pharmacy', 'nursing', 'veterinary'];
            medicalFields.forEach(field => {
                expect(courseExamValidation_1.FIELD_OF_STUDY).toContain(field);
            });
        });
        test('should contain humanities fields', () => {
            const humanitiesFields = ['law', 'economics', 'management', 'psychology', 'sociology'];
            humanitiesFields.forEach(field => {
                expect(courseExamValidation_1.FIELD_OF_STUDY).toContain(field);
            });
        });
    });
});
//# sourceMappingURL=field-of-study.test.js.map