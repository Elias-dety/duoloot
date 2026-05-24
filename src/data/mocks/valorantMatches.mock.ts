import type {
  ValorantMatchResult,
  ValorantMatchWeaponStat,
  ValorantQueue,
  ValorantRank,
  ValorantRecentMatch,
  ValorantRoundStats,
  ValorantRoundSideStats,
} from '@/types/valorant.types';
import { getValorantAgentMock } from './valorantAgents.mock';
import { getValorantMapMock } from './valorantMaps.mock';
import { getValorantWeaponMock } from './valorantWeapons.mock';

type MatchSeed = {
  mapId: string;
  agentId: string;
  result: ValorantMatchResult;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  firstBloods: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  aces: number;
  clutches: number;
  rrChange: number;
  weapons: string[];
};

type UserMatchPreset = {
  userId: string;
  rank: ValorantRank;
  queue?: ValorantQueue;
  seeds: MatchSeed[];
};

export const mockRanks = {
  bronze2: rank('Bronze', 2, 41, 5),
  silver1: rank('Silver', 1, 12, 7),
  gold3: rank('Gold', 3, 55, 12),
  platinum1: rank('Platinum', 1, 8, 13),
  diamond2: rank('Diamond', 2, 64, 17),
  ascendant1: rank('Ascendant', 1, 22, 19),
  immortal2: rank('Immortal', 2, 138, 23),
  immortal3: rank('Immortal', 3, 211, 24),
} satisfies Record<string, ValorantRank>;

const MOCK_ACT_ID = 'duoloot-act-2026-e01-a03';
const MOCK_SEASON_NAME = 'Episode 10: Act 3';

function rank(tier: ValorantRank['tier'], division: number, rr: number, order: number): ValorantRank {
  const label = `${tier} ${division}`;

  return {
    tier,
    division,
    label,
    rr,
    order,
    currentTier: label,
    currentTierNumber: order,
    currentRankImage: `/assets/badges/elos/${rankImageSlug(tier, division)}.png`,
    rankedRating: rr,
    peakTier: label,
    peakTierNumber: order,
    peakAct: 'Episode 10: Act 2',
    leaderboardRank: tier === 'Immortal' ? 1842 - order * 37 : null,
    numberOfWins: 24 + order * 9,
    actId: MOCK_ACT_ID,
    seasonName: MOCK_SEASON_NAME,
  };
}

function rankImageSlug(tier: ValorantRank['tier'], division: number | null): string {
  const tierMap: Record<ValorantRank['tier'], string> = {
    Unranked: 'unranked',
    Iron: 'ferro',
    Bronze: 'bronze',
    Silver: 'prata',
    Gold: 'ouro',
    Platinum: 'platina',
    Diamond: 'diamante',
    Ascendant: 'ascendente',
    Immortal: 'imortal',
    Radiant: 'radiante',
  };

  return division ? `${tierMap[tier]}-${division}` : tierMap[tier];
}

function deriveScore(result: ValorantMatchResult, index: number): { teamScore: number; enemyScore: number } {
  if (result === 'draw') {
    return { teamScore: 14, enemyScore: 14 };
  }

  const losingScore = 7 + (index % 5);
  return result === 'win'
    ? { teamScore: 13, enemyScore: losingScore }
    : { teamScore: losingScore, enemyScore: 13 };
}

function deriveSideStats(teamScore: number, enemyScore: number, index: number): {
  attack: ValorantRoundSideStats;
  defense: ValorantRoundSideStats;
} {
  const attackWon = Math.floor(teamScore / 2) + (index % 2);
  const defenseWon = Math.max(teamScore - attackWon, 0);
  const attackLost = Math.floor(enemyScore / 2);
  const defenseLost = Math.max(enemyScore - attackLost, 0);

  return {
    attack: { won: attackWon, lost: attackLost },
    defense: { won: defenseWon, lost: defenseLost },
  };
}

function splitTotal(total: number, parts: number): number[] {
  if (parts <= 1) {
    return [total];
  }

  const first = Math.round(total * 0.62);
  const second = Math.round(total * 0.26);
  const remaining = Math.max(total - first - second, 0);
  return [first, second, remaining].slice(0, parts);
}

function createWeaponStats(seed: MatchSeed): ValorantMatchWeaponStat[] {
  const weaponIds = seed.weapons.slice(0, 3);
  const kills = splitTotal(seed.kills, weaponIds.length);
  const headshots = splitTotal(seed.headshots, weaponIds.length);
  const bodyshots = splitTotal(seed.bodyshots, weaponIds.length);
  const legshots = splitTotal(seed.legshots, weaponIds.length);
  const damage = splitTotal(Math.round(seed.adr * 24), weaponIds.length);

  return weaponIds.map((weaponId, index) => {
    const weapon = getValorantWeaponMock(weaponId);
    return {
      weaponId: weapon.weaponId,
      weapon: weapon.name,
      category: weapon.category,
      imageUrl: weapon.imageUrl,
      kills: kills[index] ?? 0,
      headshots: headshots[index] ?? 0,
      bodyshots: bodyshots[index] ?? 0,
      legshots: legshots[index] ?? 0,
      damage: damage[index] ?? 0,
    };
  });
}

function createMatch(preset: UserMatchPreset, seed: MatchSeed, index: number): ValorantRecentMatch {
  const agent = getValorantAgentMock(seed.agentId);
  const map = getValorantMapMock(seed.mapId);
  const score = deriveScore(seed.result, index);
  const sideStats = deriveSideStats(score.teamScore, score.enemyScore, index);
  const shots = seed.headshots + seed.bodyshots + seed.legshots;
  const startedAt = new Date(Date.UTC(2026, 4, 22 - index, 21, (index * 7) % 60)).toISOString();
  const durationMillis = (31 + (index % 12)) * 60 * 1000;
  const queue = preset.queue ?? 'competitive';

  return {
    matchId: `${preset.userId}-match-${String(index + 1).padStart(2, '0')}`,
    userId: preset.userId,
    map: map.name,
    mapId: map.mapId,
    mapImageUrl: map.imageUrl,
    gameMode: 'Bomb',
    agent: agent.name,
    agentId: agent.agentId,
    agentRole: agent.role,
    agentImageUrl: agent.imageUrl,
    queue,
    queueId: queue,
    seasonId: MOCK_ACT_ID,
    teamId: index % 2 === 0 ? 'Blue' : 'Red',
    result: seed.result,
    teamScore: score.teamScore,
    enemyScore: score.enemyScore,
    roundsWon: score.teamScore,
    roundsLost: score.enemyScore,
    scoreText: `${score.teamScore}-${score.enemyScore}`,
    kills: seed.kills,
    deaths: seed.deaths,
    assists: seed.assists,
    kdRatio: seed.deaths > 0 ? Number((seed.kills / seed.deaths).toFixed(2)) : seed.kills,
    averageCombatScore: seed.acs,
    averageDamagePerRound: seed.adr,
    headshotPercent: shots > 0 ? Number(((seed.headshots / shots) * 100).toFixed(1)) : 0,
    headshots: seed.headshots,
    bodyshots: seed.bodyshots,
    legshots: seed.legshots,
    firstBloods: seed.firstBloods,
    firstDeaths: seed.firstDeaths,
    plants: seed.plants,
    defuses: seed.defuses,
    aces: seed.aces,
    clutches: seed.clutches,
    rrChange: seed.rrChange,
    rankBefore: preset.rank.label,
    rankAfter: preset.rank.label,
    rankBeforeDetails: preset.rank,
    rankAfterDetails: preset.rank,
    gameStart: startedAt,
    startedAt,
    gameLengthMillis: durationMillis,
    durationMillis,
    attack: sideStats.attack,
    defense: sideStats.defense,
    weapons: createWeaponStats(seed),
  };
}

const userMatchPresets: UserMatchPreset[] = [
  {
    userId: 'user-bronze-rafa',
    rank: mockRanks.bronze2,
    seeds: [
      seed('ascent', 'sage', 'win', 15, 14, 8, 188, 118, 12, 34, 8, 1, 2, 3, 1, 0, 1, 15, ['phantom', 'spectre', 'sheriff']),
      seed('bind', 'sage', 'loss', 10, 17, 6, 139, 92, 7, 31, 12, 0, 3, 2, 0, 0, 0, -18, ['phantom', 'spectre', 'sheriff']),
      seed('haven', 'sova', 'loss', 12, 16, 7, 151, 101, 8, 29, 11, 1, 2, 1, 0, 0, 0, -16, ['vandal', 'spectre', 'sheriff']),
      seed('ascent', 'sage', 'win', 17, 13, 9, 211, 132, 13, 36, 7, 2, 1, 4, 0, 0, 2, 18, ['phantom', 'spectre', 'sheriff']),
      seed('split', 'killjoy', 'loss', 9, 15, 5, 128, 87, 6, 26, 13, 0, 2, 1, 1, 0, 0, -17, ['phantom', 'spectre', 'sheriff']),
      seed('lotus', 'sage', 'draw', 14, 14, 10, 174, 111, 10, 35, 9, 1, 1, 3, 1, 0, 1, 0, ['phantom', 'spectre', 'sheriff']),
      seed('bind', 'sova', 'loss', 11, 18, 8, 144, 96, 8, 30, 12, 1, 3, 1, 0, 0, 0, -20, ['vandal', 'spectre', 'sheriff']),
      seed('ascent', 'sage', 'win', 16, 12, 11, 203, 126, 12, 33, 8, 1, 1, 4, 1, 0, 2, 16, ['phantom', 'spectre', 'sheriff']),
      seed('sunset', 'killjoy', 'loss', 13, 16, 6, 160, 104, 9, 31, 10, 1, 2, 2, 0, 0, 0, -15, ['phantom', 'spectre', 'sheriff']),
      seed('haven', 'sage', 'win', 18, 14, 7, 214, 134, 14, 35, 8, 2, 2, 2, 1, 0, 1, 17, ['phantom', 'spectre', 'sheriff']),
    ],
  },
  {
    userId: 'user-gold-luna',
    rank: mockRanks.gold3,
    seeds: [
      seed('ascent', 'sova', 'win', 18, 13, 12, 226, 146, 18, 31, 6, 2, 1, 2, 0, 0, 2, 20, ['vandal', 'sheriff', 'spectre']),
      seed('haven', 'skye', 'win', 16, 12, 15, 207, 133, 15, 34, 8, 1, 1, 1, 1, 0, 1, 18, ['vandal', 'phantom', 'sheriff']),
      seed('bind', 'sova', 'loss', 14, 16, 9, 184, 119, 13, 36, 9, 1, 2, 2, 0, 0, 1, -15, ['vandal', 'spectre', 'sheriff']),
      seed('lotus', 'skye', 'win', 20, 14, 13, 242, 154, 19, 35, 7, 2, 1, 3, 0, 0, 2, 22, ['vandal', 'phantom', 'sheriff']),
      seed('sunset', 'sova', 'loss', 13, 15, 11, 179, 116, 11, 33, 8, 0, 1, 1, 0, 0, 0, -13, ['vandal', 'spectre', 'sheriff']),
      seed('ascent', 'sova', 'win', 19, 11, 14, 238, 151, 20, 32, 6, 2, 0, 2, 1, 0, 2, 24, ['vandal', 'sheriff', 'spectre']),
      seed('split', 'skye', 'loss', 12, 17, 10, 168, 108, 10, 31, 9, 0, 2, 1, 0, 0, 0, -17, ['phantom', 'spectre', 'sheriff']),
      seed('haven', 'sova', 'win', 17, 13, 16, 216, 141, 16, 33, 7, 1, 1, 2, 0, 0, 1, 19, ['vandal', 'phantom', 'sheriff']),
      seed('bind', 'skye', 'win', 15, 12, 17, 204, 129, 14, 34, 7, 1, 0, 1, 1, 0, 1, 17, ['phantom', 'vandal', 'sheriff']),
      seed('ascent', 'sova', 'win', 22, 13, 10, 265, 166, 23, 34, 5, 3, 1, 3, 0, 1, 2, 25, ['vandal', 'sheriff', 'spectre']),
    ],
  },
  {
    userId: 'user-diamond-kai',
    rank: mockRanks.diamond2,
    seeds: [
      seed('bind', 'omen', 'win', 20, 12, 8, 251, 158, 17, 36, 8, 2, 1, 5, 0, 0, 2, 21, ['phantom', 'vandal', 'sheriff']),
      seed('ascent', 'omen', 'win', 18, 11, 11, 236, 149, 16, 35, 8, 1, 0, 4, 1, 0, 3, 19, ['phantom', 'vandal', 'sheriff']),
      seed('split', 'killjoy', 'win', 17, 10, 7, 224, 137, 14, 32, 7, 0, 1, 1, 2, 0, 2, 18, ['phantom', 'odin', 'sheriff']),
      seed('lotus', 'omen', 'loss', 15, 15, 9, 203, 128, 13, 34, 10, 1, 1, 4, 0, 0, 1, -14, ['phantom', 'vandal', 'sheriff']),
      seed('haven', 'omen', 'win', 21, 13, 12, 262, 164, 19, 36, 7, 2, 1, 5, 0, 0, 2, 22, ['phantom', 'vandal', 'sheriff']),
      seed('bind', 'omen', 'win', 19, 10, 10, 245, 152, 18, 34, 6, 1, 0, 4, 1, 0, 2, 20, ['phantom', 'vandal', 'sheriff']),
      seed('sunset', 'killjoy', 'loss', 12, 16, 7, 171, 110, 10, 33, 9, 0, 2, 1, 1, 0, 0, -17, ['phantom', 'odin', 'sheriff']),
      seed('ascent', 'omen', 'win', 23, 12, 9, 278, 171, 21, 37, 7, 2, 1, 3, 0, 0, 1, 24, ['phantom', 'vandal', 'sheriff']),
      seed('split', 'killjoy', 'win', 16, 11, 8, 210, 131, 14, 31, 8, 0, 1, 1, 2, 0, 1, 16, ['phantom', 'odin', 'sheriff']),
      seed('bind', 'omen', 'win', 22, 13, 13, 270, 168, 20, 35, 7, 2, 0, 4, 0, 0, 3, 23, ['phantom', 'vandal', 'sheriff']),
    ],
  },
  {
    userId: 'user-immortal-nox',
    rank: mockRanks.immortal2,
    seeds: [
      seed('ascent', 'jett', 'win', 28, 15, 5, 326, 201, 27, 31, 4, 5, 2, 1, 0, 1, 2, 24, ['vandal', 'operator', 'sheriff']),
      seed('haven', 'jett', 'win', 24, 13, 6, 301, 188, 24, 30, 5, 4, 1, 0, 0, 0, 1, 22, ['vandal', 'operator', 'sheriff']),
      seed('bind', 'raze', 'loss', 21, 17, 4, 264, 166, 19, 32, 7, 3, 3, 2, 0, 0, 1, -15, ['vandal', 'phantom', 'sheriff']),
      seed('split', 'jett', 'win', 26, 14, 3, 318, 196, 25, 29, 5, 5, 1, 0, 0, 1, 2, 23, ['vandal', 'operator', 'sheriff']),
      seed('lotus', 'raze', 'win', 23, 16, 6, 286, 179, 21, 33, 6, 4, 2, 2, 0, 0, 1, 20, ['vandal', 'phantom', 'sheriff']),
      seed('ascent', 'jett', 'win', 30, 13, 4, 356, 219, 31, 28, 4, 6, 1, 1, 0, 1, 3, 27, ['vandal', 'operator', 'sheriff']),
      seed('sunset', 'jett', 'loss', 18, 18, 5, 230, 145, 16, 31, 8, 2, 4, 0, 0, 0, 0, -18, ['vandal', 'operator', 'sheriff']),
      seed('haven', 'jett', 'win', 25, 12, 7, 315, 194, 26, 30, 4, 5, 1, 1, 0, 0, 2, 25, ['vandal', 'operator', 'sheriff']),
      seed('bind', 'raze', 'win', 22, 15, 8, 282, 175, 20, 34, 6, 3, 2, 3, 0, 0, 1, 19, ['vandal', 'phantom', 'sheriff']),
      seed('ascent', 'jett', 'win', 29, 14, 5, 344, 211, 30, 29, 4, 5, 1, 0, 0, 1, 2, 26, ['vandal', 'operator', 'sheriff']),
    ],
  },
  {
    userId: 'user-volatile-mika',
    rank: mockRanks.platinum1,
    seeds: [
      seed('sunset', 'raze', 'loss', 26, 20, 3, 301, 190, 28, 30, 6, 4, 5, 1, 0, 0, 0, -20, ['vandal', 'sheriff', 'phantom']),
      seed('ascent', 'jett', 'win', 27, 15, 4, 320, 199, 29, 31, 5, 5, 3, 0, 0, 1, 1, 22, ['vandal', 'operator', 'sheriff']),
      seed('bind', 'raze', 'loss', 12, 19, 2, 158, 101, 11, 27, 9, 1, 5, 2, 0, 0, 0, -19, ['vandal', 'spectre', 'sheriff']),
      seed('haven', 'jett', 'win', 24, 14, 5, 292, 181, 25, 30, 4, 4, 2, 0, 0, 0, 1, 19, ['vandal', 'operator', 'sheriff']),
      seed('lotus', 'raze', 'loss', 9, 18, 3, 132, 84, 8, 25, 10, 0, 4, 1, 0, 0, 0, -21, ['phantom', 'spectre', 'sheriff']),
      seed('ascent', 'jett', 'win', 31, 16, 2, 356, 222, 34, 28, 4, 6, 2, 0, 0, 1, 1, 24, ['vandal', 'operator', 'sheriff']),
      seed('split', 'raze', 'loss', 11, 20, 4, 151, 96, 10, 29, 8, 1, 5, 2, 0, 0, 0, -22, ['vandal', 'spectre', 'sheriff']),
      seed('sunset', 'jett', 'loss', 17, 19, 2, 216, 139, 16, 32, 7, 2, 4, 0, 0, 0, 0, -17, ['vandal', 'operator', 'sheriff']),
      seed('haven', 'jett', 'win', 28, 14, 6, 333, 205, 30, 29, 5, 5, 2, 0, 0, 1, 2, 23, ['vandal', 'operator', 'sheriff']),
      seed('bind', 'raze', 'loss', 13, 21, 2, 164, 105, 12, 28, 9, 1, 5, 2, 0, 0, 0, -20, ['vandal', 'spectre', 'sheriff']),
    ],
  },
];

function seed(
  mapId: string,
  agentId: string,
  result: ValorantMatchResult,
  kills: number,
  deaths: number,
  assists: number,
  acs: number,
  adr: number,
  headshots: number,
  bodyshots: number,
  legshots: number,
  firstBloods: number,
  firstDeaths: number,
  plants: number,
  defuses: number,
  aces: number,
  clutches: number,
  rrChange: number,
  weapons: string[],
): MatchSeed {
  return {
    mapId,
    agentId,
    result,
    kills,
    deaths,
    assists,
    acs,
    adr,
    headshots,
    bodyshots,
    legshots,
    firstBloods,
    firstDeaths,
    plants,
    defuses,
    aces,
    clutches,
    rrChange,
    weapons,
  };
}

export const valorantMatchesMock: ValorantRecentMatch[] = userMatchPresets.flatMap((preset) =>
  preset.seeds.map((matchSeed, index) => createMatch(preset, matchSeed, index)),
);

export const valorantRoundStatsMock: ValorantRoundStats[] = valorantMatchesMock.flatMap((match) =>
  createRoundStats(match),
);

export function getRecentMatches(userId: string, limit?: number): ValorantRecentMatch[] {
  const matches = valorantMatchesMock
    .filter((match) => match.userId === userId)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));

  return typeof limit === 'number' ? matches.slice(0, limit) : matches;
}

export function getRoundStats(userId: string): ValorantRoundStats[] {
  const matchIds = new Set(getRecentMatches(userId).map((match) => match.matchId));
  return valorantRoundStatsMock.filter((round) => matchIds.has(round.matchId));
}

function createRoundStats(match: ValorantRecentMatch): ValorantRoundStats[] {
  const roundsToMock = Math.min(6, match.roundsWon + match.roundsLost);
  const primaryWeapon = match.weapons[0]?.weapon ?? 'Vandal';

  return Array.from({ length: roundsToMock }, (_, index) => {
    const roundNumber = index + 1;
    const playerWonRound = roundNumber <= Math.ceil((match.roundsWon / (match.roundsWon + match.roundsLost)) * roundsToMock);
    const playerKills = Math.max(Math.min(Math.round(match.kills / roundsToMock + (index % 3 === 0 ? 1 : 0)), 4), 0);
    const playerHeadshots = Math.min(playerKills, index % 2 === 0 ? 1 : 0);
    const loadoutValue = index === 0 ? 800 : 2900 + (index % 3) * 1000;

    return {
      matchId: match.matchId,
      roundNumber,
      winningTeam: playerWonRound ? match.teamId : match.teamId === 'Blue' ? 'Red' : 'Blue',
      roundResult: index === 0 ? 'Pistol' : playerWonRound ? 'Eliminated' : 'Detonated',
      playerTeam: match.teamId,
      playerSurvived: playerWonRound && index % 3 !== 1,
      playerKills,
      playerDamage: Math.round(match.averageDamagePerRound * (0.75 + index * 0.08)),
      playerHeadshots,
      economySpent: index === 0 ? 800 : 2200 + (index % 4) * 700,
      loadoutValue,
      weapon: index === 0 ? 'Ghost' : primaryWeapon,
      armor: index === 0 ? 'Light' : loadoutValue >= 3900 ? 'Heavy' : 'Light',
      plantedSpike: match.plants > 0 && index % 4 === 0,
      defusedSpike: match.defuses > 0 && index % 5 === 0,
    };
  });
}
