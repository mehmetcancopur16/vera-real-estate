import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/auth.middleware.js';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getListings,
  toggleListing,
  deleteAnyListing,
  getContacts,
  markContactRead,
  deleteContact,
  getNewsletters,
  deleteNewsletter
} from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, restrictTo('admin'));

/* ════════════════════════════════════
   STATS
════════════════════════════════════ */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     operationId: adminGetStats
 *     tags:
 *       - Admin — Stats
 *     summary: Genel bakış istatistikleri
 *     description: |
 *       Dashboard için toplam kullanıcı, ilan, aktif/pasif ilan, plan dağılımı,
 *       okunmamış mesaj sayısı, newsletter abone sayısı ve son kayıtları döner.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: İstatistikler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AdminStats'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/stats', getStats);

/* ════════════════════════════════════
   USERS
════════════════════════════════════ */

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     operationId: adminGetUsers
 *     tags:
 *       - Admin — Users
 *     summary: Tüm kullanıcıları listele
 *     description: Sayfalama ve isteğe bağlı arama ile kullanıcıları getirir. Her kullanıcıya ilan sayısı eklenir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
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
 *                     $ref: '#/components/schemas/UserWithListingCount'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/users', getUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   patch:
 *     operationId: adminUpdateUser
 *     tags:
 *       - Admin — Users
 *     summary: Kullanıcıyı güncelle (rol veya plan)
 *     description: Kullanıcının `role` ve/veya `subscription.plan` alanlarını günceller.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateUserBody'
 *           examples:
 *             changeRole:
 *               summary: Rolü admin yap
 *               value:
 *                 role: admin
 *             changePlan:
 *               summary: Planı yükselt
 *               value:
 *                 subscription.plan: professional
 *     responses:
 *       200:
 *         description: Güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/users/:id', updateUser);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     operationId: adminDeleteUser
 *     tags:
 *       - Admin — Users
 *     summary: Kullanıcıyı ve tüm ilanlarını sil
 *     description: Kullanıcıyı ve ona ait tüm ilanları kalıcı olarak siler. Kendi hesabınızı silemezsiniz.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Kullanıcı ve ilanları silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Kullanıcı ve tüm ilanları silindi
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/users/:id', deleteUser);

/* ════════════════════════════════════
   LISTINGS
════════════════════════════════════ */

/**
 * @openapi
 * /api/admin/listings:
 *   get:
 *     operationId: adminGetListings
 *     tags:
 *       - Admin — Listings
 *     summary: Tüm ilanları listele
 *     description: Sayfalama, tam metin arama ve aktif/pasif filtresi ile ilanları getirir. Her ilanın sahibi populate edilir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: isActive
 *         in: query
 *         description: Aktif/pasif filtresi
 *         schema:
 *           type: boolean
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/listings', getListings);

/**
 * @openapi
 * /api/admin/listings/{id}/toggle:
 *   patch:
 *     operationId: adminToggleListing
 *     tags:
 *       - Admin — Listings
 *     summary: İlanı aktif/pasif yap
 *     description: İlanın `isActive` değerini tersine çevirir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Durum güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: İlan aktif yapıldı
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/listings/:id/toggle', toggleListing);

/**
 * @openapi
 * /api/admin/listings/{id}:
 *   delete:
 *     operationId: adminDeleteListing
 *     tags:
 *       - Admin — Listings
 *     summary: Herhangi bir ilanı sil
 *     description: Sahip kontrolü olmaksızın herhangi bir ilanı kalıcı siler.
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: İlan silindi
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/listings/:id', deleteAnyListing);

/* ════════════════════════════════════
   CONTACTS
════════════════════════════════════ */

/**
 * @openapi
 * /api/admin/contacts:
 *   get:
 *     operationId: adminGetContacts
 *     tags:
 *       - Admin — Contacts
 *     summary: İletişim mesajlarını listele
 *     description: Sayfalama, arama ve okunma durumu filtresi ile iletişim formu mesajlarını getirir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: isRead
 *         in: query
 *         description: Okunma durumu filtresi
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Mesaj listesi
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
 *                     $ref: '#/components/schemas/Contact'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/contacts', getContacts);

/**
 * @openapi
 * /api/admin/contacts/{id}/read:
 *   patch:
 *     operationId: adminMarkContactRead
 *     tags:
 *       - Admin — Contacts
 *     summary: Mesajı okundu olarak işaretle
 *     description: Belirtilen iletişim mesajının `isRead` alanını `true` yapar.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Okundu işaretlendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/contacts/:id/read', markContactRead);

/**
 * @openapi
 * /api/admin/contacts/{id}:
 *   delete:
 *     operationId: adminDeleteContact
 *     tags:
 *       - Admin — Contacts
 *     summary: Mesajı kalıcı sil
 *     description: Belirtilen iletişim mesajını veritabanından kalıcı olarak siler.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Mesaj silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Mesaj silindi
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/contacts/:id', deleteContact);

/* ════════════════════════════════════
   NEWSLETTERS
════════════════════════════════════ */

/**
 * @openapi
 * /api/admin/newsletters:
 *   get:
 *     operationId: adminGetNewsletters
 *     tags:
 *       - Admin — Newsletters
 *     summary: Newsletter abonelerini listele
 *     description: Sayfalama ve email araması ile bülten abonelerini getirir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - name: isActive
 *         in: query
 *         description: Aktif/pasif abone filtresi
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Abone listesi
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
 *                     $ref: '#/components/schemas/Newsletter'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/newsletters', getNewsletters);

/**
 * @openapi
 * /api/admin/newsletters/{id}:
 *   delete:
 *     operationId: adminDeleteNewsletter
 *     tags:
 *       - Admin — Newsletters
 *     summary: Aboneyi kalıcı sil
 *     description: Belirtilen newsletter abonesini veritabanından kalıcı olarak siler.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Abone silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Abone silindi
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/newsletters/:id', deleteNewsletter);

export default router;
