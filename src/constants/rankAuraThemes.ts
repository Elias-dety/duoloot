export interface RankAuraTierTheme {
  icon: string;
  accent: string;
  accentSoft: string;
  glow: string;
  metal: string;
  surfaceTint: string;
  tierPower: number;
}

export interface RankAuraTheme {
  label: string;
  iconBasePath: string;
  tiers: Record<string | number, RankAuraTierTheme>;
}

// Fallback utility to generate tiers automatically if not fully typed
const generateTiers = (elo: string, accent: string, glowBase: string, metal: string) => {
  return {
    1: {
      icon: `/assets/badges/elos/${elo}-1.png`,
      accent,
      accentSoft: accent,
      glow: `rgba(${glowBase}, 0.45)`,
      metal,
      surfaceTint: `rgba(${glowBase}, 0.13)`,
      tierPower: 0.25,
    },
    2: {
      icon: `/assets/badges/elos/${elo}-2.png`,
      accent,
      accentSoft: accent,
      glow: `rgba(${glowBase}, 0.58)`,
      metal,
      surfaceTint: `rgba(${glowBase}, 0.22)`,
      tierPower: 0.55,
    },
    3: {
      icon: `/assets/badges/elos/${elo}-3.png`,
      accent,
      accentSoft: accent,
      glow: `rgba(${glowBase}, 0.72)`,
      metal,
      surfaceTint: `rgba(${glowBase}, 0.34)`,
      tierPower: 0.85,
    },
  };
};

export const rankAuraThemes: Record<string, RankAuraTheme> = {
  ferro: {
    label: 'Ferro',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('ferro', '#a19d94', '161, 157, 148', '#858585'),
  },
  bronze: {
    label: 'Bronze',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('bronze', '#cd7f32', '205, 127, 50', '#a36325'),
  },
  prata: {
    label: 'Prata',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('prata', '#c0c0c0', '192, 192, 192', '#e4e9f2'),
  },
  ouro: {
    label: 'Ouro',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('ouro', '#ffd700', '255, 215, 0', '#e5c100'),
  },
  platina: {
    label: 'Platina',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('platina', '#0df0ff', '13, 240, 255', '#d8dde6'),
  },
  diamante: {
    label: 'Diamante',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('diamante', '#b9aaff', '185, 170, 255', '#e4e9f2'),
  },
  ascendente: {
    label: 'Ascendente',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('ascendente', '#50a373', '80, 163, 115', '#b3d9c4'),
  },
  imortal: {
    label: 'Imortal',
    iconBasePath: '/assets/badges/elos/',
    tiers: generateTiers('imortal', '#ff4655', '255, 70, 85', '#ff9999'),
  },
  radiante: {
    label: 'Radiante',
    iconBasePath: '/assets/badges/elos/',
    tiers: {
      legend: {
        icon: '/assets/badges/elos/radiante.png',
        accent: '#fffeb8',
        accentSoft: '#ffffff',
        glow: 'rgba(255, 254, 184, 0.8)',
        metal: '#fffeb8',
        surfaceTint: 'rgba(255, 254, 184, 0.4)',
        tierPower: 1,
      } as RankAuraTierTheme
    }
  }
};

export const getRankAuraTheme = (eloName: string, tier: number | string = 1): RankAuraTierTheme => {
  const normalizedElo = eloName.toLowerCase().trim().replace(/[^a-z]/g, '');
  const theme = rankAuraThemes[normalizedElo] || rankAuraThemes['ferro'];
  
  if (normalizedElo === 'radiante') {
    return theme.tiers['legend'] as RankAuraTierTheme;
  }
  
  const numericTier = typeof tier === 'string' ? parseInt(tier, 10) : tier;
  const safeTier = [1, 2, 3].includes(numericTier) ? numericTier as 1 | 2 | 3 : 1;
  return theme.tiers[safeTier] as RankAuraTierTheme;
};
