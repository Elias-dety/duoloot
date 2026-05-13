import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  nickname: z.string(),
  avatarUrl: z.string().url().optional(),
  trustScore: z.number().min(0).max(100),
  status: z.enum(['online', 'offline', 'in-game']),
  gameProfile: z.object({
    rank: z.string(),
    mainRole: z.string(),
    secondaryRole: z.string().optional(),
  }),
  stats: z.object({
    matchesPlayed: z.number().int().min(0),
    winRate: z.number().min(0).max(100),
    averageKda: z.number().min(0),
    hoursPlayed: z.number().int().min(0),
    commendations: z.number().int().min(0),
    abandons: z.number().int().min(0),
  }),
  preferences: z.object({
    micRequired: z.boolean(),
    playStyle: z.string(),
    sessionFocus: z.string(),
    availability: z.string(),
  }),
  isPremium: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Player = z.infer<typeof PlayerSchema>;
