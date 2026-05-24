import type { ValorantMapStats, ValorantRecentMatch } from '@/types/valorant.types';
import { average, percent, round } from './shared';

type MapAccumulator = Omit<
  ValorantMapStats,
  | 'winRate'
  | 'attackWinRate'
  | 'defenseWinRate'
  | 'bestAgent'
  | 'worstAgent'
  | 'averageCombatScore'
  | 'averageDamagePerRound'
  | 'kdRatio'
> & {
  acsTotal: number;
  adrTotal: number;
  kills: number;
  deaths: number;
  agents: Map<string, { matches: number; wins: number }>;
};

export function calculateMapStats(matches: ValorantRecentMatch[]): ValorantMapStats[] {
  const grouped = new Map<string, MapAccumulator>();

  matches.forEach((match) => {
    const current = grouped.get(match.mapId) ?? {
      map: match.map,
      mapId: match.mapId,
      imageUrl: match.mapImageUrl,
      matches: 0,
      wins: 0,
      losses: 0,
      attackRoundsWon: 0,
      attackRoundsLost: 0,
      defenseRoundsWon: 0,
      defenseRoundsLost: 0,
      acsTotal: 0,
      adrTotal: 0,
      kills: 0,
      deaths: 0,
      agents: new Map<string, { matches: number; wins: number }>(),
    };

    const agentStats = current.agents.get(match.agent) ?? { matches: 0, wins: 0 };
    current.agents.set(match.agent, {
      matches: agentStats.matches + 1,
      wins: agentStats.wins + (match.result === 'win' ? 1 : 0),
    });

    grouped.set(match.mapId, {
      ...current,
      matches: current.matches + 1,
      wins: current.wins + (match.result === 'win' ? 1 : 0),
      losses: current.losses + (match.result === 'loss' ? 1 : 0),
      attackRoundsWon: current.attackRoundsWon + match.attack.won,
      attackRoundsLost: current.attackRoundsLost + match.attack.lost,
      defenseRoundsWon: current.defenseRoundsWon + match.defense.won,
      defenseRoundsLost: current.defenseRoundsLost + match.defense.lost,
      acsTotal: current.acsTotal + match.averageCombatScore,
      adrTotal: current.adrTotal + match.averageDamagePerRound,
      kills: current.kills + match.kills,
      deaths: current.deaths + match.deaths,
      agents: current.agents,
    });
  });

  return [...grouped.values()]
    .map((stats) => {
      const agentsByWinRate = [...stats.agents.entries()].sort((a, b) => {
        const winRateDelta = b[1].wins / b[1].matches - a[1].wins / a[1].matches;
        return winRateDelta || b[1].matches - a[1].matches;
      });

      return {
        map: stats.map,
        mapId: stats.mapId,
        imageUrl: stats.imageUrl,
        matches: stats.matches,
        wins: stats.wins,
        losses: stats.losses,
        winRate: percent(stats.wins, stats.matches),
        attackRoundsWon: stats.attackRoundsWon,
        attackRoundsLost: stats.attackRoundsLost,
        attackWinRate: percent(stats.attackRoundsWon, stats.attackRoundsWon + stats.attackRoundsLost),
        defenseRoundsWon: stats.defenseRoundsWon,
        defenseRoundsLost: stats.defenseRoundsLost,
        defenseWinRate: percent(stats.defenseRoundsWon, stats.defenseRoundsWon + stats.defenseRoundsLost),
        bestAgent: agentsByWinRate[0]?.[0] ?? 'Unknown',
        worstAgent: agentsByWinRate.at(-1)?.[0] ?? 'Unknown',
        averageCombatScore: average(stats.acsTotal, stats.matches),
        averageDamagePerRound: average(stats.adrTotal, stats.matches),
        kdRatio: round(stats.deaths === 0 ? stats.kills : stats.kills / stats.deaths, 2),
      };
    })
    .sort((a, b) => b.winRate - a.winRate || b.matches - a.matches);
}
