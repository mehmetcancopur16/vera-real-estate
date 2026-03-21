import mongoose from 'mongoose';
import logger from '../utils/logger.js';

function getMongoUri() {
  return process.env.MONGO_URI || process.env.MONGODB_URI;
}

/**
 * Mongoose ile MongoDB bağlantısı. Başarısızlıkta loglar ve hatayı fırlatır.
 */
export async function connectDB() {
  const uri = getMongoUri();
  if (!uri) {
    const err = new Error('MONGO_URI (veya MONGODB_URI) tanımlı değil');
    logger.error(err.message);
    throw err;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    logger.info('MongoDB bağlantısı başarılı');
  } catch (error) {
    logger.error(`MongoDB bağlantı hatası: ${error.message}`, { stack: error.stack });
    throw error;
  }
}
