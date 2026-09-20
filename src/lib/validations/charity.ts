import { z } from 'zod';

/**
 * Charity validation schemas.
 * PRD rules enforced:
 * - Minimum contribution: 10% [EXPLICIT]
 * - Maximum: 100%
 */

export const charityContributionSchema = z.object({
  charity_id: z.string().uuid('Invalid charity ID'),
  charity_percentage: z
    .number()
    .int('Percentage must be a whole number')
    .min(10, 'Minimum charity contribution is 10%')
    .max(100, 'Maximum charity contribution is 100%'),
});

export const charitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  description: z.string().optional(),
  short_description: z.string().max(300).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  category: z.string().max(100).optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  upcoming_events: z
    .array(
      z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
      })
    )
    .default([]),
});

export type CharityContributionInput = z.infer<typeof charityContributionSchema>;
export type CharityInput = z.infer<typeof charitySchema>;
