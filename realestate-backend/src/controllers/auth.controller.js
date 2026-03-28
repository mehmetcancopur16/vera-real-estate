import jwt from 'jsonwebtoken';
import path from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import Property from '../models/Property.model.js';
import { UPLOAD_ROOT } from '../middlewares/upload.middleware.js';

function signToken(userId, expiresIn = process.env.JWT_EXPIRES_IN || '1d') {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET yapılandırılmamış');
  }
  return jwt.sign({ id: userId.toString() }, secret, { expiresIn });
}

function assertBodyFields(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    throw new ApiError(400, `Eksik alanlar: ${missing.join(', ')}`);
  }
}

export async function register(req, res, next) {
  try {
    assertBodyFields(req.body, ['name', 'email', 'password']);
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'user' });
    const token = signToken(user._id);
    res.status(201).json({ success: true, user: user.toJSON(), token });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(400, 'Bu e-posta adresi zaten kayıtlı'));
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return next(new ApiError(400, msg));
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    assertBodyFields(req.body, ['email', 'password']);
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(401, 'Geçersiz e-posta veya şifre');
    const ok = await user.matchPassword(password);
    if (!ok) throw new ApiError(401, 'Geçersiz e-posta veya şifre');
    const expiresIn = rememberMe ? '30d' : '1d';
    const token = signToken(user._id, expiresIn);
    res.status(200).json({ success: true, user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, 'Kullanıcı bulunamadı');
    res.status(200).json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const allowed = ['name', 'email'];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    const updated = await User.findByIdAndUpdate(req.user.id, payload, { new: true, runValidators: true });
    if (!updated) throw new ApiError(404, 'Kullanıcı bulunamadı');
    res.status(200).json({ success: true, user: updated.toJSON() });
  } catch (err) {
    if (err?.code === 11000) {
      return next(new ApiError(400, 'Bu e-posta adresi zaten kayıtlı'));
    }
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) throw new ApiError(404, 'Kullanıcı bulunamadı');
    const ok = await user.matchPassword(currentPassword);
    if (!ok) throw new ApiError(400, 'Mevcut şifre hatalı');
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Şifre güncellendi' });
  } catch (err) {
    next(err);
  }
}

async function deleteLocalFile(fileUrl) {
  try {
    if (!fileUrl) return;
    const match = fileUrl.match(/\/uploads\/(.+)$/);
    if (!match) return;
    const filePath = path.join(UPLOAD_ROOT, match[1]);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch {
    // non-critical: ignore deletion errors
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    const file = req.file;
    if (!file?.filename) {
      throw new ApiError(400, 'Avatar dosyası zorunlu');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;

    const currentUser = await User.findById(req.user.id);
    if (currentUser?.avatarUrl) {
      await deleteLocalFile(currentUser.avatarUrl);
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true, runValidators: true }
    );
    if (!updated) throw new ApiError(404, 'Kullanıcı bulunamadı');

    res.status(200).json({ success: true, user: updated.toJSON(), avatarUrl });
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(req, res, next) {
  try {
    const { currentPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) throw new ApiError(404, 'Kullanıcı bulunamadı');
    const ok = await user.matchPassword(currentPassword);
    if (!ok) throw new ApiError(400, 'Mevcut şifre hatalı');
    await Promise.all([Property.deleteMany({ owner: req.user.id }), User.deleteOne({ _id: req.user.id })]);
    res.status(200).json({ success: true, message: 'Hesap kalıcı olarak silindi' });
  } catch (err) {
    next(err);
  }
}
