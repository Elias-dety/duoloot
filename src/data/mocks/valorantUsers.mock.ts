import type {
  ValorantMatchmakingProfile,
  ValorantMockUser,
  ValorantProfile,
  ValorantStatsBundle,
} from '@/types/valorant.types';
import { calculateAgentStats } from '@/lib/valorantStats/calculateAgentStats';
import { calculateMapStats } from '@/lib/valorantStats/calculateMapStats';
import { calculateOverviewStats } from '@/lib/valorantStats/calculateOverviewStats';
import { calculateTrends } from '@/lib/valorantStats/calculateTrends';
import { calculateWeaponStats } from '@/lib/valorantStats/calculateWeaponStats';
import { generateBadges } from '@/lib/valorantStats/generateBadges';
import { generateValorantInsights } from '@/lib/valorantStats/generateInsights';
import { getRecentMatches, mockRanks } from './valorantMatches.mock';

type BaseValorantUser = {
  id: string;
  profile: ValorantProfile;
  matchmakingProfile: ValorantMatchmakingProfile;
};

const baseValorantUsers: BaseValorantUser[] = [
  {
    id: 'user-bronze-rafa',
    profile: {
      userId: 'user-bronze-rafa',
      riotId: 'RafaTreino#BR1',
      gameName: 'RafaTreino',
      tagLine: 'BR1',
      region: 'americas',
      platform: 'br',
      level: 58,
      avatarUrl: '/assets/valorant/avatars/rafa.png',
      currentRank: mockRanks.bronze2,
      peakRank: mockRanks.silver1,
    },
    matchmakingProfile: {
      userId: 'user-bronze-rafa',
      primaryRole: 'Sentinel',
      secondaryRole: 'Initiator',
      playStyle: 'supportive',
      communicationStyle: 'balanced',
      preferredMaps: ['Ascent', 'Haven', 'Lotus'],
      preferredAgents: ['Sage', 'Sova'],
      aggressionScore: 38,
      reliabilityScore: 72,
      consistencyScore: 64,
      toxicityScore: 12,
    },
  },
  {
    id: 'user-gold-luna',
    profile: {
      userId: 'user-gold-luna',
      riotId: 'LunaRecon#DUO',
      gameName: 'LunaRecon',
      tagLine: 'DUO',
      region: 'americas',
      platform: 'br',
      level: 143,
      avatarUrl: '/assets/valorant/avatars/luna.png',
      currentRank: mockRanks.gold3,
      peakRank: mockRanks.platinum1,
    },
    matchmakingProfile: {
      userId: 'user-gold-luna',
      primaryRole: 'Initiator',
      secondaryRole: 'Sentinel',
      playStyle: 'balanced',
      communicationStyle: 'shotcaller',
      preferredMaps: ['Ascent', 'Haven', 'Bind'],
      preferredAgents: ['Sova', 'Skye'],
      aggressionScore: 58,
      reliabilityScore: 86,
      consistencyScore: 79,
      toxicityScore: 18,
    },
  },
  {
    id: 'user-diamond-kai',
    profile: {
      userId: 'user-diamond-kai',
      riotId: 'KaiSmoke#CTRL',
      gameName: 'KaiSmoke',
      tagLine: 'CTRL',
      region: 'americas',
      platform: 'br',
      level: 221,
      avatarUrl: '/assets/valorant/avatars/kai.png',
      currentRank: mockRanks.diamond2,
      peakRank: mockRanks.ascendant1,
    },
    matchmakingProfile: {
      userId: 'user-diamond-kai',
      primaryRole: 'Controller',
      secondaryRole: 'Sentinel',
      playStyle: 'supportive',
      communicationStyle: 'balanced',
      preferredMaps: ['Bind', 'Ascent', 'Split'],
      preferredAgents: ['Omen', 'Killjoy'],
      aggressionScore: 46,
      reliabilityScore: 91,
      consistencyScore: 88,
      toxicityScore: 10,
    },
  },
  {
    id: 'user-immortal-nox',
    profile: {
      userId: 'user-immortal-nox',
      riotId: 'NoxEntry#IMT',
      gameName: 'NoxEntry',
      tagLine: 'IMT',
      region: 'americas',
      platform: 'br',
      level: 339,
      avatarUrl: '/assets/valorant/avatars/nox.png',
      currentRank: mockRanks.immortal2,
      peakRank: mockRanks.immortal3,
    },
    matchmakingProfile: {
      userId: 'user-immortal-nox',
      primaryRole: 'Duelist',
      secondaryRole: 'Initiator',
      playStyle: 'aggressive',
      communicationStyle: 'shotcaller',
      preferredMaps: ['Ascent', 'Haven', 'Split'],
      preferredAgents: ['Jett', 'Raze'],
      aggressionScore: 92,
      reliabilityScore: 84,
      consistencyScore: 82,
      toxicityScore: 24,
    },
  },
  {
    id: 'user-volatile-mika',
    profile: {
      userId: 'user-volatile-mika',
      riotId: 'MikaAim#CLIP',
      gameName: 'MikaAim',
      tagLine: 'CLIP',
      region: 'americas',
      platform: 'br',
      level: 118,
      avatarUrl: '/assets/valorant/avatars/mika.png',
      currentRank: mockRanks.platinum1,
      peakRank: mockRanks.diamond2,
    },
    matchmakingProfile: {
      userId: 'user-volatile-mika',
      primaryRole: 'Duelist',
      secondaryRole: 'Flex',
      playStyle: 'aggressive',
      communicationStyle: 'quiet',
      preferredMaps: ['Ascent', 'Haven', 'Sunset'],
      preferredAgents: ['Jett', 'Raze'],
      aggressionScore: 89,
      reliabilityScore: 61,
      consistencyScore: 48,
      toxicityScore: 34,
    },
  },
];

export const valorantMockUsers: ValorantMockUser[] = baseValorantUsers.map((user) => {
  const recentMatches = getRecentMatches(user.id);
  const stats: ValorantStatsBundle = {
    overviewStats: calculateOverviewStats(recentMatches, user.profile),
    agentStats: calculateAgentStats(recentMatches),
    mapStats: calculateMapStats(recentMatches),
    weaponStats: calculateWeaponStats(recentMatches),
    trendStats: calculateTrends(recentMatches),
  };

  return {
    ...user,
    recentMatches,
    ...stats,
    insights: generateValorantInsights(stats),
    badges: generateBadges(stats),
  };
});

export function getValorantMockUser(userId: string): ValorantMockUser | null {
  return valorantMockUsers.find((user) => user.id === userId) ?? null;
}
