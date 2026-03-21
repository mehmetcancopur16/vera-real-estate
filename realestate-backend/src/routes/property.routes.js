import { Router } from 'express';
import { isOwner, protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import * as propertyController from '../controllers/property.controller.js';
import Property from '../models/Property.model.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPropertySchema, updatePropertySchema } from '../validations/property.validation.js';

const router = Router();

/**
 * @openapi
 * /api/properties/featured:
 *   get:
 *     tags: [Properties]
 *     summary: Öne çıkan 6 ilan
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/featured', propertyController.featuredProperties);

/**
 * @openapi
 * /api/properties:
 *   get:
 *     tags: [Properties]
 *     summary: İlanları listele (filtreleme + sayfalama)
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [apartment, house, land, commercial] }
 *       - in: query
 *         name: listingType
 *         schema: { type: string, enum: [sale, rent] }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: rooms
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Başlık ve açıklamada tam metin arama
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste
 */
router.get('/', propertyController.getProperties);

/**
 * @openapi
 * /api/properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Tekil ilan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: İlan detayı
 *       404:
 *         description: Bulunamadı
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @openapi
 * /api/properties:
 *   post:
 *     tags: [Properties]
 *     summary: Yeni ilan (JWT gerekli)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, listingType, price, location]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               type: { type: string, enum: [apartment, house, land, commercial] }
 *               listingType: { type: string, enum: [sale, rent] }
 *               price: { type: number }
 *               currency: { type: string }
 *               size: { type: number }
 *               features: { type: object }
 *               location:
 *                 type: object
 *                 properties:
 *                   city: { type: string }
 *                   district: { type: string }
 *                   address: { type: string }
 *     responses:
 *       201:
 *         description: Oluşturuldu
 */
router.post('/', protect, validate(createPropertySchema), propertyController.createProperty);

/**
 * @openapi
 * /api/properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: İlanı güncelle (sadece sahip)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Güncellendi
 *       403:
 *         description: Yetkisiz
 */
router.put('/:id', protect, isOwner(Property), validate(updatePropertySchema), propertyController.updateProperty);

/**
 * @openapi
 * /api/properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: İlanı sil (sadece sahip)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Silindi
 */
router.delete('/:id', protect, isOwner(Property), propertyController.deleteProperty);

/**
 * @openapi
 * /api/properties/{id}/images:
 *   post:
 *     tags: [Properties]
 *     summary: Görselleri Cloudinary'ye yükle (en fazla 5, sadece sahip)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Yüklendi
 */
router.post('/:id/images', protect, isOwner(Property), upload.array('images', 5), propertyController.uploadPropertyImages);

export default router;
