import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getPlans, upgradePlan } from '../controllers/subscription.controller.js';

const router = Router();

/**
 * @openapi
 * /api/subscription/plans:
 *   get:
 *     operationId: getSubscriptionPlans
 *     tags:
 *       - Subscription
 *     summary: Mevcut abonelik planlarını listele
 *     description: |
 *       Free, Professional ve Corporate plan bilgilerini (fiyat, özellikler, ilan limiti) döner.
 *       Kimlik doğrulama gerekmez.
 *     responses:
 *       200:
 *         description: Plan listesi
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
 *                     $ref: '#/components/schemas/PlanInfo'
 */
router.get('/plans', getPlans);

/**
 * @openapi
 * /api/subscription/upgrade:
 *   post:
 *     operationId: upgradeSubscriptionPlan
 *     tags:
 *       - Subscription
 *     summary: Abonelik planını yükselt
 *     description: |
 *       Giriş yapmış kullanıcının abonelik planını günceller.
 *       `professional` ve `corporate` planlar 30 gün süreli olarak aktif hale gelir.
 *
 *       > **Not:** Bu demo bir platformdur; gerçek ödeme alınmaz.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpgradePlanBody'
 *           examples:
 *             professional:
 *               summary: Professional plana geç
 *               value:
 *                 plan: professional
 *             corporate:
 *               summary: Corporate plana geç
 *               value:
 *                 plan: corporate
 *             downgrade:
 *               summary: Free plana dön
 *               value:
 *                 plan: free
 *     responses:
 *       200:
 *         description: Plan güncellendi
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
 *                   example: Plan güncellendi.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/upgrade', protect, upgradePlan);

export default router;
