import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import { ApiError } from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function createStorage(subDir) {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      const dir = path.join(UPLOAD_ROOT, subDir);
      ensureDir(dir);
      cb(null, dir);
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, unique);
    }
  });
}

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Sadece JPEG, PNG veya WebP yükleyebilirsiniz'));
}

export const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: MAX_BYTES },
  fileFilter
});

export const upload = multer({
  storage: createStorage('properties'),
  limits: { fileSize: MAX_BYTES },
  fileFilter
});
