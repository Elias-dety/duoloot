import type { ValorantInsight, ValorantStatsBundle } from '@/types/valorant.types';

export function generateValorantInsights(stats: ValorantStatsBundle): ValorantInsight[] {
  const insights: ValorantInsight[] = [];
  const mainAgent = stats.agentStats.find((agent) => agent.isMainAgent);
  const bestMap = stats.mapStats[0];
  const mainWeapon = stats.weaponStats[0];

  if (bestMap) {
    insights.push({
      type: bestMap.winRate >= 55 ? 'positive' : 'neutral',
      title: `Mapa forte: ${bestMap.map}`,
      description: `Seu melhor mapa e ${bestMap.map}, com ${bestMap.winRate}% de vitorias em ${bestMap.matches} partidas.`,
      metric: `${bestMap.winRate}% WR`,
    });
  }

  if (mainAgent) {
    insights.push({
      type: mainAgent.winRate >= 55 ? 'positive' : 'neutral',
      title: `${mainAgent.agent} e seu agente principal`,
      description: `Voce jogou ${mainAgent.matches} partidas de ${mainAgent.agent}, com K/D ${mainAgent.kdRatio}.`,
      metric: `${mainAgent.matches} partidas`,
    });
  }

  if (stats.overviewStats.firstDeaths > stats.overviewStats.firstBloods) {
    insights.push({
      type: 'warning',
      title: 'Entrada com risco alto',
      description: 'Voce esta morrendo primeiro mais vezes do que abre abates. Reduzir duelos secos pode melhorar sua consistencia.',
      metric: `${stats.overviewStats.firstDeaths} FD`,
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'Bom impacto de entrada',
      description: 'Voce abre mais rounds do que entrega first death, o que ajuda sua dupla a jogar com vantagem.',
      metric: `${stats.overviewStats.firstBloods} FB`,
    });
  }

  if (mainWeapon) {
    insights.push({
      type: mainWeapon.headshotPercent >= 25 ? 'positive' : 'neutral',
      title: `${mainWeapon.weapon} domina seu dano`,
      description: `${mainWeapon.weapon} concentra ${mainWeapon.usageRate}% dos seus abates mockados nesta amostra.`,
      metric: `${mainWeapon.kills} kills`,
    });
  }

  if (stats.trendStats.rrTrend < 0) {
    insights.push({
      type: 'warning',
      title: 'Tendencia recente negativa',
      description: `Nas ultimas ${stats.trendStats.lastMatchesCount} partidas, seu saldo de RR esta em ${stats.trendStats.rrTrend}.`,
      metric: `${stats.trendStats.rrTrend} RR`,
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'Tendencia recente positiva',
      description: `Nas ultimas ${stats.trendStats.lastMatchesCount} partidas, seu saldo de RR esta em +${stats.trendStats.rrTrend}.`,
      metric: `+${stats.trendStats.rrTrend} RR`,
    });
  }

  return insights.slice(0, Math.max(3, Math.min(insights.length, 5)));
}
