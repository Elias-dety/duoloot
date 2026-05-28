export type SupportedGameId = 'valorant';

export type RankDivision = 1 | 2 | 3 | null;

export interface RankColorTemperature {
  /** Base color for text, icon accents and main highlights. */
  primary: string;
  /** Darker or supporting color for gradients and secondary UI accents. */
  secondary: string;
  /** Extra highlight used for small details and hover states. */
  accent: string;
  /** Border color already prepared as CSS rgba/hex. */
  border: string;
  /** Soft panel background already prepared as CSS rgba/hex. */
  background: string;
  /** Glow color already prepared as CSS rgba/hex. */
  glow: string;
  /** Recommended readable text color over the rank background. */
  text: string;
}

export interface GameRankTheme {
  game: SupportedGameId;
  tier: string;
  division: RankDivision;
  label: string;
  normalizedRank: string;
  icon: string | null;
  colors: RankColorTemperature;
  isUnranked: boolean;
}

export interface GetGameRankThemeParams {
  game: SupportedGameId;
  rank?: string | null;
}

export type GameRankThemeResolver = (rank?: string | null) => GameRankTheme;
