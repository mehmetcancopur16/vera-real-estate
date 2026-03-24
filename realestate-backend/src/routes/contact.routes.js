import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { createContactSchema } from '../validations/contact.validation.js';
import { createContactMessage } from '../controllers/contact.controller.js';

const router = Router();

router.post('/', validate(createContactSchema), createContactMessage);

export default router;
