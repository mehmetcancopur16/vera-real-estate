import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Sadece JPEG, PNG veya WebP yükleyebilirsiniz'));
}

export const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter
});
