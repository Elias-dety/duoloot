import type { ValorantAgentStats, ValorantRecentMatch } from '@/types/valorant.types';
import { average, percent, round, totalShots } from './shared';

type AgentAccumulator = Omit<
  ValorantAgentStats,
  | 'winRate'
  | 'kdRatio'
  | 'kdaRatio'
  | 'averageCombatScore'
  | 'averageDamagePerRound'
  | 'headshotPercent'
  | 'isMainAgent'
> & {
  acsTotal: number;
  adrTotal: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
};

export function calculateAgentStats(matches: ValorantRecentMatch[]): ValorantAgentStats[] {
  const grouped = new Map<string, AgentAccumulator>();

  matches.forEach((match) => {
    const current = grouped.get(match.agentId) ?? {
      agent: match.agent,
      agentId: match.agentId,
      role: match.agentRole,
      imageUrl: match.agentImageUrl,
      matches: 0,
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      playtimeMillis: 0,
      acsTotal: 0,
      adrTotal: 0,
      headshots: 0,
      bodyshots: 0,
      legshots: 0,
    };

    grouped.set(match.agentId, {
      ...current,
      matches: current.matches + 1,
      wins: current.wins + (match.result === 'win' ? 1 : 0),
      losses: current.losses + (match.result === 'loss' ? 1 : 0),
      kills: current.kills + match.kills,
      deaths: current.deaths + match.deaths,
      assists: current.assists + match.assists,
      playtimeMillis: current.playtimeMillis + match.durationMillis,
      acsTotal: current.acsTotal + match.averageCombatScore,
      adrTotal: current.adrTotal + match.averageDamagePerRound,
      headshots: current.headshots + match.headshots,
      bodyshots: current.bodyshots + match.bodyshots,
      legshots: current.legshots + match.legshots,
    });
  });

  const mainAgentId = [...grouped.values()].sort((a, b) => b.matches - a.matches)[0]?.agentId;

  return [...grouped.values()]
    .map((stats) => ({
      agent: stats.agent,
      agentId: stats.agentId,
      role: stats.role,
      imageUrl: stats.imageUrl,
      matches: stats.matches,
      wins: stats.wins,
      losses: stats.losses,
      winRate: percent(stats.wins, stats.matches),
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      kdRatio: round(stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths, 2),
      kdaRatio: round(
        stats.deaths === 0 ? stats.kills + stats.assists : (stats.kills + stats.assists) / stats.deaths,
        2,
      ),
      averageCombatScore: average(stats.acsTotal, stats.matches),
      averageDamagePerRound: average(stats.adrTotal, stats.matches),
      headshotPercent: percent(
        stats.headshots,
        totalShots(stats.headshots, stats.bodyshots, stats.legshots),
      ),
      playtimeMillis: stats.playtimeMillis,
      isMainAgent: stats.agentId === mainAgentId,
    }))
    .sort((a, b) => b.matches - a.matches || b.winRate - a.winRate);
}
