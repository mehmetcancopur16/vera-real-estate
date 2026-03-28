import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';
import { subscribeToNewsletter } from '../controllers/newsletter.controller.js';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().trim().email('Gecerli bir e-posta girin'),
});

/**
 * @openapi
 * /api/newsletter/subscribe:
 *   post:
 *     tags: [Newsletter]
 *     summary: Email bültenine abone ol
 *     description: |
 *       Verilen email adresi bülten aboneleri listesine eklenir.
 *       Aynı email zaten kayıtlıysa hata döner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: abone@ornek.com
 *     responses:
 *       201:
 *         description: Abonelik başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Bültene abone oldunuz.' }
 *                 data: { $ref: '#/components/schemas/Newsletter' }
 *       400:
 *         description: Geçersiz email veya zaten kayıtlı
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/subscribe', validate(subscribeSchema), subscribeToNewsletter);

export default router;
