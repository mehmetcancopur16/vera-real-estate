import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config.js';
import logger from './utils/logger.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { mongoSanitizeCompatible } from './middlewares/mongo-sanitize.middleware.js';
import authRoutes from './routes/auth.routes.js';
import propertyRoutes from './routes/property.routes.js';
import contactRoutes from './routes/contact.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Production: add Vercel frontend domains via CORS_ORIGINS env (comma-separated).
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [])
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' }
});

app.set('trust proxy', 1);

// Serve uploaded files
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true
  })
);
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitizeCompatible());
app.use(hpp());

morgan.token('colored-status', (req, res) => {
  const code = res.statusCode;
  if (code >= 500) return `\x1b[31m${code}\x1b[0m`;
  if (code >= 400) return `\x1b[33m${code}\x1b[0m`;
  if (code >= 300) return `\x1b[36m${code}\x1b[0m`;
  return `\x1b[32m${code}\x1b[0m`;
});

app.use(
  morgan(':method :url :colored-status :response-time ms - :res[content-length]', {
    stream: { write: (msg) => logger.info(msg.trim()) }
  })
);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    service: 'vera-real-estate-api',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorMiddleware);

export default app;
