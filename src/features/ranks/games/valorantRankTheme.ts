import type { GameRankTheme, RankColorTemperature, RankDivision } from '../types';

export const VALORANT_RANK_ASSET_PATH = '/assets/games/valorant/ranks';
export const LEGACY_VALORANT_RANK_ASSET_PATH = '/assets/badges/elos';

const RANK_TRANSLATIONS: Record<string, string> = {
  iron: 'ferro',
  ferro: 'ferro',
  bronze: 'bronze',
  silver: 'prata',
  prata: 'prata',
  gold: 'ouro',
  ouro: 'ouro',
  platinum: 'platina',
  platina: 'platina',
  diamond: 'diamante',
  diamante: 'diamante',
  ascendant: 'ascendente',
  ascendente: 'ascendente',
  immortal: 'imortal',
  imortal: 'imortal',
  radiant: 'radiante',
  radiante: 'radiante',
};

const RANK_LABELS: Record<string, string> = {
  ferro: 'Ferro',
  bronze: 'Bronze',
  prata: 'Prata',
  ouro: 'Ouro',
  platina: 'Platina',
  diamante: 'Diamante',
  ascendente: 'Ascendente',
  imortal: 'Imortal',
  radiante: 'Radiante',
  unranked: 'Sem rank',
};

type TierPalette = {
  primary: [string, string, string];
  secondary: string;
  accent: [string, string, string];
  text: [string, string, string];
};

const TIER_PALETTES: Record<string, TierPalette> = {
  ferro: {
    primary: ['#515866', '#68717f', '#858f9d'],
    secondary: '#252a33',
    accent: ['#7a8494', '#9aa4b3', '#c0c8d4'],
    text: ['#c2c8d2', '#d5dbe5', '#f1f4f8'],
  },
  bronze: {
    primary: ['#8a4f2a', '#b87333', '#d58a45'],
    secondary: '#3a2418',
    accent: ['#bd7a48', '#d89558', '#ffb36d'],
    text: ['#f2d3bd', '#ffe0c7', '#fff0df'],
  },
  prata: {
    primary: ['#8e99a8', '#b0bccb', '#d7e0ec'],
    secondary: '#39424f',
    accent: ['#b2bdca', '#d1d9e4', '#ffffff'],
    text: ['#dce3ec', '#eef3f8', '#ffffff'],
  },
  ouro: {
    primary: ['#b98922', '#e0ad2f', '#ffd166'],
    secondary: '#4a3511',
    accent: ['#dfb84d', '#ffd166', '#fff0a3'],
    text: ['#ffe8a8', '#fff0ba', '#fff8d9'],
  },
  platina: {
    primary: ['#38bdf8', '#5eead4', '#67e8f9'],
    secondary: '#0f766e',
    accent: ['#7dd3fc', '#99f6e4', '#cffafe'],
    text: ['#d9f4ff', '#ccfbf1', '#ecfeff'],
  },
  diamante: {
    primary: ['#60a5fa', '#7dd3fc', '#bfdbfe'],
    secondary: '#1e3a8a',
    accent: ['#93c5fd', '#bae6fd', '#ffffff'],
    text: ['#dbeafe', '#e0f2fe', '#ffffff'],
  },
  ascendente: {
    primary: ['#22c55e', '#34d399', '#6ee7b7'],
    secondary: '#14532d',
    accent: ['#86efac', '#a7f3d0', '#ecfdf5'],
    text: ['#dcfce7', '#d1fae5', '#f0fdf4'],
  },
  imortal: {
    primary: ['#e11d48', '#f43f5e', '#ff5c8a'],
    secondary: '#881337',
    accent: ['#fb7185', '#fda4af', '#f0abfc'],
    text: ['#ffe4e6', '#fff1f2', '#fff1f8'],
  },
};

const UNRANKED_COLORS: RankColorTemperature = {
  primary: '#8b95a5',
  secondary: '#303642',
  accent: '#c4ccd8',
  border: 'rgba(139, 149, 165, 0.28)',
  background: 'rgba(139, 149, 165, 0.08)',
  glow: 'rgba(139, 149, 165, 0.16)',
  text: '#d8dee8',
};

const RADIANT_COLORS: RankColorTemperature = {
  primary: '#fff7ad',
  secondary: '#b45309',
  accent: '#ffffff',
  border: 'rgba(255, 247, 173, 0.82)',
  background: 'rgba(255, 247, 173, 0.18)',
  glow: 'rgba(255, 247, 173, 0.72)',
  text: '#fffbe6',
};

const COLOR_ALPHA_BY_DIVISION: Record<1 | 2 | 3, { border: number; background: number; glow: number }> = {
  1: { border: 0.38, background: 0.11, glow: 0.26 },
  2: { border: 0.52, background: 0.16, glow: 0.42 },
  3: { border: 0.70, background: 0.22, glow: 0.60 },
};

export function normalizeRank(rank: string) {
  return rank
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');
}

function hexToRgb(hex: string) {
  const normalizedHex = hex.replace('#', '');
  const value = Number.parseInt(normalizedHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildColors(tier: string, division: RankDivision): RankColorTemperature {
  if (tier === 'radiante') return RADIANT_COLORS;
  if (tier === 'unranked' || !division) return UNRANKED_COLORS;

  const palette = TIER_PALETTES[tier];
  if (!palette) return UNRANKED_COLORS;

  const index = division - 1;
  const primary = palette.primary[index];
  const alpha = COLOR_ALPHA_BY_DIVISION[division];

  return {
    primary,
    secondary: palette.secondary,
    accent: palette.accent[index],
    border: rgba(primary, alpha.border),
    background: rgba(primary, alpha.background),
    glow: rgba(primary, alpha.glow),
    text: palette.text[index],
  };
}

function buildIconPath(basePath: string, tier: string, division: RankDivision) {
  if (tier === 'radiante') return `${basePath}/radiante.png`;
  if (!division || tier === 'unranked') return null;

  return `${basePath}/${tier}-${division}.png`;
}

function buildTheme(tier: string, division: RankDivision, normalizedRank: string): GameRankTheme {
  const isUnranked = tier === 'unranked';
  const label = isUnranked
    ? RANK_LABELS.unranked
    : tier === 'radiante'
      ? RANK_LABELS.radiante
      : `${RANK_LABELS[tier] || tier} ${division || 1}`;

  return {
    game: 'valorant',
    tier,
    division,
    label,
    normalizedRank,
    icon: buildIconPath(VALORANT_RANK_ASSET_PATH, tier, division),
    fallbackIcon: buildIconPath(LEGACY_VALORANT_RANK_ASSET_PATH, tier, division),
    colors: buildColors(tier, division),
    isUnranked,
  };
}

export function getValorantRankTheme(rank?: string | null): GameRankTheme {
  if (!rank) return buildTheme('unranked', null, '');

  const normalizedRank = normalizeRank(rank);

  if (!normalizedRank || normalizedRank === 'unranked' || normalizedRank === 'sem rank') {
    return buildTheme('unranked', null, normalizedRank);
  }

  if (normalizedRank.includes('radiant') || normalizedRank.includes('radiante')) {
    return buildTheme('radiante', null, normalizedRank);
  }

  const rankMatch = normalizedRank.match(
    /(iron|ferro|bronze|silver|prata|gold|ouro|platinum|platina|diamond|diamante|ascendant|ascendente|immortal|imortal)\s*([123])?/,
  );

  if (!rankMatch) return buildTheme('unranked', null, normalizedRank);

  const [, rawTier, rawDivision] = rankMatch;
  const tier = RANK_TRANSLATIONS[rawTier] || 'unranked';
  const division = (Number(rawDivision || 1) as 1 | 2 | 3);

  return buildTheme(tier, division, normalizedRank);
}

export function getValorantRankIcon(rank?: string | null): string | null {
  const theme = getValorantRankTheme(rank);
  return theme.icon || theme.fallbackIcon || null;
}
