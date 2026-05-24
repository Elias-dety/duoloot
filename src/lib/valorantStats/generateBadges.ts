import type { ValorantBadge, ValorantStatsBundle } from '@/types/valorant.types';

export function generateBadges(stats: ValorantStatsBundle): ValorantBadge[] {
  const badges: ValorantBadge[] = [];
  const mainAgent = stats.agentStats.find((agent) => agent.isMainAgent);
  const mainWeapon = stats.weaponStats[0];
  const bestMap = stats.mapStats[0];

  if (stats.overviewStats.headshotPercent >= 25) {
    badges.push({
      id: 'head-hunter',
      label: 'Head Hunter',
      description: 'HS% acima de 25% na amostra analisada.',
      rarity: stats.overviewStats.headshotPercent >= 32 ? 'epic' : 'rare',
      icon: 'crosshair',
    });
  }

  if (stats.overviewStats.clutches >= 10) {
    badges.push({
      id: 'clutch-master',
      label: 'Clutch Master',
      description: 'Converte muitos rounds de clutch.',
      rarity: stats.overviewStats.clutches >= 18 ? 'legendary' : 'epic',
      icon: 'shield-check',
    });
  }

  if (stats.overviewStats.firstBloods >= 20) {
    badges.push({
      id: 'entry-king',
      label: 'Entry King',
      description: 'Abre muitos rounds com first blood.',
      rarity: stats.overviewStats.firstBloods >= 35 ? 'legendary' : 'epic',
      icon: 'sword',
    });
  }

  if (mainWeapon?.weaponId === 'vandal') {
    badges.push({
      id: 'vandal-specialist',
      label: 'Vandal Specialist',
      description: 'Vandal e a principal fonte de abates.',
      rarity: 'rare',
      icon: 'rifle',
    });
  }

  if (mainAgent?.role === 'Duelist') {
    badges.push({
      id: 'duelist-main',
      label: 'Duelist Main',
      description: 'Maioria das partidas jogada como duelista.',
      rarity: 'common',
      icon: 'zap',
    });
  }

  if (stats.trendStats.lastMatchesWinRate >= 60 && stats.overviewStats.kdRatio >= 1.1) {
    badges.push({
      id: 'consistent-player',
      label: 'Consistent Player',
      description: 'Boa taxa de vitoria recente com K/D positivo.',
      rarity: 'rare',
      icon: 'activity',
    });
  }

  if (stats.overviewStats.plants + stats.overviewStats.clutches >= 28) {
    badges.push({
      id: 'spike-hero',
      label: 'Spike Hero',
      description: 'Impacto alto em bomba e rounds decisivos.',
      rarity: 'rare',
      icon: 'target',
    });
  }

  if (bestMap && bestMap.winRate >= 70 && bestMap.matches >= 3) {
    badges.push({
      id: 'map-dominator',
      label: 'Map Dominator',
      description: `Win rate muito forte em ${bestMap.map}.`,
      rarity: 'epic',
      icon: 'map',
    });
  }

  if (stats.weaponStats.some((weapon) => weapon.weaponId === 'sheriff' && weapon.headshotPercent >= 35)) {
    badges.push({
      id: 'sheriff-demon',
      label: 'Sheriff Demon',
      description: 'Sheriff com HS% elevado.',
      rarity: 'epic',
      icon: 'badge',
    });
  }

  if (badges.length === 0) {
    badges.push({
      id: 'rank-grinder',
      label: 'Rank Grinder',
      description: 'Historico competitivo ativo na amostra mockada.',
      rarity: 'common',
      icon: 'ranking',
    });
  }

  return badges;
}
