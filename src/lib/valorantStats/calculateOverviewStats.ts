import type {
  ValorantOverviewStats,
  ValorantProfile,
  ValorantRecentMatch,
} from '@/types/valorant.types';
import { average, percent, round, totalShots } from './shared';

export function calculateOverviewStats(
  matches: ValorantRecentMatch[],
  profile: ValorantProfile,
): ValorantOverviewStats {
  const matchesPlayed = matches.length;
  const wins = matches.filter((match) => match.result === 'win').length;
  const losses = matches.filter((match) => match.result === 'loss').length;
  const draws = matches.filter((match) => match.result === 'draw').length;
  const kills = sum(matches, (match) => match.kills);
  const deaths = sum(matches, (match) => match.deaths);
  const assists = sum(matches, (match) => match.assists);
  const headshots = sum(matches, (match) => match.headshots);
  const bodyshots = sum(matches, (match) => match.bodyshots);
  const legshots = sum(matches, (match) => match.legshots);
  const playtimeMillis = sum(matches, (match) => match.durationMillis);

  return {
    riotId: profile.riotId,
    currentRank: profile.currentRank,
    peakRank: profile.peakRank,
    level: profile.level,
    matchesPlayed,
    wins,
    losses,
    draws,
    winRate: percent(wins, matchesPlayed),
    kills,
    deaths,
    assists,
    kdRatio: round(deaths === 0 ? kills : kills / deaths, 2),
    kdaRatio: round(deaths === 0 ? kills + assists : (kills + assists) / deaths, 2),
    averageCombatScore: average(sum(matches, (match) => match.averageCombatScore), matchesPlayed),
    averageDamagePerRound: average(sum(matches, (match) => match.averageDamagePerRound), matchesPlayed),
    headshotPercent: percent(headshots, totalShots(headshots, bodyshots, legshots)),
    bodyshotPercent: percent(bodyshots, totalShots(headshots, bodyshots, legshots)),
    legshotPercent: percent(legshots, totalShots(headshots, bodyshots, legshots)),
    firstBloods: sum(matches, (match) => match.firstBloods),
    firstDeaths: sum(matches, (match) => match.firstDeaths),
    plants: sum(matches, (match) => match.plants),
    defuses: sum(matches, (match) => match.defuses),
    aces: sum(matches, (match) => match.aces),
    clutches: sum(matches, (match) => match.clutches),
    playtimeMillis,
    playtimeHours: round(playtimeMillis / 1000 / 60 / 60, 1),
    mainAgent: getMostFrequent(matches, (match) => match.agent),
    strongestMap: getStrongestMap(matches),
    mostUsedWeapon: getMostUsedWeapon(matches),
  };
}

function sum(matches: ValorantRecentMatch[], selector: (match: ValorantRecentMatch) => number): number {
  return matches.reduce((total, match) => total + selector(match), 0);
}

function getMostFrequent<T extends string>(
  matches: ValorantRecentMatch[],
  selector: (match: ValorantRecentMatch) => T,
): T | null {
  const counts = new Map<T, number>();
  matches.forEach((match) => {
    const value = selector(match);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function getStrongestMap(matches: ValorantRecentMatch[]): string | null {
  const grouped = new Map<string, { matches: number; wins: number }>();
  matches.forEach((match) => {
    const current = grouped.get(match.map) ?? { matches: 0, wins: 0 };
    grouped.set(match.map, {
      matches: current.matches + 1,
      wins: current.wins + (match.result === 'win' ? 1 : 0),
    });
  });

  return (
    [...grouped.entries()]
      .filter(([, stats]) => stats.matches >= 2)
      .sort((a, b) => b[1].wins / b[1].matches - a[1].wins / a[1].matches)[0]?.[0] ??
    getMostFrequent(matches, (match) => match.map)
  );
}

function getMostUsedWeapon(matches: ValorantRecentMatch[]): string | null {
  const killsByWeapon = new Map<string, number>();
  matches.forEach((match) => {
    match.weapons.forEach((weapon) => {
      killsByWeapon.set(weapon.weapon, (killsByWeapon.get(weapon.weapon) ?? 0) + weapon.kills);
    });
  });

  return [...killsByWeapon.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
