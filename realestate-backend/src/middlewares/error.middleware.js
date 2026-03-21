import logger from '../utils/logger.js';

/**
 * Global error handler: logs server errors and returns a consistent JSON shape.
 */
export function errorMiddleware(err, req, res, _next) {
  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Dosya boyutu en fazla 5MB olabilir'
        : 'Dosya yükleme hatası';
    logger.warn(message, { code: err.code, path: req.originalUrl });
    return res.status(400).json({ success: false, message });
  }

  const statusCode = Number(err.statusCode) || 500;
  const isOperational = err.isOperational === true;

  if (statusCode >= 500 || !isOperational) {
    logger.error(err.message, { stack: err.stack, path: req.originalUrl, method: req.method });
  } else {
    logger.warn(err.message, { path: req.originalUrl, method: req.method });
  }

  const body = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && statusCode >= 500 && { stack: err.stack })
  };

  res.status(statusCode).json(body);
}
