/**
 * Database configuration
 * 
 * This file configures the MongoDB connection using Mongoose.
 */

import mongoose from 'mongoose';
import logger from './logger';
import { MONGO_URI } from './env';

/**
 * Connect to MongoDB
 * @returns {Promise<typeof mongoose>} Mongoose connection promise
 */
const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Mongoose 6+ doesn't need these options anymore, they're now default
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 