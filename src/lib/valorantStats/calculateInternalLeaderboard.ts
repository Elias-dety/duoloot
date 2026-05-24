import type { ValorantInternalLeaderboardEntry, ValorantMockUser } from '@/types/valorant.types';
import { round } from './shared';

export function calculateInternalLeaderboard(
  users: ValorantMockUser[],
): ValorantInternalLeaderboardEntry[] {
  return users
    .map((user) => {
      const clutchScore = user.overviewStats.clutches * 4 + user.overviewStats.aces * 10;
      const consistencyScore = user.matchmakingProfile.consistencyScore;
      const duoLootScore = round(
        user.overviewStats.winRate * 0.25 +
          user.overviewStats.kdRatio * 20 +
          user.overviewStats.averageCombatScore * 0.15 +
          user.overviewStats.headshotPercent * 0.5 +
          clutchScore * 0.2 +
          consistencyScore * 0.2,
        1,
      );

      return {
        userId: user.id,
        riotId: user.profile.riotId,
        rank: user.profile.currentRank,
        winRate: user.overviewStats.winRate,
        kdRatio: user.overviewStats.kdRatio,
        averageCombatScore: user.overviewStats.averageCombatScore,
        headshotPercent: user.overviewStats.headshotPercent,
        clutchScore,
        consistencyScore,
        duoLootScore,
        position: 0,
      };
    })
    .sort((a, b) => b.duoLootScore - a.duoLootScore || b.rank.order - a.rank.order)
    .map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
}
