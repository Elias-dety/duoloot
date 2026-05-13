import { z } from 'zod';

export const MissionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  rules: z.array(z.string()),
  progress: z.number().min(0).max(100),
  isCompleted: z.boolean(),
  reward: z.object({
    amount: z.number(),
    currency: z.string(),
  }),
  validationType: z.enum(['manual', 'automatic']),
});

export type Mission = z.infer<typeof MissionSchema>;
