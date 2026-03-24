import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().trim().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().trim().email('Geçerli bir e-posta girin'),
  phone: z.string().trim().min(7, 'Telefon en az 7 karakter olmalı').optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalı')
});
