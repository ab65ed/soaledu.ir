/**
 * Main server file for the Educational Test System API
 *
 * This file initializes the Express server, connects to MongoDB,
 * sets up middleware, and defines API routes.
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import Parse from "parse/node";

// Import configuration
import { 
  PORT, 
  NODE_ENV, 
  MONGO_URI, 
  FRONTEND_URL, 
  PARSE_APPLICATION_ID, 
  PARSE_JAVASCRIPT_KEY, 
  PARSE_SERVER_URL 
} from "./config/env";
import logger from "./config/logger";

// Import routes
// Import working routes
import contactRoutes from "./routes/contact"; // Contact management routes - فعال شده
import cacheRoutes from "./routes/cache"; // Cache management routes
import performanceRoutes from "./routes/performance"; // Performance monitoring routes
import abTestRoutes from "./routes/ab-test"; // A/B Testing management routes
import scalabilityRoutes from "./routes/scalability"; // Database scalability and optimization routes
import apiRoutes from "./routes/index"; // Main API routes including institutional discounts - فعال شده

// Recently activated API routes
import questionsRoutes from "./routes/questions"; // Question bank management - فعال شده
import questionBulkRoutes from "./routes/question.routes"; // Question bulk upload routes - جدید
import flashcardRoutes from "./routes/flashcard"; // Flashcard management routes - فعال شده
import walletRoutes from "./routes/wallet"; // Wallet management routes - فعال شده
import institutionRoutes from "./routes/institutionRoutes"; // Institution management routes - جدید

// Auth routes - فعال شده
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import examsRoutes from "./routes/exams"; // New exam management routes
import categoriesRoutes from "./routes/categories"; // New category management
import analyticsRoutes from "./routes/analytics"; // Analytics and reporting
import ticketRoutes from "./routes/tickets";
import paymentRoutes from "./routes/payment";
import resultsRoutes from "./routes/results";
import examPurchaseRoutes from "./routes/exam-purchase"; // Exam purchase cache management routes
import financeRoutes from "./routes/finance"; // Finance and pricing routes - فعال شده
import designerFinanceRoutes from "./routes/designer-finance"; // Designer finance management routes - فعال شده
import financeSettingsRoutes from "./routes/financeSettings"; // Finance settings management routes - فعال شده
import blogRoutes from "./routes/blogRoutes"; // Blog management routes - فعال شده

// Newly activated routes
import contactRoutes2 from "./routes/contact"; // Contact form routes - فعال شده
import testExamsRoutes from "./routes/testExams"; // Test exam routes - فعال شده
import designerFinanceRoutes2 from "./routes/designer-finance.routes"; // Designer finance routes v2 - فعال شده
import questionRoutes from "./routes/question"; // Question management routes - فعال شده
import rolesRoutes from "./routes/roles"; // Roles management routes - فعال شده
import courseExamRoutes from "./routes/course-exam"; // Course exam routes - فعال شده
import courseExamRoutes2 from "./routes/course-exam.routes"; // Course exam routes v2 - فعال شده
import fieldOfStudyRoutes from "./routes/field-of-study.routes"; // Field of study routes - جدید
import courseTypesRoutes from "./routes/course-types.routes"; // Course types routes - جدید
import gradesRoutes from "./routes/grades.routes"; // Grades routes - جدید
import coursesRoutes from "./routes/courses.routes"; // Courses routes - جدید

// Import middleware
import { errorHandler } from "./middlewares/errorHandler";
import { createParseServer } from "./config/parse-server";
import { setupCSRFToken, validateCSRFToken } from "./middlewares/csrf.middleware";
import { checkTokenBlocklist } from "./middlewares/token-blocklist.middleware";

// Initialize Parse Server
const parseServer = createParseServer();

// Initialize Parse - after server creation
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = `http://localhost:${PORT}/parse`; // Use the same server

logger.info(`Parse initialized with Application ID: ${PARSE_APPLICATION_ID}`);
logger.info(`Parse Server URL: http://localhost:${PORT}/parse`);

// Initialize Express app
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Educational Test System API - Exam-Edu",
      version: "1.0.0",
      description: "API documentation for the Educational Test System including Contact, Performance, A/B Testing, Cache Management, and Scalability routes",
      contact: {
        name: "API Support",
        url: "https://soaledu.ir",
        email: "support@soaledu.ir"
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: "Development server",
      },
      {
        url: "https://soaledu.ir/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/routes/*.js", "./src/models/*.ts", "./src/models/*.js", "./src/controllers/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Security middleware - CSRF protection
app.use(setupCSRFToken);

// Token blocklist check (before authentication middleware)
app.use(checkTokenBlocklist as any);

// Parse Server endpoint
app.use('/parse', parseServer.app);

// API Routes - Working routes
app.use("/api/v1/contact", contactRoutes); // Contact management routes - فعال شده
app.use("/api/v1/cache", cacheRoutes); // Cache management routes
app.use("/api/v1/performance", performanceRoutes); // Performance monitoring routes
app.use("/api/v1/ab-test", abTestRoutes); // A/B Testing management routes
app.use("/api/v1/scalability", scalabilityRoutes); // Database scalability and optimization routes
app.use("/api/v1", apiRoutes); // Main API routes including institutional discounts - فعال شده

// Recently activated API routes
app.use("/api/v1/questions", questionsRoutes); // Question bank management - فعال شده
app.use("/api/v1/questions", questionBulkRoutes); // Question bulk upload routes - جدید
app.use("/api/v1/flashcards", flashcardRoutes); // Flashcard management routes - فعال شده
app.use("/api/v1/wallet", walletRoutes); // Wallet management routes - فعال شده
app.use("/api/v1/institutions", institutionRoutes); // Institution management routes - جدید

// Auth routes - فعال شده
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/legacy-categories", categoryRoutes); // Keep legacy routes for backward compatibility
app.use("/api/v1/exams", examsRoutes); // New exam management routes
app.use("/api/v1/categories", categoriesRoutes); // Override with new category management
app.use("/api/v1/analytics", analyticsRoutes); // Analytics and reporting
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/results", resultsRoutes);
app.use("/api/v1/exam-purchase", examPurchaseRoutes); // Exam purchase cache management routes - استانداردسازی شده

// Finance and Blog routes - فعال شده
app.use("/api/v1/finance", financeRoutes); // Finance and pricing routes - فعال شده
app.use("/api/v1/designer-finance", designerFinanceRoutes); // Designer finance management routes - فعال شده
app.use("/api/finance-settings", financeSettingsRoutes); // Finance settings management routes - فعال شده
app.use("/api/v1/blog", blogRoutes); // Blog management routes - فعال شده

// Newly activated routes
app.use("/api/v1/contact-form", contactRoutes2); // Contact form routes - فعال شده
app.use("/api/v1/test-exams", testExamsRoutes); // Test exam routes - فعال شده
app.use("/api/v1/designer-finance-v2", designerFinanceRoutes2); // Designer finance routes v2 - فعال شده
app.use("/api/v1/question", questionRoutes); // Question management routes - فعال شده
app.use("/api/v1/roles", rolesRoutes); // Roles management routes - فعال شده
app.use("/api/v1/course-exams", courseExamRoutes); // Course exam routes - فعال شده
app.use("/api/v1/course-exams-v2", courseExamRoutes2); // Course exam routes v2 - فعال شده
app.use("/api/v1/field-of-study", fieldOfStudyRoutes); // Field of study routes - جدید
app.use("/api/v1/course-types", courseTypesRoutes); // Course types routes - جدید
app.use("/api/v1/grades", gradesRoutes); // Grades routes - جدید
app.use("/api/v1/courses", coursesRoutes); // Courses routes - جدید

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", environment: NODE_ENV });
});

// CSRF Token endpoint
import { provideCSRFToken } from "./middlewares/csrf.middleware";
app.get("/api/v1/csrf-token", provideCSRFToken);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  })
  .catch((err: Error) => {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

export default app; // Export for testing 