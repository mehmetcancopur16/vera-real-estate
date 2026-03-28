import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getPlans, upgradePlan } from '../controllers/subscription.controller.js';

const router = Router();

router.get('/plans', getPlans);
router.post('/upgrade', protect, upgradePlan);

export default router;
