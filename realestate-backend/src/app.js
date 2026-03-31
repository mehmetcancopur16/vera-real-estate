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
import adminRoutes from './routes/admin.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const SERVER_PORT = process.env.PORT || 5050;
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  `http://localhost:${SERVER_PORT}`,
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

// Swagger UI requires inline scripts/styles and its own security context.
// Docs routes get relaxed Helmet (no CSP, no COEP); all other routes get full protection.
const helmetSwagger = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
});
const helmetDefault = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

app.use((req, res, next) => {
  const isDocsRoute = req.path.startsWith('/docs') || req.path.startsWith('/api-docs');
  return isDocsRoute ? helmetSwagger(req, res, next) : helmetDefault(req, res, next);
});

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

/* ─────────────────────────────────────────────────────────────────
   Vera Real Estate — Swagger UI  |  Full custom theme
   Palette
     page-bg    : #f0f4f8
     card-bg    : #ffffff
     border     : #dde3ec
     text-main  : #0d1b2e
     text-sub   : #4a5568
     text-muted : #8a96a8
     brand      : #1a56db   (accent blue)
     code-bg    : #0d1b2e
     code-text  : #e8edf5
   ───────────────────────────────────────────────────────────────── */

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Vera Real Estate — API Docs',
  customfavIcon: '/favicon.ico',
  customCss: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* ── Base ── */
    body, .swagger-ui { font-family: 'Inter', system-ui, sans-serif !important; background: #f8fafc !important; color: #0f172a; }

    /* ── Top bar ── */
    .swagger-ui .topbar { background: #0f172a !important; border-bottom: 3px solid #d4af37; padding: 10px 0; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .topbar-wrapper { display: flex; align-items: center; gap: 12px; }
    .swagger-ui .topbar-wrapper::before {
      content: '✦ Vera Real Estate API';
      font-family: 'Inter', sans-serif;
      font-size: 17px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: -0.01em;
      margin-left: 20px;
      white-space: nowrap;
    }
    .swagger-ui .topbar-wrapper svg { display: none; }
    .swagger-ui .topbar-wrapper .link { display: none; }

    /* ── Info section ── */
    .swagger-ui .info { margin: 32px 0 24px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .swagger-ui .info .title { font-size: 26px !important; font-weight: 800 !important; color: #0f172a !important; margin-bottom: 6px; }
    .swagger-ui .info p { color: #475569 !important; font-size: 14px !important; line-height: 1.6; }
    .swagger-ui .info .base-url { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 10px; display: inline-block; margin-top: 8px; }
    .swagger-ui .scheme-container { background: #fff !important; border: 1px solid #e2e8f0 !important; border-radius: 12px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important; padding: 16px 24px !important; margin: 0 0 20px; }

    /* ── Tags / operation groups ── */
    .swagger-ui .opblock-tag { font-size: 16px !important; font-weight: 700 !important; color: #0f172a !important; border-bottom: 2px solid #e2e8f0 !important; padding: 12px 0 10px !important; margin-top: 8px; }
    .swagger-ui .opblock-tag:hover { background: #f8fafc !important; }
    .swagger-ui .opblock-tag small { font-size: 12px; font-weight: 400; color: #64748b; margin-left: 6px; }

    /* ── Operation blocks ── */
    .swagger-ui .opblock { margin: 6px 0 !important; border-radius: 12px !important; border: 1px solid #e2e8f0 !important; box-shadow: none !important; overflow: hidden; background: #fff !important; }
    .swagger-ui .opblock:hover { border-color: #d4af37 !important; box-shadow: 0 2px 8px rgba(212,175,55,0.15) !important; }
    .swagger-ui .opblock .opblock-summary { padding: 10px 16px !important; }
    .swagger-ui .opblock .opblock-summary-description { font-size: 13px; color: #334155; font-weight: 500; }
    .swagger-ui .opblock-body { background: #fafafa !important; border-top: 1px solid #e2e8f0 !important; padding: 16px !important; }

    /* ── HTTP method badges ── */
    .swagger-ui .opblock-summary-method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px !important;
      font-weight: 700 !important;
      min-width: 68px;
      text-align: center;
      border-radius: 8px !important;
      padding: 4px 10px !important;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .swagger-ui .opblock-get .opblock-summary-method { background: #16a34a !important; color: #fff !important; }
    .swagger-ui .opblock-post .opblock-summary-method { background: #2563eb !important; color: #fff !important; }
    .swagger-ui .opblock-put .opblock-summary-method { background: #d97706 !important; color: #fff !important; }
    .swagger-ui .opblock-delete .opblock-summary-method { background: #dc2626 !important; color: #fff !important; }
    .swagger-ui .opblock-patch .opblock-summary-method { background: #7c3aed !important; color: #fff !important; }

    .swagger-ui .opblock-get { border-color: #bbf7d0 !important; background: #f0fdf4 !important; }
    .swagger-ui .opblock-post { border-color: #bfdbfe !important; background: #eff6ff !important; }
    .swagger-ui .opblock-put { border-color: #fed7aa !important; background: #fffbeb !important; }
    .swagger-ui .opblock-delete { border-color: #fecaca !important; background: #fef2f2 !important; }
    .swagger-ui .opblock-patch { border-color: #e9d5ff !important; background: #faf5ff !important; }

    /* ── Parameters & tables ── */
    .swagger-ui table { border-collapse: collapse; width: 100%; }
    .swagger-ui table thead tr th { background: #f1f5f9 !important; color: #475569 !important; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 12px !important; border-bottom: 2px solid #e2e8f0 !important; }
    .swagger-ui table tbody tr td { padding: 8px 12px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 13px; color: #334155 !important; }
    .swagger-ui table tbody tr:hover td { background: #f8fafc !important; }
    .swagger-ui .parameter__name { font-weight: 600 !important; color: #0f172a !important; }
    .swagger-ui .parameter__type { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7c3aed; background: #f5f3ff; border-radius: 4px; padding: 1px 5px; }
    .swagger-ui .parameter__in { font-size: 10px; color: #64748b; font-style: italic; }

    /* ── Code blocks / responses ── */
    .swagger-ui .highlight-code, .swagger-ui pre { font-family: 'JetBrains Mono', monospace !important; font-size: 12.5px !important; background: #f1f5f9 !important; color: #1e293b !important; border-radius: 10px !important; border: 1px solid #e2e8f0 !important; padding: 14px !important; line-height: 1.6; }
    .swagger-ui .responses-inner { background: #fff !important; border-radius: 12px; padding: 12px; }
    .swagger-ui .response-col_status { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; }

    /* ── Response code badges ── */
    .swagger-ui .response-col_status[data-code="200"],
    .swagger-ui .response-col_status[data-code="201"] { color: #16a34a; }
    .swagger-ui .response-col_status[data-code="400"],
    .swagger-ui .response-col_status[data-code="401"],
    .swagger-ui .response-col_status[data-code="403"],
    .swagger-ui .response-col_status[data-code="404"] { color: #dc2626; }
    .swagger-ui .response-col_status[data-code="500"] { color: #7c3aed; }

    /* ── Models section ── */
    .swagger-ui section.models { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 24px; margin-top: 24px; }
    .swagger-ui section.models h4 { font-size: 15px; font-weight: 700; color: #0f172a; }
    .swagger-ui .model-title { font-size: 14px; font-weight: 600; color: #0f172a; }
    .swagger-ui .model { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #334155; }
    .swagger-ui .prop-type { color: #7c3aed; font-size: 11px; }
    .swagger-ui .prop-format { color: #0891b2; font-size: 10px; }

    /* ── Buttons ── */
    .swagger-ui .btn { border-radius: 8px !important; font-weight: 600 !important; font-size: 12px !important; transition: all 0.15s !important; }
    .swagger-ui .btn.execute { background: #0f172a !important; border-color: #0f172a !important; color: #fff !important; }
    .swagger-ui .btn.execute:hover { background: #1e293b !important; }
    .swagger-ui .btn.authorize { background: #d4af37 !important; border-color: #d4af37 !important; color: #0f172a !important; font-weight: 700 !important; }
    .swagger-ui .btn.authorize:hover { background: #c5a028 !important; }
    .swagger-ui .btn.cancel { background: #f1f5f9 !important; border-color: #cbd5e1 !important; color: #475569 !important; }
    .swagger-ui .btn.try-out__btn { background: #eff6ff !important; border-color: #2563eb !important; color: #2563eb !important; }

    /* ── Inputs ── */
    .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui textarea, .swagger-ui select {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      border: 1.5px solid #cbd5e1 !important;
      border-radius: 8px !important;
      background: #fff !important;
      color: #0f172a !important;
      padding: 7px 11px !important;
      transition: border-color 0.15s;
    }
    .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus { border-color: #d4af37 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.12) !important; }

    /* ── Auth dialog ── */
    .swagger-ui .dialog-ux .modal-ux { background: #fff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; box-shadow: 0 20px 60px rgba(0,0,0,0.18) !important; }
    .swagger-ui .dialog-ux .modal-ux-header { background: #0f172a !important; color: #d4af37 !important; border-radius: 14px 14px 0 0 !important; padding: 16px 24px !important; font-weight: 700 !important; }
    .swagger-ui .dialog-ux .modal-ux-content { padding: 24px !important; }

    /* ── Scrollbar ── */
    .swagger-ui ::-webkit-scrollbar { width: 6px; height: 6px; }
    .swagger-ui ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
    .swagger-ui ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .swagger-ui ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* ── Focus ── */
    .swagger-ui *:focus-visible { outline: 2px solid #d4af37; outline-offset: 2px; }

    /* ── Animations ── */
    @keyframes swaggerFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .swagger-ui .opblock-body { animation: swaggerFadeIn 0.2s ease-out; }
    .swagger-ui .model-box { animation: swaggerFadeIn 0.25s ease-out; }

    /* ── Elevation levels on opblock ── */
    .swagger-ui .opblock { box-shadow: 0 1px 3px rgba(15,23,42,0.06) !important; transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s !important; }
    .swagger-ui .opblock:hover { box-shadow: 0 4px 14px rgba(212,175,55,0.18) !important; transform: translateY(-1px); }
    .swagger-ui .opblock.is-open { box-shadow: 0 6px 24px rgba(15,23,42,0.10) !important; transform: none; }

    /* ── Sticky thead in tables ── */
    .swagger-ui table thead { position: sticky; top: 0; z-index: 2; }

    /* ── Required field indicator ── */
    .swagger-ui .parameter__name.required::after {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #d97706;
      border-radius: 50%;
      margin-left: 5px;
      vertical-align: middle;
    }

    /* ── Topbar min-height ── */
    .swagger-ui .topbar { min-height: 54px !important; display: flex !important; align-items: center; }

    /* ── Section wrapper max-width & spacing ── */
    .swagger-ui .wrapper { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .swagger-ui .opblock-tag-section { margin-bottom: 8px; }

    /* ── Response description ── */
    .swagger-ui .response-col_description__inner p { font-size: 13px; color: #475569; line-height: 1.5; }

    /* ── Loading indicator ── */
    .swagger-ui .loading-container { padding: 40px; text-align: center; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    defaultModelsExpandDepth: 2,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

/**
 * @openapi
 * /api/health:
 *   get:
 *     operationId: healthCheck
 *     tags:
 *       - System
 *     summary: Sağlık kontrolü
 *     description: API'nin çalışır durumda olup olmadığını kontrol eder.
 *     responses:
 *       200:
 *         description: Servis sağlıklı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
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
app.use('/api/admin', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use(errorMiddleware);

export default app;
