import { Router } from 'express';
import { z } from 'zod';

import { validate } from '../middlewares/validate.middleware.js';
import { subscribeToNewsletter } from '../controllers/newsletter.controller.js';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().trim().email('Gecerli bir e-posta girin'),
});

router.post('/subscribe', validate(subscribeSchema), subscribeToNewsletter);

export default router;

