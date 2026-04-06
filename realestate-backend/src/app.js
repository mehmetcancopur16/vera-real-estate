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

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Vera Real Estate — API Docs',
  customfavIcon: '/favicon.ico',
  customCss: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    /* ════════════════════════════════
       BASE
    ════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; }
    body { background: #0f1117 !important; margin: 0; }
    .swagger-ui {
      font-family: 'Inter', system-ui, sans-serif !important;
      background: #0f1117 !important;
      color: #e2e8f0 !important;
    }

    /* ════════════════════════════════
       TOP BAR
    ════════════════════════════════ */
    .swagger-ui .topbar {
      background: linear-gradient(135deg, #0d1117 0%, #161b27 100%) !important;
      border-bottom: 2px solid #d4af37 !important;
      padding: 0 !important;
      min-height: 60px !important;
      display: flex !important;
      align-items: center !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
    }
    .swagger-ui .topbar .download-url-wrapper { display: none !important; }
    .swagger-ui .topbar-wrapper {
      display: flex !important;
      align-items: center !important;
      gap: 14px !important;
      padding: 0 28px !important;
    }
    .swagger-ui .topbar-wrapper::before {
      content: '⬡ VERA REAL ESTATE  ·  API v2.0';
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #d4af37;
      letter-spacing: 0.12em;
      white-space: nowrap;
    }
    .swagger-ui .topbar-wrapper svg,
    .swagger-ui .topbar-wrapper .link { display: none !important; }

    /* ════════════════════════════════
       PAGE WRAPPER
    ════════════════════════════════ */
    .swagger-ui .wrapper {
      max-width: 1280px !important;
      margin: 0 auto !important;
      padding: 0 32px 60px !important;
    }

    /* ════════════════════════════════
       INFO / DESCRIPTION CARD
    ════════════════════════════════ */
    .swagger-ui .info {
      margin: 36px 0 28px !important;
      background: linear-gradient(145deg, #161b27 0%, #1a2035 100%) !important;
      border: 1px solid #2d3748 !important;
      border-top: 3px solid #d4af37 !important;
      border-radius: 18px !important;
      padding: 32px 36px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
    }
    .swagger-ui .info .title {
      font-size: 28px !important;
      font-weight: 800 !important;
      color: #f8fafc !important;
      margin-bottom: 4px !important;
      letter-spacing: -0.02em !important;
    }
    .swagger-ui .info .version {
      background: #d4af37 !important;
      color: #0d1117 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 2px 8px !important;
      border-radius: 20px !important;
      letter-spacing: 0.05em !important;
    }
    .swagger-ui .info p,
    .swagger-ui .info li,
    .swagger-ui .info td { color: #94a3b8 !important; font-size: 13.5px !important; line-height: 1.65 !important; }
    .swagger-ui .info h2,
    .swagger-ui .info h3 { color: #cbd5e1 !important; font-size: 15px !important; font-weight: 700 !important; margin: 20px 0 8px !important; border-bottom: 1px solid #2d3748 !important; padding-bottom: 6px !important; }
    .swagger-ui .info code {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      background: #0d1117 !important;
      color: #7dd3fc !important;
      border: 1px solid #2d3748 !important;
      border-radius: 5px !important;
      padding: 1px 6px !important;
    }
    .swagger-ui .info table {
      border-collapse: collapse !important;
      width: auto !important;
      margin: 12px 0 !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      border: 1px solid #2d3748 !important;
    }
    .swagger-ui .info table thead tr th {
      background: #1e2a3a !important;
      color: #d4af37 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.08em !important;
      padding: 8px 16px !important;
      border-bottom: 1px solid #2d3748 !important;
    }
    .swagger-ui .info table tbody tr td {
      background: #161b27 !important;
      color: #94a3b8 !important;
      padding: 7px 16px !important;
      border-bottom: 1px solid #1e2a3a !important;
      font-size: 13px !important;
    }
    .swagger-ui .info table tbody tr:last-child td { border-bottom: none !important; }
    .swagger-ui .info a { color: #60a5fa !important; text-decoration: underline !important; }

    /* ════════════════════════════════
       SCHEME / SERVER CONTAINER
    ════════════════════════════════ */
    .swagger-ui .scheme-container {
      background: #161b27 !important;
      border: 1px solid #2d3748 !important;
      border-radius: 14px !important;
      box-shadow: none !important;
      padding: 18px 28px !important;
      margin: 0 0 24px !important;
    }
    .swagger-ui .scheme-container .schemes > label {
      color: #94a3b8 !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.08em !important;
    }

    /* ════════════════════════════════
       FILTER BAR
    ════════════════════════════════ */
    .swagger-ui .filter {
      background: #161b27 !important;
      border: 1px solid #2d3748 !important;
      border-radius: 14px !important;
      padding: 14px 20px !important;
      margin-bottom: 20px !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }
    .swagger-ui .filter::before {
      content: '🔍';
      font-size: 14px;
      flex-shrink: 0;
    }
    .swagger-ui .filter .operation-filter-input {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      background: #0d1117 !important;
      border: 1.5px solid #374151 !important;
      border-radius: 9px !important;
      color: #e2e8f0 !important;
      padding: 8px 14px !important;
      width: 100% !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    .swagger-ui .filter .operation-filter-input::placeholder { color: #4b5563 !important; }
    .swagger-ui .filter .operation-filter-input:focus {
      border-color: #d4af37 !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.15) !important;
    }

    /* ════════════════════════════════
       TAG GROUP HEADERS
    ════════════════════════════════ */
    .swagger-ui .opblock-tag-section { margin-bottom: 10px !important; }

    .swagger-ui .opblock-tag {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      color: #f1f5f9 !important;
      background: #161b27 !important;
      border: 1px solid #2d3748 !important;
      border-left: 4px solid #d4af37 !important;
      border-radius: 12px !important;
      padding: 14px 20px !important;
      margin: 0 !important;
      cursor: pointer !important;
      transition: background 0.18s, border-color 0.18s, box-shadow 0.18s !important;
      text-decoration: none !important;
    }
    .swagger-ui .opblock-tag:hover {
      background: #1e2a3a !important;
      border-color: #3b4a60 !important;
      border-left-color: #e8c84a !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;
    }
    .swagger-ui .opblock-tag svg { fill: #94a3b8 !important; width: 18px !important; height: 18px !important; }
    .swagger-ui .opblock-tag small {
      font-size: 12px !important;
      font-weight: 400 !important;
      color: #64748b !important;
      margin-left: 4px !important;
    }

    /* Tag colour accents by name */
    .swagger-ui .opblock-tag[data-tag="Auth"]          { border-left-color: #3b82f6 !important; }
    .swagger-ui .opblock-tag[data-tag="Properties"]    { border-left-color: #22c55e !important; }
    .swagger-ui .opblock-tag[data-tag="Contact"]       { border-left-color: #06b6d4 !important; }
    .swagger-ui .opblock-tag[data-tag="Newsletter"]    { border-left-color: #f97316 !important; }
    .swagger-ui .opblock-tag[data-tag="Subscription"]  { border-left-color: #a855f7 !important; }
    .swagger-ui .opblock-tag[data-tag="System"]        { border-left-color: #64748b !important; }
    .swagger-ui .opblock-tag[data-tag^="Admin"]        { border-left-color: #ef4444 !important; }

    /* ════════════════════════════════
       OPERATION BLOCKS
    ════════════════════════════════ */
    .swagger-ui .opblock {
      margin: 5px 0 !important;
      border-radius: 11px !important;
      border: 1px solid #252d3d !important;
      box-shadow: none !important;
      overflow: hidden !important;
      transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s !important;
    }
    .swagger-ui .opblock:hover {
      border-color: #3b4a60 !important;
      box-shadow: 0 4px 18px rgba(0,0,0,0.35) !important;
      transform: translateY(-1px) !important;
    }
    .swagger-ui .opblock.is-open {
      box-shadow: 0 6px 28px rgba(0,0,0,0.4) !important;
      transform: none !important;
    }
    .swagger-ui .opblock .opblock-summary { padding: 10px 16px !important; }
    .swagger-ui .opblock .opblock-summary-description {
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #cbd5e1 !important;
    }
    .swagger-ui .opblock .opblock-summary-path,
    .swagger-ui .opblock .opblock-summary-path__deprecated {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      color: #e2e8f0 !important;
    }
    .swagger-ui .opblock-body {
      background: #0d1117 !important;
      border-top: 1px solid #252d3d !important;
      padding: 20px !important;
    }

    /* Method colours */
    .swagger-ui .opblock-summary-method {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      min-width: 72px !important;
      text-align: center !important;
      border-radius: 7px !important;
      padding: 5px 10px !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
    }
    .swagger-ui .opblock-get    { background: #0a1f14 !important; border-color: #166534 !important; }
    .swagger-ui .opblock-post   { background: #0c1a30 !important; border-color: #1d4ed8 !important; }
    .swagger-ui .opblock-put    { background: #1c1200 !important; border-color: #92400e !important; }
    .swagger-ui .opblock-delete { background: #200a0a !important; border-color: #991b1b !important; }
    .swagger-ui .opblock-patch  { background: #160c26 !important; border-color: #6d28d9 !important; }

    .swagger-ui .opblock-get    .opblock-summary-method { background: #16a34a !important; color: #fff !important; }
    .swagger-ui .opblock-post   .opblock-summary-method { background: #2563eb !important; color: #fff !important; }
    .swagger-ui .opblock-put    .opblock-summary-method { background: #d97706 !important; color: #fff !important; }
    .swagger-ui .opblock-delete .opblock-summary-method { background: #dc2626 !important; color: #fff !important; }
    .swagger-ui .opblock-patch  .opblock-summary-method { background: #7c3aed !important; color: #fff !important; }

    /* ════════════════════════════════
       PARAMETERS & TABLES
    ════════════════════════════════ */
    .swagger-ui table { border-collapse: collapse !important; width: 100% !important; }
    .swagger-ui table thead tr th {
      background: #1a2035 !important;
      color: #94a3b8 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.07em !important;
      padding: 9px 14px !important;
      border-bottom: 1px solid #252d3d !important;
    }
    .swagger-ui table tbody tr td {
      padding: 9px 14px !important;
      border-bottom: 1px solid #1a2035 !important;
      font-size: 13px !important;
      color: #cbd5e1 !important;
      background: #0d1117 !important;
    }
    .swagger-ui table tbody tr:hover td { background: #141a26 !important; }
    .swagger-ui .parameter__name { font-weight: 600 !important; color: #f1f5f9 !important; }
    .swagger-ui .parameter__type {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11px !important;
      color: #c084fc !important;
      background: #1e1030 !important;
      border-radius: 4px !important;
      padding: 1px 6px !important;
    }
    .swagger-ui .parameter__in { font-size: 10px !important; color: #64748b !important; font-style: italic !important; }

    .swagger-ui .parameters-col_description input[type=text],
    .swagger-ui .parameters-col_description textarea {
      background: #0d1117 !important;
      border: 1.5px solid #374151 !important;
      color: #e2e8f0 !important;
      border-radius: 8px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      padding: 7px 12px !important;
    }

    /* ════════════════════════════════
       CODE BLOCKS & RESPONSES
    ════════════════════════════════ */
    .swagger-ui .highlight-code,
    .swagger-ui pre {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12.5px !important;
      background: #080c12 !important;
      color: #e2e8f0 !important;
      border-radius: 10px !important;
      border: 1px solid #1e2a3a !important;
      padding: 16px !important;
      line-height: 1.7 !important;
    }
    .swagger-ui .microlight { color: #a5f3fc !important; }
    .swagger-ui .responses-inner {
      background: #0d1117 !important;
      border-radius: 10px !important;
      padding: 14px !important;
    }
    .swagger-ui .response-col_status {
      font-family: 'JetBrains Mono', monospace !important;
      font-weight: 700 !important;
      font-size: 13px !important;
    }
    .swagger-ui .response-col_status[data-code="200"],
    .swagger-ui .response-col_status[data-code="201"] { color: #4ade80 !important; }
    .swagger-ui .response-col_status[data-code="400"],
    .swagger-ui .response-col_status[data-code="401"],
    .swagger-ui .response-col_status[data-code="403"],
    .swagger-ui .response-col_status[data-code="404"] { color: #f87171 !important; }
    .swagger-ui .response-col_status[data-code="500"] { color: #c084fc !important; }
    .swagger-ui .response-col_description__inner p { font-size: 13px !important; color: #94a3b8 !important; line-height: 1.5 !important; }

    /* ════════════════════════════════
       MODELS / SCHEMAS SECTION
    ════════════════════════════════ */
    .swagger-ui section.models {
      background: #161b27 !important;
      border: 1px solid #2d3748 !important;
      border-top: 3px solid #7c3aed !important;
      border-radius: 16px !important;
      padding: 0 !important;
      margin-top: 32px !important;
      overflow: hidden !important;
    }
    .swagger-ui section.models h4 {
      font-size: 14px !important;
      font-weight: 700 !important;
      color: #c084fc !important;
      background: #1a1030 !important;
      margin: 0 !important;
      padding: 16px 24px !important;
      border-bottom: 1px solid #2d3748 !important;
      letter-spacing: 0.04em !important;
      text-transform: uppercase !important;
    }
    .swagger-ui section.models .models-control { padding: 0 16px !important; }
    .swagger-ui .model-container {
      background: #0d1117 !important;
      border: 1px solid #1e2a3a !important;
      border-radius: 10px !important;
      margin: 10px 16px !important;
      padding: 10px !important;
    }
    .swagger-ui .model-title {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #e2e8f0 !important;
    }
    .swagger-ui .model {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12.5px !important;
      color: #94a3b8 !important;
    }
    .swagger-ui .model-toggle::after {
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%2394a3b8' d='M5 7L1 2h8z'/%3E%3C/svg%3E") no-repeat center !important;
    }
    .swagger-ui .prop-type { color: #c084fc !important; font-size: 11px !important; }
    .swagger-ui .prop-format { color: #67e8f9 !important; font-size: 10px !important; }
    .swagger-ui .prop-enum { color: #86efac !important; }

    /* ════════════════════════════════
       BUTTONS
    ════════════════════════════════ */
    .swagger-ui .btn {
      border-radius: 8px !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      transition: all 0.15s !important;
    }
    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, #1e3a5f, #1d4ed8) !important;
      border-color: #2563eb !important;
      color: #fff !important;
    }
    .swagger-ui .btn.execute:hover { background: linear-gradient(135deg, #1d4ed8, #2563eb) !important; box-shadow: 0 4px 12px rgba(37,99,235,0.4) !important; }
    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, #92400e, #d97706) !important;
      border-color: #d4af37 !important;
      color: #fff !important;
      font-weight: 700 !important;
    }
    .swagger-ui .btn.authorize svg { fill: #fff !important; }
    .swagger-ui .btn.authorize:hover { box-shadow: 0 4px 14px rgba(212,175,55,0.35) !important; }
    .swagger-ui .btn.cancel {
      background: #1a2035 !important;
      border-color: #374151 !important;
      color: #94a3b8 !important;
    }
    .swagger-ui .btn.try-out__btn {
      background: #0c1a30 !important;
      border-color: #2563eb !important;
      color: #60a5fa !important;
    }
    .swagger-ui .btn.try-out__btn:hover { background: #1e3a5f !important; }

    /* ════════════════════════════════
       INPUTS (global)
    ════════════════════════════════ */
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui textarea,
    .swagger-ui select {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      background: #0d1117 !important;
      border: 1.5px solid #374151 !important;
      border-radius: 8px !important;
      color: #e2e8f0 !important;
      padding: 8px 12px !important;
      transition: border-color 0.15s, box-shadow 0.15s !important;
    }
    .swagger-ui input:focus,
    .swagger-ui textarea:focus {
      border-color: #d4af37 !important;
      outline: none !important;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.15) !important;
    }
    .swagger-ui select { background-image: none !important; }

    /* ════════════════════════════════
       AUTH / LOCK DIALOG
    ════════════════════════════════ */
    .swagger-ui .dialog-ux .modal-ux {
      background: #161b27 !important;
      border: 1px solid #2d3748 !important;
      border-radius: 18px !important;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6) !important;
    }
    .swagger-ui .dialog-ux .modal-ux-header {
      background: linear-gradient(135deg, #0d1117, #1a1030) !important;
      border-bottom: 2px solid #d4af37 !important;
      border-radius: 16px 16px 0 0 !important;
      padding: 18px 26px !important;
    }
    .swagger-ui .dialog-ux .modal-ux-header h3 { color: #d4af37 !important; font-weight: 700 !important; }
    .swagger-ui .dialog-ux .modal-ux-content { padding: 26px !important; }
    .swagger-ui .dialog-ux .modal-ux-content label { color: #94a3b8 !important; font-size: 12px !important; font-weight: 600 !important; }
    .swagger-ui .dialog-ux .modal-ux-content p { color: #64748b !important; font-size: 13px !important; }
    .swagger-ui .auth-container .auth__title { color: #e2e8f0 !important; }
    .swagger-ui .locked-text, .swagger-ui .unlocked-text { color: #94a3b8 !important; }
    .swagger-ui .auth-container .scopes h2 { color: #94a3b8 !important; }

    /* ════════════════════════════════
       MARKDOWN IN DESCRIPTIONS
    ════════════════════════════════ */
    .swagger-ui .markdown p { color: #94a3b8 !important; font-size: 13px !important; line-height: 1.6 !important; }
    .swagger-ui .markdown code {
      font-family: 'JetBrains Mono', monospace !important;
      background: #0d1117 !important;
      color: #7dd3fc !important;
      border: 1px solid #1e2a3a !important;
      border-radius: 4px !important;
      padding: 1px 5px !important;
      font-size: 12px !important;
    }

    /* ════════════════════════════════
       LOADING & MISC
    ════════════════════════════════ */
    .swagger-ui .loading-container { padding: 60px; text-align: center; color: #64748b !important; }
    .swagger-ui .info .base-url {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      color: #7dd3fc !important;
      background: #0d1117 !important;
      border: 1px solid #1e2a3a !important;
      border-radius: 8px !important;
      padding: 4px 12px !important;
      display: inline-block !important;
      margin-top: 10px !important;
    }

    /* ════════════════════════════════
       REQUIRED FIELD DOT
    ════════════════════════════════ */
    .swagger-ui .parameter__name.required::after {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      background: #f97316;
      border-radius: 50%;
      margin-left: 5px;
      vertical-align: middle;
    }

    /* ════════════════════════════════
       SCROLLBAR
    ════════════════════════════════ */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: #0d1117; }
    ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #4b5563; }

    /* ════════════════════════════════
       FOCUS RING
    ════════════════════════════════ */
    .swagger-ui *:focus-visible { outline: 2px solid #d4af37 !important; outline-offset: 2px !important; }

    /* ════════════════════════════════
       ANIMATIONS
    ════════════════════════════════ */
    @keyframes swaggerFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .swagger-ui .opblock-body { animation: swaggerFadeIn 0.2s ease-out; }
    .swagger-ui .model-box    { animation: swaggerFadeIn 0.25s ease-out; }

    /* ════════════════════════════════
       TABLE STICKY HEADER
    ════════════════════════════════ */
    .swagger-ui .table-container table thead { position: sticky !important; top: 0 !important; z-index: 2 !important; }
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
