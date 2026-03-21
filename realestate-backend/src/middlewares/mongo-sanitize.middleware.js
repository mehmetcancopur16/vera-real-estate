import expressMongoSanitize from 'express-mongo-sanitize';

const { sanitize } = expressMongoSanitize;

/**
 * express-mongo-sanitize assigns to req.query; Express 5 exposes req.query as read-only.
 * This wrapper sanitizes the same surfaces using the library's `sanitize` helper and
 * redefines `req.query` only when needed.
 */
export function mongoSanitizeCompatible(options = {}) {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitize(req.body, options);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitize(req.params, options);
    }
    if (req.headers && typeof req.headers === 'object') {
      req.headers = sanitize(req.headers, options);
    }
    if (req.query && typeof req.query === 'object') {
      const cleaned = sanitize({ ...req.query }, options);
      Object.defineProperty(req, 'query', {
        value: cleaned,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
    next();
  };
}
