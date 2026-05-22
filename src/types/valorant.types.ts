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
