import mongoose from 'mongoose';
import Property from '../models/Property.model.js';
import { ApiError } from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

const PROPERTY_TYPES = new Set(['apartment', 'house', 'land', 'commercial']);
const LISTING_TYPES = new Set(['sale', 'rent']);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * URL query → MongoDB filtre objesi (liste: sadece aktif ilanlar).
 */
export function buildFilter(query) {
  const filter = { isActive: true };

  if (query.city && String(query.city).trim()) {
    filter['location.city'] = new RegExp(escapeRegex(String(query.city).trim()), 'i');
  }

  if (query.type && PROPERTY_TYPES.has(query.type)) {
    filter.type = query.type;
  }

  if (query.listingType && LISTING_TYPES.has(query.listingType)) {
    filter.listingType = query.listingType;
  }

  const minP = query.minPrice !== undefined && query.minPrice !== '' ? Number(query.minPrice) : null;
  const maxP = query.maxPrice !== undefined && query.maxPrice !== '' ? Number(query.maxPrice) : null;
  if ((minP !== null && !Number.isNaN(minP)) || (maxP !== null && !Number.isNaN(maxP))) {
    filter.price = {};
    if (minP !== null && !Number.isNaN(minP)) filter.price.$gte = minP;
    if (maxP !== null && !Number.isNaN(maxP)) filter.price.$lte = maxP;
  }

  if (query.rooms !== undefined && query.rooms !== '') {
    const r = Number(query.rooms);
    if (!Number.isNaN(r)) {
      filter['features.rooms'] = r;
    }
  }

  if (query.search && String(query.search).trim()) {
    filter.$text = { $search: String(query.search).trim() };
  }

  return filter;
}

function assertCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new ApiError(500, 'Cloudinary ortam değişkenleri eksik');
  }
}

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      },
      { folder: 'vera-real-estate/properties', resource_type: 'image' }
    );
    stream.end(buffer);
  });
}

function parseCloudinaryPublicIdFromUrl(url) {
  try {
    const parsed = new URL(url);
    const marker = '/upload/';
    const uploadIndex = parsed.pathname.indexOf(marker);
    if (uploadIndex === -1) return null;

    let rest = parsed.pathname.slice(uploadIndex + marker.length);
    rest = rest.replace(/^v\d+\//, '');
    const withoutExtension = rest.replace(/\.[^/.]+$/, '');
    return withoutExtension || null;
  } catch {
    return null;
  }
}

export async function createProperty(req, res, next) {
  try {
    const { title, description, type, listingType, price, currency, size, features, location } = req.body;

    if (!title || !description || !type || !listingType || price === undefined || price === '') {
      throw new ApiError(400, 'title, description, type, listingType ve price zorunludur');
    }
    if (!location?.city) {
      throw new ApiError(400, 'location.city zorunludur');
    }
    if (!PROPERTY_TYPES.has(type)) {
      throw new ApiError(400, 'Geçersiz type');
    }
    if (!LISTING_TYPES.has(listingType)) {
      throw new ApiError(400, 'Geçersiz listingType');
    }

    const property = await Property.create({
      owner: req.user.id,
      title,
      description,
      type,
      listingType,
      price: Number(price),
      currency: currency || 'TRY',
      size: size !== undefined && size !== '' ? Number(size) : undefined,
      features: features || {},
      location,
      images: Array.isArray(req.body.images) ? req.body.images : []
    });

    await property.populate('owner', 'name email');
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
}

export async function getProperties(req, res, next) {
  try {
    const filter = buildFilter(req.query);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    let query = Property.find(filter).skip(skip).limit(limit).populate('owner', 'name email');

    if (filter.$text) {
      query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const [items, total] = await Promise.all([query.lean(), Property.countDocuments(filter)]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyProperties(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Property.find({ owner: req.user.id, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email')
        .lean(),
      Property.countDocuments({ owner: req.user.id, isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 0
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getPropertyById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'Geçersiz ilan kimliği');
    }

    const property = await Property.findOneAndUpdate(
      { _id: id, isActive: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('owner', 'name email');
    if (!property) {
      throw new ApiError(404, 'İlan bulunamadı');
    }

    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) throw new ApiError(404, 'İlan bulunamadı');

    const allowed = ['title', 'description', 'type', 'listingType', 'price', 'currency', 'size', 'features', 'location', 'isActive', 'images'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'type' && !PROPERTY_TYPES.has(req.body.type)) {
          throw new ApiError(400, 'Geçersiz type');
        }
        if (key === 'listingType' && !LISTING_TYPES.has(req.body.listingType)) {
          throw new ApiError(400, 'Geçersiz listingType');
        }
        property[key] = req.body[key];
      }
    }

    await property.save();
    await property.populate('owner', 'name email');
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!property) throw new ApiError(404, 'İlan bulunamadı');
    res.status(200).json({ success: true, message: 'İlan pasife alındı' });
  } catch (err) {
    next(err);
  }
}

export async function uploadPropertyImages(req, res, next) {
  try {
    assertCloudinary();

    const property = await Property.findById(req.params.id);
    if (!property) throw new ApiError(404, 'İlan bulunamadı');

    const files = req.files;
    if (!files?.length) {
      throw new ApiError(400, 'En az bir görsel yükleyin');
    }

    const urls = await Promise.all(files.map((f) => uploadBuffer(f.buffer)));
    property.images.push(...urls);
    await property.save();
    await property.populate('owner', 'name email');

    res.status(200).json({ success: true, data: property, uploaded: urls });
  } catch (err) {
    next(err);
  }
}

export async function deletePropertyImage(req, res, next) {
  try {
    assertCloudinary();
    const { id, imgId } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, 'Geçersiz ilan kimliği');
    }

    const property = await Property.findById(id);
    if (!property) {
      throw new ApiError(404, 'İlan bulunamadı');
    }

    const decodedImgId = decodeURIComponent(imgId);
    const imageUrl = property.images.find(
      (url) => url === decodedImgId || url.includes(`/${decodedImgId}.`) || url.includes(`/${decodedImgId}/`)
    );
    if (!imageUrl) {
      throw new ApiError(404, 'Görsel bulunamadı');
    }

    const publicId = decodedImgId.includes('/') ? decodedImgId : parseCloudinaryPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new ApiError(400, 'Cloudinary public_id çözümlenemedi');
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    property.images = property.images.filter((url) => url !== imageUrl);
    await property.save();

    res.status(200).json({ success: true, message: 'Görsel silindi', data: property });
  } catch (err) {
    next(err);
  }
}

export async function featuredProperties(req, res, next) {
  try {
    const items = await Property.find({ isActive: true })
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(6)
      .populate('owner', 'name email')
      .lean();

    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}
