# Project Brief: Exam-Edu

## Project Overview

Exam-Edu is an online testing platform for Persian-speaking students, offering exam-taking, result tracking, and personalized learning experiences and  a comprehensive online examination and educational platform designed to create, manage, and deliver exams while providing educational resources. The system serves multiple user roles including students, administrators, and support staff.

## Core Requirements
- **Frontend**: Next.js, React Query, Tailwind CSS, Aceternity UI, Framer Motion.
- **Pages**: Home, Contact Us, Login, Register, Student Dashboard, Admin Dashboard, Exam, Exam Results, Exam Settings.
- **Roles**: Student, Support, Question Designer, Admin.
- **RTL Persian UI**: IranSans font, colors (#213448, #547792, #94B4C1, #ECEFCA).
- **Validation**: `fastest-validator` only, no Zod.
- **File Types**: `.jsx` for React components/pages, `.js` for utilities/services.
- **Project Root**: Only `frontend` and `backend` folders; other files moved to `/frontend` or `/backup`.
- **Modularity**: All frontend code in `/frontend/src`; extra folders moved or deleted.
- **MCP Servers**: Back4App (backend), @21st-dev/magic (UI), magicuidesign/mcp (UI/UX), sequential-thinking (debugging).
- **React Query**: Full optimization (caching, prefetch, infinite scroll) with custom hooks.
- **JavaScript**: No TypeScript.
- **Responsive**: Fully responsive pages with senior-level UI/UX via MCPs.

### User Management

- User registration and authentication system
- Role-based access control (student, admin, support)
- User profile management
- Permission-based actions

### Exam System

- Exam creation and management
- Question bank with categories and difficulty levels
- Timer options for exams
- Negative marking capability
- Result analysis and reporting

### Educational Content

- Categorized lessons and educational materials
- Question repository with various difficulty levels
- Blog posts and educational articles

### Support System

- Ticket-based support for user inquiries
- Response and resolution tracking

### Payment System

- Credit-based wallet for taking exams
- Payment history and transaction records

## Technical Goals

- Create a responsive React/Next.js frontend
- Develop a robust Node.js/Express backend API
- Implement MongoDB database with proper data modeling
- Ensure security with JWT authentication
- Document API comprehensively using Swagger
- Support RTL interface for Persian language

## Business Goals

- Provide a reliable platform for educational institutions
- Offer a user-friendly experience for both students and administrators
- Enable effective management of educational content and exams
- Build a scalable solution that can grow with increasing user base
- Conduct online exams with timers and negative marking.
- Display graphical results and review mistakes.
- Manage wallet with payments and discounts.
- Ensure modular, maintainable code with auto-error handling.
