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
}

// ---------------------------------------------------------------------------
// Estatísticas agregadas do jogador
// ---------------------------------------------------------------------------

/**
 * Estatísticas agregadas calculadas a partir do histórico de partidas.
 * Usadas para exibição no perfil do jogador.
 */
export interface ValorantPlayerStats {
  /** Total de partidas jogadas */
  matchesPlayed: number;
  /** Taxa de vitória (0-100) */
  winRate: number;
  /** KDA médio */
  averageKda: number;
  /** Rank atual (ex: "Diamond 2") — pode ser null se não ranqueado */
  rank: string | null;
  /** Último agente mais jogado */
  topAgent: string | null;
}

// ---------------------------------------------------------------------------
// Resultado de lookup de perfil (resposta da Edge Function)
// ---------------------------------------------------------------------------

/**
 * Payload retornado pela Edge Function `valorant-profile-lookup`.
 * Combina dados da conta Riot com estatísticas iniciais.
 */
export interface ValorantProfileLookupResult {
  /** Dados da conta Riot */
  account: RiotAccountDto;
  /** Região usada na busca */
  region: RiotRegion;
  /** Plataforma VALORANT */
  platform: ValorantPlatform;
  /** IDs das partidas recentes (pode ser vazio inicialmente) */
  matchIds: string[];
  /** Estatísticas agregadas (pode ser null até primeiro sync) */
  stats: ValorantPlayerStats | null;
  /** ISO 8601 timestamp da última sincronização */
  lastSyncAt: string;
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
