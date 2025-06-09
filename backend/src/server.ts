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
// import contactRoutes from "./routes/contact"; // Contact management routes - موقتاً غیرفعال
import cacheRoutes from "./routes/cache"; // Cache management routes
import performanceRoutes from "./routes/performance"; // Performance monitoring routes
import abTestRoutes from "./routes/ab-test"; // A/B Testing management routes
import scalabilityRoutes from "./routes/scalability"; // Database scalability and optimization routes

// Auth routes - موقتاً غیرفعال به دلیل مشکلات compilation
// import authRoutes from "./routes/auth.routes";
// import categoryRoutes from "./routes/category.routes";
// import examsRoutes from "./routes/exams"; // New exam management routes
// import questionsRoutes from "./routes/questions"; // New question bank management
// import categoriesRoutes from "./routes/categories"; // New category management
// import analyticsRoutes from "./routes/analytics"; // Analytics and reporting
// import ticketRoutes from "./routes/tickets";
// import paymentRoutes from "./routes/payment";
// import resultsRoutes from "./routes/results";
// import financeRoutes from "./routes/finance"; // Finance and pricing routes
// import designerFinanceRoutes from "./routes/designer-finance"; // Designer finance management routes
// import financeSettingsRoutes from "./routes/financeSettings"; // Finance settings management routes
// import flashcardRoutes from "./routes/flashcard"; // Flashcard management routes
// import examPurchaseRoutes from "./routes/exam-purchase"; // Exam purchase cache management routes
// import blogRoutes from "./routes/blogRoutes"; // Blog management routes

// Import middleware
import { errorHandler } from "./middlewares/errorHandler";
import { createParseServer } from "./config/parse-server";

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

// Parse Server endpoint
app.use('/parse', parseServer.app);

// API Routes - Working routes
// app.use("/api/v1/contact", contactRoutes); // Contact management routes - موقتاً غیرفعال
app.use("/api/v1/cache", cacheRoutes); // Cache management routes
app.use("/api/v1/performance", performanceRoutes); // Performance monitoring routes
app.use("/api/v1/ab-test", abTestRoutes); // A/B Testing management routes
app.use("/api/v1/scalability", scalabilityRoutes); // Database scalability and optimization routes

// Auth routes - موقتاً غیرفعال به دلیل مشکلات compilation
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/legacy-categories", categoryRoutes); // Keep legacy routes for backward compatibility
// app.use("/api/v1/exams", examsRoutes); // New exam management routes
// app.use("/api/v1/questions", questionsRoutes); // New question bank management
// app.use("/api/v1/categories", categoriesRoutes); // Override with new category management
// app.use("/api/v1/analytics", analyticsRoutes); // Analytics and reporting
// app.use("/api/v1/tickets", ticketRoutes);
// app.use("/api/v1/payments", paymentRoutes);
// app.use("/api/v1/results", resultsRoutes);
// app.use("/api/v1/finance", financeRoutes); // Finance and pricing routes
// app.use("/api/v1/designer-finance", designerFinanceRoutes); // Designer finance management routes
// app.use("/api/finance-settings", financeSettingsRoutes); // Finance settings management routes
// app.use("/api/v1/flashcards", flashcardRoutes); // Flashcard management routes
// app.use("/api/exam-purchase", examPurchaseRoutes); // Exam purchase cache management routes
// app.use("/api/v1/blog", blogRoutes); // Blog management routes

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", environment: NODE_ENV });
});

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