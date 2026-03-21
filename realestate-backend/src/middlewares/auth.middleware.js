import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Bearer JWT doğrular; kullanıcıyı `req.user` olarak ekler.
 */
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Yetkisiz — erişim token\'ı gerekli');
    }

    const token = header.slice(7).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, 'JWT_SECRET yapılandırılmamış');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      throw new ApiError(401, 'Geçersiz veya süresi dolmuş token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Kullanıcı bulunamadı');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };
    next();
  } catch (err) {
    next(err);
  }
}
