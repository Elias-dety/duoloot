import type {
  ValorantAbilityStats,
  ValorantEconomyStats,
  ValorantMatchmakingProfile,
  ValorantMockUser,
  ValorantProfile,
  ValorantRank,
  ValorantRole,
  ValorantStatsBundle,
} from '@/types/valorant.types';
import { calculateAgentStats } from '@/lib/valorantStats/calculateAgentStats';
import { calculateMapStats } from '@/lib/valorantStats/calculateMapStats';
import { calculateOverviewStats } from '@/lib/valorantStats/calculateOverviewStats';
import { calculateTrends } from '@/lib/valorantStats/calculateTrends';
import { calculateWeaponStats } from '@/lib/valorantStats/calculateWeaponStats';
import { generateBadges } from '@/lib/valorantStats/generateBadges';
import { generateValorantInsights } from '@/lib/valorantStats/generateInsights';
import { getRecentMatches, getRoundStats, mockRanks } from './valorantMatches.mock';

type BaseValorantUser = {
  id: string;
  profile: ValorantProfile;
  matchmakingProfile: ValorantMatchmakingProfile;
};

type ProfileInput = {
  id: string;
  gameName: string;
  tagLine: string;
  level: number;
  avatarSlug: string;
  playerTitle: string;
  currentRank: ValorantRank;
  peakRank: ValorantRank;
  numberOfWins: number;
  leaderboardRank?: number | null;
};

type MatchmakingInput = {
  userId: string;
  primaryRole: ValorantRole;
  secondaryRole: ValorantRole;
  playStyle: ValorantMatchmakingProfile['playStyle'];
  communicationStyle: ValorantMatchmakingProfile['communicationStyle'];
  preferredMaps: string[];
  avoidedMaps: string[];
  preferredAgents: string[];
  aggressionScore: number;
  reliabilityScore: number;
  teamplayScore: number;
  clutchScore: number;
  consistencyScore: number;
  toxicityScore: number;
  lookingForDuo: boolean;
};

const MOCK_CREATED_AT = '2026-02-10T14:00:00.000Z';
const MOCK_UPDATED_AT = '2026-05-22T23:30:00.000Z';

function createProfile(input: ProfileInput): ValorantProfile {
  const riotId = `${input.gameName}#${input.tagLine}`;
  const currentRank = hydrateRank(input.currentRank, input.peakRank, input.numberOfWins, input.leaderboardRank);

  return {
    id: input.id,
    userId: input.id,
    puuid: `mock-puuid-${input.id}`,
    gameName: input.gameName,
    tagLine: input.tagLine,
    riotId,
    region: 'BR',
    shard: 'br',
    platform: 'br',
    country: 'Brasil',
    language: 'pt-BR',
    avatarUrl: `/assets/valorant/avatars/${input.avatarSlug}.png`,
    playerCard: `/assets/valorant/player-cards/${input.avatarSlug}-card.png`,
    playerTitle: input.playerTitle,
    accountLevel: input.level,
    level: input.level,
    isFakeUser: true,
    createdAt: MOCK_CREATED_AT,
    updatedAt: MOCK_UPDATED_AT,
    currentRank,
    peakRank: hydrateRank(input.peakRank, input.peakRank, input.numberOfWins, input.leaderboardRank),
  };
}

function hydrateRank(
  rank: ValorantRank,
  peakRank: ValorantRank,
  numberOfWins: number,
  leaderboardRank: number | null = null,
): ValorantRank {
  return {
    ...rank,
    currentTier: rank.label,
    currentTierNumber: rank.order,
    rankedRating: rank.rr,
    peakTier: peakRank.label,
    peakTierNumber: peakRank.order,
    peakAct: 'Episode 10: Act 2',
    leaderboardRank,
    numberOfWins,
  };
}

function createMatchmakingProfile(input: MatchmakingInput): ValorantMatchmakingProfile {
  return {
    userId: input.userId,
    preferredRole: input.primaryRole,
    primaryRole: input.primaryRole,
    secondaryRole: input.secondaryRole,
    playStyle: input.playStyle,
    communicationStyle: input.communicationStyle,
    preferredQueue: 'competitive',
    preferredMaps: input.preferredMaps,
    avoidedMaps: input.avoidedMaps,
    preferredAgents: input.preferredAgents,
    lookingForDuo: input.lookingForDuo,
    aggressionScore: input.aggressionScore,
    reliabilityScore: input.reliabilityScore,
    teamplayScore: input.teamplayScore,
    clutchScore: input.clutchScore,
    consistencyScore: input.consistencyScore,
    toxicityScore: input.toxicityScore,
  };
}

const baseValorantUsers: BaseValorantUser[] = [
  {
    id: 'user-bronze-rafa',
    profile: createProfile({
      id: 'user-bronze-rafa',
      gameName: 'RafaTreino',
      tagLine: 'BR1',
      level: 58,
      avatarSlug: 'rafa',
      playerTitle: 'Aprendiz Tatico',
      currentRank: mockRanks.bronze2,
      peakRank: mockRanks.silver1,
      numberOfWins: 42,
    }),
    matchmakingProfile: createMatchmakingProfile({
      userId: 'user-bronze-rafa',
      primaryRole: 'Sentinel',
      secondaryRole: 'Initiator',
      playStyle: 'supportive',
      communicationStyle: 'balanced',
      preferredMaps: ['Ascent', 'Haven', 'Lotus'],
      avoidedMaps: ['Breeze', 'Icebox'],
      preferredAgents: ['Sage', 'Sova'],
      aggressionScore: 38,
      reliabilityScore: 72,
      teamplayScore: 76,
      clutchScore: 41,
      consistencyScore: 64,
      toxicityScore: 12,
      lookingForDuo: true,
    }),
  },
  {
    id: 'user-gold-luna',
    profile: createProfile({
      id: 'user-gold-luna',
      gameName: 'LunaRecon',
      tagLine: 'DUO',
      level: 143,
      avatarSlug: 'luna',
      playerTitle: 'Recon Consistente',
      currentRank: mockRanks.gold3,
      peakRank: mockRanks.platinum1,
      numberOfWins: 126,
    }),
    matchmakingProfile: createMatchmakingProfile({
      userId: 'user-gold-luna',
      primaryRole: 'Initiator',
      secondaryRole: 'Sentinel',
      playStyle: 'balanced',
      communicationStyle: 'shotcaller',
      preferredMaps: ['Ascent', 'Haven', 'Bind'],
      avoidedMaps: ['Breeze'],
      preferredAgents: ['Sova', 'Skye'],
      aggressionScore: 58,
      reliabilityScore: 86,
      teamplayScore: 88,
      clutchScore: 63,
      consistencyScore: 79,
      toxicityScore: 18,
      lookingForDuo: true,
    }),
  },
  {
    id: 'user-diamond-kai',
    profile: createProfile({
      id: 'user-diamond-kai',
      gameName: 'KaiSmoke',
      tagLine: 'CTRL',
      level: 221,
      avatarSlug: 'kai',
      playerTitle: 'Controlador de Ritmo',
      currentRank: mockRanks.diamond2,
      peakRank: mockRanks.ascendant1,
      numberOfWins: 214,
    }),
    matchmakingProfile: createMatchmakingProfile({
      userId: 'user-diamond-kai',
      primaryRole: 'Controller',
      secondaryRole: 'Sentinel',
      playStyle: 'supportive',
      communicationStyle: 'balanced',
      preferredMaps: ['Bind', 'Ascent', 'Split'],
      avoidedMaps: ['Icebox'],
      preferredAgents: ['Omen', 'Killjoy'],
      aggressionScore: 46,
      reliabilityScore: 91,
      teamplayScore: 93,
      clutchScore: 84,
      consistencyScore: 88,
      toxicityScore: 10,
      lookingForDuo: false,
    }),
  },
  {
    id: 'user-immortal-nox',
    profile: createProfile({
      id: 'user-immortal-nox',
      gameName: 'NoxEntry',
      tagLine: 'IMT',
      level: 339,
      avatarSlug: 'nox',
      playerTitle: 'Entry de Elite',
      currentRank: mockRanks.immortal2,
      peakRank: mockRanks.immortal3,
      numberOfWins: 386,
      leaderboardRank: 732,
    }),
    matchmakingProfile: createMatchmakingProfile({
      userId: 'user-immortal-nox',
      primaryRole: 'Duelist',
      secondaryRole: 'Initiator',
      playStyle: 'aggressive',
      communicationStyle: 'shotcaller',
      preferredMaps: ['Ascent', 'Haven', 'Split'],
      avoidedMaps: ['Breeze'],
      preferredAgents: ['Jett', 'Raze'],
      aggressionScore: 92,
      reliabilityScore: 84,
      teamplayScore: 78,
      clutchScore: 91,
      consistencyScore: 82,
      toxicityScore: 24,
      lookingForDuo: true,
    }),
  },
  {
    id: 'user-volatile-mika',
    profile: createProfile({
      id: 'user-volatile-mika',
      gameName: 'MikaAim',
      tagLine: 'CLIP',
      level: 118,
      avatarSlug: 'mika',
      playerTitle: 'Mira de Destaque',
      currentRank: mockRanks.platinum1,
      peakRank: mockRanks.diamond2,
      numberOfWins: 118,
    }),
    matchmakingProfile: createMatchmakingProfile({
      userId: 'user-volatile-mika',
      primaryRole: 'Duelist',
      secondaryRole: 'Flex',
      playStyle: 'aggressive',
      communicationStyle: 'quiet',
      preferredMaps: ['Ascent', 'Haven', 'Sunset'],
      avoidedMaps: ['Split', 'Breeze'],
      preferredAgents: ['Jett', 'Raze'],
      aggressionScore: 89,
      reliabilityScore: 61,
      teamplayScore: 54,
      clutchScore: 72,
      consistencyScore: 48,
      toxicityScore: 34,
      lookingForDuo: true,
    }),
  },
];

export const valorantMockUsers: ValorantMockUser[] = baseValorantUsers.map((user) => {
  const recentMatches = getRecentMatches(user.id);
  const roundStats = getRoundStats(user.id);
  const recentPerformance = calculateTrends(recentMatches);
  const stats: ValorantStatsBundle = {
    overviewStats: calculateOverviewStats(recentMatches, user.profile),
    agentStats: calculateAgentStats(recentMatches),
    mapStats: calculateMapStats(recentMatches),
    weaponStats: calculateWeaponStats(recentMatches),
    recentPerformance,
    trendStats: recentPerformance,
  };

  return {
    ...user,
    rank: user.profile.currentRank,
    recentMatches,
    roundStats,
    economyStats: calculateEconomyStats(roundStats),
    abilityStats: calculateAbilityStats(recentMatches),
    ...stats,
    insights: generateValorantInsights(stats),
    badges: generateBadges(stats),
  };
});

export function getValorantMockUser(userId: string): ValorantMockUser | null {
  return valorantMockUsers.find((user) => user.id === userId) ?? null;
}

function calculateEconomyStats(roundStats: ReturnType<typeof getRoundStats>): ValorantEconomyStats {
  const rounds = Math.max(roundStats.length, 1);
  const ecoRoundWins = roundStats.filter((round) => round.loadoutValue <= 1500 && round.winningTeam === round.playerTeam).length;
  const forceBuyWins = roundStats.filter((round) =>
    round.loadoutValue > 1500 && round.loadoutValue < 3900 && round.winningTeam === round.playerTeam
  ).length;
  const fullBuyRoundWins = roundStats.filter((round) =>
    round.loadoutValue >= 3900 && round.winningTeam === round.playerTeam
  ).length;

  return {
    averageLoadoutValue: Math.round(roundStats.reduce((total, round) => total + round.loadoutValue, 0) / rounds),
    averageSpentPerRound: Math.round(roundStats.reduce((total, round) => total + round.economySpent, 0) / rounds),
    ecoRoundWins,
    forceBuyWins,
    pistolRoundWins: roundStats.filter((round) => round.roundNumber === 1 && round.winningTeam === round.playerTeam).length,
    fullBuyRoundWins,
  };
}

function calculateAbilityStats(matches: ReturnType<typeof getRecentMatches>): ValorantAbilityStats {
  const roundsPlayed = Math.max(
    matches.reduce((total, match) => total + match.roundsWon + match.roundsLost, 0),
    1,
  );
  const grenadeCasts = matches.reduce((total, match) => total + match.firstBloods + match.plants, 0);
  const ability1Casts = Math.round(roundsPlayed * 0.72);
  const ability2Casts = Math.round(roundsPlayed * 0.58);
  const ultimateCasts = Math.round(matches.length * 1.4);

  return {
    grenadeCasts,
    ability1Casts,
    ability2Casts,
    ultimateCasts,
    averageAbilitiesPerRound: Number(((grenadeCasts + ability1Casts + ability2Casts + ultimateCasts) / roundsPlayed).toFixed(2)),
    ultimateKills: Math.round(ultimateCasts * 0.65),
  };
}
