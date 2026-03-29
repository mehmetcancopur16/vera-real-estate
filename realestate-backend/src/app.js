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
    /* ═══════════════════════════════════════════════════════════
       Vera Real Estate  |  Swagger UI — Professional Theme
       Fonts : Inter (UI) · JetBrains Mono (code)
       Palette:
         --bg        : #f0f4f8   page background
         --surface   : #ffffff   card / block surface
         --border    : #dde3ec   default border
         --navy      : #0d1b2e   brand dark / headings
         --slate     : #3d4f66   body text
         --muted     : #7a8a9e   secondary text
         --subtle    : #f5f7fa   zebra / hover tint
         --blue      : #1a56db   primary accent
         --code-bg   : #0d1b2e   dark code blocks
         --code-text : #cdd9ea   code text
    ═══════════════════════════════════════════════════════════ */

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    /* ── Global reset ── */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif !important;
      background: #f0f4f8 !important;
      color: #3d4f66 !important;
      -webkit-font-smoothing: antialiased;
    }
    .swagger-ui { font-family: 'Inter', system-ui, sans-serif !important; }

    /* ════════════════════════════════
       TOPBAR
    ════════════════════════════════ */
    .swagger-ui .topbar {
      background: #0d1b2e;
      padding: 0 32px;
      height: 56px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 2px 16px rgba(0,0,0,0.4);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .swagger-ui .topbar .download-url-wrapper { display: none !important; }
    .swagger-ui .topbar-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 100%;
    }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper .link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .swagger-ui .topbar-wrapper .link::before {
      content: '⬡';
      font-size: 20px;
      color: #4fa3e3;
      line-height: 1;
      letter-spacing: 0;
    }
    .swagger-ui .topbar-wrapper .link span {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #f0f4f8;
      letter-spacing: -0.2px;
    }

    /* ════════════════════════════════
       HERO / INFO SECTION
    ════════════════════════════════ */
    .swagger-ui .information-container {
      background: linear-gradient(160deg, #0d1b2e 0%, #0f2545 55%, #102d52 100%);
      padding: 52px 40px 44px;
      margin: 0;
      box-shadow: inset 0 -1px 0 rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.18);
    }
    .swagger-ui .info { margin: 0; max-width: 820px; }
    .swagger-ui .info hgroup.main { margin-bottom: 20px; }

    .swagger-ui .info .title {
      font-family: 'Inter', sans-serif !important;
      font-size: 30px !important;
      font-weight: 800 !important;
      color: #f0f4f8 !important;
      letter-spacing: -0.6px !important;
      line-height: 1.2 !important;
      margin: 0 0 6px !important;
    }
    .swagger-ui .info .title small {
      display: inline-flex;
      align-items: center;
      background: rgba(79, 163, 227, 0.15);
      border: 1px solid rgba(79, 163, 227, 0.35);
      color: #4fa3e3 !important;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 9px;
      border-radius: 20px;
      letter-spacing: 0.4px;
      vertical-align: middle;
      margin-left: 12px;
    }
    .swagger-ui .info .description {
      margin-top: 16px;
    }
    .swagger-ui .info p,
    .swagger-ui .info li {
      font-family: 'Inter', sans-serif !important;
      color: #8aa0bc !important;
      font-size: 13.5px !important;
      line-height: 1.75 !important;
    }
    .swagger-ui .info a {
      color: #4fa3e3 !important;
      text-decoration: none;
      border-bottom: 1px solid rgba(79,163,227,0.3);
    }
    .swagger-ui .info a:hover { border-bottom-color: #4fa3e3; }
    .swagger-ui .info h2, .swagger-ui .info h3 {
      font-family: 'Inter', sans-serif !important;
      color: #d0daea !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      margin: 20px 0 8px !important;
      letter-spacing: -0.1px;
    }
    /* Info tables (role/plan tables in description) */
    .swagger-ui .info table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0;
    }
    .swagger-ui .info table th {
      font-family: 'Inter', sans-serif !important;
      font-size: 10.5px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.7px !important;
      color: #4fa3e3 !important;
      padding: 8px 12px !important;
      border-bottom: 1px solid rgba(79,163,227,0.2) !important;
      background: rgba(79,163,227,0.06);
    }
    .swagger-ui .info table td {
      font-family: 'Inter', sans-serif !important;
      color: #8aa0bc !important;
      font-size: 13px !important;
      padding: 8px 12px !important;
      border-bottom: 1px solid rgba(255,255,255,0.04) !important;
    }
    .swagger-ui .info table td code {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(79,163,227,0.12);
      color: #4fa3e3;
      padding: 1px 7px;
      border-radius: 4px;
      font-size: 11px;
    }
    .swagger-ui .info .base-url {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      color: #4a6080 !important;
      margin-top: 12px;
    }

    /* ════════════════════════════════
       SCHEME CONTAINER (server picker + authorize)
    ════════════════════════════════ */
    .swagger-ui .scheme-container {
      background: rgba(255,255,255,0.03);
      border-top: 1px solid rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(0,0,0,0.1);
      padding: 14px 40px;
      box-shadow: none;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .swagger-ui .scheme-container .schemes { display: flex; align-items: center; gap: 10px; }
    .swagger-ui .scheme-container .schemes > label {
      font-family: 'Inter', sans-serif;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #4a6080;
    }
    .swagger-ui select {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: #c8d6e8;
      border-radius: 7px;
      padding: 6px 12px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .swagger-ui select:focus {
      border-color: #4fa3e3;
      box-shadow: 0 0 0 3px rgba(79,163,227,0.15);
    }
    /* Authorize button in scheme bar */
    .swagger-ui .auth-wrapper {
      display: flex;
      align-items: center;
      margin-left: auto;
    }
    .swagger-ui .auth-wrapper .authorize {
      background: transparent;
      border: 1.5px solid #4fa3e3;
      color: #4fa3e3;
      border-radius: 7px;
      font-family: 'Inter', sans-serif;
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      transition: background 0.2s, box-shadow 0.2s;
      letter-spacing: 0.1px;
    }
    .swagger-ui .auth-wrapper .authorize:hover {
      background: rgba(79,163,227,0.12);
      box-shadow: 0 0 0 3px rgba(79,163,227,0.12);
    }
    .swagger-ui .auth-wrapper .authorize svg { fill: #4fa3e3; width: 15px; height: 15px; }

    /* ════════════════════════════════
       MAIN WRAPPER
    ════════════════════════════════ */
    .swagger-ui .wrapper {
      max-width: 1100px;
      padding: 0 28px;
      margin: 0 auto;
    }

    /* ════════════════════════════════
       FILTER BAR
    ════════════════════════════════ */
    .swagger-ui .filter-container {
      padding: 20px 0 4px;
    }
    .swagger-ui .filter-container .operation-filter-input {
      font-family: 'Inter', sans-serif !important;
      font-size: 13.5px !important;
      background: #ffffff !important;
      border: 1.5px solid #dde3ec !important;
      border-radius: 9px !important;
      padding: 10px 16px !important;
      color: #0d1b2e !important;
      width: 100% !important;
      outline: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .swagger-ui .filter-container .operation-filter-input::placeholder { color: #7a8a9e; }
    .swagger-ui .filter-container .operation-filter-input:focus {
      border-color: #1a56db !important;
      box-shadow: 0 0 0 3px rgba(26,86,219,0.1) !important;
    }

    /* ════════════════════════════════
       TAG SECTIONS (group headers)
    ════════════════════════════════ */
    .swagger-ui .opblock-tag-section { margin-bottom: 6px; }
    .swagger-ui .opblock-tag {
      font-family: 'Inter', sans-serif !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #0d1b2e !important;
      border-bottom: 2px solid #dde3ec !important;
      padding: 20px 0 10px !important;
      margin: 24px 0 6px !important;
      letter-spacing: -0.2px;
      background: transparent !important;
      cursor: pointer;
    }
    .swagger-ui .opblock-tag:hover { background: transparent !important; opacity: 0.85; }
    .swagger-ui .opblock-tag a { color: #0d1b2e !important; text-decoration: none; }
    .swagger-ui .opblock-tag small {
      font-family: 'Inter', sans-serif !important;
      color: #7a8a9e !important;
      font-size: 12.5px !important;
      font-weight: 400 !important;
      margin-left: 10px;
    }
    .swagger-ui .opblock-tag svg { fill: #7a8a9e !important; }

    /* ════════════════════════════════
       ENDPOINT BLOCKS
    ════════════════════════════════ */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04) !important;
      margin-bottom: 7px !important;
      overflow: hidden;
      transition: box-shadow 0.18s, transform 0.18s;
    }
    .swagger-ui .opblock:hover {
      box-shadow: 0 4px 14px rgba(0,0,0,0.1) !important;
      transform: translateY(-1px);
    }

    /* GET */
    .swagger-ui .opblock.opblock-get {
      background: #f0f7ff !important;
      border: 1px solid #b8d8f8 !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #0369a1 !important; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-bottom: 1px solid #b8d8f8 !important; }

    /* POST */
    .swagger-ui .opblock.opblock-post {
      background: #f0fdf5 !important;
      border: 1px solid #a7f0c4 !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #15803d !important; }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-bottom: 1px solid #a7f0c4 !important; }

    /* PUT */
    .swagger-ui .opblock.opblock-put {
      background: #fefce8 !important;
      border: 1px solid #fcd34d !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #b45309 !important; }
    .swagger-ui .opblock.opblock-put .opblock-summary { border-bottom: 1px solid #fcd34d !important; }

    /* PATCH */
    .swagger-ui .opblock.opblock-patch {
      background: #fff7ed !important;
      border: 1px solid #fdba74 !important;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #c2410c !important; }
    .swagger-ui .opblock.opblock-patch .opblock-summary { border-bottom: 1px solid #fdba74 !important; }

    /* DELETE */
    .swagger-ui .opblock.opblock-delete {
      background: #fff1f2 !important;
      border: 1px solid #fca5a5 !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #b91c1c !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { border-bottom: 1px solid #fca5a5 !important; }

    /* HEAD / OPTIONS */
    .swagger-ui .opblock.opblock-head,
    .swagger-ui .opblock.opblock-options {
      background: #faf5ff !important;
      border: 1px solid #d8b4fe !important;
    }
    .swagger-ui .opblock.opblock-head .opblock-summary-method,
    .swagger-ui .opblock.opblock-options .opblock-summary-method { background: #7c3aed !important; }

    /* ── Method badge ── */
    .swagger-ui .opblock-summary-method {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 10.5px !important;
      font-weight: 700 !important;
      border-radius: 6px !important;
      min-width: 72px !important;
      text-align: center !important;
      letter-spacing: 0.6px !important;
      padding: 6px 10px !important;
      flex-shrink: 0;
    }

    /* ── Summary row ── */
    .swagger-ui .opblock-summary {
      padding: 10px 16px !important;
      cursor: pointer;
      align-items: center !important;
      gap: 12px !important;
    }
    .swagger-ui .opblock-summary-path {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #0d1b2e !important;
      letter-spacing: -0.1px;
    }
    .swagger-ui .opblock-summary-path .nostyle span { color: #0d1b2e !important; }
    .swagger-ui .opblock-summary-path b { font-weight: 600 !important; }
    .swagger-ui .opblock-summary-description {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #3d4f66 !important;
      margin-left: auto;
      text-align: right;
      max-width: 340px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .swagger-ui .opblock-summary .arrow { margin-left: 8px; }
    .swagger-ui .opblock-summary .arrow svg { fill: #7a8a9e; width: 18px; height: 18px; }
    /* lock icon */
    .swagger-ui .opblock-summary-control .authorization__btn svg { fill: #7a8a9e; }
    .swagger-ui .opblock-summary-control .authorization__btn.unlocked svg { fill: #b91c1c; }

    /* ── Expanded body ── */
    .swagger-ui .opblock-body { padding: 0 !important; }
    .swagger-ui .opblock-section-header {
      background: rgba(0,0,0,0.025) !important;
      border-top: 1px solid rgba(0,0,0,0.06) !important;
      padding: 9px 20px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .swagger-ui .opblock-section-header h4 {
      font-family: 'Inter', sans-serif !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      color: #3d4f66 !important;
      margin: 0 !important;
    }
    .swagger-ui .opblock-description-wrapper,
    .swagger-ui .opblock-external-docs-wrapper,
    .swagger-ui .opblock-title_normal {
      padding: 14px 20px !important;
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #3d4f66 !important;
      line-height: 1.6;
    }

    /* ════════════════════════════════
       PARAMETERS TABLE
    ════════════════════════════════ */
    .swagger-ui .parameters-container { padding: 0 20px 16px !important; }
    .swagger-ui table { width: 100%; border-collapse: collapse; }

    .swagger-ui table thead tr th,
    .swagger-ui table thead tr td {
      font-family: 'Inter', sans-serif !important;
      font-size: 10.5px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.7px !important;
      color: #7a8a9e !important;
      padding: 10px 12px !important;
      border-bottom: 2px solid #dde3ec !important;
      background: transparent !important;
    }
    .swagger-ui table tbody tr:hover { background: #f5f7fa; }
    .swagger-ui table tbody tr td {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #3d4f66 !important;
      padding: 10px 12px !important;
      border-bottom: 1px solid #eef1f6 !important;
      vertical-align: top;
    }

    .swagger-ui .parameter__name {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #0d1b2e !important;
    }
    .swagger-ui .parameter__name.required span { color: #b91c1c !important; margin-left: 2px; }
    .swagger-ui .parameter__name.required::after {
      color: #b91c1c !important;
      content: ' *';
      font-size: 15px;
    }
    .swagger-ui .parameter__in {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 10.5px !important;
      font-weight: 500 !important;
      color: #7a8a9e !important;
      font-style: normal !important;
      display: block;
      margin-top: 2px;
    }
    .swagger-ui .parameter__type,
    .swagger-ui .property-row .star {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 11px !important;
      color: #6d28d9 !important;
    }
    .swagger-ui .parameter__deprecated {
      font-size: 11px;
      color: #b91c1c;
      font-style: italic;
    }

    /* content-type select in body */
    .swagger-ui .body-param-content-type {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      border: 1px solid #dde3ec;
      border-radius: 6px;
      padding: 4px 10px;
      background: #fff;
      color: #3d4f66;
      outline: none;
      margin-bottom: 10px;
    }

    /* ════════════════════════════════
       INPUTS & TEXTAREAS
    ════════════════════════════════ */
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=search],
    .swagger-ui input[type=email],
    .swagger-ui textarea {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12.5px !important;
      background: #ffffff !important;
      border: 1.5px solid #dde3ec !important;
      border-radius: 8px !important;
      padding: 8px 13px !important;
      color: #0d1b2e !important;
      outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
      width: 100%;
    }
    .swagger-ui input:focus,
    .swagger-ui textarea:focus {
      border-color: #1a56db !important;
      box-shadow: 0 0 0 3px rgba(26,86,219,0.1) !important;
    }
    .swagger-ui input::placeholder,
    .swagger-ui textarea::placeholder { color: #aab4c0 !important; }
    .swagger-ui textarea { min-height: 110px; resize: vertical; line-height: 1.5; }

    /* ════════════════════════════════
       BUTTONS
    ════════════════════════════════ */
    .swagger-ui .btn {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
      padding: 8px 18px !important;
      cursor: pointer !important;
      transition: all 0.18s !important;
      letter-spacing: 0.1px;
      outline: none !important;
    }
    /* Execute */
    .swagger-ui .btn.execute {
      background: #1a56db !important;
      border: 1.5px solid #1a56db !important;
      color: #ffffff !important;
      box-shadow: 0 2px 8px rgba(26,86,219,0.3) !important;
    }
    .swagger-ui .btn.execute:hover {
      background: #1446b5 !important;
      border-color: #1446b5 !important;
      box-shadow: 0 4px 14px rgba(26,86,219,0.38) !important;
      transform: translateY(-1px);
    }
    /* Cancel */
    .swagger-ui .btn.cancel,
    .swagger-ui .btn-clear {
      background: #ffffff !important;
      border: 1.5px solid #dde3ec !important;
      color: #3d4f66 !important;
    }
    .swagger-ui .btn.cancel:hover,
    .swagger-ui .btn-clear:hover {
      background: #f5f7fa !important;
      border-color: #b0bcc8 !important;
    }
    /* Try-it-out toggle */
    .swagger-ui .try-out__btn {
      background: transparent !important;
      border: 1.5px solid #1a56db !important;
      color: #1a56db !important;
      font-size: 12px !important;
      padding: 5px 14px !important;
      border-radius: 7px !important;
    }
    .swagger-ui .try-out__btn:hover {
      background: rgba(26,86,219,0.07) !important;
    }
    .swagger-ui .try-out__btn.cancel {
      border-color: #7a8a9e !important;
      color: #7a8a9e !important;
    }
    /* Copy button */
    .swagger-ui .copy-to-clipboard {
      background: rgba(255,255,255,0.08) !important;
      border: 1px solid rgba(255,255,255,0.15) !important;
      border-radius: 6px !important;
      cursor: pointer;
      transition: background 0.18s;
    }
    .swagger-ui .copy-to-clipboard:hover { background: rgba(255,255,255,0.15) !important; }
    .swagger-ui .copy-to-clipboard button { color: #cdd9ea !important; font-size: 11px !important; }

    /* ════════════════════════════════
       RESPONSES
    ════════════════════════════════ */
    .swagger-ui .responses-wrapper { padding: 0 !important; }
    .swagger-ui .responses-inner { padding: 0 20px 20px !important; }
    .swagger-ui .response {
      border-bottom: 1px solid #eef1f6 !important;
      padding: 12px 0 !important;
    }
    .swagger-ui .response:last-child { border-bottom: none !important; }

    .swagger-ui .response-col_status {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      min-width: 80px;
    }
    /* Color-code static status codes */
    .swagger-ui .response-col_status .response-undocumented { color: #7a8a9e !important; }
    .swagger-ui .response-col_description {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #3d4f66 !important;
    }
    .swagger-ui .response-col_links { font-size: 12px !important; color: #7a8a9e !important; }

    /* ── Live response: curl / request URL / body ── */
    .swagger-ui .request-url,
    .swagger-ui .curl-command { margin: 12px 0; }
    .swagger-ui .request-url pre,
    .swagger-ui .curl-command pre,
    .swagger-ui .curl pre {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      background: #0d1b2e !important;
      color: #cdd9ea !important;
      border-radius: 8px !important;
      padding: 14px 18px !important;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,0.07) !important;
      line-height: 1.6;
      margin: 0;
    }
    .swagger-ui .microlight {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      line-height: 1.6 !important;
    }
    .swagger-ui .highlight-code > .microlight,
    .swagger-ui .response-body pre,
    .swagger-ui .model-box pre {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      background: #0d1b2e !important;
      color: #cdd9ea !important;
      border-radius: 8px !important;
      padding: 14px 18px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      line-height: 1.6 !important;
    }
    /* Syntax tokens */
    .swagger-ui .microlight .hljs-string { color: #86efac !important; }
    .swagger-ui .microlight .hljs-number { color: #7dd3fc !important; }
    .swagger-ui .microlight .hljs-literal { color: #f9a8d4 !important; }
    .swagger-ui .microlight .hljs-attr { color: #c4b5fd !important; }
    .swagger-ui .microlight .hljs-punctuation { color: #94a3b8 !important; }

    /* Response status label */
    .swagger-ui .responses-table .response-col_status code {
      display: inline-flex;
      align-items: center;
      padding: 2px 9px;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ════════════════════════════════
       MODELS / SCHEMAS SECTION
    ════════════════════════════════ */
    .swagger-ui section.models {
      background: #ffffff;
      border: 1.5px solid #dde3ec;
      border-radius: 12px;
      margin: 32px 0 24px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .swagger-ui section.models h4 {
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      font-weight: 700 !important;
      color: #0d1b2e !important;
      padding: 16px 22px !important;
      margin: 0 !important;
      border-bottom: 1px solid #dde3ec;
      background: #f5f7fa;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .swagger-ui section.models h4 svg { fill: #7a8a9e; }
    .swagger-ui section.models .model-container {
      border-bottom: 1px solid #eef1f6;
      margin: 0 !important;
      padding: 0 !important;
    }
    .swagger-ui section.models .model-container:last-child { border-bottom: none; }
    .swagger-ui .model-box {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 12px 16px !important;
      margin: 8px 16px 12px;
    }
    .swagger-ui .model-title {
      font-family: 'Inter', sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      color: #0d1b2e !important;
    }
    .swagger-ui .model-toggle::after { color: #7a8a9e; }
    .swagger-ui .model {
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 12px !important;
      color: #3d4f66 !important;
      line-height: 1.7;
    }
    .swagger-ui .model span.prop-name {
      color: #6d28d9 !important;
      font-weight: 500 !important;
    }
    .swagger-ui .model span.prop-type { color: #0369a1 !important; }
    .swagger-ui .model span.prop-format { color: #15803d !important; font-style: italic; }
    .swagger-ui .model .required { color: #b91c1c !important; font-size: 11px; }
    .swagger-ui .model-collapse .model-box-control { color: #1a56db !important; }

    /* ════════════════════════════════
       AUTH MODAL
    ════════════════════════════════ */
    .swagger-ui .dialog-ux .backdrop-ux {
      background: rgba(13,27,46,0.55);
      backdrop-filter: blur(3px);
    }
    .swagger-ui .dialog-ux .modal-ux {
      border-radius: 16px !important;
      border: 1px solid #dde3ec !important;
      box-shadow: 0 24px 64px rgba(0,0,0,0.18) !important;
      overflow: hidden;
      max-width: 540px;
      width: 90%;
    }
    .swagger-ui .dialog-ux .modal-ux-header {
      background: #0d1b2e;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding: 18px 24px !important;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .swagger-ui .dialog-ux .modal-ux-header h3 {
      font-family: 'Inter', sans-serif !important;
      font-size: 17px !important;
      font-weight: 700 !important;
      color: #f0f4f8 !important;
      margin: 0 !important;
    }
    .swagger-ui .dialog-ux .modal-ux-header .close-modal svg { fill: #7a8a9e; }
    .swagger-ui .dialog-ux .modal-ux-header .close-modal:hover svg { fill: #f0f4f8; }
    .swagger-ui .dialog-ux .modal-ux-content {
      padding: 24px !important;
      background: #ffffff;
    }
    .swagger-ui .dialog-ux .modal-ux-content p {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      color: #7a8a9e !important;
      line-height: 1.6;
    }
    .swagger-ui .dialog-ux .modal-ux-content h4 {
      font-family: 'Inter', sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #0d1b2e !important;
      margin: 0 0 8px !important;
    }
    .swagger-ui .dialog-ux .modal-ux-content label {
      font-family: 'Inter', sans-serif !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #3d4f66 !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 6px;
    }
    .swagger-ui .auth-container {
      padding: 0 !important;
    }
    .swagger-ui .auth-container .authorize {
      background: #1a56db !important;
      border-color: #1a56db !important;
      color: #ffffff !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 600 !important;
      border-radius: 8px !important;
    }
    .swagger-ui .auth-container .authorize:hover {
      background: #1446b5 !important;
    }
    .swagger-ui .auth-container .btn-done {
      background: #15803d !important;
      border-color: #15803d !important;
      color: #ffffff !important;
      border-radius: 8px !important;
      font-family: 'Inter', sans-serif !important;
      font-weight: 600 !important;
    }
    .swagger-ui .auth-container .btn-done:hover {
      background: #166534 !important;
    }
    .swagger-ui .auth-container code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      background: #f0f4f8;
      border: 1px solid #dde3ec;
      border-radius: 5px;
      padding: 2px 8px;
      color: #0d1b2e;
    }

    /* ════════════════════════════════
       MISC
    ════════════════════════════════ */
    /* Deprecation badge */
    .swagger-ui .opblock-deprecated .opblock-summary-method {
      text-decoration: line-through;
      opacity: 0.6;
    }
    .swagger-ui .opblock-deprecated { opacity: 0.65 !important; }

    /* Markdown content */
    .swagger-ui .markdown p { color: #3d4f66 !important; }
    .swagger-ui .markdown code,
    .swagger-ui p code {
      font-family: 'JetBrains Mono', monospace !important;
      background: #eef1f6;
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 11.5px;
      color: #6d28d9;
    }
    .swagger-ui .markdown pre {
      background: #0d1b2e !important;
      border-radius: 8px;
      padding: 14px 18px;
    }
    .swagger-ui .markdown pre code { background: transparent; color: #cdd9ea; padding: 0; }

    /* Loading */
    .swagger-ui .loading-container { padding: 60px !important; }
    .swagger-ui .loading-container .loading::before {
      border-color: #dde3ec;
      border-top-color: #1a56db;
    }

    /* Servers title */
    .swagger-ui .servers-title { display: none !important; }
    .swagger-ui .servers { margin-left: auto; }

    /* Scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f0f4f8; }
    ::-webkit-scrollbar-thumb { background: #c4cdd8; border-radius: 6px; }
    ::-webkit-scrollbar-thumb:hover { background: #8a96a8; }

    /* Focus outlines */
    .swagger-ui *:focus-visible {
      outline: 2px solid #1a56db;
      outline-offset: 2px;
    }
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
