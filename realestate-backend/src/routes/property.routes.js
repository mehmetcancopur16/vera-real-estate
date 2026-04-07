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
 *     operationId: getFeaturedProperties
 *     tags:
 *       - Properties
 *     summary: Öne çıkan 6 ilan
 *     description: |
 *       Ana sayfa icin isFeatured degeri true olan en son 6 ilani doner.
 *     responses:
 *       200:
 *         description: Öne çıkan ilanlar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 */
router.get('/featured', propertyController.featuredProperties);

/**
 * @openapi
 * /api/properties/my:
 *   get:
 *     operationId: getMyProperties
 *     tags:
 *       - Properties
 *     summary: Giriş yapan kullanıcının ilanları
 *     description: JWT ile kimliği doğrulanmış kullanıcının kendi ilanlarını sayfalı döner.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Kullanıcının ilan listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/my', protect, propertyController.getMyProperties);

/**
 * @openapi
 * /api/properties:
 *   get:
 *     operationId: getProperties
 *     tags:
 *       - Properties
 *     summary: İlanları listele (filtreleme + sayfalama)
 *     description: |
 *       Tüm aktif ilanları filtre ve sayfalama ile döner.
 *       Şehir, tip, satılık/kiralık, fiyat aralığı, oda sayısı ve
 *       tam metin arama desteklenir.
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Şehir filtresi
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: Emlak tipi
 *         schema:
 *           type: string
 *           enum:
 *             - apartment
 *             - house
 *             - land
 *             - commercial
 *       - name: listingType
 *         in: query
 *         description: Satılık veya kiralık
 *         schema:
 *           type: string
 *           enum:
 *             - sale
 *             - rent
 *       - name: minPrice
 *         in: query
 *         description: Minimum fiyat
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         description: Maksimum fiyat
 *         schema:
 *           type: number
 *       - name: rooms
 *         in: query
 *         description: Oda sayısı
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         description: Başlık ve açıklamada tam metin arama
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: İlan listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', propertyController.getProperties);

/**
 * @openapi
 * /api/properties/{id}:
 *   get:
 *     operationId: getPropertyById
 *     tags:
 *       - Properties
 *     summary: Tekil ilan detayı
 *     description: Verilen ID'ye sahip ilanın tüm bilgilerini döner. Görüntülenme sayacı +1 artar.
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: İlan detayı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @openapi
 * /api/properties:
 *   post:
 *     operationId: createProperty
 *     tags:
 *       - Properties
 *     summary: Yeni ilan oluştur
 *     description: |
 *       JWT ile kimliği doğrulanmış kullanıcı adına yeni ilan oluşturur.
 *       Abonelik planına göre ilan limiti kontrol edilir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyBody'
 *     responses:
 *       201:
 *         description: İlan oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', protect, validate(createPropertySchema), propertyController.createProperty);

/**
 * @openapi
 * /api/properties/{id}:
 *   put:
 *     operationId: updateProperty
 *     tags:
 *       - Properties
 *     summary: İlanı güncelle (sadece sahip)
 *     description: İlan sahibi tarafından mevcut ilanın alanlarını günceller.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyBody'
 *     responses:
 *       200:
 *         description: İlan güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', protect, isOwner(Property), validate(updatePropertySchema), propertyController.updateProperty);

/**
 * @openapi
 * /api/properties/{id}:
 *   delete:
 *     operationId: deleteProperty
 *     tags:
 *       - Properties
 *     summary: İlanı sil (sadece sahip)
 *     description: İlan sahibi ilanını kalıcı olarak siler. Sunucudaki görsel dosyaları da temizlenir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: İlan silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', protect, isOwner(Property), propertyController.deleteProperty);

/**
 * @openapi
 * /api/properties/{id}/images:
 *   post:
 *     operationId: uploadPropertyImages
 *     tags:
 *       - Properties
 *     summary: İlana görsel yükle (disk, maks 5)
 *     description: |
 *       İlan sahibi ilana en fazla 5 görsel yükleyebilir.
 *       Görseller sunucu diskine (Multer) yüklenir, `/uploads/` altında saklanır ve URL'ler ilana eklenir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Yüklenecek görsel dosyaları (maks 5)
 *     responses:
 *       200:
 *         description: Görseller başarıyla yüklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:id/images', protect, isOwner(Property), upload.array('images', 5), propertyController.uploadPropertyImages);

/**
 * @openapi
 * /api/properties/{id}/images/{imgId}:
 *   delete:
 *     operationId: deletePropertyImage
 *     tags:
 *       - Properties
 *     summary: İlandaki tek görseli sil
 *     description: Sunucu diskinden ve veritabanından belirtilen görseli siler.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - name: imgId
 *         in: path
 *         required: true
 *         description: Silinecek görselin ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Görsel silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id/images/:imgId', protect, isOwner(Property), propertyController.deletePropertyImage);

export default router;
