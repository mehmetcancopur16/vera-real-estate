import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanıcı kaydı
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Geçersiz istek veya e-posta kullanımda
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Giriş — JWT döner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *       400:
 *         description: Eksik alanlar
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Giriş yapan kullanıcının profil bilgisi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil bilgisi
 *       401:
 *         description: Yetkisiz
 */
router.get('/me', protect, authController.getMe);

export default router;
