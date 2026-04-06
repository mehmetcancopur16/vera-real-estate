import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Property from '../models/Property.model.js';
import Contact from '../models/Contact.model.js';
import Newsletter from '../models/Newsletter.model.js';
import { ApiError } from '../utils/ApiError.js';
import { PLAN_LIMITS } from './property.controller.js';

/* ── Stats ── */
export async function getStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      inactiveListings,
      planDistribution,
      recentUsers,
      recentListings,
      totalNewsletters,
      unreadContacts
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ isActive: false }),
      User.aggregate([
        { $group: { _id: '$subscription.plan', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(8).select('name email role subscription createdAt avatarUrl').lean(),
      Property.find().sort({ createdAt: -1 }).limit(6).populate('owner', 'name email').lean(),
      Newsletter.countDocuments({ isActive: true }),
      Contact.countDocuments({ isRead: false })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalListings,
        activeListings,
        inactiveListings,
        planDistribution: planDistribution.reduce((acc, d) => {
          acc[d._id || 'free'] = d.count;
          return acc;
        }, { free: 0, professional: 0, corporate: 0 }),
        recentUsers,
        recentListings,
        totalNewsletters,
        unreadContacts
      }
    });
  } catch (err) {
    next(err);
  }
}

/* ── Users ── */
export async function getUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : '';
    const role = req.query.role ? String(req.query.role).trim() : '';
    const plan = req.query.plan ? String(req.query.plan).trim() : '';
    const hasListings = req.query.hasListings;
    const sortBy = req.query.sortBy ? String(req.query.sortBy).trim() : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const match = {};
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (['user', 'admin'].includes(role)) {
      match.role = role;
    }
    if (['free', 'professional', 'corporate'].includes(plan)) {
      match['subscription.plan'] = plan;
    }

    const sortableFields = new Set(['createdAt', 'name', 'email', 'listingCount', 'activeListingCount']);
    const safeSortBy = sortableFields.has(sortBy) ? sortBy : 'createdAt';
    const sortStage = { [safeSortBy]: sortOrder, _id: -1 };

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'owner',
          as: 'listingDocs'
        }
      },
      {
        $addFields: {
          listingCount: { $size: '$listingDocs' },
          activeListingCount: {
            $size: {
              $filter: {
                input: '$listingDocs',
                as: 'listing',
                cond: { $eq: ['$$listing.isActive', true] }
              }
            }
          }
        }
      }
    ];

    if (hasListings === 'true') {
      pipeline.push({ $match: { listingCount: { $gt: 0 } } });
    } else if (hasListings === 'false') {
      pipeline.push({ $match: { listingCount: 0 } });
    }

    pipeline.push({ $sort: sortStage });
    pipeline.push({
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          { $project: { listingDocs: 0 } }
        ],
        totalCount: [
          { $count: 'count' }
        ]
      }
    });

    const [agg] = await User.aggregate(pipeline);
    const enriched = agg?.data || [];
    const total = agg?.totalCount?.[0]?.count || 0;

    res.json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 0 }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz kullanıcı ID');

    const allowed = ['role', 'subscription'];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    // Allow changing just subscription.plan
    if (req.body['subscription.plan'] !== undefined) {
      payload['subscription.plan'] = req.body['subscription.plan'];
      if (['professional', 'corporate'].includes(req.body['subscription.plan'])) {
        payload['subscription.expiresAt'] = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else {
        payload['subscription.expiresAt'] = null;
      }
      delete payload.subscription;
    }

    const updated = await User.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean();
    if (!updated) throw new ApiError(404, 'Kullanıcı bulunamadı');

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz kullanıcı ID');
    if (id === req.user.id) throw new ApiError(400, 'Kendinizi silemezsiniz');

    const user = await User.findById(id);
    if (!user) throw new ApiError(404, 'Kullanıcı bulunamadı');

    await Promise.all([
      Property.deleteMany({ owner: id }),
      User.deleteOne({ _id: id })
    ]);

    res.json({ success: true, message: 'Kullanıcı ve tüm ilanları silindi' });
  } catch (err) {
    next(err);
  }
}

/* ── Listings ── */
export async function getListings(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : '';

    const filter = {};
    if (search) filter.$text = { $search: search };
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      filter.isActive = req.query.isActive === 'true';
    }

    const [listings, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email subscription')
        .lean(),
      Property.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: listings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 0 }
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleListing(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz ilan ID');

    const property = await Property.findById(id);
    if (!property) throw new ApiError(404, 'İlan bulunamadı');

    property.isActive = !property.isActive;
    await property.save();

    res.json({ success: true, data: property, message: `İlan ${property.isActive ? 'aktif' : 'pasif'} yapıldı` });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnyListing(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz ilan ID');

    const property = await Property.findByIdAndDelete(id);
    if (!property) throw new ApiError(404, 'İlan bulunamadı');

    res.json({ success: true, message: 'İlan silindi' });
  } catch (err) {
    next(err);
  }
}

/* ── Contacts ── */
export async function getContacts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : '';

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    if (req.query.isRead !== undefined && req.query.isRead !== '') {
      filter.isRead = req.query.isRead === 'true';
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 0 }
    });
  } catch (err) {
    next(err);
  }
}

export async function markContactRead(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz mesaj ID');

    const contact = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true }).lean();
    if (!contact) throw new ApiError(404, 'Mesaj bulunamadı');

    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz mesaj ID');

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) throw new ApiError(404, 'Mesaj bulunamadı');

    res.json({ success: true, message: 'Mesaj silindi' });
  } catch (err) {
    next(err);
  }
}

/* ── Newsletters ── */
export async function getNewsletters(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : '';

    const filter = {};
    if (search) filter.email = { $regex: search, $options: 'i' };
    if (req.query.isActive !== undefined && req.query.isActive !== '') {
      filter.isActive = req.query.isActive === 'true';
    }

    const [newsletters, total] = await Promise.all([
      Newsletter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Newsletter.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: newsletters,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 0 }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteNewsletter(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Geçersiz abone ID');

    const sub = await Newsletter.findByIdAndDelete(id);
    if (!sub) throw new ApiError(404, 'Abone bulunamadı');

    res.json({ success: true, message: 'Abone silindi' });
  } catch (err) {
    next(err);
  }
}
