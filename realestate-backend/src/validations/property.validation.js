import { z } from 'zod';

const featureSchema = z.object({
  rooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  floor: z.number().int().optional(),
  heating: z.string().trim().min(1).optional()
});

const locationSchema = z.object({
  city: z.string().trim().min(1, 'location.city zorunlu'),
  district: z.string().trim().optional(),
  address: z.string().trim().optional()
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(3, 'title en az 3 karakter olmalı'),
  description: z.string().trim().min(10, 'description en az 10 karakter olmalı'),
  type: z.enum(['apartment', 'house', 'land', 'commercial']),
  listingType: z.enum(['sale', 'rent']),
  price: z.number().nonnegative(),
  currency: z.string().trim().default('TRY').optional(),
  size: z.number().nonnegative().optional(),
  features: featureSchema.optional(),
  location: locationSchema,
  images: z.array(z.string().url()).optional()
});

export const updatePropertySchema = createPropertySchema.partial();
