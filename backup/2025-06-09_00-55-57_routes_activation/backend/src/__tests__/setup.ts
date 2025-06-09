/**
 * Test Setup
 * تنظیمات اولیه تست‌ها
 */

// Mock Parse globally
jest.mock('parse/node', () => ({
  Object: {
    extend: jest.fn().mockImplementation((className: string) => {
      return class MockParseObject {
        static className = className;
        private attributes: Record<string, any> = {};
        
        set(key: string, value: any) {
          this.attributes[key] = value;
        }
        
        get(key: string) {
          return this.attributes[key];
        }
        
        save() {
          return Promise.resolve({
            id: 'mock-id',
            objectId: 'mock-object-id',
            ...this.attributes
          });
        }
        
        toJSON() {
          return {
            objectId: 'mock-object-id',
            ...this.attributes
          };
        }
        
        setACL() {
          // Mock ACL setting
        }
      };
    })
  },
  Query: jest.fn().mockImplementation((objectClass: any) => ({
    get: jest.fn().mockResolvedValue({
      get: jest.fn(),
      set: jest.fn(),
      save: jest.fn(),
      toJSON: jest.fn()
    }),
    find: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    equalTo: jest.fn().mockReturnThis(),
    containedIn: jest.fn().mockReturnThis(),
    descending: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis()
  })),
  ACL: jest.fn().mockImplementation(() => ({
    setReadAccess: jest.fn(),
    setWriteAccess: jest.fn()
  }))
}));

// Global test configuration
beforeEach(() => {
  jest.clearAllMocks();
});

// Suppress console.error in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 