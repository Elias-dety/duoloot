import { z } from 'zod';
import { PlayerSchema } from './player.schema';

const LobbyOwnerSnapshotSchema = PlayerSchema.pick({
  id: true,
  name: true,
  avatarUrl: true,
  trustScore: true,
  status: true,
  gameProfile: true,
});

export const LobbySchema = z.object({
  id: z.string().uuid(),
  owner: LobbyOwnerSnapshotSchema,
  slotsTotal: z.number().int().min(2),
  slotsFilled: z.number().int().min(1),
  mode: z.string(),
  queue: z.string(),
  minRank: z.string(),
  maxRank: z.string(),
  compatibilityScore: z.number().min(0).max(100).optional(),
  status: z.enum(['open', 'full', 'in-game', 'closed']),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
});


export type Lobby = z.infer<typeof LobbySchema>;
