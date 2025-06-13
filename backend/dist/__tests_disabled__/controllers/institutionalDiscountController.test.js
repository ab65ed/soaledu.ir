"use strict";
/**
 * Test suite for Institutional Discount Controller
 * تست‌های واحد برای کنترلر تخفیف سازمانی
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mock dependencies first - before any imports
jest.mock('bcrypt', () => ({
    genSalt: jest.fn().mockResolvedValue('mocked-salt'),
    hash: jest.fn().mockResolvedValue('mocked-hash'),
    compare: jest.fn().mockResolvedValue(true),
}));
// Mock filesystem operations
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn().mockReturnValue(true),
    unlinkSync: jest.fn(),
    createReadStream: jest.fn(),
}));
// Mock xlsx library
jest.mock('xlsx', () => ({
    readFile: jest.fn(),
    utils: {
        sheet_to_json: jest.fn(),
    },
}));
// Setup test environment
process.env.NODE_ENV = 'test';
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const xlsx_1 = __importDefault(require("xlsx"));
const institutionalDiscountController_1 = require("../../controllers/institutionalDiscountController");
// Mock models after imports
const mockInstitutionalDiscountGroup = {
    findById: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
    prototype: {
        save: jest.fn(),
    },
};
const mockUser = {
    findOne: jest.fn(),
    updateMany: jest.fn(),
};
// Apply mocks
jest.doMock('../../models/InstitutionalDiscountGroup', () => mockInstitutionalDiscountGroup);
jest.doMock('../../models/user.model', () => mockUser);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/test', institutionalDiscountController_1.upload.single('file'), institutionalDiscountController_1.uploadInstitutionalDiscountList);
describe('InstitutionalDiscountController', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeAll(() => {
        // Mock mongoose connection
        jest.spyOn(mongoose_1.default, 'connect').mockImplementation(() => Promise.resolve());
    });
    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: {
                _id: 'admin123',
                role: 'admin',
            },
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        // Clear all mocks
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });
    describe('uploadInstitutionalDiscountList', () => {
        it('باید خطای عدم وجود فایل را برگرداند', async () => {
            mockReq.file = null;
            await (0, institutionalDiscountController_1.uploadInstitutionalDiscountList)(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'فایل اکسل ارسال نشده است',
            });
        });
        it('باید خطای عدم وجود درصد تخفیف را برگرداند', async () => {
            mockReq.file = {
                path: '/test/file.xlsx',
                originalname: 'discount-list.xlsx',
            };
            mockReq.body = {}; // No discount specified
            await (0, institutionalDiscountController_1.uploadInstitutionalDiscountList)(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'باید یکی از فیلدهای درصد تخفیف یا مبلغ تخفیف را وارد کنید',
            });
        });
        it('باید فایل را با موفقیت بارگذاری کند', async () => {
            // Mock file
            mockReq.file = {
                path: '/test/file.xlsx',
                originalname: 'discount-list.xlsx',
                size: 1024,
            };
            mockReq.body = {
                groupName: 'مدرسه تست',
                discountPercentage: '10',
            };
            // Mock Excel parsing
            const mockExcelData = [
                ['کد ملی', 'شماره تلفن'],
                ['1234567890', '09123456789'],
                ['0987654321', '09987654321'],
            ];
            xlsx_1.default.readFile.mockReturnValue({
                SheetNames: ['Sheet1'],
                Sheets: {
                    Sheet1: {},
                },
            });
            xlsx_1.default.utils.sheet_to_json.mockReturnValue(mockExcelData);
            // Mock group save
            const mockGroupInstance = {
                _id: 'group123',
                groupName: 'مدرسه تست',
                discountPercentage: 10,
                status: 'processing',
                save: jest.fn().mockResolvedValue({
                    _id: 'group123',
                    status: 'processing',
                    fileName: 'discount-list.xlsx',
                }),
            };
            // Mock constructor
            mockInstitutionalDiscountGroup.prototype.constructor = jest.fn().mockImplementation(() => mockGroupInstance);
            await (0, institutionalDiscountController_1.uploadInstitutionalDiscountList)(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: expect.stringContaining('بارگذاری شد'),
            }));
        });
    });
    describe('getInstitutionalDiscountGroups', () => {
        it('باید لیست گروه‌های تخفیف را برگرداند', async () => {
            const mockGroups = [
                {
                    _id: 'group1',
                    groupName: 'مدرسه تست ۱',
                    discountPercentage: 10,
                    status: 'completed',
                },
            ];
            mockInstitutionalDiscountGroup.countDocuments.mockResolvedValue(1);
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue(mockGroups),
            };
            mockInstitutionalDiscountGroup.find.mockReturnValue(mockQuery);
            await (0, institutionalDiscountController_1.getInstitutionalDiscountGroups)(mockReq, mockRes);
            expect(mockRes.status).not.toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    groups: mockGroups,
                    pagination: expect.any(Object),
                },
            });
        });
        it('باید گروه‌ها را بر اساس وضعیت فیلتر کند', async () => {
            mockReq.query = { status: 'completed' };
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue([]),
            };
            mockInstitutionalDiscountGroup.find.mockReturnValue(mockQuery);
            mockInstitutionalDiscountGroup.countDocuments.mockResolvedValue(0);
            await (0, institutionalDiscountController_1.getInstitutionalDiscountGroups)(mockReq, mockRes);
            expect(mockInstitutionalDiscountGroup.find).toHaveBeenCalledWith({
                status: 'completed',
            });
        });
    });
    describe('getInstitutionalDiscountGroupById', () => {
        it('باید جزئیات گروه تخفیف را برگرداند', async () => {
            mockReq.params = { id: 'group123' };
            const mockGroup = {
                _id: 'group123',
                groupName: 'مدرسه تست',
                discountPercentage: 10,
            };
            const mockQuery = {
                populate: jest.fn().mockResolvedValue(mockGroup),
            };
            mockInstitutionalDiscountGroup.findById.mockReturnValue(mockQuery);
            await (0, institutionalDiscountController_1.getInstitutionalDiscountGroupById)(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockGroup,
            });
        });
        it('باید خطای عدم یافتن گروه را برگرداند', async () => {
            mockReq.params = { id: 'nonexistent' };
            const mockQuery = {
                populate: jest.fn().mockResolvedValue(null),
            };
            mockInstitutionalDiscountGroup.findById.mockReturnValue(mockQuery);
            await (0, institutionalDiscountController_1.getInstitutionalDiscountGroupById)(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'گروه تخفیف یافت نشد',
            });
        });
    });
    describe('deleteInstitutionalDiscountGroup', () => {
        it('باید گروه تخفیف را غیرفعال کند', async () => {
            mockReq.params = { id: 'group123' };
            const mockGroup = {
                _id: 'group123',
                isActive: true,
                save: jest.fn().mockResolvedValue(true),
            };
            mockInstitutionalDiscountGroup.findById.mockResolvedValue(mockGroup);
            await (0, institutionalDiscountController_1.deleteInstitutionalDiscountGroup)(mockReq, mockRes);
            expect(mockGroup.isActive).toBe(false);
            expect(mockGroup.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'گروه تخفیف با موفقیت حذف شد',
            });
        });
        it('باید خطای عدم یافتن گروه برای حذف را برگرداند', async () => {
            mockReq.params = { id: 'nonexistent' };
            mockInstitutionalDiscountGroup.findById.mockResolvedValue(null);
            await (0, institutionalDiscountController_1.deleteInstitutionalDiscountGroup)(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'گروه تخفیف یافت نشد',
            });
        });
    });
});
//# sourceMappingURL=institutionalDiscountController.test.js.map