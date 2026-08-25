import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const seed = async () => {
  try {
    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASSWORD;
    const name = env.ADMIN_NAME;

    if (!email || !password) {
      logger.error('❌ Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file to run the seed script.');
      process.exit(1);
    }

    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB for admin seeding...');

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      logger.info(`ℹ️ Admin user with email ${email} already exists. No actions required.`);
    } else {
      await Admin.create({
        name,
        email,
        password,
        role: 'admin',
      });
      logger.info(`✅ Admin user [${email}] created successfully.`);
    }

    await mongoose.connection.close();
    logger.info('Database connection closed.');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();