import {
  ValorantMockUser,
  ValorantProfile,
  ValorantRank,
  ValorantRankTier,
  ValorantWeaponStats,
  ValorantMapStats,
  ValorantRecentMatch,
  ValorantRoundStats
} from '@/types/valorant.types';
import { Player } from '@/schemas/player.schema';

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
  avatarUrl: '/assets/avatars/default.png',
  playerCard: '/assets/cards/default.png',
  playerTitle: 'Mock Title',
  isFakeUser: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentRank: rank,
  peakRank: rank
});

const generateRounds = (matchId: string, mainWeapon: string): ValorantRoundStats[] => 
  Array.from({ length: 12 }, (_, i) => ({
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
    weapon: i % 3 === 2 ? 'Classic' : mainWeapon,
    armor: i % 3 === 2 ? 'Light Shield' : 'Heavy Shield',
    plantedSpike: i === 4,
    defusedSpike: i === 8
  }));

// Mapeamentos de armas padrão
const defaultWeaponStats = (
  vKills: number, pKills: number, oKills: number, sKills: number, spKills: number,
  avgHsPercent: number
): ValorantWeaponStats[] => [
  {
    weapon: 'Vandal',
    weaponId: 'vandal-id',
    category: 'Rifle',
    imageUrl: '/assets/weapons/vandal.png',
    kills: vKills,
    headshots: Math.round(vKills * (avgHsPercent / 100)),
    bodyshots: Math.round(vKills * 0.65),
    legshots: Math.round(vKills * 0.1),
    headshotPercent: avgHsPercent,
    bodyshotPercent: 65,
    legshotPercent: 10,
    damage: vKills * 150,
    usageRate: 50
  },
  {
    weapon: 'Phantom',
    weaponId: 'phantom-id',
    category: 'Rifle',
    imageUrl: '/assets/weapons/phantom.png',
    kills: pKills,
    headshots: Math.round(pKills * ((avgHsPercent + 2) / 100)),
    bodyshots: Math.round(pKills * 0.63),
    legshots: Math.round(pKills * 0.12),
    headshotPercent: avgHsPercent + 2,
    bodyshotPercent: 63,
    legshotPercent: 12,
    damage: pKills * 140,
    usageRate: 25
  },
  {
    weapon: 'Operator',
    weaponId: 'operator-id',
    category: 'Sniper',
    imageUrl: '/assets/weapons/operator.png',
    kills: oKills,
    headshots: Math.round(oKills * 0.1),
    bodyshots: Math.round(oKills * 0.85),
    legshots: Math.round(oKills * 0.05),
    headshotPercent: 10,
    bodyshotPercent: 85,
    legshotPercent: 5,
    damage: oKills * 150,
    usageRate: 10
  },
  {
    weapon: 'Sheriff',
    weaponId: 'sheriff-id',
    category: 'Sidearm',
    imageUrl: '/assets/weapons/sheriff.png',
    kills: sKills,
    headshots: Math.round(sKills * ((avgHsPercent + 10) / 100)),
    bodyshots: Math.round(sKills * 0.5),
    legshots: Math.round(sKills * 0.1),
    headshotPercent: avgHsPercent + 10,
    bodyshotPercent: 50,
    legshotPercent: 10,
    damage: sKills * 55,
    usageRate: 10
  },
  {
    weapon: 'Spectre',
    weaponId: 'spectre-id',
    category: 'SMG',
    imageUrl: '/assets/weapons/spectre.png',
    kills: spKills,
    headshots: Math.round(spKills * 0.15),
    bodyshots: Math.round(spKills * 0.65),
    legshots: Math.round(spKills * 0.2),
    headshotPercent: 15,
    bodyshotPercent: 65,
    legshotPercent: 20,
    damage: spKills * 26,
    usageRate: 5
  }
];

// Mapeamentos de mapas padrão
const defaultMapStats = (
  isTopFirst: boolean,
  mainAgent: string,
  alternativeAgent: string,
  avgAcs: number,
  avgAdr: number
): ValorantMapStats[] => [
  {
    map: 'Ascent',
    mapId: 'ascent-id',
    imageUrl: '/assets/maps/ascent.jpg',
    matches: 25,
    wins: isTopFirst ? 16 : 10,
    losses: isTopFirst ? 9 : 15,
    winRate: isTopFirst ? 64 : 40,
    attackRoundsWon: 140,
    attackRoundsLost: 120,
    attackWinRate: 53.8,
    defenseRoundsWon: 150,
    defenseRoundsLost: 110,
    defenseWinRate: 57.6,
    bestAgent: mainAgent,
    worstAgent: 'Sage',
    averageCombatScore: avgAcs + 15,
    averageDamagePerRound: avgAdr + 10,
    kdRatio: isTopFirst ? 1.15 : 0.85
  },
  {
    map: 'Bind',
    mapId: 'bind-id',
    imageUrl: '/assets/maps/bind.jpg',
    matches: 20,
    wins: isTopFirst ? 13 : 9,
    losses: isTopFirst ? 7 : 11,
    winRate: isTopFirst ? 65 : 45,
    attackRoundsWon: 110,
    attackRoundsLost: 100,
    attackWinRate: 52.3,
    defenseRoundsWon: 120,
    defenseRoundsLost: 90,
    defenseWinRate: 57.1,
    bestAgent: mainAgent,
    worstAgent: 'Omen',
    averageCombatScore: avgAcs + 5,
    averageDamagePerRound: avgAdr + 5,
    kdRatio: isTopFirst ? 1.08 : 0.9
  },
  {
    map: 'Haven',
    mapId: 'haven-id',
    imageUrl: '/assets/maps/haven.jpg',
    matches: 15,
    wins: 9,
    losses: 6,
    winRate: 60,
    attackRoundsWon: 90,
    attackRoundsLost: 80,
    attackWinRate: 52.9,
    defenseRoundsWon: 95,
    defenseRoundsLost: 75,
    defenseWinRate: 55.8,
    bestAgent: alternativeAgent,
    worstAgent: 'Breach',
    averageCombatScore: avgAcs,
    averageDamagePerRound: avgAdr,
    kdRatio: 1.05
  },
  {
    map: 'Split',
    mapId: 'split-id',
    imageUrl: '/assets/maps/split.jpg',
    matches: 15,
    wins: 7,
    losses: 8,
    winRate: 46.6,
    attackRoundsWon: 80,
    attackRoundsLost: 85,
    attackWinRate: 48.4,
    defenseRoundsWon: 85,
    defenseRoundsLost: 80,
    defenseWinRate: 51.5,
    bestAgent: alternativeAgent,
    worstAgent: 'Viper',
    averageCombatScore: avgAcs - 10,
    averageDamagePerRound: avgAdr - 5,
    kdRatio: 0.95
  }
];

// Mapeamentos de partidas recentes padrão
const generateRecentMatches = (
  userId: string,
  baseRank: ValorantRank,
  mainAgent: string,
  mainRole: 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'Flex',
  avgAcs: number,
  avgAdr: number,
  hsPercent: number,
  winStreaks: boolean[]
): ValorantRecentMatch[] =>
  Array.from({ length: 5 }, (_, idx) => {
    const isWin = winStreaks[idx];
    const scoreText = isWin ? '13 - 9' : '9 - 13';
    const matchId = `match-${userId}-${idx + 1}`;
    
    return {
      matchId,
      userId,
      map: idx % 2 === 0 ? 'Ascent' : 'Bind',
      mapId: idx % 2 === 0 ? 'ascent-id' : 'bind-id',
      mapImageUrl: idx % 2 === 0 ? '/assets/maps/ascent.jpg' : '/assets/maps/bind.jpg',
      gameMode: 'Competitive',
      agent: mainAgent,
      agentId: `${mainAgent.toLowerCase()}-id`,
      agentRole: mainRole,
      agentImageUrl: `/assets/agents/${mainAgent.toLowerCase()}.png`,
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
      kills: isWin ? Math.round(avgAcs / 12) + 2 : Math.max(8, Math.round(avgAcs / 15) - 3),
      deaths: isWin ? 12 : 16,
      assists: 5,
      kdRatio: isWin ? 1.25 : 0.75,
      averageCombatScore: isWin ? avgAcs + 20 : avgAcs - 30,
      averageDamagePerRound: isWin ? avgAdr + 15 : avgAdr - 20,
      headshotPercent: hsPercent,
      headshots: 8,
      bodyshots: 20,
      legshots: 2,
      firstBloods: isWin ? 3 : 1,
      firstDeaths: isWin ? 1 : 4,
      plants: 2,
      defuses: 1,
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
      attack: { won: 6, lost: 6 },
      defense: { won: 7, lost: 3 },
      weapons: [
        {
          weaponId: 'vandal-id',
          weapon: 'Vandal',
          category: 'Rifle',
          imageUrl: '/assets/weapons/vandal.png',
          kills: 10,
          headshots: 3,
          bodyshots: 6,
          legshots: 1,
          damage: 1500
        }
      ]
    };
  });

// ==========================================
// 1. INICIANTE BRONZE/SILVER
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
    matchesPlayed: 50,
    wins: 22,
    losses: 28,
    draws: 0,
    winRate: 44,
    kills: 450,
    deaths: 580,
    assists: 120,
    kdRatio: 0.77,
    kdaRatio: 0.98,
    averageCombatScore: 160,
    averageDamagePerRound: 110,
    score: 160,
    headshots: 90,
    bodyshots: 280,
    legshots: 80,
    headshotPercent: 20,
    bodyshotPercent: 62,
    legshotPercent: 18,
    firstBloods: 15,
    firstDeaths: 40,
    plants: 20,
    defuses: 5,
    aces: 0,
    clutches: 2,
    flawlessRounds: 4,
    playtimeMillis: 36000000,
    playtimeHours: 10,
    mainAgent: 'Sage',
    strongestMap: 'Ascent',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: 'Sage',
      agentId: 'sage-id',
      role: 'Sentinel',
      imageUrl: '/assets/agents/sage.png',
      matches: 30,
      wins: 14,
      losses: 16,
      winRate: 46.6,
      kills: 250,
      deaths: 300,
      assists: 100,
      kdRatio: 0.83,
      kdaRatio: 1.16,
      averageCombatScore: 170,
      averageDamagePerRound: 120,
      headshotPercent: 22,
      playtimeMillis: 20000000,
      isMainAgent: true
    },
    {
      agent: 'Omen',
      agentId: 'omen-id',
      role: 'Controller',
      imageUrl: '/assets/agents/omen.png',
      matches: 20,
      wins: 8,
      losses: 12,
      winRate: 40,
      kills: 200,
      deaths: 280,
      assists: 20,
      kdRatio: 0.71,
      kdaRatio: 0.78,
      averageCombatScore: 150,
      averageDamagePerRound: 100,
      headshotPercent: 18,
      playtimeMillis: 16000000,
      isMainAgent: false
    }
  ],
  mapStats: defaultMapStats(false, 'Sage', 'Omen', 160, 110),
  weaponStats: defaultWeaponStats(220, 100, 10, 80, 40, 20),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 2,
    lastMatchesLosses: 3,
    lastMatchesWinRate: 40,
    lastMatchesKd: 0.8,
    lastMatchesAcs: 160,
    lastMatchesAdr: 110,
    lastMatchesHsPercent: 20,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 2,
    bestRecentMatchId: `match-${user1Profile.id}-1`,
    worstRecentMatchId: `match-${user1Profile.id}-2`,
    rrTrend: -10
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 2,
    lastMatchesLosses: 3,
    lastMatchesWinRate: 40,
    lastMatchesKd: 0.8,
    lastMatchesAcs: 160,
    lastMatchesAdr: 110,
    lastMatchesHsPercent: 20,
    currentWinStreak: 0,
    currentLoseStreak: 1,
    bestWinStreak: 2,
    bestRecentMatchId: `match-${user1Profile.id}-1`,
    worstRecentMatchId: `match-${user1Profile.id}-2`,
    rrTrend: -10
  },
  recentMatches: generateRecentMatches(user1Profile.id, user1Rank, 'Sage', 'Sentinel', 160, 110, 20, user1MatchesWinStreaks),
  insights: [
    { type: 'warning', title: 'KD Ratio Baixo', description: 'Você está morrendo mais do que matando na maioria das partidas.' },
    { type: 'positive', title: 'Uso Pró do Cofre', description: 'Foco constante em missões de suporte e resgates rápidos de spike.' },
    { type: 'neutral', title: 'Preferência por Sage', description: 'Você tende a jogar melhor servindo de suporte estratégico à equipe.' }
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
    preferredMaps: ['Ascent', 'Bind'],
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
  roundStats: generateRounds(`match-${user1Profile.id}-1`, 'Vandal'),
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
// 2. MEDIANO GOLD/PLATINUM
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
    matchesPlayed: 150,
    wins: 76,
    losses: 74,
    draws: 0,
    winRate: 50.6,
    kills: 2200,
    deaths: 2100,
    assists: 600,
    kdRatio: 1.04,
    kdaRatio: 1.33,
    averageCombatScore: 210,
    averageDamagePerRound: 140,
    score: 210,
    headshots: 440,
    bodyshots: 1500,
    legshots: 260,
    headshotPercent: 20,
    bodyshotPercent: 68,
    legshotPercent: 12,
    firstBloods: 150,
    firstDeaths: 140,
    plants: 50,
    defuses: 20,
    aces: 1,
    clutches: 15,
    flawlessRounds: 20,
    playtimeMillis: 108000000,
    playtimeHours: 30,
    mainAgent: 'Omen',
    strongestMap: 'Split',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: 'Omen',
      agentId: 'omen-id',
      role: 'Controller',
      imageUrl: '/assets/agents/omen.png',
      matches: 80,
      wins: 42,
      losses: 38,
      winRate: 52.5,
      kills: 1200,
      deaths: 1100,
      assists: 400,
      kdRatio: 1.09,
      kdaRatio: 1.45,
      averageCombatScore: 220,
      averageDamagePerRound: 145,
      headshotPercent: 22,
      playtimeMillis: 50000000,
      isMainAgent: true
    },
    {
      agent: 'Brimstone',
      agentId: 'brimstone-id',
      role: 'Controller',
      imageUrl: '/assets/agents/brimstone.png',
      matches: 40,
      wins: 20,
      losses: 20,
      winRate: 50,
      kills: 600,
      deaths: 600,
      assists: 150,
      kdRatio: 1.0,
      kdaRatio: 1.25,
      averageCombatScore: 200,
      averageDamagePerRound: 135,
      headshotPercent: 18,
      playtimeMillis: 28000000,
      isMainAgent: false
    },
    {
      agent: 'Sage',
      agentId: 'sage-id',
      role: 'Sentinel',
      imageUrl: '/assets/agents/sage.png',
      matches: 30,
      wins: 14,
      losses: 16,
      winRate: 46.6,
      kills: 400,
      deaths: 400,
      assists: 50,
      kdRatio: 1.0,
      kdaRatio: 1.12,
      averageCombatScore: 190,
      averageDamagePerRound: 130,
      headshotPercent: 18,
      playtimeMillis: 30000000,
      isMainAgent: false
    }
  ],
  mapStats: defaultMapStats(true, 'Omen', 'Brimstone', 210, 140),
  weaponStats: defaultWeaponStats(1100, 600, 100, 250, 150, 20),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 3,
    lastMatchesLosses: 2,
    lastMatchesWinRate: 60,
    lastMatchesKd: 1.1,
    lastMatchesAcs: 215,
    lastMatchesAdr: 142,
    lastMatchesHsPercent: 21,
    currentWinStreak: 1,
    currentLoseStreak: 0,
    bestWinStreak: 4,
    bestRecentMatchId: `match-${user2Profile.id}-1`,
    worstRecentMatchId: `match-${user2Profile.id}-2`,
    rrTrend: 15
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 3,
    lastMatchesLosses: 2,
    lastMatchesWinRate: 60,
    lastMatchesKd: 1.1,
    lastMatchesAcs: 215,
    lastMatchesAdr: 142,
    lastMatchesHsPercent: 21,
    currentWinStreak: 1,
    currentLoseStreak: 0,
    bestWinStreak: 4,
    bestRecentMatchId: `match-${user2Profile.id}-1`,
    worstRecentMatchId: `match-${user2Profile.id}-2`,
    rrTrend: 15
  },
  recentMatches: generateRecentMatches(user2Profile.id, user2Rank, 'Omen', 'Controller', 210, 140, 20, user2MatchesWinStreaks),
  insights: [
    { type: 'positive', title: 'Fumaças Precisas', description: 'Seu uso estratégico de smokes bloqueia e domina o campo visual adversário.' },
    { type: 'warning', title: 'Trocas Forçadas', description: 'Às vezes você se coloca em situações de duelista sem necessidade.' },
    { type: 'neutral', title: 'Equilíbrio na Fila', description: 'Taxa de vitórias e KDA estão próximos da média do servidor em Gold.' }
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
  roundStats: generateRounds(`match-${user2Profile.id}-1`, 'Vandal'),
  economyStats: {
    averageLoadoutValue: 3500,
    averageSpentPerRound: 3200,
    ecoRoundWins: 5,
    forceBuyWins: 8,
    pistolRoundWins: 150,
    fullBuyRoundWins: 400
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
// 3. BOM DIAMOND/ASCENDANT
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
    matchesPlayed: 400,
    wins: 220,
    losses: 180,
    draws: 0,
    winRate: 55.0,
    kills: 7200,
    deaths: 6000,
    assists: 1500,
    kdRatio: 1.2,
    kdaRatio: 1.45,
    averageCombatScore: 245,
    averageDamagePerRound: 155,
    score: 245,
    headshots: 2160,
    bodyshots: 4500,
    legshots: 540,
    headshotPercent: 30,
    bodyshotPercent: 62.5,
    legshotPercent: 7.5,
    firstBloods: 600,
    firstDeaths: 400,
    plants: 120,
    defuses: 50,
    aces: 10,
    clutches: 80,
    flawlessRounds: 100,
    playtimeMillis: 288000000,
    playtimeHours: 80,
    mainAgent: 'Jett',
    strongestMap: 'Haven',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: 'Jett',
      agentId: 'jett-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/jett.png',
      matches: 250,
      wins: 140,
      losses: 110,
      winRate: 56.0,
      kills: 5000,
      deaths: 4000,
      assists: 800,
      kdRatio: 1.25,
      kdaRatio: 1.45,
      averageCombatScore: 260,
      averageDamagePerRound: 165,
      headshotPercent: 32,
      playtimeMillis: 180000000,
      isMainAgent: true
    },
    {
      agent: 'Reyna',
      agentId: 'reyna-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/reyna.png',
      matches: 100,
      wins: 55,
      losses: 45,
      winRate: 55,
      kills: 1700,
      deaths: 1500,
      assists: 400,
      kdRatio: 1.13,
      kdaRatio: 1.4,
      averageCombatScore: 235,
      averageDamagePerRound: 145,
      headshotPercent: 28,
      playtimeMillis: 78000000,
      isMainAgent: false
    },
    {
      agent: 'Raze',
      agentId: 'raze-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/raze.png',
      matches: 50,
      wins: 25,
      losses: 25,
      winRate: 50,
      kills: 500,
      deaths: 500,
      assists: 300,
      kdRatio: 1.0,
      kdaRatio: 1.6,
      averageCombatScore: 210,
      averageDamagePerRound: 130,
      headshotPercent: 25,
      playtimeMillis: 30000000,
      isMainAgent: false
    }
  ],
  mapStats: defaultMapStats(true, 'Jett', 'Reyna', 245, 155),
  weaponStats: defaultWeaponStats(4000, 1800, 800, 400, 200, 30),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.3,
    lastMatchesAcs: 255,
    lastMatchesAdr: 160,
    lastMatchesHsPercent: 32,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 6,
    bestRecentMatchId: `match-${user3Profile.id}-1`,
    worstRecentMatchId: `match-${user3Profile.id}-3`,
    rrTrend: 45
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.3,
    lastMatchesAcs: 255,
    lastMatchesAdr: 160,
    lastMatchesHsPercent: 32,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 6,
    bestRecentMatchId: `match-${user3Profile.id}-1`,
    worstRecentMatchId: `match-${user3Profile.id}-3`,
    rrTrend: 45
  },
  recentMatches: generateRecentMatches(user3Profile.id, user3Rank, 'Jett', 'Duelist', 245, 155, 30, user3MatchesWinStreaks),
  insights: [
    { type: 'positive', title: 'First Bloods Incríveis', description: 'Seu impacto inicial abrindo espaços no round com Jett está absurdo.' },
    { type: 'warning', title: 'Duelos na Defesa', description: 'Você tende a buscar combates perigosos desnecessariamente no lado defensivo.' },
    { type: 'neutral', title: 'Armas Favoritas', description: 'Prefere consistentemente a Vandal para tiros de longa distância.' }
  ],
  badges: [
    { id: 'b7', label: 'Clutch Master', description: 'Líder supremo em situações de 1vX vencidas.', rarity: 'rare', icon: 'gift' },
    { id: 'b8', label: 'Head Hunter', description: 'Precisão impressionante de headshots.', rarity: 'rare', icon: 'starFavorite' },
    { id: 'b9', label: 'Entry King', description: 'Iniciador tático de combates ideal.', rarity: 'rare', icon: 'sword' }
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
  roundStats: generateRounds(`match-${user3Profile.id}-1`, 'Vandal'),
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
// 4. FORTE IMMORTAL
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
    matchesPlayed: 1000,
    wins: 550,
    losses: 450,
    draws: 0,
    winRate: 55.0,
    kills: 19000,
    deaths: 15000,
    assists: 5000,
    kdRatio: 1.26,
    kdaRatio: 1.6,
    averageCombatScore: 260,
    averageDamagePerRound: 165,
    score: 260,
    headshots: 6650,
    bodyshots: 11000,
    legshots: 1350,
    headshotPercent: 35,
    bodyshotPercent: 58,
    legshotPercent: 7,
    firstBloods: 1800,
    firstDeaths: 1200,
    plants: 400,
    defuses: 150,
    aces: 50,
    clutches: 300,
    flawlessRounds: 400,
    playtimeMillis: 720000000,
    playtimeHours: 200,
    mainAgent: 'Reyna',
    strongestMap: 'Bind',
    mostUsedWeapon: 'Vandal'
  },
  agentStats: [
    {
      agent: 'Reyna',
      agentId: 'reyna-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/reyna.png',
      matches: 600,
      wins: 340,
      losses: 260,
      winRate: 56.6,
      kills: 12000,
      deaths: 9000,
      assists: 2000,
      kdRatio: 1.33,
      kdaRatio: 1.55,
      averageCombatScore: 275,
      averageDamagePerRound: 175,
      headshotPercent: 36,
      playtimeMillis: 430000000,
      isMainAgent: true
    },
    {
      agent: 'Jett',
      agentId: 'jett-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/jett.png',
      matches: 300,
      wins: 160,
      losses: 140,
      winRate: 53.3,
      kills: 5000,
      deaths: 4500,
      assists: 1500,
      kdRatio: 1.11,
      kdaRatio: 1.44,
      averageCombatScore: 245,
      averageDamagePerRound: 155,
      headshotPercent: 32,
      playtimeMillis: 220000000,
      isMainAgent: false
    },
    {
      agent: 'Chamber',
      agentId: 'chamber-id',
      role: 'Sentinel',
      imageUrl: '/assets/agents/chamber.png',
      matches: 100,
      wins: 50,
      losses: 50,
      winRate: 50,
      kills: 2000,
      deaths: 1500,
      assists: 1500,
      kdRatio: 1.33,
      kdaRatio: 2.33,
      averageCombatScore: 240,
      averageDamagePerRound: 150,
      headshotPercent: 40,
      playtimeMillis: 70000000,
      isMainAgent: false
    }
  ],
  mapStats: defaultMapStats(true, 'Reyna', 'Jett', 260, 165),
  weaponStats: defaultWeaponStats(11000, 5000, 1800, 800, 400, 35),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.35,
    lastMatchesAcs: 265,
    lastMatchesAdr: 170,
    lastMatchesHsPercent: 35,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 8,
    bestRecentMatchId: `match-${user4Profile.id}-1`,
    worstRecentMatchId: `match-${user4Profile.id}-2`,
    rrTrend: 45
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 4,
    lastMatchesLosses: 1,
    lastMatchesWinRate: 80,
    lastMatchesKd: 1.35,
    lastMatchesAcs: 265,
    lastMatchesAdr: 170,
    lastMatchesHsPercent: 35,
    currentWinStreak: 3,
    currentLoseStreak: 0,
    bestWinStreak: 8,
    bestRecentMatchId: `match-${user4Profile.id}-1`,
    worstRecentMatchId: `match-${user4Profile.id}-2`,
    rrTrend: 45
  },
  recentMatches: generateRecentMatches(user4Profile.id, user4Rank, 'Reyna', 'Duelist', 260, 165, 35, user4MatchesWinStreaks),
  insights: [
    { type: 'positive', title: 'Aim God Absoluto', description: 'Taxa de headshot e K/D estão no topo global do servidor Immortal.' },
    { type: 'warning', title: 'Estilo Agressivo', description: 'Pode ser punido contra times com setups rígidos e flashes combinados.' },
    { type: 'neutral', title: 'Vencedor do Cofre', description: 'Sempre garante os bônus de clutches no ranking de temporadas.' }
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
    communicationStyle: 'shotcaller',
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
  roundStats: generateRounds(`match-${user4Profile.id}-1`, 'Vandal'),
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
// 5. INCONSISTENTE PLATINUM
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
    matchesPlayed: 200,
    wins: 95,
    losses: 105,
    draws: 0,
    winRate: 47.5,
    kills: 3000,
    deaths: 3200,
    assists: 800,
    kdRatio: 0.93,
    kdaRatio: 1.18,
    averageCombatScore: 195,
    averageDamagePerRound: 130,
    score: 195,
    headshots: 660,
    bodyshots: 2040,
    legshots: 300,
    headshotPercent: 22,
    bodyshotPercent: 68,
    legshotPercent: 10,
    firstBloods: 250,
    firstDeaths: 350,
    plants: 80,
    defuses: 30,
    aces: 2,
    clutches: 20,
    flawlessRounds: 30,
    playtimeMillis: 144000000,
    playtimeHours: 40,
    mainAgent: 'Raze',
    strongestMap: 'Lotus',
    mostUsedWeapon: 'Phantom'
  },
  agentStats: [
    {
      agent: 'Raze',
      agentId: 'raze-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/raze.png',
      matches: 120,
      wins: 55,
      losses: 65,
      winRate: 45.8,
      kills: 1900,
      deaths: 2000,
      assists: 400,
      kdRatio: 0.95,
      kdaRatio: 1.15,
      averageCombatScore: 205,
      averageDamagePerRound: 135,
      headshotPercent: 20,
      playtimeMillis: 86000000,
      isMainAgent: true
    },
    {
      agent: 'Reyna',
      agentId: 'reyna-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/reyna.png',
      matches: 50,
      wins: 25,
      losses: 25,
      winRate: 50,
      kills: 700,
      deaths: 750,
      assists: 200,
      kdRatio: 0.93,
      kdaRatio: 1.2,
      averageCombatScore: 190,
      averageDamagePerRound: 125,
      headshotPercent: 22,
      playtimeMillis: 34000000,
      isMainAgent: false
    },
    {
      agent: 'Phoenix',
      agentId: 'phoenix-id',
      role: 'Duelist',
      imageUrl: '/assets/agents/phoenix.png',
      matches: 30,
      wins: 15,
      losses: 15,
      winRate: 50,
      kills: 400,
      deaths: 450,
      assists: 200,
      kdRatio: 0.88,
      kdaRatio: 1.33,
      averageCombatScore: 180,
      averageDamagePerRound: 120,
      headshotPercent: 20,
      playtimeMillis: 24000000,
      isMainAgent: false
    }
  ],
  mapStats: defaultMapStats(true, 'Raze', 'Reyna', 195, 130),
  weaponStats: defaultWeaponStats(1000, 1500, 100, 250, 150, 22),
  recentPerformance: {
    lastMatchesCount: 5,
    lastMatchesWins: 1,
    lastMatchesLosses: 4,
    lastMatchesWinRate: 20,
    lastMatchesKd: 0.7,
    lastMatchesAcs: 150,
    lastMatchesAdr: 100,
    lastMatchesHsPercent: 18,
    currentWinStreak: 0,
    currentLoseStreak: 3,
    bestWinStreak: 3,
    bestRecentMatchId: `match-${user5Profile.id}-3`,
    worstRecentMatchId: `match-${user5Profile.id}-1`,
    rrTrend: -65
  },
  trendStats: {
    lastMatchesCount: 5,
    lastMatchesWins: 1,
    lastMatchesLosses: 4,
    lastMatchesWinRate: 20,
    lastMatchesKd: 0.7,
    lastMatchesAcs: 150,
    lastMatchesAdr: 100,
    lastMatchesHsPercent: 18,
    currentWinStreak: 0,
    currentLoseStreak: 3,
    bestWinStreak: 3,
    bestRecentMatchId: `match-${user5Profile.id}-3`,
    worstRecentMatchId: `match-${user5Profile.id}-1`,
    rrTrend: -65
  },
  recentMatches: generateRecentMatches(user5Profile.id, user5Rank, 'Raze', 'Duelist', 195, 130, 22, user5MatchesWinStreaks),
  insights: [
    { type: 'warning', title: 'Inconsistente', description: 'Seu ACS varia muito. Tente jogar de forma mais controlada.' },
    { type: 'warning', title: 'Queda de Rendimento', description: 'Você perdeu 4 das últimas 5 partidas competitivas.' },
    { type: 'positive', title: 'Granadas Perfeitas', description: 'Alto rendimento e eliminações consistentes usando granadas da Raze.' }
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
  roundStats: generateRounds(`match-${user5Profile.id}-1`, 'Phantom'),
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
