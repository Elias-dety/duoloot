import {
  ValorantMockUser,
  ValorantProfile,
  ValorantRank,
  ValorantRankTier,
  ValorantWeaponStats,
  ValorantMapStats
} from '@/types/valorant.types';
import { Player } from '@/schemas/player.schema';
import { VALORANT_AGENTS } from './valorantAgents.mock';
import { VALORANT_MAPS } from './valorantMaps.mock';
import { VALORANT_WEAPONS } from './valorantWeapons.mock';
import { generateRounds, generateRecentMatches } from './valorantMatches.mock';

// ==========================================
// FUNÇÕES AUXILIARES PARA GERAR MOCKS
// ==========================================

const createRank = (tierName: ValorantRankTier, div: number, rr: number, order: number): ValorantRank => ({
  tier: tierName,
  division: div,
  label: `${tierName} ${div}`,
  rr,
  order,
  currentTier: tierName,
  currentTierNumber: order,
  currentRankImage: `/assets/ranks/${tierName.toLowerCase()}-${div}.png`,
  rankedRating: rr,
  peakTier: tierName,
  peakTierNumber: order,
  peakAct: 'E8A1',
  leaderboardRank: null,
  numberOfWins: 30,
  actId: 'mock-act-1',
  seasonName: 'Episode 8 Act 1'
});

const createProfile = (name: string, tag: string, level: number, rank: ValorantRank): ValorantProfile => ({
  id: `usr-${name.toLowerCase()}`,
  userId: `uid-${name.toLowerCase()}`,
  puuid: `puuid-${name.toLowerCase()}`,
  riotId: `${name}#${tag}`,
  gameName: name,
  tagLine: tag,
  region: 'americas',
  shard: 'br',
  platform: 'br',
  country: 'BR',
  language: 'pt-BR',
  level,
  accountLevel: level,
  avatarUrl: `/assets/avatars/default.png`,
  playerCard: `/assets/cards/default.png`,
  playerTitle: 'Mock Title',
  isFakeUser: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentRank: rank,
  peakRank: rank
});

// Armas personalizadas para cada elo e perfil
const generateWeaponStats = (
  weaponsConfig: {
    weaponKey: string;
    kills: number;
    hsPercent: number;
    usageRate: number;
    baseDamage: number;
  }[]
): ValorantWeaponStats[] =>
  weaponsConfig.map((wc) => {
    const weapon = VALORANT_WEAPONS[wc.weaponKey.toLowerCase()];
    const headshots = Math.round(wc.kills * (wc.hsPercent / 100));
    const legshots = Math.round(wc.kills * 0.1);
    const bodyshots = wc.kills - headshots - legshots;
    
    return {
      weapon: weapon.name,
      weaponId: weapon.weaponId,
      category: weapon.category,
      imageUrl: weapon.imageUrl,
      kills: wc.kills,
      headshots,
      bodyshots,
      legshots,
      headshotPercent: wc.hsPercent,
      bodyshotPercent: Number(((bodyshots / wc.kills) * 100).toFixed(1)),
      legshotPercent: Number(((legshots / wc.kills) * 100).toFixed(1)),
      damage: wc.kills * wc.baseDamage,
      usageRate: wc.usageRate
    };
  });

// Mapas com cálculo coerente de rounds e taxas de vitória
const generateMapStats = (
  configs: {
    mapKey: string;
    matches: number;
    wins: number;
    bestAgentKey: string;
    worstAgentKey: string;
    averageCombatScore: number;
    averageDamagePerRound: number;
    kdRatio: number;
  }[]
): ValorantMapStats[] =>
  configs.map((c) => {
    const map = VALORANT_MAPS[c.mapKey.toLowerCase()];
    const bestAgent = VALORANT_AGENTS[c.bestAgentKey.toLowerCase()];
    const worstAgent = VALORANT_AGENTS[c.worstAgentKey.toLowerCase()];
    const losses = c.matches - c.wins;
    const winRate = Number(((c.wins / c.matches) * 100).toFixed(1));
    
    const totalRounds = c.matches * 20;
    const roundsWon = Math.round(totalRounds * (winRate / 100));
    const roundsLost = totalRounds - roundsWon;
    
    const attackRoundsWon = Math.round(roundsWon * 0.5);
    const attackRoundsLost = Math.round(roundsLost * 0.5);
    const attackWinRate = Number(((attackRoundsWon / (attackRoundsWon + attackRoundsLost)) * 100).toFixed(1));
    
    const defenseRoundsWon = roundsWon - attackRoundsWon;
    const defenseRoundsLost = roundsLost - attackRoundsLost;
    const defenseWinRate = Number(((defenseRoundsWon / (defenseRoundsWon + defenseRoundsLost)) * 100).toFixed(1));
    
    return {
      map: map.name,
      mapId: map.mapId,
      imageUrl: map.imageUrl,
      matches: c.matches,
      wins: c.wins,
      losses,
      winRate,
      attackRoundsWon,
      attackRoundsLost,
      attackWinRate,
      defenseRoundsWon,
      defenseRoundsLost,
      defenseWinRate,
      bestAgent: bestAgent.name,
      worstAgent: worstAgent.name,
      averageCombatScore: c.averageCombatScore,
      averageDamagePerRound: c.averageDamagePerRound,
      kdRatio: c.kdRatio
    };
  });

// ==========================================
// 1. INICIANTE BRONZE/SILVER - NoobMaster
// ==========================================

const user1Rank = createRank('Silver', 1, 45, 6);
const user1Profile = createProfile('NoobMaster', 'BR1', 45, user1Rank);
const user1MatchesWinStreaks = [true, false, false, true, false];

const user1: ValorantMockUser = {
  id: user1Profile.id,
  profile: user1Profile,
  rank: user1Rank,
  overviewStats: {
    riotId: user1Profile.riotId,
    currentRank: user1Rank,
    peakRank: user1Rank,
    level: 45,
    matchesPlayed: 60,
    wins: 26,
    losses: 34,
    draws: 0,
    winRate: 43.3,
    kills: 620,
    deaths: 890,
    assists: 180,
    kdRatio: 0.70,
    kdaRatio: 0.90,
    averageCombatScore: 145,
    averageDamagePerRound: 102,
    score: 145,
    headshots: 92,
    bodyshots: 520,
    legshots: 153,
    headshotPercent: 12.0,
    bodyshotPercent: 68.0,
    legshotPercent: 20.0,
    firstBloods: 18,
    firstDeaths: 48,
    plants: 24,
    defuses: 8,
    aces: 0,
    clutches: 3,
    flawlessRounds: 5,
    playtimeMillis: 43200000,
    playtimeHours: 12,
    mainAgent: 'Sage',
    strongestMap: 'Haven',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: VALORANT_AGENTS.sage.name,
      agentId: VALORANT_AGENTS.sage.agentId,
      role: VALORANT_AGENTS.sage.role,
      imageUrl: VALORANT_AGENTS.sage.imageUrl,
      matches: 40,
      wins: 18,
      losses: 22,
      winRate: 45.0,
      kills: 420,
      deaths: 580,
      assists: 130,
      kdRatio: 0.72,
      kdaRatio: 0.95,
      averageCombatScore: 150,
      averageDamagePerRound: 105,
      headshotPercent: 13,
      playtimeMillis: 28800000,
      isMainAgent: true
    },
    {
      agent: VALORANT_AGENTS.omen.name,
      agentId: VALORANT_AGENTS.omen.agentId,
      role: VALORANT_AGENTS.omen.role,
      imageUrl: VALORANT_AGENTS.omen.imageUrl,
      matches: 20,
      wins: 8,
      losses: 12,
      winRate: 40.0,
      kills: 200,
      deaths: 310,
      assists: 50,
      kdRatio: 0.65,
      kdaRatio: 0.81,
      averageCombatScore: 135,
      averageDamagePerRound: 96,
      headshotPercent: 10,
      playtimeMillis: 14400000,
      isMainAgent: false
    }
  ],
  mapStats: generateMapStats([
    {
      mapKey: 'haven',
      matches: 15,
      wins: 9,
      bestAgentKey: 'sage',
      worstAgentKey: 'omen',
      averageCombatScore: 165,
      averageDamagePerRound: 112,
      kdRatio: 0.90
    },
    {
      mapKey: 'ascent',
      matches: 20,
      wins: 9,
      bestAgentKey: 'sage',
      worstAgentKey: 'reyna',
      averageCombatScore: 155,
      averageDamagePerRound: 105,
      kdRatio: 0.75
    },
    {
      mapKey: 'bind',
      matches: 15,
      wins: 5,
      bestAgentKey: 'sage',
      worstAgentKey: 'omen',
      averageCombatScore: 150,
      averageDamagePerRound: 100,
      kdRatio: 0.70
    },
    {
      mapKey: 'split',
      matches: 10,
      wins: 3,
      bestAgentKey: 'omen',
      worstAgentKey: 'sage',
      averageCombatScore: 145,
      averageDamagePerRound: 98,
      kdRatio: 0.65
    }
  ]),
  weaponStats: generateWeaponStats([
    {
      weaponKey: 'vandal',
      kills: 350,
      hsPercent: 12,
      usageRate: 55,
      baseDamage: 150
    },
    {
      weaponKey: 'phantom',
      kills: 180,
      hsPercent: 10,
      usageRate: 30,
      baseDamage: 140
    },
    {
      weaponKey: 'marshal',
      kills: 40,
      hsPercent: 15,
      usageRate: 5,
      baseDamage: 101
    },
    {
      weaponKey: 'ghost',
      kills: 30,
      hsPercent: 18,
      usageRate: 7,
      baseDamage: 30
    },
    {
      weaponKey: 'spectre',
      kills: 20,
      hsPercent: 8,
      usageRate: 3,
      baseDamage: 26
    }
  ]),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 2,
    lastMatchesLosses: 3,
    lastMatchesWinRate: 40,
    lastMatchesKd: 0.76,
    lastMatchesAcs: 142,
    lastMatchesAdr: 101,
    lastMatchesHsPercent: 12,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 2,
    bestRecentMatchId: `match-${user1Profile.id}-1`,
    worstRecentMatchId: `match-${user1Profile.id}-2`,
    rrTrend: -12
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 2,
    lastMatchesLosses: 3,
    lastMatchesWinRate: 40,
    lastMatchesKd: 0.76,
    lastMatchesAcs: 142,
    lastMatchesAdr: 101,
    lastMatchesHsPercent: 12,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 2,
    bestRecentMatchId: `match-${user1Profile.id}-1`,
    worstRecentMatchId: `match-${user1Profile.id}-2`,
    rrTrend: -12
  },
  recentMatches: generateRecentMatches(
    user1Profile.id,
    user1Rank,
    'sage',
    'Sentinel',
    145,
    102,
    12,
    user1MatchesWinStreaks,
    'vandal'
  ),
  insights: [
    { type: 'warning', title: 'Mira Baixa', description: 'Taxa de headshot de 12% sugere que você precisa treinar posicionamento de mira.' },
    { type: 'positive', title: 'Suporte de Luxo', description: 'Grande volume de curas e ressurreições cruciais como Sage Sentinel.' },
    { type: 'neutral', title: 'Duo Recomendado', description: 'Jogar com um duelista agressivo de confiança ajudaria a estabilizar seu rank.' }
  ],
  badges: [
    { id: 'b1', label: 'Consistent Player', description: 'Mantém impacto tático estável.', rarity: 'common', icon: 'clock' },
    { id: 'b2', label: 'Spike Hero', description: 'Desarmou spikes cruciais sob pressão.', rarity: 'common', icon: 'shield' },
    { id: 'b3', label: 'Rank Grinder', description: 'Dedicado ao ganho progressivo de RR.', rarity: 'common', icon: 'sword' }
  ],
  matchmakingProfile: {
    userId: user1Profile.id,
    preferredRole: 'Sentinel',
    secondaryRole: 'Controller',
    primaryRole: 'Sentinel',
    playStyle: 'supportive',
    communicationStyle: 'quiet',
    preferredQueue: 'competitive',
    preferredMaps: ['Haven', 'Ascent'],
    avoidedMaps: ['Breeze'],
    preferredAgents: ['Sage', 'Omen'],
    lookingForDuo: true,
    aggressionScore: 20,
    reliabilityScore: 80,
    teamplayScore: 70,
    clutchScore: 30,
    consistencyScore: 50,
    toxicityScore: 10
  },
  roundStats: generateRounds(`match-${user1Profile.id}-1`, 'vandal'),
  economyStats: {
    averageLoadoutValue: 3000,
    averageSpentPerRound: 2800,
    ecoRoundWins: 1,
    forceBuyWins: 2,
    pistolRoundWins: 4,
    fullBuyRoundWins: 10
  },
  abilityStats: {
    grenadeCasts: 0,
    ability1Casts: 50,
    ability2Casts: 30,
    ultimateCasts: 5,
    averageAbilitiesPerRound: 1.5,
    ultimateKills: 0
  }
};

// ==========================================
// 2. MEDIANO GOLD/PLATINUM - MidPlayer
// ==========================================

const user2Rank = createRank('Gold', 3, 85, 12);
const user2Profile = createProfile('MidPlayer', 'GG', 120, user2Rank);
const user2MatchesWinStreaks = [true, false, true, true, false];

const user2: ValorantMockUser = {
  id: user2Profile.id,
  profile: user2Profile,
  rank: user2Rank,
  overviewStats: {
    riotId: user2Profile.riotId,
    currentRank: user2Rank,
    peakRank: createRank('Platinum', 1, 10, 13),
    level: 120,
    matchesPlayed: 140,
    wins: 72,
    losses: 68,
    draws: 0,
    winRate: 51.4,
    kills: 1950,
    deaths: 1850,
    assists: 540,
    kdRatio: 1.05,
    kdaRatio: 1.34,
    averageCombatScore: 205,
    averageDamagePerRound: 138,
    score: 205,
    headshots: 432,
    bodyshots: 1530,
    legshots: 260,
    headshotPercent: 18.0,
    bodyshotPercent: 70.0,
    legshotPercent: 12.0,
    firstBloods: 120,
    firstDeaths: 130,
    plants: 48,
    defuses: 18,
    aces: 1,
    clutches: 12,
    flawlessRounds: 18,
    playtimeMillis: 100800000,
    playtimeHours: 28,
    mainAgent: 'Omen',
    strongestMap: 'Split',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: VALORANT_AGENTS.omen.name,
      agentId: VALORANT_AGENTS.omen.agentId,
      role: VALORANT_AGENTS.omen.role,
      imageUrl: VALORANT_AGENTS.omen.imageUrl,
      matches: 80,
      wins: 44,
      losses: 36,
      winRate: 55.0,
      kills: 1150,
      deaths: 1040,
      assists: 380,
      kdRatio: 1.11,
      kdaRatio: 1.47,
      averageCombatScore: 215,
      averageDamagePerRound: 142,
      headshotPercent: 19,
      playtimeMillis: 57600000,
      isMainAgent: true
    },
    {
      agent: VALORANT_AGENTS.sage.name,
      agentId: VALORANT_AGENTS.sage.agentId,
      role: VALORANT_AGENTS.sage.role,
      imageUrl: VALORANT_AGENTS.sage.imageUrl,
      matches: 40,
      wins: 20,
      losses: 20,
      winRate: 50.0,
      kills: 550,
      deaths: 560,
      assists: 110,
      kdRatio: 0.98,
      kdaRatio: 1.18,
      averageCombatScore: 190,
      averageDamagePerRound: 130,
      headshotPercent: 17,
      playtimeMillis: 28800000,
      isMainAgent: false
    },
    {
      agent: VALORANT_AGENTS.brimstone.name,
      agentId: VALORANT_AGENTS.brimstone.agentId,
      role: VALORANT_AGENTS.brimstone.role,
      imageUrl: VALORANT_AGENTS.brimstone.imageUrl,
      matches: 20,
      wins: 8,
      losses: 12,
      winRate: 40.0,
      kills: 250,
      deaths: 250,
      assists: 50,
      kdRatio: 1.00,
      kdaRatio: 1.20,
      averageCombatScore: 195,
      averageDamagePerRound: 132,
      headshotPercent: 16,
      playtimeMillis: 14400000,
      isMainAgent: false
    }
  ],
  mapStats: generateMapStats([
    {
      mapKey: 'split',
      matches: 45,
      wins: 27,
      bestAgentKey: 'omen',
      worstAgentKey: 'brimstone',
      averageCombatScore: 215,
      averageDamagePerRound: 142,
      kdRatio: 1.15
    },
    {
      mapKey: 'ascent',
      matches: 40,
      wins: 20,
      bestAgentKey: 'omen',
      worstAgentKey: 'sage',
      averageCombatScore: 205,
      averageDamagePerRound: 138,
      kdRatio: 1.05
    },
    {
      mapKey: 'bind',
      matches: 30,
      wins: 15,
      bestAgentKey: 'brimstone',
      worstAgentKey: 'sage',
      averageCombatScore: 200,
      averageDamagePerRound: 135,
      kdRatio: 1.00
    },
    {
      mapKey: 'haven',
      matches: 25,
      wins: 10,
      bestAgentKey: 'omen',
      worstAgentKey: 'brimstone',
      averageCombatScore: 195,
      averageDamagePerRound: 130,
      kdRatio: 0.95
    }
  ]),
  weaponStats: generateWeaponStats([
    {
      weaponKey: 'vandal',
      kills: 1100,
      hsPercent: 18,
      usageRate: 60,
      baseDamage: 150
    },
    {
      weaponKey: 'phantom',
      kills: 600,
      hsPercent: 20,
      usageRate: 25,
      baseDamage: 140
    },
    {
      weaponKey: 'operator',
      kills: 100,
      hsPercent: 10,
      usageRate: 5,
      baseDamage: 150
    },
    {
      weaponKey: 'sheriff',
      kills: 90,
      hsPercent: 25,
      usageRate: 6,
      baseDamage: 55
    },
    {
      weaponKey: 'spectre',
      kills: 60,
      hsPercent: 14,
      usageRate: 4,
      baseDamage: 26
    }
  ]),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 3,
    lastMatchesLosses: 2,
    lastMatchesWinRate: 60,
    lastMatchesKd: 1.08,
    lastMatchesAcs: 208,
    lastMatchesAdr: 139,
    lastMatchesHsPercent: 19,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 4,
    bestRecentMatchId: `match-${user2Profile.id}-1`,
    worstRecentMatchId: `match-${user2Profile.id}-2`,
    rrTrend: 16
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 3,
    lastMatchesLosses: 2,
    lastMatchesWinRate: 60,
    lastMatchesKd: 1.08,
    lastMatchesAcs: 208,
    lastMatchesAdr: 139,
    lastMatchesHsPercent: 19,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 4,
    bestRecentMatchId: `match-${user2Profile.id}-1`,
    worstRecentMatchId: `match-${user2Profile.id}-2`,
    rrTrend: 16
  },
  recentMatches: generateRecentMatches(
    user2Profile.id,
    user2Rank,
    'omen',
    'Controller',
    205,
    138,
    18,
    user2MatchesWinStreaks,
    'vandal'
  ),
  insights: [
    { type: 'warning', title: 'Retenção de Util.', description: 'Evite morrer com as smokes no inventário; use-as proativamente no round.' },
    { type: 'positive', title: 'Smokes Estratégicas', description: 'Ótima precisão nas cortinas de fumaça, com alto valor tático no Split.' },
    { type: 'neutral', title: 'Equilíbrio Competitivo', description: 'Seu desempenho geral está equilibrado, ideal para subida estável.' }
  ],
  badges: [
    { id: 'b4', label: 'Consistent Player', description: 'Impacto constante como controller.', rarity: 'common', icon: 'clock' },
    { id: 'b5', label: 'Spike Hero', description: 'Pontua bem nas ativações de objetivos.', rarity: 'common', icon: 'shield' },
    { id: 'b6', label: 'Rank Grinder', description: 'Progresso focado em subir de elo.', rarity: 'common', icon: 'sword' }
  ],
  matchmakingProfile: {
    userId: user2Profile.id,
    preferredRole: 'Controller',
    secondaryRole: 'Initiator',
    primaryRole: 'Controller',
    playStyle: 'balanced',
    communicationStyle: 'balanced',
    preferredQueue: 'competitive',
    preferredMaps: ['Split', 'Bind'],
    avoidedMaps: ['Icebox'],
    preferredAgents: ['Omen', 'Sova'],
    lookingForDuo: true,
    aggressionScore: 50,
    reliabilityScore: 70,
    teamplayScore: 80,
    clutchScore: 60,
    consistencyScore: 70,
    toxicityScore: 5
  },
  roundStats: generateRounds(`match-${user2Profile.id}-1`, 'vandal'),
  economyStats: {
    averageLoadoutValue: 3500,
    averageSpentPerRound: 3200,
    ecoRoundWins: 5,
    forceBuyWins: 8,
    pistolRoundWins: 15,
    fullBuyRoundWins: 40
  },
  abilityStats: {
    grenadeCasts: 20,
    ability1Casts: 150,
    ability2Casts: 120,
    ultimateCasts: 15,
    averageAbilitiesPerRound: 2.5,
    ultimateKills: 10
  }
};

// ==========================================
// 3. BOM DIAMOND/ASCENDANT - Tryhard (Main User)
// ==========================================

const user3Rank = createRank('Diamond', 3, 50, 18);
const user3Profile = createProfile('Tryhard', 'NA', 250, user3Rank);
const user3MatchesWinStreaks = [true, true, false, true, true];

const user3: ValorantMockUser = {
  id: user3Profile.id,
  profile: user3Profile,
  rank: user3Rank,
  overviewStats: {
    riotId: user3Profile.riotId,
    currentRank: user3Rank,
    peakRank: createRank('Ascendant', 1, 15, 19),
    level: 250,
    matchesPlayed: 320,
    wins: 180,
    losses: 140,
    draws: 0,
    winRate: 56.3,
    kills: 5800,
    deaths: 4600,
    assists: 1200,
    kdRatio: 1.26,
    kdaRatio: 1.52,
    averageCombatScore: 245,
    averageDamagePerRound: 158,
    score: 245,
    headshots: 2160,
    bodyshots: 4500,
    legshots: 540,
    headshotPercent: 28.0,
    bodyshotPercent: 64.0,
    legshotPercent: 8.0,
    firstBloods: 420,
    firstDeaths: 280,
    plants: 85,
    defuses: 35,
    aces: 8,
    clutches: 48,
    flawlessRounds: 62,
    playtimeMillis: 230400000,
    playtimeHours: 64,
    mainAgent: 'Jett',
    strongestMap: 'Haven',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: VALORANT_AGENTS.jett.name,
      agentId: VALORANT_AGENTS.jett.agentId,
      role: VALORANT_AGENTS.jett.role,
      imageUrl: VALORANT_AGENTS.jett.imageUrl,
      matches: 180,
      wins: 105,
      losses: 75,
      winRate: 58.3,
      kills: 3500,
      deaths: 2600,
      assists: 600,
      kdRatio: 1.35,
      kdaRatio: 1.58,
      averageCombatScore: 260,
      averageDamagePerRound: 166,
      headshotPercent: 29,
      playtimeMillis: 129600000,
      isMainAgent: true
    },
    {
      agent: VALORANT_AGENTS.reyna.name,
      agentId: VALORANT_AGENTS.reyna.agentId,
      role: VALORANT_AGENTS.reyna.role,
      imageUrl: VALORANT_AGENTS.reyna.imageUrl,
      matches: 100,
      wins: 55,
      losses: 45,
      winRate: 55.0,
      kills: 1800,
      deaths: 1500,
      assists: 400,
      kdRatio: 1.20,
      kdaRatio: 1.47,
      averageCombatScore: 235,
      averageDamagePerRound: 152,
      headshotPercent: 27,
      playtimeMillis: 72000000,
      isMainAgent: false
    },
    {
      agent: VALORANT_AGENTS.raze.name,
      agentId: VALORANT_AGENTS.raze.agentId,
      role: VALORANT_AGENTS.raze.role,
      imageUrl: VALORANT_AGENTS.raze.imageUrl,
      matches: 40,
      wins: 20,
      losses: 20,
      winRate: 50.0,
      kills: 500,
      deaths: 500,
      assists: 200,
      kdRatio: 1.00,
      kdaRatio: 1.40,
      averageCombatScore: 210,
      averageDamagePerRound: 135,
      headshotPercent: 25,
      playtimeMillis: 28800000,
      isMainAgent: false
    }
  ],
  mapStats: generateMapStats([
    {
      mapKey: 'haven',
      matches: 90,
      wins: 56,
      bestAgentKey: 'jett',
      worstAgentKey: 'reyna',
      averageCombatScore: 255,
      averageDamagePerRound: 162,
      kdRatio: 1.35
    },
    {
      mapKey: 'ascent',
      matches: 80,
      wins: 45,
      bestAgentKey: 'jett',
      worstAgentKey: 'raze',
      averageCombatScore: 245,
      averageDamagePerRound: 158,
      kdRatio: 1.25
    },
    {
      mapKey: 'bind',
      matches: 80,
      wins: 44,
      bestAgentKey: 'reyna',
      worstAgentKey: 'raze',
      averageCombatScore: 240,
      averageDamagePerRound: 155,
      kdRatio: 1.20
    },
    {
      mapKey: 'split',
      matches: 70,
      wins: 35,
      bestAgentKey: 'jett',
      worstAgentKey: 'reyna',
      averageCombatScore: 230,
      averageDamagePerRound: 148,
      kdRatio: 1.10
    }
  ]),
  weaponStats: generateWeaponStats([
    {
      weaponKey: 'vandal',
      kills: 3200,
      hsPercent: 28,
      usageRate: 65,
      baseDamage: 150
    },
    {
      weaponKey: 'phantom',
      kills: 1600,
      hsPercent: 26,
      usageRate: 20,
      baseDamage: 140
    },
    {
      weaponKey: 'operator',
      kills: 600,
      hsPercent: 12,
      usageRate: 8,
      baseDamage: 150
    },
    {
      weaponKey: 'sheriff',
      kills: 300,
      hsPercent: 35,
      usageRate: 5,
      baseDamage: 55
    },
    {
      weaponKey: 'spectre',
      kills: 100,
      hsPercent: 18,
      usageRate: 2,
      baseDamage: 26
    }
  ]),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.32,
    lastMatchesAcs: 252,
    lastMatchesAdr: 164,
    lastMatchesHsPercent: 29,
    currentWinStreak: 2,
    currentLoseStreak: 0,
    bestWinStreak: 6,
    bestRecentMatchId: `match-${user3Profile.id}-1`,
    worstRecentMatchId: `match-${user3Profile.id}-3`,
    rrTrend: 42
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.32,
    lastMatchesAcs: 252,
    lastMatchesAdr: 164,
    lastMatchesHsPercent: 29,
    currentWinStreak: 2,
    currentLoseStreak: 0,
    bestWinStreak: 6,
    bestRecentMatchId: `match-${user3Profile.id}-1`,
    worstRecentMatchId: `match-${user3Profile.id}-3`,
    rrTrend: 42
  },
  recentMatches: generateRecentMatches(
    user3Profile.id,
    user3Rank,
    'jett',
    'Duelist',
    245,
    158,
    28,
    user3MatchesWinStreaks,
    'vandal'
  ),
  insights: [
    { type: 'warning', title: 'First Death Defensivo', description: 'Você morre cedo em 15% dos rounds defensivos ao tentar buscar duelos perigosos.' },
    { type: 'positive', title: 'Entrada Explosiva', description: 'Excelente abertura de bombs e criação de espaço agressivo com Jett Duelist.' },
    { type: 'neutral', title: 'Domínio de Rifles', description: 'Preferência notável pela Vandal sobre a Phantom, com 3200 eliminações totais.' }
  ],
  badges: [
    { id: 'b7', label: 'Clutch Master', description: 'Vence clutches em elo alto com facilidade.', rarity: 'rare', icon: 'gift' },
    { id: 'b8', label: 'Head Hunter', description: 'Precisão excelente de mira.', rarity: 'rare', icon: 'starFavorite' },
    { id: 'b9', label: 'Entry King', description: 'Líder absoluto de combates iniciais.', rarity: 'rare', icon: 'sword' }
  ],
  matchmakingProfile: {
    userId: user3Profile.id,
    preferredRole: 'Duelist',
    secondaryRole: 'Initiator',
    primaryRole: 'Duelist',
    playStyle: 'aggressive',
    communicationStyle: 'shotcaller',
    preferredQueue: 'competitive',
    preferredMaps: ['Haven', 'Ascent'],
    avoidedMaps: ['Lotus'],
    preferredAgents: ['Jett', 'Reyna'],
    lookingForDuo: true,
    aggressionScore: 90,
    reliabilityScore: 60,
    teamplayScore: 50,
    clutchScore: 80,
    consistencyScore: 60,
    toxicityScore: 30
  },
  roundStats: generateRounds(`match-${user3Profile.id}-1`, 'vandal'),
  economyStats: {
    averageLoadoutValue: 4000,
    averageSpentPerRound: 3800,
    ecoRoundWins: 10,
    forceBuyWins: 20,
    pistolRoundWins: 40,
    fullBuyRoundWins: 150
  },
  abilityStats: {
    grenadeCasts: 50,
    ability1Casts: 400,
    ability2Casts: 300,
    ultimateCasts: 80,
    averageAbilitiesPerRound: 3.5,
    ultimateKills: 150
  }
};

// ==========================================
// 4. FORTE IMMORTAL - GodMode
// ==========================================

const user4Rank = createRank('Immortal', 2, 120, 23);
const user4Profile = createProfile('GodMode', 'Radi', 400, user4Rank);
const user4MatchesWinStreaks = [true, false, true, true, true];

const user4: ValorantMockUser = {
  id: user4Profile.id,
  profile: user4Profile,
  rank: user4Rank,
  overviewStats: {
    riotId: user4Profile.riotId,
    currentRank: user4Rank,
    peakRank: createRank('Radiant', 1, 500, 24),
    level: 400,
    matchesPlayed: 500,
    wins: 285,
    losses: 215,
    draws: 0,
    winRate: 57.0,
    kills: 10200,
    deaths: 7800,
    assists: 2400,
    kdRatio: 1.31,
    kdaRatio: 1.62,
    averageCombatScore: 268,
    averageDamagePerRound: 172,
    score: 268,
    headshots: 3468,
    bodyshots: 5916,
    legshots: 816,
    headshotPercent: 34.0,
    bodyshotPercent: 58.0,
    legshotPercent: 8.0,
    firstBloods: 950,
    firstDeaths: 580,
    plants: 110,
    defuses: 50,
    aces: 18,
    clutches: 85,
    flawlessRounds: 115,
    playtimeMillis: 360000000,
    playtimeHours: 100,
    mainAgent: 'Reyna',
    strongestMap: 'Bind',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: VALORANT_AGENTS.reyna.name,
      agentId: VALORANT_AGENTS.reyna.agentId,
      role: VALORANT_AGENTS.reyna.role,
      imageUrl: VALORANT_AGENTS.reyna.imageUrl,
      matches: 300,
      wins: 180,
      losses: 120,
      winRate: 60.0,
      kills: 6400,
      deaths: 4500,
      assists: 1300,
      kdRatio: 1.42,
      kdaRatio: 1.71,
      averageCombatScore: 280,
      averageDamagePerRound: 180,
      headshotPercent: 35,
      playtimeMillis: 216000000,
      isMainAgent: true
    },
    {
      agent: VALORANT_AGENTS.jett.name,
      agentId: VALORANT_AGENTS.jett.agentId,
      role: VALORANT_AGENTS.jett.role,
      imageUrl: VALORANT_AGENTS.jett.imageUrl,
      matches: 150,
      wins: 82,
      losses: 68,
      winRate: 54.7,
      kills: 2900,
      deaths: 2400,
      assists: 800,
      kdRatio: 1.21,
      kdaRatio: 1.54,
      averageCombatScore: 255,
      averageDamagePerRound: 164,
      headshotPercent: 33,
      playtimeMillis: 108000000,
      isMainAgent: false
    },
    {
      agent: VALORANT_AGENTS.chamber.name,
      agentId: VALORANT_AGENTS.chamber.agentId,
      role: VALORANT_AGENTS.chamber.role,
      imageUrl: VALORANT_AGENTS.chamber.imageUrl,
      matches: 50,
      wins: 23,
      losses: 27,
      winRate: 46.0,
      kills: 900,
      deaths: 900,
      assists: 300,
      kdRatio: 1.00,
      kdaRatio: 1.33,
      averageCombatScore: 230,
      averageDamagePerRound: 148,
      headshotPercent: 38,
      playtimeMillis: 36000000,
      isMainAgent: false
    }
  ],
  mapStats: generateMapStats([
    {
      mapKey: 'bind',
      matches: 150,
      wins: 95,
      bestAgentKey: 'reyna',
      worstAgentKey: 'chamber',
      averageCombatScore: 280,
      averageDamagePerRound: 180,
      kdRatio: 1.45
    },
    {
      mapKey: 'ascent',
      matches: 130,
      wins: 76,
      bestAgentKey: 'reyna',
      worstAgentKey: 'jett',
      averageCombatScore: 270,
      averageDamagePerRound: 175,
      kdRatio: 1.35
    },
    {
      mapKey: 'haven',
      matches: 120,
      wins: 66,
      bestAgentKey: 'jett',
      worstAgentKey: 'chamber',
      averageCombatScore: 265,
      averageDamagePerRound: 170,
      kdRatio: 1.28
    },
    {
      mapKey: 'split',
      matches: 100,
      wins: 48,
      bestAgentKey: 'reyna',
      worstAgentKey: 'jett',
      averageCombatScore: 250,
      averageDamagePerRound: 160,
      kdRatio: 1.15
    }
  ]),
  weaponStats: generateWeaponStats([
    {
      weaponKey: 'vandal',
      kills: 6200,
      hsPercent: 34,
      usageRate: 60,
      baseDamage: 150
    },
    {
      weaponKey: 'phantom',
      kills: 2300,
      hsPercent: 32,
      usageRate: 20,
      baseDamage: 140
    },
    {
      weaponKey: 'operator',
      kills: 1100,
      hsPercent: 14,
      usageRate: 12,
      baseDamage: 150
    },
    {
      weaponKey: 'sheriff',
      kills: 400,
      hsPercent: 42,
      usageRate: 6,
      baseDamage: 55
    },
    {
      weaponKey: 'spectre',
      kills: 200,
      hsPercent: 22,
      usageRate: 2,
      baseDamage: 26
    }
  ]),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.36,
    lastMatchesAcs: 275,
    lastMatchesAdr: 178,
    lastMatchesHsPercent: 34,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 8,
    bestRecentMatchId: `match-${user4Profile.id}-1`,
    worstRecentMatchId: `match-${user4Profile.id}-2`,
    rrTrend: 44
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.36,
    lastMatchesAcs: 275,
    lastMatchesAdr: 178,
    lastMatchesHsPercent: 34,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 8,
    bestRecentMatchId: `match-${user4Profile.id}-1`,
    worstRecentMatchId: `match-${user4Profile.id}-2`,
    rrTrend: 44
  },
  recentMatches: generateRecentMatches(
    user4Profile.id,
    user4Rank,
    'reyna',
    'Duelist',
    268,
    172,
    34,
    user4MatchesWinStreaks,
    'vandal'
  ),
  insights: [
    { type: 'warning', title: 'Alvo Prioritário', description: 'Sua presença agressiva é intensamente contestada por utilitários adversários em Immortal.' },
    { type: 'positive', title: 'Mira Absoluta', description: 'Taxa de headshot de 34% garante domínio completo dos duelos um contra um.' },
    { type: 'neutral', title: 'Chamber Secundário', description: 'Seu Chamber serve como uma boa válvula de segurança defensiva em mapas abertos.' }
  ],
  badges: [
    { id: 'b10', label: 'Clutch Master', description: 'Vence clutches em elo alto com facilidade.', rarity: 'legendary', icon: 'gift' },
    { id: 'b11', label: 'Head Hunter', description: 'Precisão excelente de mira.', rarity: 'legendary', icon: 'starFavorite' },
    { id: 'b12', label: 'Entry King', description: 'Líder absoluto de combates iniciais.', rarity: 'legendary', icon: 'sword' }
  ],
  matchmakingProfile: {
    userId: user4Profile.id,
    preferredRole: 'Duelist',
    secondaryRole: 'Flex',
    primaryRole: 'Duelist',
    playStyle: 'aggressive',
    communicationStyle: 'quiet',
    preferredQueue: 'competitive',
    preferredMaps: ['Bind', 'Ascent'],
    avoidedMaps: ['Sunset'],
    preferredAgents: ['Reyna', 'Chamber'],
    lookingForDuo: false,
    aggressionScore: 95,
    reliabilityScore: 80,
    teamplayScore: 40,
    clutchScore: 90,
    consistencyScore: 85,
    toxicityScore: 40
  },
  roundStats: generateRounds(`match-${user4Profile.id}-1`, 'vandal'),
  economyStats: {
    averageLoadoutValue: 4200,
    averageSpentPerRound: 4000,
    ecoRoundWins: 30,
    forceBuyWins: 60,
    pistolRoundWins: 150,
    fullBuyRoundWins: 400
  },
  abilityStats: {
    grenadeCasts: 100,
    ability1Casts: 1000,
    ability2Casts: 800,
    ultimateCasts: 200,
    averageAbilitiesPerRound: 2.0,
    ultimateKills: 300
  }
};

// ==========================================
// 5. INCONSISTENTE PLATINUM - Tilted
// ==========================================

const user5Rank = createRank('Platinum', 2, 25, 14);
const user5Profile = createProfile('Tilted', 'FF', 90, user5Rank);
const user5MatchesWinStreaks = [false, false, true, false, false];

const user5: ValorantMockUser = {
  id: user5Profile.id,
  profile: user5Profile,
  rank: user5Rank,
  overviewStats: {
    riotId: user5Profile.riotId,
    currentRank: user5Rank,
    peakRank: createRank('Diamond', 1, 0, 16),
    level: 90,
    matchesPlayed: 180,
    wins: 84,
    losses: 96,
    draws: 0,
    winRate: 46.7,
    kills: 2600,
    deaths: 2950,
    assists: 750,
    kdRatio: 0.88,
    kdaRatio: 1.14,
    averageCombatScore: 188,
    averageDamagePerRound: 124,
    score: 188,
    headshots: 546,
    bodyshots: 1794,
    legshots: 260,
    headshotPercent: 21.0,
    bodyshotPercent: 69.0,
    legshotPercent: 10.0,
    firstBloods: 210,
    firstDeaths: 310,
    plants: 68,
    defuses: 22,
    aces: 2,
    clutches: 15,
    flawlessRounds: 25,
    playtimeMillis: 129600000,
    playtimeHours: 36,
    mainAgent: 'Raze',
    strongestMap: 'Lotus',
    mostUsedWeapon: 'Phantom'
  },
  agentStats: [
    {
      agent: VALORANT_AGENTS.raze.name,
      agentId: VALORANT_AGENTS.raze.agentId,
      role: VALORANT_AGENTS.raze.role,
      imageUrl: VALORANT_AGENTS.raze.imageUrl,
      matches: 100,
      wins: 45,
      losses: 55,
      winRate: 45.0,
      kills: 1500,
      deaths: 1650,
      assists: 420,
      kdRatio: 0.91,
      kdaRatio: 1.16,
      averageCombatScore: 195,
      averageDamagePerRound: 128,
      headshotPercent: 20,
      playtimeMillis: 72000000,
      isMainAgent: true
    },
    {
      agent: VALORANT_AGENTS.reyna.name,
      agentId: VALORANT_AGENTS.reyna.agentId,
      role: VALORANT_AGENTS.reyna.role,
      imageUrl: VALORANT_AGENTS.reyna.imageUrl,
      matches: 50,
      wins: 24,
      losses: 26,
      winRate: 48.0,
      kills: 750,
      deaths: 800,
      assists: 180,
      kdRatio: 0.94,
      kdaRatio: 1.16,
      averageCombatScore: 185,
      averageDamagePerRound: 122,
      headshotPercent: 22,
      playtimeMillis: 36000000,
      isMainAgent: false
    },
    {
      agent: VALORANT_AGENTS.phoenix.name,
      agentId: VALORANT_AGENTS.phoenix.agentId,
      role: VALORANT_AGENTS.phoenix.role,
      imageUrl: VALORANT_AGENTS.phoenix.imageUrl,
      matches: 30,
      wins: 15,
      losses: 15,
      winRate: 50.0,
      kills: 350,
      deaths: 500,
      assists: 150,
      kdRatio: 0.70,
      kdaRatio: 1.00,
      averageCombatScore: 170,
      averageDamagePerRound: 115,
      headshotPercent: 20,
      playtimeMillis: 216000000,
      isMainAgent: false
    }
  ],
  mapStats: generateMapStats([
    {
      mapKey: 'lotus',
      matches: 60,
      wins: 34,
      bestAgentKey: 'raze',
      worstAgentKey: 'reyna',
      averageCombatScore: 210,
      averageDamagePerRound: 140,
      kdRatio: 1.05
    },
    {
      mapKey: 'split',
      matches: 50,
      wins: 22,
      bestAgentKey: 'raze',
      worstAgentKey: 'phoenix',
      averageCombatScore: 190,
      averageDamagePerRound: 125,
      kdRatio: 0.88
    },
    {
      mapKey: 'ascent',
      matches: 40,
      wins: 16,
      bestAgentKey: 'reyna',
      worstAgentKey: 'phoenix',
      averageCombatScore: 180,
      averageDamagePerRound: 120,
      kdRatio: 0.82
    },
    {
      mapKey: 'bind',
      matches: 30,
      wins: 12,
      bestAgentKey: 'raze',
      worstAgentKey: 'reyna',
      averageCombatScore: 180,
      averageDamagePerRound: 120,
      kdRatio: 0.80
    }
  ]),
  weaponStats: generateWeaponStats([
    {
      weaponKey: 'phantom',
      kills: 1300,
      hsPercent: 21,
      usageRate: 50,
      baseDamage: 140
    },
    {
      weaponKey: 'vandal',
      kills: 900,
      hsPercent: 23,
      usageRate: 35,
      baseDamage: 150
    },
    {
      weaponKey: 'operator',
      kills: 150,
      hsPercent: 12,
      usageRate: 5,
      baseDamage: 150
    },
    {
      weaponKey: 'ghost',
      kills: 130,
      hsPercent: 24,
      usageRate: 6,
      baseDamage: 30
    },
    {
      weaponKey: 'spectre',
      kills: 120,
      hsPercent: 16,
      usageRate: 4,
      baseDamage: 26
    }
  ]),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 1,
    lastMatchesLosses: 4,
    lastMatchesWinRate: 20,
    lastMatchesKd: 0.72,
    lastMatchesAcs: 154,
    lastMatchesAdr: 102,
    lastMatchesHsPercent: 21,
    currentWinStreak: 0,
    currentLoseStreak: 2,
    bestWinStreak: 3,
    bestRecentMatchId: `match-${user5Profile.id}-3`,
    worstRecentMatchId: `match-${user5Profile.id}-1`,
    rrTrend: -64
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 1,
    lastMatchesLosses: 4,
    lastMatchesWinRate: 20,
    lastMatchesKd: 0.72,
    lastMatchesAcs: 154,
    lastMatchesAdr: 102,
    lastMatchesHsPercent: 21,
    currentWinStreak: 0,
    currentLoseStreak: 2,
    bestWinStreak: 3,
    bestRecentMatchId: `match-${user5Profile.id}-3`,
    worstRecentMatchId: `match-${user5Profile.id}-1`,
    rrTrend: -64
  },
  recentMatches: generateRecentMatches(
    user5Profile.id,
    user5Rank,
    'raze',
    'Duelist',
    188,
    124,
    21,
    user5MatchesWinStreaks,
    'phantom'
  ),
  insights: [
    { type: 'warning', title: 'Queda Recente', description: 'Taxa de vitórias recente despencou para 20%, indicando forte fadiga/tilt.' },
    { type: 'positive', title: 'Lotus Dominante', description: 'Aproveitamento sólido de 56.7% no Lotus usando as double satchels da Raze.' },
    { type: 'neutral', title: 'Phantom Main', description: 'Você opta preferencialmente pela Phantom (1300 abates), focando em combate próximo.' }
  ],
  badges: [
    { id: 'b13', label: 'Entry King', description: 'Abre bem o spike site na maioria das vezes.', rarity: 'common', icon: 'sword' },
    { id: 'b14', label: 'Spike Hero', description: 'Muitos plantios bem-sucedidos no Lotus.', rarity: 'common', icon: 'shield' },
    { id: 'b15', label: 'Rank Grinder', description: 'Joga muitas partidas competitivas seguidas.', rarity: 'common', icon: 'sword' }
  ],
  matchmakingProfile: {
    userId: user5Profile.id,
    preferredRole: 'Duelist',
    secondaryRole: 'Flex',
    primaryRole: 'Duelist',
    playStyle: 'aggressive',
    communicationStyle: 'quiet',
    preferredQueue: 'competitive',
    preferredMaps: ['Lotus', 'Split'],
    avoidedMaps: ['Breeze'],
    preferredAgents: ['Raze', 'Phoenix'],
    lookingForDuo: true,
    aggressionScore: 80,
    reliabilityScore: 30,
    teamplayScore: 40,
    clutchScore: 50,
    consistencyScore: 20,
    toxicityScore: 60
  },
  roundStats: generateRounds(`match-${user5Profile.id}-1`, 'phantom'),
  economyStats: {
    averageLoadoutValue: 3200,
    averageSpentPerRound: 3000,
    ecoRoundWins: 2,
    forceBuyWins: 10,
    pistolRoundWins: 20,
    fullBuyRoundWins: 50
  },
  abilityStats: {
    grenadeCasts: 300,
    ability1Casts: 400,
    ability2Casts: 200,
    ultimateCasts: 50,
    averageAbilitiesPerRound: 4.0,
    ultimateKills: 60
  }
};

export const mockValorantUsers: ValorantMockUser[] = [user1, user2, user3, user4, user5];

// ==========================================
// HELPERS
// ==========================================

export function getValorantUserById(id: string): ValorantMockUser | undefined {
  return mockValorantUsers.find((u) => u.id === id);
}

export function getMainValorantUser(): ValorantMockUser {
  // Retorna o Tryhard (Diamond/Ascendant) como usuário principal para demonstração
  return user3;
}

export function getAvailableDuoUsers(): ValorantMockUser[] {
  const mainId = getMainValorantUser().id;
  return mockValorantUsers.filter((u) => u.id !== mainId);
}

export function mapValorantUserToPlayer(user: ValorantMockUser): Player {
  return {
    id: user.id,
    name: user.profile.gameName,
    nickname: user.profile.riotId,
    avatarUrl: user.profile.avatarUrl,
    trustScore: user.matchmakingProfile.reliabilityScore,
    status: 'online',
    isPremium: false,
    gameProfile: {
      mainGame: 'Valorant',
      riotId: user.profile.riotId,
      nickname: user.profile.gameName,
      currentRank: user.rank.label,
      rank: user.rank.label,
      mainRole: user.matchmakingProfile.preferredRole,
      secondaryRole: user.matchmakingProfile.secondaryRole,
      playStyle: user.matchmakingProfile.playStyle,
      sessionFocus: 'Ranked Push',
      availability: 'Noturno',
      preferredModes: [user.matchmakingProfile.preferredQueue],
      microphone: user.matchmakingProfile.communicationStyle !== 'quiet',
      region: user.profile.region,
      bio: 'Buscando duo focado para subir de rank.',
    },
    stats: {
      matchesPlayed: user.overviewStats.matchesPlayed,
      winRate: user.overviewStats.winRate,
      averageKda: user.overviewStats.kdaRatio,
      hoursPlayed: user.overviewStats.playtimeHours,
      commendations: Math.floor(user.overviewStats.wins / 10),
      abandons: 0,
    },
    preferences: {
      micRequired: user.matchmakingProfile.communicationStyle !== 'quiet',
      playStyle: user.matchmakingProfile.playStyle,
      sessionFocus: 'Competitive',
      availability: 'Noturno',
    },
    metadata: {
      valorantStats: user,
    },
    createdAt: user.profile.createdAt,
    updatedAt: user.profile.updatedAt,
  };
}
