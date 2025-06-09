# Testing Framework Documentation

## Overview

This document provides comprehensive information about the testing framework implemented for the Exam-Edu project. The testing strategy includes unit tests, integration tests, and end-to-end (E2E) tests to ensure 80%+ code coverage and robust application functionality.

## Testing Stack

### Frontend Testing
- **Jest**: Unit and integration testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation

### Backend Testing
- **Jest**: Unit and integration testing framework
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for testing

### E2E Testing
- **Cypress**: End-to-end testing framework
- **cypress-real-events**: Real user event simulation

## Project Structure

```
exam-edu/
├── jest.config.js                 # Global Jest configuration
├── cypress.config.js              # Cypress configuration
├── test-utils/                    # Global test utilities
│   ├── globalSetup.js
│   └── globalTeardown.js
├── frontend/
│   ├── src/
│   │   ├── __tests__/             # Frontend unit/integration tests
│   │   │   ├── components/        # Component tests
│   │   │   ├── hooks/             # Hook tests
│   │   │   ├── pages/             # Page tests
│   │   │   └── utils/             # Utility tests
│   │   └── test-utils/            # Frontend test utilities
│   │       ├── setupTests.js      # Jest setup
│   │       ├── renderWithProviders.jsx
│   │       └── __mocks__/         # Mock files
├── backend/
│   ├── tests/                     # Backend unit/integration tests
│   │   ├── models/                # Model tests
│   │   ├── routes/                # Route tests
│   │   ├── middleware/            # Middleware tests
│   │   └── services/              # Service tests
│   └── test-utils/                # Backend test utilities
│       ├── setupTests.js          # Jest setup
│       └── testHelpers.js         # Test helper functions
├── cypress/
│   ├── e2e/                       # E2E test specs
│   │   ├── auth/                  # Authentication tests
│   │   ├── exams/                 # Exam-related tests
│   │   ├── admin/                 # Admin panel tests
│   │   ├── blog/                  # Blog tests
│   │   └── payment/               # Payment tests
│   ├── fixtures/                  # Test data fixtures
│   ├── support/                   # Cypress support files
│   │   ├── commands.js            # Custom commands
│   │   └── e2e.js                 # Global setup
│   └── screenshots/               # Test screenshots
└── coverage/                      # Coverage reports
```

## Running Tests

### All Tests
```bash
# Run all tests (backend + frontend)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Frontend Tests
```bash
# Run frontend tests
npm run test:frontend

# Watch mode
npm run test:watch:frontend

# Coverage
npm run test:coverage:frontend
```

### Backend Tests
```bash
# Run backend tests
npm run test:backend

# Watch mode
npm run test:watch:backend

# Coverage
npm run test:coverage:backend
```

### E2E Tests
```bash
# Run E2E tests (headless)
npm run cypress:run

# Open Cypress GUI
npm run cypress:open

# Run E2E with server startup
npm run e2e

# Open E2E with server startup
npm run e2e:open
```

## Test Categories

### 1. Unit Tests

#### Frontend Unit Tests
- **Components**: Test individual React components in isolation
- **Hooks**: Test custom React hooks
- **Utils**: Test utility functions
- **Store**: Test Redux slices and actions

Example:
```javascript
// ActionButton.test.jsx
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import ActionButton from '@/components/atoms/ActionButton';

describe('ActionButton Component', () => {
  it('renders with default props', () => {
    renderWithProviders(<ActionButton>Click me</ActionButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

#### Backend Unit Tests
- **Models**: Test Mongoose models and validation
- **Services**: Test business logic services
- **Utils**: Test utility functions
- **Middleware**: Test Express middleware

Example:
```javascript
// User.test.js
const User = require('../../src/models/User');

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
  });
});
```

### 2. Integration Tests

#### Frontend Integration Tests
- **Page Components**: Test complete page functionality
- **API Integration**: Test React Query hooks with mocked APIs
- **Form Workflows**: Test multi-step forms and validation

#### Backend Integration Tests
- **API Routes**: Test complete request/response cycles
- **Database Operations**: Test CRUD operations with real database
- **Authentication Flow**: Test JWT authentication middleware

Example:
```javascript
// auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Routes', () => {
  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.data.token).toBeDefined();
  });
});
```

### 3. End-to-End Tests

E2E tests simulate real user interactions across the entire application:

- **Authentication Flow**: Login, registration, password reset
- **Exam Taking**: Complete exam workflow from start to submission
- **Admin Operations**: User management, content creation
- **Payment Process**: Wallet operations, payment gateway integration
- **Blog Management**: Post creation, commenting, moderation

Example:
```javascript
// login.cy.js
describe('Authentication - Login', () => {
  it('should login with valid credentials', () => {
    cy.visit('/auth/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Test Data Management

### Fixtures
Test data is managed through fixtures for consistent testing:

```javascript
// cypress/fixtures/user.json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@example.com",
      "role": "student"
    }
  }
}
```

### Test Helpers
Utility functions for creating test data:

```javascript
// Backend test helpers
const { createTestUser, createTestExam } = require('../test-utils/testHelpers');

// Frontend test helpers
const { createMockUser, createMockExam } = require('@/test-utils/renderWithProviders');
```

### Database Seeding
Automated test data seeding for consistent test environments:

```javascript
// Backend seeding
async function seedDatabase() {
  const student = await createTestUser();
  const admin = await createTestAdmin();
  const exam = await createTestExam();
  return { student, admin, exam };
}
```

## Mocking Strategy

### Frontend Mocks
- **API Calls**: Mock all external API calls using MSW or Jest mocks
- **External Libraries**: Mock Chart.js, Framer Motion, etc.
- **Browser APIs**: Mock localStorage, sessionStorage, fetch

### Backend Mocks
- **External Services**: Mock ZarinPal, email service, file upload
- **Database**: Use MongoDB Memory Server for isolated testing
- **Environment**: Mock environment variables

## Coverage Requirements

### Target Coverage: 80%+

#### Frontend Coverage
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

#### Backend Coverage
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Coverage Exclusions
- Test files themselves
- Configuration files
- Mock files
- Node modules
- Build artifacts

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert

### 2. Test Independence
- Each test should be independent and not rely on other tests
- Use `beforeEach` and `afterEach` for setup and cleanup
- Reset mocks and state between tests

### 3. Realistic Testing
- Test user interactions, not implementation details
- Use realistic test data
- Test error scenarios and edge cases

### 4. Performance
- Keep tests fast by using mocks appropriately
- Use `only` and `skip` for debugging specific tests
- Parallelize tests when possible
- Monitor test execution time and optimize slow tests
- Use Lighthouse integration for performance auditing
- Test animation performance (60fps target)
- Monitor memory usage during test execution

### 5. Accessibility Testing
- Include accessibility checks in E2E tests
- Test keyboard navigation
- Verify ARIA attributes and labels

### 6. Mobile Testing
- Test responsive layouts in Cypress
- Verify touch interactions
- Test different viewport sizes

### 7. RTL Support
- Test Persian text rendering
- Verify RTL layout behavior
- Test Jalali calendar functionality

## Continuous Integration

### GitHub Actions Configuration
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run e2e
```

### Coverage Reporting
- Coverage reports are generated in `coverage/` directory
- HTML reports available at `coverage/lcov-report/index.html`
- CI integration with coverage badges

## Debugging Tests

### Frontend Debugging
```bash
# Debug specific test
npm test -- --testNamePattern="ActionButton"

# Debug with watch mode
npm run test:watch

# Debug in VS Code
# Add breakpoints and use Jest extension
```

### Backend Debugging
```bash
# Debug specific test file
npm test -- tests/models/User.test.js

# Debug with inspect
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Cypress Debugging
```bash
# Open Cypress GUI for debugging
npm run cypress:open

# Run specific test
npx cypress run --spec "cypress/e2e/auth/login.cy.js"

# Debug mode
npx cypress open --config video=false
```

## Common Issues and Solutions

### 1. Async Testing Issues
```javascript
// ❌ Wrong
it('should update state', () => {
  fireEvent.click(button);
  expect(screen.getByText('Updated')).toBeInTheDocument();
});

// ✅ Correct
it('should update state', async () => {
  fireEvent.click(button);
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### 2. Mock Cleanup
```javascript
// Always clean up mocks
afterEach(() => {
  jest.clearAllMocks();
});
```

### 3. Cypress Flaky Tests
```javascript
// Use proper waits
cy.get('[data-testid="loading"]').should('not.exist');
cy.get('[data-testid="content"]').should('be.visible');
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Cypress Documentation](https://docs.cypress.io/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests pass before submitting PR
3. Maintain or improve coverage percentage
4. Update documentation if needed
5. Add E2E tests for new user flows
