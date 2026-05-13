import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['vault', 'lobby', 'premium', 'coach', 'system']),
  title: z.string(),
  description: z.string(),
  isRead: z.boolean(),
  ctaLabel: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;
