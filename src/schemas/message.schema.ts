import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  senderNickname: z.string(),
  recipientNickname: z.string(),
  content: z.string().min(1),
  status: z.enum(['sent', 'delivered', 'read']),
  createdAt: z.string().datetime(),
});

export type Message = z.infer<typeof MessageSchema>;
