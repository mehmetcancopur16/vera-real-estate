import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { createContactSchema } from '../validations/contact.validation.js';
import { createContactMessage } from '../controllers/contact.controller.js';

const router = Router();

/**
 * @openapi
 * /api/contact:
 *   post:
 *     tags: [Contact]
 *     summary: İletişim formu mesajı gönder
 *     description: |
 *       Ziyaretçilerin iletişim formu üzerinden mesaj göndermesini sağlar.
 *       Mesajlar veritabanına kaydedilir; admin panelinden görüntülenebilir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactBody'
 *           example:
 *             name: Ayşe Kaya
 *             email: ayse@ornek.com
 *             phone: "+90 532 000 0000"
 *             message: Merhaba, emlak danışmanlığı hakkında bilgi almak istiyorum.
 *     responses:
 *       201:
 *         description: Mesaj başarıyla gönderildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Mesajınız alındı.' }
 *                 data: { $ref: '#/components/schemas/Contact' }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', validate(createContactSchema), createContactMessage);

export default router;
