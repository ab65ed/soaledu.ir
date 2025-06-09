# Educational Test System API

A robust, scalable, modular, and well-documented API backend for an educational test system built with Express.js and MongoDB (Mongoose).

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Exam System**: Create and take exams with configurable settings (negative marking, timer options)
- **Educational Content**: Categories, lessons, and questions with difficulty levels
- **User Management**: Student, admin, and support roles with appropriate permissions
- **Payment System**: Credit-based wallet system for taking exams
- **Support System**: Ticket-based support for user inquiries
- **Blog System**: Content management for educational articles and SEO

## Tech Stack

- **Node.js & Express.js**: Modern JavaScript (ES6+) backend framework
- **MongoDB & Mongoose**: NoSQL database with ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Winston**: Logging
- **Fastest-Validator**: Input validation
- **Swagger**: API documentation
- **Jest & Supertest**: Testing

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Custom middleware functions
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validations/    # Input validation schemas
├── tests/          # Test files
└── server.js       # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Testing

Run tests with:

```
npm test
```

## License

ISC
