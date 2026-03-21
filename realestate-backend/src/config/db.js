import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connects to MongoDB. Call once during app bootstrap.
 */
export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info('MongoDB connected');
}
