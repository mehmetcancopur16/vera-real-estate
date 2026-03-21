import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'name en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'password en az 6 karakter olmalı')
});

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'password en az 6 karakter olmalı')
});
