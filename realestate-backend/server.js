import 'dotenv/config';
import app from './src/app.js';
import logger from './src/utils/logger.js';
import { connectDB } from './src/config/db.js';

const PORT = Number(process.env.PORT) || 5050;
const NODE_ENV = process.env.NODE_ENV || 'development';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};

function printStartupBanner(port) {
  const line = `${C.dim}${'─'.repeat(54)}${C.reset}`;
  const envColor = NODE_ENV === 'production' ? C.yellow : C.green;
  const row = (label, value, valueColor = C.white) =>
    `  ${C.dim}${label.padEnd(14)}${C.reset} ${valueColor}${value}${C.reset}`;

  const banner = [
    '',
    line,
    `  ${C.bold}${C.cyan}VERA REAL ESTATE${C.reset}  ${C.dim}—${C.reset}  API Server`,
    line,
    row('Environment', NODE_ENV, envColor),
    row('Server', `http://localhost:${port}`, C.bold + C.white),
    row('API Base', `http://localhost:${port}/api`, C.white),
    `  ${C.dim}${'·'.repeat(52)}${C.reset}`,
    row('Swagger UI', `http://localhost:${port}/docs`, C.bold + C.cyan),
    row('OpenAPI JSON', `http://localhost:${port}/docs.json`, C.cyan),
    row('Health Check', `http://localhost:${port}/api/health`, C.green),
    line,
    '',
  ].join('\n');

  process.stdout.write(banner);
}

async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      printStartupBanner(PORT);
    });
  } catch (err) {
    logger.error('Sunucu başlatılamadı', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

bootstrap();
