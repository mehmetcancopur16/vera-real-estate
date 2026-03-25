import Newsletter from '../models/Newsletter.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function subscribeToNewsletter(req, res, next) {
  try {
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Zaten abonesiniz. Tesekkurler.',
      });
    }

    const doc = await Newsletter.create({
      email,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Bültene başarıyla abone oldunuz.',
      data: doc
    });
  } catch (err) {
    // Unique index hatası olusursa (yarismada), kibar mesajla donebilmek icin kontrol edilebilir.
    if (err?.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'Zaten abonesiniz. Tesekkurler.',
      });
    }
    next(err instanceof ApiError ? err : err);
  }
}

