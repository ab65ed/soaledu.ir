/**
 * Database configuration
 *
 * This file configures the MongoDB connection using Mongoose.
 */
import mongoose from 'mongoose';
/**
 * Connect to MongoDB
 * @returns {Promise<typeof mongoose>} Mongoose connection promise
 */
declare const connectDB: () => Promise<typeof mongoose>;
export default connectDB;
