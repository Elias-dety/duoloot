import type { GameRankTheme, GetGameRankThemeParams, GameRankThemeResolver, SupportedGameId } from './types';
import { getValorantRankTheme } from './games/valorantRankTheme';

const resolvers: Record<SupportedGameId, GameRankThemeResolver> = {
  valorant: getValorantRankTheme,
};

export function getGameRankTheme({ game, rank }: GetGameRankThemeParams): GameRankTheme {
  return resolvers[game](rank);
}

export function getGameRankIcon(params: GetGameRankThemeParams): string | null {
  return getGameRankTheme(params).icon;
}
