import type { ValorantRecentMatch, ValorantTrendStats } from '@/types/valorant.types';
import { average, matchPerformanceScore, percent, round, sortMatchesByRecent, totalShots } from './shared';

export function calculateTrends(matches: ValorantRecentMatch[], limit = 20): ValorantTrendStats {
  const recentMatches = sortMatchesByRecent(matches).slice(0, limit);
  const lastMatchesCount = recentMatches.length;
  const lastMatchesWins = recentMatches.filter((match) => match.result === 'win').length;
  const lastMatchesLosses = recentMatches.filter((match) => match.result === 'loss').length;
  const kills = recentMatches.reduce((total, match) => total + match.kills, 0);
  const deaths = recentMatches.reduce((total, match) => total + match.deaths, 0);
  const headshots = recentMatches.reduce((total, match) => total + match.headshots, 0);
  const bodyshots = recentMatches.reduce((total, match) => total + match.bodyshots, 0);
  const legshots = recentMatches.reduce((total, match) => total + match.legshots, 0);
  const byPerformance = [...recentMatches].sort(
    (a, b) => matchPerformanceScore(b) - matchPerformanceScore(a),
  );

  return {
    lastMatchesCount,
    lastMatchesWins,
    lastMatchesLosses,
    lastMatchesWinRate: percent(lastMatchesWins, lastMatchesCount),
    lastMatchesKd: round(deaths === 0 ? kills : kills / deaths, 2),
    lastMatchesAcs: average(
      recentMatches.reduce((total, match) => total + match.averageCombatScore, 0),
      lastMatchesCount,
    ),
    lastMatchesAdr: average(
      recentMatches.reduce((total, match) => total + match.averageDamagePerRound, 0),
      lastMatchesCount,
    ),
    lastMatchesHsPercent: percent(headshots, totalShots(headshots, bodyshots, legshots)),
    currentWinStreak: getCurrentStreak(recentMatches, 'win'),
    currentLoseStreak: getCurrentStreak(recentMatches, 'loss'),
    bestWinStreak: getBestWinStreak(recentMatches),
    bestRecentMatchId: byPerformance[0]?.matchId ?? null,
    worstRecentMatchId: byPerformance.at(-1)?.matchId ?? null,
    rrTrend: recentMatches.reduce((total, match) => total + match.rrChange, 0),
  };
}

function getCurrentStreak(matches: ValorantRecentMatch[], result: 'win' | 'loss'): number {
  let streak = 0;

  for (const match of matches) {
    if (match.result !== result) {
      break;
    }
    streak += 1;
  }

  return streak;
}

function getBestWinStreak(matches: ValorantRecentMatch[]): number {
  let best = 0;
  let current = 0;

  [...matches].reverse().forEach((match) => {
    if (match.result === 'win') {
      current += 1;
      best = Math.max(best, current);
      return;
    }

    current = 0;
  });

  return best;
}
