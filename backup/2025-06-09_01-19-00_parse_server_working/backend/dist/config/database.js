"use strict";
/**
 * Database configuration
 *
 * This file configures the MongoDB connection using Mongoose.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const env_1 = require("./env");
/**
 * Connect to MongoDB
 * @returns {Promise<typeof mongoose>} Mongoose connection promise
 */
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.MONGO_URI, {
        // Mongoose 6+ doesn't need these options anymore, they're now default
        });
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        logger_1.default.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map