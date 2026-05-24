export type GlobalRaceStatus =
  | 'draft'
  | 'scheduled'
  | 'registration_open'
  | 'in_progress'
  | 'awaiting_validation'
  | 'finished'
  | 'cancelled';

export type GlobalRaceMissionType =
  | 'first_win'
  | 'kill_count'
  | 'assist_count'
  | 'headshot_count'
  | 'damage_total'
  | 'plant_or_defuse'
  | 'match_mvp';

export type GlobalRaceEntryMode = 'mercenary' | 'closed_duo';

export type GlobalRaceEntryStatus =
  | 'registered'
  | 'waiting_partner'
  | 'team_ready'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type GlobalRaceTeamStatus =
  | 'waiting_partner'
  | 'ready'
  | 'in_progress'
  | 'awaiting_validation'
  | 'completed'
  | 'failed'
  | 'abandoned'
  | 'cancelled';

export type GlobalRaceResultStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'disputed';

export type GlobalRaceRewardType = 'points' | 'duocoins' | 'badge' | 'vault_bonus';

export type GlobalRaceParticipantSnapshot = {
  userId: string;
  nickname: string;
  riotName?: string;
  rank: string;
  trustScore: number;
  isCaptain?: boolean;
};

export type GlobalRaceMission = {
  id: string;
  raceId: string;
  title: string;
  description: string;
  type: GlobalRaceMissionType;
  targetValue: number;
  rules: string[];
  verificationHint: string;
  pointsReward: number;
};

export type GlobalRaceReward = {
  id: string;
  raceId: string;
  type: GlobalRaceRewardType;
  label: string;
  amount: number;
  positionFrom: number;
  positionTo: number;
};

export type GlobalRace = {
  id: string;
  title: string;
  description: string;
  status: GlobalRaceStatus;
  mission: GlobalRaceMission;
  rewards: GlobalRaceReward[];
  teamSize: 2;
  maxTeams: number;
  registeredTeams: number;
  startsAt: string;
  endsAt: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  freeMissionRevealAt: string;
  premiumPreviewStartsAt: string;
  minRank: string;
  maxRank: string;
  createdAt: string;
  updatedAt: string;
};

export type GlobalRaceEntry = {
  id: string;
  raceId: string;
  userId: string;
  teamId?: string;
  mode: GlobalRaceEntryMode;
  status: GlobalRaceEntryStatus;
  partnerUserId?: string;
  createdAt: string;
  updatedAt: string;
};

export type GlobalRaceTeam = {
  id: string;
  raceId: string;
  name: string;
  mode: GlobalRaceEntryMode;
  status: GlobalRaceTeamStatus;
  participants: GlobalRaceParticipantSnapshot[];
  entryIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type GlobalRaceResult = {
  id: string;
  raceId: string;
  teamId: string;
  status: GlobalRaceResultStatus;
  missionProgress: number;
  score: number;
  completionSeconds?: number;
  verificationRequestedAt: string;
  completedAt?: string;
  failureReason?: string;
  source: 'mock';
};

export type GlobalRaceRankingEntry = {
  raceId: string;
  teamId: string;
  teamName: string;
  position: number;
  status: GlobalRaceResultStatus;
  score: number;
  missionProgress: number;
  completionSeconds?: number;
  verifiedAt: string;
  completedAt?: string;
  participants: GlobalRaceParticipantSnapshot[];
  reward?: GlobalRaceReward;
};

export type JoinGlobalRacePayload = {
  raceId: string;
  userId: string;
  userNickname: string;
  userRank: string;
  userTrustScore: number;
  mode: GlobalRaceEntryMode;
  partnerUserId?: string;
  partnerNickname?: string;
  partnerRank?: string;
  partnerTrustScore?: number;
};

export type VerifyGlobalRaceResultPayload = {
  raceId: string;
  teamId: string;
};
