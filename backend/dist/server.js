"use strict";
/**
 * Main server file for the Educational Test System API
 *
 * This file initializes the Express server, connects to MongoDB,
 * sets up middleware, and defines API routes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const node_1 = __importDefault(require("parse/node"));
// Import configuration
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./config/logger"));
// Import routes
// Import working routes
const contact_1 = __importDefault(require("./routes/contact")); // Contact management routes - فعال شده
const cache_1 = __importDefault(require("./routes/cache")); // Cache management routes
const performance_1 = __importDefault(require("./routes/performance")); // Performance monitoring routes
const ab_test_1 = __importDefault(require("./routes/ab-test")); // A/B Testing management routes
const scalability_1 = __importDefault(require("./routes/scalability")); // Database scalability and optimization routes
const index_1 = __importDefault(require("./routes/index")); // Main API routes including institutional discounts - فعال شده
// Recently activated API routes
const questions_1 = __importDefault(require("./routes/questions")); // Question bank management - فعال شده
const question_routes_1 = __importDefault(require("./routes/question.routes")); // Question bulk upload routes - جدید
const flashcard_1 = __importDefault(require("./routes/flashcard")); // Flashcard management routes - فعال شده
const wallet_1 = __importDefault(require("./routes/wallet")); // Wallet management routes - فعال شده
const institutionRoutes_1 = __importDefault(require("./routes/institutionRoutes")); // Institution management routes - جدید
// Auth routes - فعال شده
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const exams_1 = __importDefault(require("./routes/exams")); // New exam management routes
const categories_1 = __importDefault(require("./routes/categories")); // New category management
const analytics_1 = __importDefault(require("./routes/analytics")); // Analytics and reporting
const tickets_1 = __importDefault(require("./routes/tickets"));
const payment_1 = __importDefault(require("./routes/payment"));
const results_1 = __importDefault(require("./routes/results"));
const exam_purchase_1 = __importDefault(require("./routes/exam-purchase")); // Exam purchase cache management routes
const finance_1 = __importDefault(require("./routes/finance")); // Finance and pricing routes - فعال شده
const designer_finance_1 = __importDefault(require("./routes/designer-finance")); // Designer finance management routes - فعال شده
const financeSettings_1 = __importDefault(require("./routes/financeSettings")); // Finance settings management routes - فعال شده
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes")); // Blog management routes - فعال شده
// Newly activated routes
const contact_2 = __importDefault(require("./routes/contact")); // Contact form routes - فعال شده
const testExams_1 = __importDefault(require("./routes/testExams")); // Test exam routes - فعال شده
const designer_finance_routes_1 = __importDefault(require("./routes/designer-finance.routes")); // Designer finance routes v2 - فعال شده
const question_1 = __importDefault(require("./routes/question")); // Question management routes - فعال شده
const roles_1 = __importDefault(require("./routes/roles")); // Roles management routes - فعال شده
const course_exam_1 = __importDefault(require("./routes/course-exam")); // Course exam routes - فعال شده
const course_exam_routes_1 = __importDefault(require("./routes/course-exam.routes")); // Course exam routes v2 - فعال شده
// Import middleware
const errorHandler_1 = require("./middlewares/errorHandler");
const parse_server_1 = require("./config/parse-server");
const csrf_middleware_1 = require("./middlewares/csrf.middleware");
const token_blocklist_middleware_1 = require("./middlewares/token-blocklist.middleware");
// Initialize Parse Server
const parseServer = (0, parse_server_1.createParseServer)();
// Initialize Parse - after server creation
node_1.default.initialize(env_1.PARSE_APPLICATION_ID, env_1.PARSE_JAVASCRIPT_KEY);
node_1.default.serverURL = `http://localhost:${env_1.PORT}/parse`; // Use the same server
logger_1.default.info(`Parse initialized with Application ID: ${env_1.PARSE_APPLICATION_ID}`);
logger_1.default.info(`Parse Server URL: http://localhost:${env_1.PORT}/parse`);
// Initialize Express app
const app = (0, express_1.default)();
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
                url: `http://localhost:${env_1.PORT}/api/v1`,
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: env_1.FRONTEND_URL,
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
})); // Enable CORS
app.use((0, cookie_parser_1.default)()); // Parse cookies
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
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
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`);
    next();
});
// Security middleware - CSRF protection
app.use(csrf_middleware_1.setupCSRFToken);
// Token blocklist check (before authentication middleware)
app.use(token_blocklist_middleware_1.checkTokenBlocklist);
// Parse Server endpoint
app.use('/parse', parseServer.app);
// API Routes - Working routes
app.use("/api/v1/contact", contact_1.default); // Contact management routes - فعال شده
app.use("/api/v1/cache", cache_1.default); // Cache management routes
app.use("/api/v1/performance", performance_1.default); // Performance monitoring routes
app.use("/api/v1/ab-test", ab_test_1.default); // A/B Testing management routes
app.use("/api/v1/scalability", scalability_1.default); // Database scalability and optimization routes
app.use("/api/v1", index_1.default); // Main API routes including institutional discounts - فعال شده
// Recently activated API routes
app.use("/api/v1/questions", questions_1.default); // Question bank management - فعال شده
app.use("/api/v1/questions", question_routes_1.default); // Question bulk upload routes - جدید
app.use("/api/v1/flashcards", flashcard_1.default); // Flashcard management routes - فعال شده
app.use("/api/v1/wallet", wallet_1.default); // Wallet management routes - فعال شده
app.use("/api/v1/institutions", institutionRoutes_1.default); // Institution management routes - جدید
// Auth routes - فعال شده
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/legacy-categories", category_routes_1.default); // Keep legacy routes for backward compatibility
app.use("/api/v1/exams", exams_1.default); // New exam management routes
app.use("/api/v1/categories", categories_1.default); // Override with new category management
app.use("/api/v1/analytics", analytics_1.default); // Analytics and reporting
app.use("/api/v1/tickets", tickets_1.default);
app.use("/api/v1/payments", payment_1.default);
app.use("/api/v1/results", results_1.default);
app.use("/api/v1/exam-purchase", exam_purchase_1.default); // Exam purchase cache management routes - استانداردسازی شده
// Finance and Blog routes - فعال شده
app.use("/api/v1/finance", finance_1.default); // Finance and pricing routes - فعال شده
app.use("/api/v1/designer-finance", designer_finance_1.default); // Designer finance management routes - فعال شده
app.use("/api/finance-settings", financeSettings_1.default); // Finance settings management routes - فعال شده
app.use("/api/v1/blog", blogRoutes_1.default); // Blog management routes - فعال شده
// Newly activated routes
app.use("/api/v1/contact-form", contact_2.default); // Contact form routes - فعال شده
app.use("/api/v1/test-exams", testExams_1.default); // Test exam routes - فعال شده
app.use("/api/v1/designer-finance-v2", designer_finance_routes_1.default); // Designer finance routes v2 - فعال شده
app.use("/api/v1/question", question_1.default); // Question management routes - فعال شده
app.use("/api/v1/roles", roles_1.default); // Roles management routes - فعال شده
app.use("/api/v1/course-exams", course_exam_1.default); // Course exam routes - فعال شده
app.use("/api/v1/course-exams-v2", course_exam_routes_1.default); // Course exam routes v2 - فعال شده
// Swagger API Documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", environment: env_1.NODE_ENV });
});
// CSRF Token endpoint
const csrf_middleware_2 = require("./middlewares/csrf.middleware");
app.get("/api/v1/csrf-token", csrf_middleware_2.provideCSRFToken);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Connect to MongoDB and start server
mongoose_1.default
    .connect(env_1.MONGO_URI)
    .then(() => {
    logger_1.default.info("Connected to MongoDB");
    app.listen(env_1.PORT, () => {
        logger_1.default.info(`Server running on port ${env_1.PORT} in ${env_1.NODE_ENV} mode`);
    });
})
    .catch((err) => {
    logger_1.default.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger_1.default.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});
exports.default = app; // Export for testing 
//# sourceMappingURL=server.js.map