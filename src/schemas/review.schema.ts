import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  authorNickname: z.string(),
  targetType: z.enum(['coach', 'player']),
  targetId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  sentiment: z.enum(['positive', 'neutral', 'critical']),
  comment: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof ReviewSchema>;
