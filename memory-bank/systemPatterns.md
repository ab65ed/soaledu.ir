# System Patterns

## Architecture Overview

Exam-Edu follows a client-server architecture with a clear separation between frontend and backend:

```
├── Frontend (Next.js)
│   ├── App Router
│   ├── React Components (Atomic Design)
│   ├── Client State (Redux)
│   └── Server State (React Query)
│
└── Backend (Express.js)
    ├── RESTful API
    ├── Controllers
    ├── Services
    ├── Models (Mongoose)
    └── Middleware
```

## Design Patterns
- Atomic Design for components.
- Custom hooks for logic (e.g., `usePageData`, `useThrottle`).
- Context API for theme and auth.

## System Architecture
- **Frontend**: Next.js (SSG/SSR), React Query, Tailwind CSS in `/frontend/src`.
- **Backend**: Managed via Back4App MCP.
- **File Structure**:
  - `/frontend/src/pages`: `.jsx` pages (e.g., `index.jsx`, `admin/dashboard.jsx`).
  - `/frontend/src/components`: Atomic Design (`atoms`, `molecules`, `organisms`).
  - `/frontend/src/hooks`: Custom hooks (e.g., `useAuth.jsx`, `useValidator.jsx`).
  - `/frontend/src/services`: API calls (`api.js`).
  - `/frontend/src/utils`: Utilities (`toPersianRial.js`).
- Extra folders moved to `/frontend/src` or deleted.


### Frontend

1. **Atomic Design Pattern**: Components organized into atoms, molecules, and organisms

   - Atoms: Basic UI elements (buttons, inputs)
   - Molecules: Groups of atoms (form fields, cards)
   - Organisms: Complex components (forms, headers)

2. **Separation of Concerns**:

   - React Query for server state
   - Redux for global client state
   - Local state for component-specific needs

3. **Container/Presentation Pattern**:
   - Container components handle logic and state
   - Presentation components focus on UI

### Backend

1. **MVC-like Pattern**:

   - Controllers: Handle requests and responses
   - Services: Contain business logic
   - Models: Represent data structure

2. **Middleware Pattern**:

   - Authentication middleware
   - Validation middleware
   - Error handling middleware

3. **Repository Pattern**:
   - Abstract database operations
   - Centralize data access logic

## Key Technical Decisions
- `.jsx` for React, `.js` for utilities/services.
- `fastest-validator` for validation with `useValidator` hook.
- Full React Query optimization (prefetch, infinite scroll, deduplication).
- Auto-error handling with sequential-thinking MCP.

### Frontend

- **Next.js**: For server-side rendering and app routing
- **Tailwind CSS**: For utility-first styling
- **React Query**: For server state management and caching
- **Redux Toolkit**: For global state management
- **React Hook Form**: For form handling
- **Framer Motion**: For animations
- **Chart.js**: For data visualization

### Backend

- **Express.js**: For RESTful API development
- **MongoDB**: As NoSQL database
- **Mongoose**: For data modeling and validation
- **JWT**: For authentication and authorization
- **Fastest Validator**: For input validation
- **Winston**: For logging
- **Swagger**: For API documentation

## Component Relationships

### User Authentication Flow

```
Client → Auth API → JWT Generation → MongoDB
   ↑          ↓
   └── JWT Response
```

### Exam Taking Flow

```
Student → Exam API → Load Questions → Timer Start → Submit Answers → Calculate Results
                                                                          ↓
                                                       Update Student Records & Show Results
```

### Admin Dashboard Flow

```
Admin → Auth → Dashboard
         ↓
    Content Management
         ↓
    User Management
         ↓
    Exam Management
         ↓
    Support Ticket Management
```

- Atomic Design for components.
- Custom hooks for logic (e.g., `usePageData`, `useThrottle`).
- Context API for theme and auth.


## Data Flow Patterns

- RESTful API communication between frontend and backend
- JWT for secure authentication
- Centralized error handling
- Consistent API response format
