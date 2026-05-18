import { z } from 'zod';

export const VaultEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  prize_label: z.string(),
  prize_value: z.number(),
  prize_pool: z.number().optional(), // For backward compat
  prize_currency: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'active', 'ended', 'cancelled']),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
  goal_points: z.number(),
  current_points: z.number(),
  total_participants: z.number().optional(),
  online_participants: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type VaultEvent = z.infer<typeof VaultEventSchema>;

export const VaultMissionSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mission_type: z.string(),
  target_value: z.number(),
  points_reward: z.number(),
  status: z.enum(['active', 'inactive']),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type VaultMission = z.infer<typeof VaultMissionSchema>;

export const VaultParticipantSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  player_id: z.string().uuid(),
  points: z.number(),
  status: z.enum(['active', 'blocked', 'winner']),
  joined_at: z.string(),
  updated_at: z.string(),
});

export type VaultParticipant = z.infer<typeof VaultParticipantSchema>;

export const VaultMissionProgressSchema = z.object({
  id: z.string().uuid(),
  mission_id: z.string().uuid(),
  event_id: z.string().uuid(),
  player_id: z.string().uuid(),
  current_value: z.number(),
  completed: z.boolean(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type VaultMissionProgress = z.infer<typeof VaultMissionProgressSchema>;

export const VaultGameProfileSchema = z.record(z.string(), z.unknown()).nullable().optional();

export const VaultLeaderboardEntrySchema = z.object({
  rankPosition: z.number().int().nonnegative(),
  participantId: z.string().uuid(),
  playerId: z.string().uuid(),
  playerName: z.string().nullable().optional(),
  playerNickname: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  trustScore: z.number().int().nullable().optional(),
  points: z.number().int().nullable().optional(),
  joinedAt: z.string(),
  missionsCompleted: z.number().int().nullable().optional(),
  totalMissions: z.number().int().nullable().optional(),
  gameProfile: VaultGameProfileSchema,
});

export type VaultLeaderboardEntry = z.infer<typeof VaultLeaderboardEntrySchema>;
export type MyVaultRank = VaultLeaderboardEntry;

export const VaultWinnerSchema = z.object({
  winnerId: z.string().uuid(),
  eventId: z.string().uuid(),
  eventTitle: z.string().nullable().optional(),
  playerId: z.string().uuid(),
  playerName: z.string().nullable().optional(),
  playerNickname: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  trustScore: z.number().int().nullable().optional(),
  rankPosition: z.number().int().positive(),
  points: z.number(),
  prizeLabel: z.string().nullable().optional(),
  prizeValue: z.number(),
  rewardStatus: z.enum(['pending', 'approved', 'paid', 'cancelled']),
  snapshot: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string(),
  endedAt: z.string().nullable().optional(),
});

export const VaultSeasonSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  prizeLabel: z.string().nullable().optional(),
  prizeValue: z.number(),
  status: z.enum(['draft', 'scheduled', 'active', 'ended', 'cancelled']),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  currentPoints: z.number(),
  goalPoints: z.number(),
  participantCount: z.number().int(),
  winnersCount: z.number().int(),
  topWinnerNickname: z.string().nullable().optional(),
  topWinnerAvatarUrl: z.string().nullable().optional(),
});

export type VaultWinner = z.infer<typeof VaultWinnerSchema>;
export type VaultSeason = z.infer<typeof VaultSeasonSchema>;

export type VaultOverview = {
  event: VaultEvent;
  missions: VaultMission[];
  participantCount: number;
};

export type MyVaultProgress = {
  participant: VaultParticipant | null;
  missionProgress: (VaultMission & { progress: VaultMissionProgress | null })[];
  totalPoints: number;
  percentage: number;
};
