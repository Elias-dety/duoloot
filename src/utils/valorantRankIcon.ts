const ELO_BADGES_BASE_PATH = '/assets/badges/elos';

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

function normalizeRank(rank: string) {
  return rank
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');
}

export function getValorantRankIcon(rank?: string | null): string | null {
  if (!rank) return null;

  const normalizedRank = normalizeRank(rank);

  if (!normalizedRank || normalizedRank === 'unranked' || normalizedRank === 'sem rank') {
    return null;
  }

  if (normalizedRank.includes('radiant') || normalizedRank.includes('radiante')) {
    return `${ELO_BADGES_BASE_PATH}/radiante.png`;
  }

  const rankMatch = normalizedRank.match(
    /(iron|ferro|bronze|silver|prata|gold|ouro|platinum|platina|diamond|diamante|ascendant|ascendente|immortal|imortal)\s*([123])?/,
  );

  if (!rankMatch) return null;

  const [, tier, division] = rankMatch;
  const translatedTier = RANK_TRANSLATIONS[tier];

  if (!translatedTier) return null;

  return `${ELO_BADGES_BASE_PATH}/${translatedTier}-${division || '1'}.png`;
}
