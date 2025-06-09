# Active Context

## Current Focus

**App Router Migration & UI/UX Enhancement (Completed)**:

1. ✅ Successfully migrated all 42 pages from Pages Router to App Router with strategic Server/Client Component usage
2. ✅ Upgraded to Tailwind CSS 4.x without tailwind.config.js, using CSS custom properties in globals.css
3. ✅ Fixed Fast Refresh issues for instant development feedback during development
4. ✅ Resolved Babel/SWC disabled warnings by removing babel.config.js and enabling SWC
5. ✅ Enhanced Redux Toolkit integration with useRedux.jsx hooks for App Router compatibility
6. ✅ Implemented professional React Query cache management with hierarchical keys and staleTime optimization
7. ✅ Created Server Components for SEO-optimized pages like /blog with static rendering
8. ✅ Built Client Components for interactive pages like /login, /dashboard with Redux and React Query
9. ✅ Updated testing framework (Jest and Cypress) for App Router compatibility
10. ✅ Enhanced SEO with Metadata API implementation for better search engine optimization

**Previous Completed Milestone - Debugging and Rendering Fix**:

1. ✅ Identified and resolved QueryClient error preventing page rendering
2. ✅ Fixed React Query hooks initialization issues with systematic component isolation
3. ✅ Cleaned up duplicate components and import path inconsistencies
4. ✅ Restored full application functionality with progressive enhancement approach

**Previous Completed Milestone - Testing Framework Implementation**:

1. ✅ Implemented comprehensive Jest testing framework with 80%+ coverage targets for frontend and backend
2. ✅ Created E2E testing infrastructure with Cypress including custom commands and fixtures
3. ✅ Built test utilities and helpers with mocking strategies for external services
4. ✅ Developed testing documentation with best practices and CI/CD integration guidelines

**Previous Completed Milestone - Blog Content Management System Implementation**:

1. ✅ Implemented comprehensive blog system with rich text editing and hierarchical category management
2. ✅ Created public blog pages with search, filtering, and SEO optimization including structured data
3. ✅ Built blog CRUD APIs with MongoDB models and comment moderation system
4. ✅ Developed admin interface with post management, category organization, and comment moderation

**Previous Completed Milestone - Advanced Analytics System Implementation**:

1. ✅ Implemented comprehensive analytics dashboard with real-time metrics and interactive charts
2. ✅ Created advanced reporting system with export functionality and report history
3. ✅ Built analytics aggregation APIs with MongoDB pipelines for performance optimization
4. ✅ Developed Persian formatting utilities with RTL support and Jalali calendar integration

**Previous Completed Milestone - Question Bank System Implementation**:

1. ✅ Implemented comprehensive question bank with advanced search and categorization
2. ✅ Created question management UI with CRUD operations and bulk actions
3. ✅ Built import/export system with CSV/JSON support and validation
4. ✅ Developed question analytics with usage tracking and success rates

**Previous Completed Milestone - Support Ticket System Implementation**:

1. ✅ Implemented comprehensive backend APIs with full CRUD operations, file upload support, and status management.
2. ✅ Created user-friendly ticket creation form with file attachments, category selection, and priority levels.
3. ✅ Built admin ticket management dashboard with filtering, assignment, and bulk operations.
4. ✅ Implemented real-time notifications using polling every 10 seconds for ticket updates.
5. ✅ Added file attachment support for PDF, PNG, JPG files with 5MB limit and 3 files per ticket.
6. ✅ Developed escalation system with auto-escalation of high priority tickets after 24 hours.
7. ✅ Implemented role-based access control with different views for users, support staff, and admins.
8. ✅ Optimized performance with lazy loading, memoization, and React Query caching.

## Recent Changes

### App Router Migration & UI/UX Enhancement (Completed)
- **App Router Migration**: Successfully migrated all 42 pages from Pages Router to App Router structure in `/frontend/src/app/` with strategic use of Server Components for SEO (blog, about) and Client Components for interactivity (login, dashboard, admin).
- **Tailwind CSS 4.x Upgrade**: Upgraded to Tailwind CSS 4.x without `tailwind.config.js`, implementing CSS custom properties in `globals.css` for theme colors, fonts, and animations with enhanced RTL support.
- **Fast Refresh Fix**: Resolved all Hot Module Replacement (HMR) issues by fixing circular dependencies, import paths, and component structure for instant development feedback.
- **SWC/Babel Resolution**: Removed `babel.config.js` to enable SWC compiler, resolved "Disabled SWC as replacement for Babel" warnings by cleaning up `next.config.js` configuration.
- **Redux Toolkit Enhancement**: Enhanced `useRedux.jsx` hooks for App Router compatibility with comprehensive state management patterns and proper "use client" directives.
- **React Query Advanced**: Implemented professional cache management with hierarchical queryKeys, optimized staleTime (5min dynamic, 1h static), advanced patterns (useQueries, dependent queries, infinite scroll).
- **Server/Client Architecture**: Strategic component architecture with Server Components for static content and SEO, Client Components for interactive features with proper data fetching patterns.
- **Testing Framework Update**: Updated Jest and Cypress configurations for App Router compatibility, enhanced test coverage for new component structure.
- **SEO Enhancement**: Implemented Metadata API for better search engine optimization, structured data, and social media sharing.
- **Performance Optimization**: Enabled SWC compiler, optimized bundle splitting, improved build performance, and enhanced runtime performance.
- **Clean Architecture**: Maintained clean project structure with all frontend code in `/frontend/src/app/` and proper separation of Server/Client Components.

### Previous Completed Milestone - Debugging and Rendering Fix (Completed)
- **Root Cause Analysis**: Systematically identified that React Query hooks were being used before QueryClientProvider initialization, causing "No QueryClient set" error across all pages.
- **Component Isolation**: Progressively simplified components starting with a basic index.jsx and minimal _app.jsx to isolate the exact source of the rendering failure.
- **Import Path Resolution**: Fixed `@/` alias imports that were incompatible with Pages Router, updated useAuth hook from next/navigation to next/router, and ensured all relative imports work correctly.
- **API Service Enhancement**: Added missing `me` endpoint to auth service, removed duplicate blog section, and verified axios integration with proper dependency management.
- **Progressive Reconstruction**: Rebuilt _app.jsx layer by layer, starting with basic component rendering, then adding Redux Provider, QueryClientProvider, and Toast notifications systematically.
- **Code Cleanup**: Removed duplicate StatsCard components from molecules and organisms directories, keeping only the comprehensive atoms version, and eliminated redundant backup directories.
- **Dependency Management**: Added missing axios dependency to package.json and ensured all required packages are properly installed and compatible.
- **Cache Management**: Cleared Next.js build cache, restarted development server multiple times, and ensured proper hot reload functionality without persistent errors.
- **Testing and Validation**: Verified all core pages (/, /login, /dashboard) render correctly on localhost:3002 with proper Tailwind styling, RTL support, and interactive functionality.
- **Clean Architecture**: Maintained clean project structure with all frontend code in /frontend/src, eliminated empty directories, and ensured no duplicate components remain.

### Previous Completed Milestone - Testing Framework Implementation (Completed)
- **Jest Configuration**: Implemented comprehensive Jest setup with separate project configurations for frontend (jsdom environment) and backend (node environment), targeting 80%+ code coverage with proper module name mapping and transform configurations.
- **Frontend Testing Infrastructure**: Created complete testing utilities including renderWithProviders for Redux and React Query integration, mock factories for test data, and comprehensive setupTests.js with mocks for Next.js, Framer Motion, Chart.js, and other external libraries.
- **Backend Testing Infrastructure**: Built test helpers with MongoDB Memory Server for isolated database testing, test data factories for consistent fixtures, and mock services for external APIs including ZarinPal, email, and file upload services.
- **E2E Testing with Cypress**: Configured Cypress with custom commands for authentication, navigation, form handling, and user interactions, plus fixtures for consistent test data and support files for global setup and teardown.
- **Test Coverage Reporting**: Implemented HTML and LCOV coverage reports with detailed module breakdown, proper exclusion patterns for non-testable code (config files, test utilities), and CI-ready configuration for automated reporting.
- **Testing Documentation**: Created comprehensive testing guide (/tests/README.md) with setup instructions, testing strategies, best practices, debugging tips, and coverage analysis templates.
- **Mock Strategy**: Developed comprehensive mocking approach for external services, browser APIs, and complex components while maintaining realistic test scenarios and avoiding implementation detail testing.
- **Clean Code Testing**: Followed testing best practices with AAA pattern (Arrange, Act, Assert), meaningful test descriptions, proper test isolation, and no duplicate test utilities or helper functions.
- **Accessibility and Mobile Testing**: Integrated accessibility checks with Cypress commands for ARIA validation, keyboard navigation testing, and responsive layout verification across different viewport sizes.
- **Performance and CI Integration**: Added performance testing capabilities with page load time validation, optimized test execution for CI environments, and GitHub Actions compatibility for automated test runs.

### Previous Completed Milestone - Blog Content Management System Implementation (Completed)
- **Backend APIs**: Implemented comprehensive blog routes with MongoDB models for BlogPost and BlogCategory, supporting hierarchical categories, comment moderation, and full-text search functionality.
- **Rich Text Editor**: Created BlogPostForm component with ReactQuill WYSIWYG editor supporting RTL content, image embedding, advanced formatting, and tabbed interface for content, settings, SEO, and media.
- **Public Blog Pages**: Built blog listing page (/blog) with category filtering, search functionality, pagination, and individual post pages (/blog/[slug]) with SEO optimization and structured data.
- **Admin Management**: Developed complete admin interface (/admin/blog) for post creation/editing, category management, and comment moderation with real-time updates and bulk operations.
- **Comment System**: Implemented threaded comment system with moderation workflow, real-time polling every 60 seconds, reply functionality, and user authentication integration.
- **SEO Optimization**: Added comprehensive SEO with meta tags, friendly URLs using slug-based routing, Open Graph and Twitter Card support, and JSON-LD structured data for search engines.
- **Category Management**: Built hierarchical category system with breadcrumb navigation, color coding, post count tracking, and parent-child relationships up to 5 levels deep.
- **Search Functionality**: Implemented full-text search with MongoDB text indexes, keyword and category filtering, advanced search options, and result highlighting.
- **Persian Integration**: Complete Persian formatting for dates using Jalali calendar, numbers with Persian digits, and RTL content support throughout the blog system.
- **Redux Integration**: Created blogSlice with Redux Toolkit for state management and React Query hooks with 5-minute stale time and Persian data transformation.
- **Performance Optimization**: Enhanced with MongoDB indexes for search performance, React Query caching with invalidation strategies, and optimized polling for real-time comment updates.
- **Mobile-first Design**: Ensured responsive layouts with touch-friendly interactions, collapsible comment sections, and mobile-optimized rich text editing experience.
- **Clean Code Implementation**: Followed Clean Code principles with single responsibility, meaningful naming, and no duplicate components found during implementation.

### Advanced Analytics System Implementation (Completed)
- **Backend APIs**: Implemented comprehensive analytics routes with MongoDB aggregation pipelines for exam performance, user engagement, payment metrics, ticket statistics, and question analytics.
- **Analytics Dashboard**: Created interactive dashboard page with real-time metrics, tabbed interface, and polling every 30 seconds for live updates.
- **Chart Visualization**: Built AnalyticsChart component with Chart.js integration supporting line, bar, doughnut, and pie charts with Persian formatting and RTL support.
- **Report Generation**: Developed comprehensive report system with export options (JSON/CSV), preview functionality, and report history management.
- **Real-time Metrics**: Implemented live dashboard with today's key metrics (exams, users, transactions, tickets, active users) with automatic refresh.
- **Persian Formatting**: Created complete Persian number and date formatting utilities with RTL support and Jalali calendar integration.
- **Redux Integration**: Implemented analyticsSlice with Redux Toolkit for state management and React Query hooks with 10-minute stale time and Persian data transformation.
- **Performance Optimization**: Enhanced with MongoDB aggregation pipelines, React Query caching, and optimized polling for real-time updates.
- **Filter System**: Built advanced filtering with date range presets, report type selection, and export format options using fastest-validator.
- **Mobile-first Design**: Ensured responsive layouts with touch-friendly interactions and collapsible components.
- **Clean Code Implementation**: Followed Clean Code principles with single responsibility and no duplicate components found during implementation.

### Support Ticket System Implementation (Completed)
- **Backend APIs**: Implemented comprehensive ticket routes with CRUD operations, file upload support using multer, and status management.
- **User Interface**: Created TicketForm component with file attachments, category selection, priority levels, and validation using fastest-validator.
- **Admin Dashboard**: Built admin tickets page with filtering, sorting, assignment, and bulk operations for comprehensive ticket management.
- **Real-time Notifications**: Implemented polling-based notifications every 10 seconds using React Query for ticket updates.
- **File Attachments**: Added support for PDF, PNG, JPG files with 5MB size limit and maximum 3 files per ticket.
- **Escalation System**: Developed auto-escalation for high priority tickets after 24 hours with admin escalation controls.
- **Role-based Access**: Implemented different views and permissions for users, support staff, and admins.
- **Performance Optimization**: Enhanced components with lazy loading, memoization, and optimized React Query caching.
- **Clean Code Implementation**: Followed Clean Code principles with single responsibility and no duplicate components.

### Exam Management System Implementation (Completed)
- **Backend APIs**: Implemented comprehensive exam routes with CRUD operations, scheduling, and result processing using updated Exam and Question models.
- **Exam Builder**: Created ExamForm component with form-based exam creation, question bank integration, and validation using fastest-validator.
- **Exam Taking Interface**: Built exam taking page with timer, question navigation, auto-save functionality, and fullscreen mode.
- **Exam Scheduling**: Implemented exam scheduling with UTC timestamps and client-side Persian calendar conversion.
- **Question Types**: Added support for multiple choice (single/multiple correct), true/false, and short answer questions.
- **Grading System**: Implemented automatic grading for MC/TF questions and manual grading interface for short answer questions.
- **Admin Management**: Created comprehensive exam management with status tracking, publishing, archiving, and deletion.
- **Real-time Features**: Added auto-save answers every 2 seconds, timer countdown, and session management.
- **Performance Optimization**: Enhanced with React Query caching, Redux Toolkit state management, and Persian formatting.
- **Clean Code Implementation**: Removed duplicate components (AnalyticsChart.jsx) and maintained single responsibility principle.

### Question Bank System Implementation (Completed)
- **Backend APIs**: Implemented comprehensive question and category management routes with advanced search, filtering, and analytics capabilities.
- **Question Management**: Created full CRUD operations with support for multiple question types (multiple-choice, true-false, short-answer) and hierarchical categorization.
- **Import/Export System**: Built CSV/JSON import/export functionality with comprehensive validation, error reporting, and bulk operations.
- **Question Analytics**: Implemented usage tracking, success rate calculation, average response time, and difficulty assessment with auto-suggestion.
- **Advanced Search**: Created multi-criteria filtering with keyword search, category filtering, difficulty levels, and sorting capabilities.
- **Category Management**: Developed hierarchical category system with breadcrumb navigation, path generation, and question count tracking.
- **Bulk Operations**: Added mass update capabilities for categories, difficulty levels, tags, and deletion with confirmation dialogs.
- **Redux Integration**: Implemented questionSlice with Redux Toolkit and React Query hooks for optimal state management and caching.
- **UI Components**: Created QuestionForm, QuestionTable, QuestionImportExport components following Atomic Design principles.
- **Clean Code Implementation**: Maintained single responsibility principle with no duplicate components found during implementation.

### Previous Milestones
- **Payment System Phase 2 (Gateway Integration) Completed**:

  - **Backend Implementation**:
    - Created `DiscountCode` model with validation, expiry, usage limits, and minimum amount requirements.
    - Updated `Payment` model to include discount tracking (originalAmount, discountAmount, discountCode reference).
    - Implemented comprehensive payment routes (`/backend/src/routes/payment.js`) with ZarinPal integration for payment initiation, callback handling, discount validation, and transaction management.
    - Added payment validation middleware (`/backend/src/validations/payment.validation.js`) using fastest-validator with Persian error messages.
  - **Frontend State Management**:
    - Extended `walletSlice.js` with payment operations (initiatePayment, validateDiscountCode, fetchPaymentTransactions, checkPaymentStatus) and comprehensive state management.
    - Enhanced `useWallet.jsx` React Query hook with payment mutations, discount validation, and Persian data formatting (5min staleTime, 2 retries).
    - Created `adminTransactionsSlice.js` for admin transaction monitoring with filtering, export, refund operations, and statistics.
  - **UI Components**:
    - Implemented `PaymentForm.jsx` (Organism) with comprehensive payment flow including amount selection, discount code validation, payment summary, terms agreement, and ZarinPal integration.
    - Created `TransactionFilter.jsx` (Molecule) for advanced transaction filtering with date ranges, status filters, quick filters, and user search for admin view.
    - Extended `wallet.jsx` page with tabbed interface for wallet transactions and payment transactions, modal payment form, and comprehensive transaction display.
    - Built `pages/admin/transactions.jsx` for admin transaction monitoring with statistics cards, filtering, export functionality, refund management, and bulk operations.
  - **Clean Code Implementation**:
    - Removed redundant `Button.jsx` component (kept `ActionButton.jsx` with project-specific styling).
    - Moved duplicate `app` directory structure to backup (maintaining pages router consistency).
    - Updated Redux store to include `adminTransactionsReducer`.
    - Ensured all components follow RTL Persian design with project colors (#213448, #547792, #94B4C1, #ECEFCA).

- **Payment System Phase 1 (Wallet & UI) Completed**:

  - Implemented `walletSlice.js` (Redux Toolkit) with async thunks to fetch balance and transactions.
  - Created `useWallet.jsx` custom React Query hook (5 min stale, 2 retries, Persian formatting).
  - Added `BalanceCard.jsx` (Atom) and `TransactionTable.jsx` (Molecule) components with RTL Persian UI and Framer Motion animations.
  - Built `pages/wallet.jsx` page integrating balance card and transaction table with responsive design.
  - Registered `walletReducer` in the Redux store.
  - Updated project navigation (if needed) to include Wallet page.
  - Ensured Clean Code principles, no duplicate components, and full RTL support.

- **Admin Dashboard Fully Implemented**:
  - Created `adminSlice.js` using Redux Toolkit for comprehensive admin state management (users, exams, analytics, UI state) with async thunks.
  - Developed `useAdmin.jsx` custom React Query hook for optimized data fetching (users, exams, analytics) from Back4App MCP, including mutations for CRUD operations, 5-min stale time, 2 retries, and Persian data transformations.
  - Implemented core UI components using Atomic Design principles with Tailwind CSS and Framer Motion animations:
    - `ActionButton.jsx` (Atom): Versatile button with multiple variants, loading states, icon support, and RTL compliance.
    - `UserTable.jsx` (Molecule): Full-featured user management table with sorting, filtering, pagination, search, inline role editing, and deletion confirmation, all with Persian UI and animations.
    - `AnalyticsChart.jsx` (Organism): Comprehensive analytics dashboard integrating Chart.js for various chart types (line, bar, doughnut), animated stat cards, loading states, and Persian number/date formatting.
    - `ContentEditor.jsx` (Organism): Modular exam and question management system with a modal form for creating/editing exams (title, description, duration, difficulty, questions), including question list management (add/remove questions with options and correct answers) and form validation with Persian error messages.
  - Created the main Admin Dashboard page (`frontend/src/pages/admin/dashboard.jsx`) integrating all above components into a tabbed interface (User Management, Content Management, Analytics) with responsive design for desktop and mobile (bottom navigation), Framer Motion page transitions, and tab-specific error handling.
- Updated Redux store to include `adminReducer`.
- Ensured all Admin Dashboard elements adhere to RTL Persian UI, IranSans font, and project color scheme.
- Confirmed Clean Code principles were followed, with no new duplicate components introduced in `/frontend/src` for the admin feature.
- Maintained project structure with all frontend code in `/frontend/src`.
- Updated Memory Bank documentation (`progress.md`, `activeContext.md`) to reflect Admin Dashboard completion and shift focus to the Payment System.

## Next Steps

With App Router Migration & UI/UX Enhancement complete, the next priorities are:

1. **Security Enhancements**: Implement advanced security features (placeholder for future decision)
2. **Performance Monitoring**: Set up comprehensive performance tracking and optimization
3. **User Experience Testing**: Conduct usability testing and gather user feedback for App Router experience
4. **Documentation**: Complete user guides and technical documentation for new App Router structure
5. **Deployment Preparation**: Prepare production environment and deployment strategy for App Router build

## Active Decisions

- Maintain all frontend code in `/frontend/src` for modularity
- Use sequential-thinking MCP for automated debugging and error resolution
- Apply minimal changes approach to preserve existing functionality
- Focus on RTL Persian UI with IranSans font and project color scheme
- Defer advanced features (Mobile App, Security, i18n, DevOps, PWA, service workers, CDN, edge computing, next-i18next, DevOps tools, ML analytics) for future implementation

## Deferred Tasks

The following tasks have been identified for future implementation and are not part of the current development cycle:

- **Mobile Application**: Progressive Web App (PWA) or React Native mobile application
- **Security Enhancements**: Two-factor authentication (2FA), advanced rate limiting, CSRF protection
- **Internationalization (i18n)**: Multi-language support beyond Persian with next-i18next framework
- **DevOps**: Advanced CI/CD pipelines, automated deployment, monitoring, and error tracking
- **PWA Features**: Service workers, offline functionality, push notifications
- **CDN Integration**: Content delivery network setup for static assets
- **Edge Computing**: Edge function implementation for improved performance
- **DevOps Tools**: Advanced monitoring, logging, and deployment automation
- **ML Analytics**: Machine learning-based analytics and recommendations
