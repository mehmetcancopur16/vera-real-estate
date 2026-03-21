import 'dotenv/config';
import app from './src/app.js';
import logger from './src/utils/logger.js';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
