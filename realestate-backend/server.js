import 'dotenv/config';
import app from './src/app.js';
import logger from './src/utils/logger.js';
import { connectDB } from './src/config/db.js';

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Sunucu başlatılamadı', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

bootstrap();
