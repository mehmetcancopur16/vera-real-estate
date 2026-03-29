import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { changePasswordSchema, deleteMeSchema, loginSchema, registerSchema, updateMeSchema } from '../validations/auth.validation.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     operationId: register
 *     tags:
 *       - Auth
 *     summary: Yeni kullanıcı kaydı
 *     description: |
 *       Ad, email ve şifre ile yeni bir kullanıcı hesabı oluşturur.
 *       Başarılı kayıt sonrası JWT token döner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: Kayıt başarılı — token ve kullanıcı bilgisi döner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz istek verisi veya e-posta zaten kullanımda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     operationId: login
 *     tags:
 *       - Auth
 *     summary: Giriş — JWT döner
 *     description: |
 *       Email ve şifre ile giriş yapar, başarılıysa JWT token döner.
 *       Token'ı `Authorization: Bearer <token>` header'ı ile kullanın.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Eksik alanlar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Geçersiz kimlik bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     operationId: getMe
 *     tags:
 *       - Auth
 *     summary: Giriş yapan kullanıcının profil bilgisi
 *     description: JWT token ile kimliği doğrulanmış kullanıcının profilini döner.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil bilgisi
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
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/me', protect, authController.getMe);

/**
 * @openapi
 * /api/auth/me:
 *   patch:
 *     operationId: updateMe
 *     tags:
 *       - Auth
 *     summary: Profil güncelle (ad / email)
 *     description: Giriş yapmış kullanıcının ad ve/veya email bilgisini günceller.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileBody'
 *     responses:
 *       200:
 *         description: Profil güncellendi
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
 */
router.patch('/me', protect, validate(updateMeSchema), authController.updateMe);

/**
 * @openapi
 * /api/auth/password:
 *   patch:
 *     operationId: changePassword
 *     tags:
 *       - Auth
 *     summary: Şifre değiştir
 *     description: Mevcut şifreyi doğrulayarak yeni şifre belirler.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordBody'
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch('/password', protect, validate(changePasswordSchema), authController.changePassword);

/**
 * @openapi
 * /api/auth/avatar:
 *   post:
 *     operationId: uploadAvatar
 *     tags:
 *       - Auth
 *     summary: Avatar yükle (Cloudinary)
 *     description: |
 *       Kullanıcı profil fotoğrafını Cloudinary'ye yükler.
 *       Sadece JPEG, PNG ve WebP formatları kabul edilir (max 5 MB).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profil fotoğrafı dosyası
 *     responses:
 *       200:
 *         description: Avatar başarıyla yüklendi
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
 */
router.post('/avatar', protect, uploadAvatar.single('avatar'), authController.uploadAvatar);

/**
 * @openapi
 * /api/auth/me:
 *   delete:
 *     operationId: deleteMe
 *     tags:
 *       - Auth
 *     summary: Hesabı sil (şifre onaylı)
 *     description: |
 *       Kullanıcı hesabını kalıcı olarak siler. Güvenlik için mevcut şifre gereklidir.
 *       Kullanıcıya ait tüm ilanlar da silinir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAccountBody'
 *     responses:
 *       200:
 *         description: Hesap başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/me', protect, validate(deleteMeSchema), authController.deleteMe);

export default router;
