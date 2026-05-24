// =============================================================================
// Valorant / Riot Games API — Tipos TypeScript
// =============================================================================
// Tipos derivados da documentação oficial da Riot Games API.
// Referência: https://developer.riotgames.com/apis
//
// IMPORTANTE: Esses tipos representam a camada de dados entre o front-end
// e a Edge Function server-side. O front-end NUNCA chama a Riot API diretamente.
// =============================================================================

// ---------------------------------------------------------------------------
// Regiões e Plataformas
// ---------------------------------------------------------------------------

/**
 * Regiões da Riot Account API (account-v1).
 * Usadas para buscar contas pelo Riot ID.
 */
export type RiotRegion = 'americas' | 'europe' | 'asia' | 'esports';

/**
 * Plataformas regionais do VALORANT (val-match-v1, val-ranked-v1).
 * Cada plataforma corresponde a um shard de dados de partidas.
 */
export type ValorantPlatform = 'br' | 'na' | 'latam' | 'eu' | 'ap' | 'kr';

// ---------------------------------------------------------------------------
// Riot Account DTO (account-v1)
// ---------------------------------------------------------------------------

/**
 * Resposta da Riot Account API ao buscar por Riot ID.
 * Endpoint: /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
 */
export interface RiotAccountDto {
  /** Identificador universal do jogador na Riot */
  puuid: string;
  /** Nome de exibição do Riot ID (ex: "Jett") */
  gameName: string;
  /** Tag do Riot ID (ex: "BR1") */
  tagLine: string;
}

// ---------------------------------------------------------------------------
// Match DTOs (val-match-v1)
// ---------------------------------------------------------------------------

/**
 * Resposta da API de matchlist por PUUID.
 * Endpoint: /val/match/v1/matchlists/by-puuid/{puuid}
 */
export interface ValorantMatchListDto {
  /** PUUID do jogador dono da matchlist */
  puuid: string;
  /** Lista de IDs das partidas recentes */
  history: ValorantMatchHistoryEntry[];
}

/**
 * Entrada individual do histórico de partidas.
 */
export interface ValorantMatchHistoryEntry {
  /** ID único da partida */
  matchId: string;
  /** Timestamp de início da partida (epoch ms) */
  gameStartTimeMillis: number;
  /** ID da fila (competitive, unrated, etc.) */
  queueId: string;
}

/**
 * Resumo simplificado de uma partida para exibição no front-end.
 * Dados normalizados a partir do match detail completo da Riot API.
 */
export interface ValorantMatchSummaryDto {
  /** ID único da partida */
  matchId: string;
  /** Mapa jogado */
  mapId: string;
  /** Modo de jogo */
  gameMode: string;
  /** Timestamp de início (ISO 8601) */
  gameStartTime: string;
  /** Duração em milissegundos */
  gameLengthMillis: number;
  /** Se o jogador venceu */
  isWin: boolean;
  /** Agente usado pelo jogador */
  agentId: string;
  /** Estatísticas do jogador nesta partida */
  playerStats: ValorantMatchPlayerStats;
}

/**
 * Estatísticas de um jogador em uma partida específica.
 */
export interface ValorantMatchPlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  /** Rounds jogados */
  roundsPlayed: number;
  /** Headshots contabilizados */
  headshots: number;
}

// ---------------------------------------------------------------------------
// Match normalizado para exibição no frontend
// ---------------------------------------------------------------------------

/**
 * Partida normalizada retornada pela Edge Function, pronta para uso no UI.
 */
export interface RiotMatchDisplay {
  /** Match ID */
  id: string;
  /** Resultado da partida */
  result: 'VICTORY' | 'DEFEAT' | 'DRAW';
  /** Nome do agente jogado (já resolvido) */
  agent: string;
  /** URL da imagem do agente (opcional) */
  agentImageUrl?: string;
  /** Nome do mapa (já resolvido) */
  map: string;
  /** Placar de rounds (ex: "13-7") */
  score: string;
  /** KDA formatado (ex: "20/5/8") */
  kda: string;
  /** Razão K/D */
  kdRatio: number;
  /** Combat score médio */
  combatScore: number;
  /** Data formatada (pt-BR) */
  date: string;
}

// ---------------------------------------------------------------------------
// Estatísticas agregadas do jogador
// ---------------------------------------------------------------------------

/**
 * Estatísticas de um agente específico.
 */
export interface AgentStat {
  agentName: string;
  agentRole: string;
  winRate: number;
  matchesPlayed: number;
  kda: number;
}

/**
 * Estatísticas de um mapa específico.
 */
export interface MapStat {
  mapName: string;
  winRate: number;
  matchesPlayed: number;
}

/**
 * Estatísticas agregadas calculadas a partir do histórico de partidas.
 * Usadas para exibição no perfil do jogador.
 */
export interface ValorantPlayerStats {
  /** Total de partidas analisadas */
  matchesPlayed: number;
  /** Taxa de vitória (0-100) */
  winRate: number;
  /** KDA médio */
  averageKda: number;
  /** Taxa de headshot (0-100) */
  headshotRate: number;
  /** Combat score médio por round */
  averageScore: number;
  /** Vitórias */
  wins: number;
  /** Derrotas */
  losses: number;
  /** Rank atual (ex: "Diamond 2") — pode ser null se não ranqueado */
  rank: string | null;
  /** Último agente mais jogado */
  topAgent?: string | null;
  /** Estatísticas por agente */
  agentStats: AgentStat[];
  /** Estatísticas por mapa */
  mapStats: MapStat[];
}

// ---------------------------------------------------------------------------
// Resultado de lookup de perfil (resposta da Edge Function)
// ---------------------------------------------------------------------------

/**
 * Payload retornado pela Edge Function `valorant-profile-lookup`.
 * Combina dados da conta Riot com estatísticas reais.
 */
export interface ValorantProfileLookupResult {
  /** Dados da conta Riot */
  account: RiotAccountDto;
  /** Região usada na busca */
  region: RiotRegion;
  /** Plataforma VALORANT */
  platform: ValorantPlatform;
  /** IDs das partidas recentes */
  matchIds: string[];
  /** Estatísticas agregadas reais */
  stats: ValorantPlayerStats | null;
  /** Partidas normalizadas para exibição */
  matches: RiotMatchDisplay[];
  /** ISO 8601 timestamp da última sincronização */
  lastSyncAt: string;
  /** Se os dados vieram do cache */
  cached: boolean;
}

// ---------------------------------------------------------------------------
// Parâmetros de busca (usados pelo serviço front-end)
// ---------------------------------------------------------------------------

/**
 * Parâmetros para buscar um perfil VALORANT.
 */
export interface ValorantProfileLookupParams {
  /** Nome de exibição do Riot ID */
  gameName: string;
  /** Tag do Riot ID */
  tagLine: string;
  /** Região (padrão: americas) */
  region?: RiotRegion;
  /** Plataforma (padrão: br) */
  platform?: ValorantPlatform;
}

// ---------------------------------------------------------------------------
// Erros tipados da integração
// ---------------------------------------------------------------------------

/**
 * Códigos de erro específicos da integração Valorant.
 */
export type ValorantErrorCode =
  | 'PLAYER_NOT_FOUND'
  | 'RIOT_API_KEY_MISSING'
  | 'RATE_LIMITED'
  | 'RIOT_API_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Estrutura de erro retornada pela Edge Function.
 */
export interface ValorantApiError {
  code: ValorantErrorCode;
  message: string;
  /** Status HTTP original da Riot API (quando aplicável) */
  riotStatus?: number;
}

// ---------------------------------------------------------------------------
// Duo Loot mock/intelligence layer types
// ---------------------------------------------------------------------------

export type ValorantRankTier =
  | 'Unranked'
  | 'Iron'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Ascendant'
  | 'Immortal'
  | 'Radiant';

export type ValorantRole = 'Duelist' | 'Controller' | 'Initiator' | 'Sentinel' | 'Flex';

export type ValorantQueue = 'competitive' | 'unrated' | 'swiftplay' | 'premier';

export type ValorantMatchResult = 'win' | 'loss' | 'draw';

export type ValorantInsightType = 'positive' | 'warning' | 'neutral';

export type ValorantBadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ValorantRank {
  tier: ValorantRankTier;
  division: number | null;
  label: string;
  rr: number;
  order: number;
}

export interface ValorantProfile {
  userId: string;
  riotId: string;
  gameName: string;
  tagLine: string;
  region: RiotRegion;
  platform: ValorantPlatform;
  level: number;
  avatarUrl: string;
  currentRank: ValorantRank;
  peakRank: ValorantRank;
}

export interface ValorantAgentDefinition {
  agentId: string;
  name: string;
  role: ValorantRole;
  imageUrl: string;
}

export interface ValorantMapDefinition {
  mapId: string;
  name: string;
  imageUrl: string;
}

export interface ValorantWeaponDefinition {
  weaponId: string;
  name: string;
  category: string;
  imageUrl: string;
}

export interface ValorantRoundSideStats {
  won: number;
  lost: number;
}

export interface ValorantMatchWeaponStat {
  weaponId: string;
  weapon: string;
  category: string;
  imageUrl: string;
  kills: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damage: number;
}

export interface ValorantRecentMatch {
  matchId: string;
  userId: string;
  map: string;
  mapId: string;
  mapImageUrl: string;
  agent: string;
  agentId: string;
  agentRole: ValorantRole;
  agentImageUrl: string;
  queue: ValorantQueue;
  result: ValorantMatchResult;
  teamScore: number;
  enemyScore: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  averageCombatScore: number;
  averageDamagePerRound: number;
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
  rankBefore: ValorantRank;
  rankAfter: ValorantRank;
  startedAt: string;
  durationMillis: number;
  attack: ValorantRoundSideStats;
  defense: ValorantRoundSideStats;
  weapons: ValorantMatchWeaponStat[];
}

export interface ValorantOverviewStats {
  riotId: string;
  currentRank: ValorantRank;
  peakRank: ValorantRank;
  level: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  kdaRatio: number;
  averageCombatScore: number;
  averageDamagePerRound: number;
  headshotPercent: number;
  bodyshotPercent: number;
  legshotPercent: number;
  firstBloods: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  aces: number;
  clutches: number;
  playtimeMillis: number;
  playtimeHours: number;
  mainAgent: string | null;
  strongestMap: string | null;
  mostUsedWeapon: string | null;
}

export interface ValorantAgentStats {
  agent: string;
  agentId: string;
  role: ValorantRole;
  imageUrl: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number;
  kdaRatio: number;
  averageCombatScore: number;
  averageDamagePerRound: number;
  headshotPercent: number;
  playtimeMillis: number;
  isMainAgent: boolean;
}

export interface ValorantMapStats {
  map: string;
  mapId: string;
  imageUrl: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  attackRoundsWon: number;
  attackRoundsLost: number;
  attackWinRate: number;
  defenseRoundsWon: number;
  defenseRoundsLost: number;
  defenseWinRate: number;
  bestAgent: string;
  worstAgent: string;
  averageCombatScore: number;
  averageDamagePerRound: number;
  kdRatio: number;
}

export interface ValorantWeaponStats {
  weapon: string;
  weaponId: string;
  category: string;
  imageUrl: string;
  kills: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  headshotPercent: number;
  bodyshotPercent: number;
  legshotPercent: number;
  damage: number;
  usageRate: number;
}

export interface ValorantTrendStats {
  lastMatchesCount: number;
  lastMatchesWins: number;
  lastMatchesLosses: number;
  lastMatchesWinRate: number;
  lastMatchesKd: number;
  lastMatchesAcs: number;
  lastMatchesAdr: number;
  lastMatchesHsPercent: number;
  currentWinStreak: number;
  currentLoseStreak: number;
  bestWinStreak: number;
  bestRecentMatchId: string | null;
  worstRecentMatchId: string | null;
  rrTrend: number;
}

export interface ValorantInsight {
  type: ValorantInsightType;
  title: string;
  description: string;
  metric?: string;
}

export interface ValorantBadge {
  id: string;
  label: string;
  description: string;
  rarity: ValorantBadgeRarity;
  icon: string;
}

export interface ValorantMatchmakingProfile {
  userId: string;
  primaryRole: ValorantRole;
  secondaryRole: ValorantRole;
  playStyle: 'aggressive' | 'balanced' | 'supportive' | 'lurker';
  communicationStyle: 'quiet' | 'balanced' | 'shotcaller';
  preferredMaps: string[];
  preferredAgents: string[];
  aggressionScore: number;
  reliabilityScore: number;
  consistencyScore: number;
  toxicityScore: number;
}

export interface ValorantStatsBundle {
  overviewStats: ValorantOverviewStats;
  agentStats: ValorantAgentStats[];
  mapStats: ValorantMapStats[];
  weaponStats: ValorantWeaponStats[];
  trendStats: ValorantTrendStats;
}

export interface ValorantMockUser extends ValorantStatsBundle {
  id: string;
  profile: ValorantProfile;
  recentMatches: ValorantRecentMatch[];
  matchmakingProfile: ValorantMatchmakingProfile;
  insights: ValorantInsight[];
  badges: ValorantBadge[];
}

export interface ValorantDuoCompatibilityResult {
  compatibilityScore: number;
  title: string;
  reason: string;
  strengths: string[];
  risks: string[];
}

export interface ValorantInternalLeaderboardEntry {
  userId: string;
  riotId: string;
  rank: ValorantRank;
  winRate: number;
  kdRatio: number;
  averageCombatScore: number;
  headshotPercent: number;
  clutchScore: number;
  consistencyScore: number;
  duoLootScore: number;
  position: number;
}
