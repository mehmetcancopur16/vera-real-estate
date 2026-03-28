import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Ücretsiz',
    listingLimit: 3,
    features: [
      '3 ilan yayınlama hakkı',
      'Standart ilan görünürlüğü',
      'Temel arama filtreleri',
      'E-posta desteği'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    priceLabel: '₺299/ay',
    listingLimit: 7,
    features: [
      '7 ilan yayınlama hakkı',
      'Öne çıkarılmış ilan seçeneği',
      'Gelişmiş arama filtreleri',
      'Öncelikli e-posta desteği',
      'İlan istatistikleri',
      'Özel profil rozeti'
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate',
    price: 799,
    priceLabel: '₺799/ay',
    listingLimit: null,
    features: [
      'Sınırsız ilan yayınlama',
      'Premium ilan görünürlüğü',
      'Tüm gelişmiş filtreler',
      '7/24 öncelikli destek',
      'Detaylı analitik raporlar',
      'Kurumsal profil rozeti',
      'API erişimi',
      'Özel müşteri temsilcisi'
    ]
  }
];

export async function getPlans(req, res) {
  res.json({ success: true, data: PLANS });
}

export async function upgradePlan(req, res, next) {
  try {
    const { plan } = req.body;
    if (!['free', 'professional', 'corporate'].includes(plan)) {
      throw new ApiError(400, 'Geçersiz plan. free, professional veya corporate olmalıdır.');
    }

    const expiresAt = plan !== 'free'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : null;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'subscription.plan': plan, 'subscription.expiresAt': expiresAt } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new ApiError(404, 'Kullanıcı bulunamadı');

    res.json({
      success: true,
      data: updated,
      message: plan === 'free'
        ? 'Free plana geçirildiniz'
        : `${plan === 'professional' ? 'Professional' : 'Corporate'} plana başarıyla yükseltildiniz`
    });
  } catch (err) {
    next(err);
  }
}
