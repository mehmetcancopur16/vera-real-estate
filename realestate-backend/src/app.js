import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config.js';
import logger from './utils/logger.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { mongoSanitizeCompatible } from './middlewares/mongo-sanitize.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
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

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorMiddleware);

export default app;
