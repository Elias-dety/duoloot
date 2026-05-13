import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  prizePool: z.number().min(0),
  prizeCurrency: z.string(),
  status: z.enum(['scheduled', 'active', 'ended', 'cancelled']),
  totalParticipants: z.number().int().min(0),
  onlineParticipants: z.number().int().min(0),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export type Event = z.infer<typeof EventSchema>;
