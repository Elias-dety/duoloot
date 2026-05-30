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
  requirements: z.string().nullable().optional(),
  mission_type: z.string(),
  target_value: z.number(),
  points_reward: z.number(),
  cash_reward_cents: z.number().optional().default(0),
  currency: z.string().optional().default('BRL'),
  winner_limit: z.number().optional().default(1),
  status: z.enum(['draft', 'active', 'inactive', 'closed', 'archived']),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
  created_by: z.string().uuid().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  winners_count: z.number().optional().default(0),
  my_submission: z.object({
    id: z.string().uuid(),
    status: z.enum(['submitted', 'approved', 'rejected', 'cancelled']),
    submitted_at: z.string()
  }).nullable().optional(),
});

export type VaultMission = z.infer<typeof VaultMissionSchema>;

export const VaultMissionSubmissionSchema = z.object({
  id: z.string().uuid(),
  mission_id: z.string().uuid(),
  user_id: z.string().uuid(),
  evidence_text: z.string().nullable().optional(),
  evidence_url: z.string().nullable().optional(),
  status: z.enum(['submitted', 'approved', 'rejected', 'cancelled']),
  submitted_at: z.string(),
  reviewed_at: z.string().nullable().optional(),
  reviewed_by: z.string().uuid().nullable().optional(),
  review_note: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type VaultMissionSubmission = z.infer<typeof VaultMissionSubmissionSchema>;

export const VaultMissionRewardSchema = z.object({
  id: z.string().uuid(),
  mission_id: z.string().uuid(),
  submission_id: z.string().uuid(),
  user_id: z.string().uuid(),
  points_awarded: z.number(),
  cash_reward_cents: z.number(),
  currency: z.string(),
  reward_status: z.enum(['reserved', 'paid', 'cancelled']),
  idempotency_key: z.string(),
  awarded_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type VaultMissionReward = z.infer<typeof VaultMissionRewardSchema>;

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

const VaultGameProfileSchema = z.record(z.string(), z.unknown()).nullable().optional();

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
