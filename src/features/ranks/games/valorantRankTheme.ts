import type { GameRankTheme, RankColorTemperature, RankDivision } from '../types';

const LEGACY_VALORANT_RANK_ASSET_PATH = '/assets/badges/elos';
export const VALORANT_RANK_ASSET_PATH = LEGACY_VALORANT_RANK_ASSET_PATH;

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

const UNRANKED_COLORS: RankColorTemperature = {
  primary: '#8b95a5',
  secondary: '#303642',
  accent: '#c4ccd8',
  border: 'rgba(139, 149, 165, 0.28)',
  background: 'rgba(139, 149, 165, 0.08)',
  glow: 'rgba(139, 149, 165, 0.16)',
  text: '#d8dee8',
};

const RANK_COLORS: Record<string, Record<1 | 2 | 3, RankColorTemperature>> = {
  ferro: {
    1: {
      primary: '#515866',
      secondary: '#252a33',
      accent: '#7a8494',
      border: 'rgba(81, 88, 102, 0.34)',
      background: 'rgba(81, 88, 102, 0.10)',
      glow: 'rgba(81, 88, 102, 0.18)',
      text: '#c2c8d2',
    },
    2: {
      primary: '#68717f',
      secondary: '#303743',
      accent: '#9aa4b3',
      border: 'rgba(104, 113, 127, 0.44)',
      background: 'rgba(104, 113, 127, 0.13)',
      glow: 'rgba(104, 113, 127, 0.28)',
      text: '#d5dbe5',
    },
    3: {
      primary: '#858f9d',
      secondary: '#3d4652',
      accent: '#c0c8d4',
      border: 'rgba(133, 143, 157, 0.58)',
      background: 'rgba(133, 143, 157, 0.17)',
      glow: 'rgba(133, 143, 157, 0.40)',
      text: '#f1f4f8',
    },
  },
  bronze: {
    1: {
      primary: '#8a4f2a',
      secondary: '#3a2418',
      accent: '#bd7a48',
      border: 'rgba(138, 79, 42, 0.36)',
      background: 'rgba(138, 79, 42, 0.10)',
      glow: 'rgba(138, 79, 42, 0.22)',
      text: '#f2d3bd',
    },
    2: {
      primary: '#b87333',
      secondary: '#4a2d1b',
      accent: '#d89558',
      border: 'rgba(184, 115, 51, 0.48)',
      background: 'rgba(184, 115, 51, 0.14)',
      glow: 'rgba(184, 115, 51, 0.34)',
      text: '#ffe0c7',
    },
    3: {
      primary: '#d58a45',
      secondary: '#5c351d',
      accent: '#ffb36d',
      border: 'rgba(213, 138, 69, 0.64)',
      background: 'rgba(213, 138, 69, 0.19)',
      glow: 'rgba(213, 138, 69, 0.50)',
      text: '#fff0df',
    },
  },
  prata: {
    1: {
      primary: '#8e99a8',
      secondary: '#39424f',
      accent: '#b2bdca',
      border: 'rgba(142, 153, 168, 0.36)',
      background: 'rgba(142, 153, 168, 0.10)',
      glow: 'rgba(142, 153, 168, 0.22)',
      text: '#dce3ec',
    },
    2: {
      primary: '#b0bccb',
      secondary: '#4a5665',
      accent: '#d1d9e4',
      border: 'rgba(176, 188, 203, 0.48)',
      background: 'rgba(176, 188, 203, 0.14)',
      glow: 'rgba(176, 188, 203, 0.34)',
      text: '#eef3f8',
    },
    3: {
      primary: '#d7e0ec',
      secondary: '#667181',
      accent: '#ffffff',
      border: 'rgba(215, 224, 236, 0.64)',
      background: 'rgba(215, 224, 236, 0.18)',
      glow: 'rgba(215, 224, 236, 0.48)',
      text: '#ffffff',
    },
  },
  ouro: {
    1: {
      primary: '#b98922',
      secondary: '#4a3511',
      accent: '#dfb84d',
      border: 'rgba(185, 137, 34, 0.38)',
      background: 'rgba(185, 137, 34, 0.11)',
      glow: 'rgba(185, 137, 34, 0.24)',
      text: '#ffe8a8',
    },
    2: {
      primary: '#e0ad2f',
      secondary: '#624817',
      accent: '#ffd166',
      border: 'rgba(224, 173, 47, 0.52)',
      background: 'rgba(224, 173, 47, 0.15)',
      glow: 'rgba(224, 173, 47, 0.38)',
      text: '#fff0ba',
    },
    3: {
      primary: '#ffd166',
      secondary: '#815d18',
      accent: '#fff0a3',
      border: 'rgba(255, 209, 102, 0.70)',
      background: 'rgba(255, 209, 102, 0.20)',
      glow: 'rgba(255, 209, 102, 0.56)',
      text: '#fff8d9',
    },
  },
  platina: {
    1: {
      primary: '#38bdf8',
      secondary: '#0f4d68',
      accent: '#7dd3fc',
      border: 'rgba(56, 189, 248, 0.38)',
      background: 'rgba(56, 189, 248, 0.10)',
      glow: 'rgba(56, 189, 248, 0.24)',
      text: '#d9f4ff',
    },
    2: {
      primary: '#5eead4',
      secondary: '#0f766e',
      accent: '#99f6e4',
      border: 'rgba(94, 234, 212, 0.52)',
      background: 'rgba(20, 184, 166, 0.15)',
      glow: 'rgba(94, 234, 212, 0.40)',
      text: '#ccfbf1',
    },
    3: {
      primary: '#67e8f9',
      secondary: '#0891b2',
      accent: '#cffafe',
      border: 'rgba(103, 232, 249, 0.70)',
      background: 'rgba(103, 232, 249, 0.20)',
      glow: 'rgba(103, 232, 249, 0.58)',
      text: '#ecfeff',
    },
  },
  diamante: {
    1: {
      primary: '#60a5fa',
      secondary: '#1e3a8a',
      accent: '#93c5fd',
      border: 'rgba(96, 165, 250, 0.40)',
      background: 'rgba(96, 165, 250, 0.11)',
      glow: 'rgba(96, 165, 250, 0.26)',
      text: '#dbeafe',
    },
    2: {
      primary: '#7dd3fc',
      secondary: '#075985',
      accent: '#bae6fd',
      border: 'rgba(125, 211, 252, 0.54)',
      background: 'rgba(125, 211, 252, 0.16)',
      glow: 'rgba(125, 211, 252, 0.42)',
      text: '#e0f2fe',
    },
    3: {
      primary: '#bfdbfe',
      secondary: '#2563eb',
      accent: '#ffffff',
      border: 'rgba(191, 219, 254, 0.74)',
      background: 'rgba(147, 197, 253, 0.22)',
      glow: 'rgba(191, 219, 254, 0.62)',
      text: '#ffffff',
    },
  },
  ascendente: {
    1: {
      primary: '#22c55e',
      secondary: '#14532d',
      accent: '#86efac',
      border: 'rgba(34, 197, 94, 0.40)',
      background: 'rgba(34, 197, 94, 0.11)',
      glow: 'rgba(34, 197, 94, 0.26)',
      text: '#dcfce7',
    },
    2: {
      primary: '#34d399',
      secondary: '#065f46',
      accent: '#a7f3d0',
      border: 'rgba(52, 211, 153, 0.54)',
      background: 'rgba(52, 211, 153, 0.16)',
      glow: 'rgba(52, 211, 153, 0.42)',
      text: '#d1fae5',
    },
    3: {
      primary: '#6ee7b7',
      secondary: '#047857',
      accent: '#ecfdf5',
      border: 'rgba(110, 231, 183, 0.72)',
      background: 'rgba(110, 231, 183, 0.22)',
      glow: 'rgba(110, 231, 183, 0.60)',
      text: '#f0fdf4',
    },
  },
  imortal: {
    1: {
      primary: '#e11d48',
      secondary: '#5b1024',
      accent: '#fb7185',
      border: 'rgba(225, 29, 72, 0.42)',
      background: 'rgba(225, 29, 72, 0.12)',
      glow: 'rgba(225, 29, 72, 0.30)',
      text: '#ffe4e6',
    },
    2: {
      primary: '#f43f5e',
      secondary: '#881337',
      accent: '#fda4af',
      border: 'rgba(244, 63, 94, 0.58)',
      background: 'rgba(244, 63, 94, 0.17)',
      glow: 'rgba(244, 63, 94, 0.48)',
      text: '#fff1f2',
    },
    3: {
      primary: '#ff5c8a',
      secondary: '#a21caf',
      accent: '#f0abfc',
      border: 'rgba(255, 92, 138, 0.76)',
      background: 'rgba(255, 92, 138, 0.22)',
      glow: 'rgba(255, 92, 138, 0.66)',
      text: '#fff1f8',
    },
  },
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

function buildIconPath(tier: string, division: RankDivision) {
  if (tier === 'radiante') return `${VALORANT_RANK_ASSET_PATH}/radiante.png`;
  if (!division) return null;

  return `${VALORANT_RANK_ASSET_PATH}/${tier}-${division}.png`;
}

function buildTheme(tier: string, division: RankDivision, normalizedRank: string): GameRankTheme {
  const isUnranked = tier === 'unranked';
  const colors = tier === 'radiante'
    ? RADIANT_COLORS
    : isUnranked
      ? UNRANKED_COLORS
      : RANK_COLORS[tier]?.[division || 1] || UNRANKED_COLORS;

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
    icon: buildIconPath(tier, division),
    colors,
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
  return getValorantRankTheme(rank).icon;
}
