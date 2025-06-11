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
// import contactRoutes from "./routes/contact"; // Contact management routes - موقتاً غیرفعال
const cache_1 = __importDefault(require("./routes/cache")); // Cache management routes
const performance_1 = __importDefault(require("./routes/performance")); // Performance monitoring routes
const ab_test_1 = __importDefault(require("./routes/ab-test")); // A/B Testing management routes
const scalability_1 = __importDefault(require("./routes/scalability")); // Database scalability and optimization routes
// Recently activated API routes
const questions_1 = __importDefault(require("./routes/questions")); // Question bank management - فعال شده
const flashcard_1 = __importDefault(require("./routes/flashcard")); // Flashcard management routes - فعال شده
const wallet_1 = __importDefault(require("./routes/wallet")); // Wallet management routes - فعال شده
// Auth routes - موقتاً غیرفعال به دلیل مشکلات compilation
// import authRoutes from "./routes/auth.routes";
// import categoryRoutes from "./routes/category.routes";
// import examsRoutes from "./routes/exams"; // New exam management routes
// import categoriesRoutes from "./routes/categories"; // New category management
// import analyticsRoutes from "./routes/analytics"; // Analytics and reporting
// import ticketRoutes from "./routes/tickets";
// import paymentRoutes from "./routes/payment";
// import resultsRoutes from "./routes/results";
// import financeRoutes from "./routes/finance"; // Finance and pricing routes
// import designerFinanceRoutes from "./routes/designer-finance"; // Designer finance management routes
// import financeSettingsRoutes from "./routes/financeSettings"; // Finance settings management routes
// import examPurchaseRoutes from "./routes/exam-purchase"; // Exam purchase cache management routes
// import blogRoutes from "./routes/blogRoutes"; // Blog management routes
// Import middleware
const errorHandler_1 = require("./middlewares/errorHandler");
const parse_server_1 = require("./config/parse-server");
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
// Parse Server endpoint
app.use('/parse', parseServer.app);
// API Routes - Working routes
// app.use("/api/v1/contact", contactRoutes); // Contact management routes - موقتاً غیرفعال
app.use("/api/v1/cache", cache_1.default); // Cache management routes
app.use("/api/v1/performance", performance_1.default); // Performance monitoring routes
app.use("/api/v1/ab-test", ab_test_1.default); // A/B Testing management routes
app.use("/api/v1/scalability", scalability_1.default); // Database scalability and optimization routes
// Recently activated API routes
app.use("/api/v1/questions", questions_1.default); // Question bank management - فعال شده
app.use("/api/v1/flashcards", flashcard_1.default); // Flashcard management routes - فعال شده
app.use("/api/v1/wallet", wallet_1.default); // Wallet management routes - فعال شده
// Auth routes - موقتاً غیرفعال به دلیل مشکلات compilation
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/legacy-categories", categoryRoutes); // Keep legacy routes for backward compatibility
// app.use("/api/v1/exams", examsRoutes); // New exam management routes
// app.use("/api/v1/categories", categoriesRoutes); // Override with new category management
// app.use("/api/v1/analytics", analyticsRoutes); // Analytics and reporting
// app.use("/api/v1/tickets", ticketRoutes);
// app.use("/api/v1/payments", paymentRoutes);
// app.use("/api/v1/results", resultsRoutes);
// app.use("/api/v1/finance", financeRoutes); // Finance and pricing routes
// app.use("/api/v1/designer-finance", designerFinanceRoutes); // Designer finance management routes
// app.use("/api/finance-settings", financeSettingsRoutes); // Finance settings management routes
// app.use("/api/exam-purchase", examPurchaseRoutes); // Exam purchase cache management routes
// app.use("/api/v1/blog", blogRoutes); // Blog management routes
// Swagger API Documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", environment: env_1.NODE_ENV });
});
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