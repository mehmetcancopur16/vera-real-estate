import { ApiError } from '../utils/ApiError.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      return next(new ApiError(400, message || 'Geçersiz istek verisi'));
    }
    req[source] = result.data;
    return next();
  };
}
