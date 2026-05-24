import { z } from 'zod';

export const CoachSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  game: z.string(),
  headline: z.string(),
  specialty: z.array(z.string()),
  focusAreas: z.array(z.string()).min(1),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  pricePerHour: z.number().min(0),
  isAvailable: z.boolean(),
  premiumOnly: z.boolean(),
  responseTime: z.string(),
  languages: z.array(z.string()).min(1),
});

export type Coach = z.infer<typeof CoachSchema>;
