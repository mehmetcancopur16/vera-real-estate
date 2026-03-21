import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET yapılandırılmamış');
  }
  return jwt.sign({ id: userId.toString() }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
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

    const user = await User.create({
      name,
      email,
      password,
      role: 'user'
    });

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(400, 'Bu e-posta adresi zaten kayıtlı'));
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ');
      return next(new ApiError(400, msg));
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    assertBodyFields(req.body, ['email', 'password']);

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Geçersiz e-posta veya şifre');
    }

    const ok = await user.matchPassword(password);
    if (!ok) {
      throw new ApiError(401, 'Geçersiz e-posta veya şifre');
    }

    const token = signToken(user._id);
    res.status(200).json({
      success: true,
      user: user.toJSON(),
      token
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }
    res.status(200).json({ success: true, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
}
