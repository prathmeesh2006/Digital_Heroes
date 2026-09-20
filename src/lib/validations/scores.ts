import { z } from 'zod';

/**
 * Score validation schemas.
 * PRD rules enforced:
 * - Score range: 1–45 (Stableford format) [EXPLICIT]
 * - Each score must include a date [EXPLICIT]
 * - Only one score per date [EXPLICIT]
 * - Score date must not be in the future [TD-006]
 */

export const scoreSchema = z.object({
  score_value: z
    .number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be at most 45'),
  played_date: z
    .string()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    }, 'Invalid date format')
    .refine((date) => {
      const played = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return played <= today;
    }, 'Score date cannot be in the future'),
});

export const scoreUpdateSchema = scoreSchema.partial();

export type ScoreInput = z.infer<typeof scoreSchema>;
