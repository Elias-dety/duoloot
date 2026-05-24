import type { ValorantRecentMatch } from '@/types/valorant.types';

export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function round(value: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function percent(numerator: number, denominator: number): number {
  return round(safeDivide(numerator, denominator) * 100, 1);
}

export function average(total: number, count: number): number {
  return round(safeDivide(total, count), 1);
}

export function sortMatchesByRecent(matches: ValorantRecentMatch[]): ValorantRecentMatch[] {
  return [...matches].sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
}

export function totalShots(headshots: number, bodyshots: number, legshots: number): number {
  return headshots + bodyshots + legshots;
}

export function matchPerformanceScore(match: ValorantRecentMatch): number {
  const resultBonus = match.result === 'win' ? 35 : match.result === 'draw' ? 10 : 0;
  return match.averageCombatScore + match.kdRatio * 45 + match.firstBloods * 8 + resultBonus;
}
