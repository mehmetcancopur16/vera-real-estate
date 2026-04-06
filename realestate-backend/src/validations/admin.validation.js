import { z } from 'zod';

const sortByEnum = z.enum([
  'createdAt',
  'name',
  'email',
  'listingCount',
  'activeListingCount'
]);

const objectIdRegex = /^[a-f\d]{24}$/i;

export const adminUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  search: z.string().trim().max(120).optional(),
  role: z.enum(['user', 'admin']).optional(),
  plan: z.enum(['free', 'professional', 'corporate']).optional(),
  hasListings: z.enum(['true', 'false']).optional(),
  sortBy: sortByEnum.optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const adminUpdateUserBodySchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  'subscription.plan': z.enum(['free', 'professional', 'corporate']).optional()
}).refine((value) => value.role !== undefined || value['subscription.plan'] !== undefined, {
  message: "En az bir alan gonderilmelidir (role veya subscription.plan)"
});

export const adminListingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  search: z.string().trim().max(120).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  ownerId: z.string().trim().regex(objectIdRegex, 'Gecersiz ownerId').optional()
});

export const adminContactsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  search: z.string().trim().max(120).optional(),
  isRead: z.enum(['true', 'false']).optional()
});

export const adminNewslettersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().max(120).optional(),
  isActive: z.enum(['true', 'false']).optional()
});
