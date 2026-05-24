import {
  ValorantRecentMatch,
  ValorantRoundStats,
  ValorantRank,
  ValorantRole
} from '@/types/valorant.types';
import { VALORANT_AGENTS } from './valorantAgents.mock';
import { VALORANT_MAPS } from './valorantMaps.mock';
import { VALORANT_WEAPONS } from './valorantWeapons.mock';

export const generateRounds = (matchId: string, mainWeaponKey: string): ValorantRoundStats[] => {
  const weapon = VALORANT_WEAPONS[mainWeaponKey.toLowerCase()] || VALORANT_WEAPONS.vandal;
  return Array.from({ length: 12 }, (_, i) => ({
    matchId,
    roundNumber: i + 1,
    winningTeam: i % 2 === 0 ? 'Blue' : 'Red',
    roundResult: i % 3 === 0 ? 'Elimination' : i % 3 === 1 ? 'BombDetonated' : 'BombDefused',
    playerTeam: 'Blue',
    playerSurvived: i % 4 !== 0,
    playerKills: i % 5 === 0 ? 2 : i % 5 === 2 ? 1 : 0,
    playerDamage: i % 5 === 0 ? 280 : i % 5 === 2 ? 140 : 0,
    playerHeadshots: i % 4 === 0 ? 1 : 0,
    economySpent: i % 3 === 0 ? 2900 : i % 3 === 1 ? 4500 : 1000,
    loadoutValue: i % 3 === 0 ? 3900 : i % 3 === 1 ? 5500 : 1500,
    weapon: i % 3 === 2 ? 'Classic' : weapon.name,
    armor: i % 3 === 2 ? 'Light Shield' : 'Heavy Shield',
    plantedSpike: i === 4,
    defusedSpike: i === 8
  }));
};

export const generateRecentMatches = (
  userId: string,
  baseRank: ValorantRank,
  mainAgentKey: string,
  mainRole: ValorantRole,
  avgAcs: number,
  avgAdr: number,
  hsPercent: number,
  winStreaks: boolean[],
  mainWeaponKey: string
): ValorantRecentMatch[] => {
  const agent = VALORANT_AGENTS[mainAgentKey.toLowerCase()] || VALORANT_AGENTS.sage;
  const weapon = VALORANT_WEAPONS[mainWeaponKey.toLowerCase()] || VALORANT_WEAPONS.vandal;
  
  return Array.from({ length: 5 }, (_, idx) => {
    const isWin = winStreaks[idx];
    const scoreText = isWin ? '13 - 9' : '9 - 13';
    const matchId = `match-${userId}-${idx + 1}`;
    
    const kills = isWin ? Math.round(avgAcs / 12) + 2 : Math.max(8, Math.round(avgAcs / 15) - 3);
    const deaths = isWin ? 12 : 16;
    const assists = isWin ? 6 : 3;
    const kdRatio = Number((kills / deaths).toFixed(2));
    
    const totalShots = 35;
    const headshots = Math.round(totalShots * (hsPercent / 100));
    const legshots = Math.round(totalShots * 0.08);
    const bodyshots = totalShots - headshots - legshots;
    
    const mapKey = idx % 2 === 0 ? 'ascent' : 'bind';
    const map = VALORANT_MAPS[mapKey];

    return {
      matchId,
      userId,
      map: map.name,
      mapId: map.mapId,
      mapImageUrl: map.imageUrl,
      gameMode: 'Competitive',
      agent: agent.name,
      agentId: agent.agentId,
      agentRole: mainRole,
      agentImageUrl: agent.imageUrl,
      queue: 'competitive',
      queueId: 'competitive',
      seasonId: 'mock-season-1',
      teamId: idx % 2 === 0 ? 'Blue' : 'Red',
      result: isWin ? 'win' : 'loss',
      teamScore: isWin ? 13 : 9,
      enemyScore: isWin ? 9 : 13,
      roundsWon: isWin ? 13 : 9,
      roundsLost: isWin ? 9 : 13,
      scoreText,
      kills,
      deaths,
      assists,
      kdRatio,
      averageCombatScore: isWin ? avgAcs + 20 : avgAcs - 30,
      averageDamagePerRound: isWin ? avgAdr + 15 : avgAdr - 20,
      headshotPercent: hsPercent,
      headshots,
      bodyshots,
      legshots,
      firstBloods: isWin ? 3 : 1,
      firstDeaths: isWin ? 1 : 4,
      plants: isWin ? 2 : 1,
      defuses: isWin ? 1 : 0,
      aces: 0,
      clutches: isWin ? 1 : 0,
      rrChange: isWin ? 18 + (idx * 2) : -15 - (idx * 2),
      rankBefore: baseRank.label,
      rankAfter: baseRank.label,
      rankBeforeDetails: baseRank,
      rankAfterDetails: baseRank,
      gameStart: new Date(Date.now() - idx * 7200000).toISOString(),
      startedAt: new Date(Date.now() - idx * 7200000).toISOString(),
      gameLengthMillis: 2300000,
      durationMillis: 2300000,
      attack: { won: isWin ? 7 : 4, lost: isWin ? 5 : 8 },
      defense: { won: isWin ? 6 : 5, lost: isWin ? 4 : 5 },
      weapons: [
        {
          weaponId: weapon.weaponId,
          weapon: weapon.name,
          category: weapon.category,
          imageUrl: weapon.imageUrl,
          kills: Math.round(kills * 0.8),
          headshots: Math.round(kills * 0.8 * (hsPercent / 100)),
          bodyshots: Math.round(kills * 0.8 * ((100 - hsPercent - 10) / 100)),
          legshots: Math.round(kills * 0.8 * 0.1),
          damage: Math.round(kills * 0.8 * 145)
        }
      ]
    };
  });
};
