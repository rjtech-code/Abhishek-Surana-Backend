import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import mongoose from 'mongoose';

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`🚀 District Admin Backend Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
    logger.info(`🌐 Allowed Frontend Origin: ${env.FRONTEND_URL}`);
  });
};

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await mongoose.connection.close(false);
        logger.info('MongoDB connection closed.');
        process.exit(0);
      } catch (err) {
        logger.error(`Error during MongoDB disconnection: ${err.message}`);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }

  // Force shutdown after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
  process.exit(1);
});

startServer();