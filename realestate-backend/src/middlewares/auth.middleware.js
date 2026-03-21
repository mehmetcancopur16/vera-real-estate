import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

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

export function restrictTo(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Önce giriş yapmalısınız'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Bu işlem için yetkiniz yok'));
    }
    return next();
  };
}

export function isOwner(Model, idParam = 'id') {
  return async (req, _res, next) => {
    try {
      if (!req.user?.id) {
        throw new ApiError(401, 'Önce giriş yapmalısınız');
      }

      const resourceId = req.params[idParam];
      if (!mongoose.isValidObjectId(resourceId)) {
        throw new ApiError(400, 'Geçersiz kaynak kimliği');
      }

      const doc = await Model.findById(resourceId).select('owner');
      if (!doc) {
        throw new ApiError(404, 'Kaynak bulunamadı');
      }

      const ownerId = typeof doc.owner === 'object' ? doc.owner.toString() : String(doc.owner);
      const isAdmin = req.user.role === 'admin';
      if (!isAdmin && ownerId !== req.user.id) {
        throw new ApiError(403, 'Bu işlem için sahiplik yetkiniz yok');
      }

      req.resource = doc;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
