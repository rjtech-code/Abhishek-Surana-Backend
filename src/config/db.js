import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

let isConnected = false;

export const connectDB = async (retryCount = 5, delayMs = 5000) => {
  let attempts = 0;

  while (attempts < retryCount) {
    try {
      attempts++;
      logger.info(`Connecting to MongoDB (Attempt ${attempts}/${retryCount})...`);

      const conn = await mongoose.connect(env.MONGODB_URI, {
        autoIndex: env.NODE_ENV !== 'production',
        serverSelectionTimeoutMS: 5000,
      });

      isConnected = true;
      logger.info(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      logger.error(`❌ MongoDB connection failed on attempt ${attempts}: ${error.message}`);
      if (attempts >= retryCount) {
        logger.error('CRITICAL: Max retry attempts reached. Exiting application.');
        process.exit(1);
      }
      logger.info(`Waiting ${delayMs / 1000} seconds before next connection retry...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('⚠️ MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection runtime error: ${err.message}`);
});

export const isDbConnected = () => isConnected;