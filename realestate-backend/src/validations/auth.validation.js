import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'name en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'password en az 6 karakter olmalı')
});

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin').transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'password en az 6 karakter olmalı'),
  rememberMe: z.boolean().optional()
});

export const updateMeSchema = z
  .object({
    name: z.string().trim().min(2, 'name en az 2 karakter olmalı').optional(),
    email: z
      .string()
      .email('Geçerli bir e-posta girin')
      .transform((v) => v.toLowerCase().trim())
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Güncellenecek alan yok' });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'currentPassword zorunlu'),
  newPassword: z.string().min(6, 'newPassword en az 6 karakter olmalı')
});
