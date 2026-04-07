import { z } from 'zod';

export const upgradePlanBodySchema = z.object({
  plan: z.enum(['free', 'professional', 'corporate'], {
    errorMap: () => ({ message: "plan 'free', 'professional' veya 'corporate' olmalıdır" })
  })
});
