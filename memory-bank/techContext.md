# Technical Context

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.2 with App Router
- **UI Library**: React 19.0.0
- **State Management**:
  - React Query 5.76.1 (server state)
  - Redux Toolkit 2.8.2 (client state)
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form 7.56.4
- **Validation**: Fastest Validator 1.19.1
- **Animation**: Framer Motion 12.12.1
- **Charts**: Chart.js 4.4.9 with React Chart.js 5.3.0
- **Notifications**: React Hot Toast 2.5.2
- **Theming**: Next Themes 0.4.6

### Backend
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.15.0
- **Authentication**: JSON Web Token (JWT) 9.0.2
- **Password Hashing**: BCrypt 6.0.0
- **Validation**: Fastest Validator 1.19.1
- **API Documentation**: Swagger UI Express 5.0.1 with Swagger JSDoc 6.2.8
- **Logging**: Winston 3.17.0
- **Security**: Helmet 8.1.0, Express Rate Limit 7.5.0
- **Environment Variables**: Dotenv 16.5.0

### Development Tools
- **Package Manager**: npm
- **Node.js Version**: 18.x or higher
- **Testing**: Jest 29.7.0, Supertest 7.1.1
- **Development Server**: Nodemon 3.1.10

## Development Setup
## Development Setup
- **Node.js**: v18+ for runtime environment.
- **Cursor IDE**: Configured with ESLint, Prettier, and Tailwind extensions.
- **Git**: Manual operations only, using `https://github.com/ab65ed/exam-edu.git`.
- **MCP Servers**:
  - **Back4App**: Backend data management and API integration.
  - **@21st-dev/magic**: UI component enhancements.
  - **magicuidesign/mcp**: Senior-level UI/UX design optimization.
  - **sequential-thinking**: Automated terminal error detection and resolution.

### Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup
```bash
# Install dependencies
cd backend
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-edu
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## API Structure
The backend follows a RESTful API structure with the following endpoints:

- `/api/auth`: Authentication endpoints
- `/api/users`: User management
- `/api/exams`: Exam creation and management
- `/api/questions`: Question bank operations
- `/api/categories`: Category management
- `/api/lessons`: Educational content
- `/api/tickets`: Support ticket system
- `/api/payments`: Payment processing
- `/api/blog`: Blog content management
- `/api/dashboard`: Analytics and reporting

## Technical Constraints
- **JavaScript Only**: No TypeScript usage.
- **RTL Support**: Full right-to-left language support for Persian
- **Responsive Design**: Support for mobile, tablet, and desktop
- **Accessibility**: WCAG compliance for key user flows
- **Security**: Protection against common web vulnerabilities
- **Performance**: Optimized loading time and UX
- **Validation**: Exclusively `fastest-validator` for all form validations.
- **Modularity**: All frontend code strictly within `/frontend/src`.
- **Responsive Design**: Fully responsive pages using magicuidesign/mcp and @21st-dev/magic for senior-level UI/UX.

## Dependencies
- MongoDB database
- Node.js runtime
- Modern web browser with JavaScript enabled
- Core: `next`, `@tanstack/react-query`, `redux`, `react-redux`, `tailwindcss`, `fastest-validator`.
- Full list available in `/frontend/package.json`.


## Deployment Considerations
- Node.js hosting environment
- MongoDB database instance
- Environment variable configuration
- Static file hosting for frontend
- API endpoint configuration between frontend and backend
