import { z } from 'zod';

export const CoachSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  game: z.string(),
  specialty: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  pricePerHour: z.number().min(0),
  isAvailable: z.boolean(),
  premiumOnly: z.boolean(),
});

export type Coach = z.infer<typeof CoachSchema>;
