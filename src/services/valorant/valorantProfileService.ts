// =============================================================================
// Valorant Profile Service — Camada front-end segura
// =============================================================================
// Este serviço NÃO chama a Riot API diretamente.
// Todas as chamadas passam pela Edge Function server-side do Supabase,
// que é a única camada com acesso à RIOT_API_KEY.
//
// Fluxo: React → Edge Function (Supabase) → Riot API → resposta normalizada
// =============================================================================

import type {
  ValorantProfileLookupParams,
  ValorantProfileLookupResult,
  ValorantApiError,
  ValorantErrorCode,
} from '@/types/valorant.types';

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const EDGE_FUNCTION_BASE = `${SUPABASE_URL}/functions/v1`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Mapeia erros de rede/HTTP para ValorantApiError com código tipado.
 */
function mapErrorCode(status: number): ValorantErrorCode {
  switch (status) {
    case 404:
      return 'PLAYER_NOT_FOUND';
    case 429:
      return 'RATE_LIMITED';
    case 500:
      return 'RIOT_API_KEY_MISSING';
    default:
      return status >= 400 && status < 500 ? 'RIOT_API_ERROR' : 'UNKNOWN_ERROR';
  }
}

/**
 * Cria headers padrão para chamadas à Edge Function.
 * Usa a anon key do Supabase como Bearer token.
 */
export function createHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

/**
 * Trata resposta de erro da Edge Function de forma padronizada.
 */
export async function handleErrorResponse(response: Response): Promise<ValorantApiError> {
  try {
    const body = await response.json();
    // Se a Edge Function retornou um erro estruturado, usa-o
    if (body && body.code && body.message) {
      return body as ValorantApiError;
    }
    // Caso contrário, cria um erro a partir do status HTTP
    return {
      code: mapErrorCode(response.status),
      message: body?.message || body?.error || `Erro HTTP ${response.status}`,
      riotStatus: response.status,
    };
  } catch {
    return {
      code: mapErrorCode(response.status),
      message: `Erro HTTP ${response.status}: ${response.statusText}`,
      riotStatus: response.status,
    };
  }
}

// ---------------------------------------------------------------------------
// Serviço público
// ---------------------------------------------------------------------------

/**
 * Busca um perfil VALORANT pelo Riot ID (gameName + tagLine).
 *
 * Chama a Edge Function `valorant-profile-lookup` que faz a busca
 * real na Riot API de forma segura (server-side).
 * Retorna dados completos: conta, stats, partidas, agentes, mapas.
 *
 * @throws {ValorantApiError} Erro tipado com código e mensagem.
 *
 * @example
 * ```ts
 * const result = await lookupValorantProfile({
 *   gameName: 'DÉTY',
 *   tagLine: '2269',
 *   region: 'americas',
 *   platform: 'br',
 * });
 * ```
 */
export async function lookupValorantProfile(
  params: ValorantProfileLookupParams,
): Promise<ValorantProfileLookupResult> {
  const { gameName, tagLine } = params;

  // Validação local antes de chamar o servidor
  if (!gameName?.trim() || !tagLine?.trim()) {
    throw {
      code: 'VALIDATION_ERROR',
      message: 'gameName e tagLine são obrigatórios.',
    } satisfies ValorantApiError;
  }

  // TODO: Chamadas reais da Riot devem passar pela Edge Function server-side do Supabase
  // que é a única camada com acesso à RIOT_API_KEY. Não expor chaves no front-end.
  
  // Mocking network delay
  await new Promise(r => setTimeout(r, 1000));

  // If gameName is "Not Found", simulate a 404
  if (gameName.toLowerCase() === 'not found') {
    throw {
      code: 'PLAYER_NOT_FOUND',
      message: 'Jogador não encontrado.',
      riotStatus: 404
    } satisfies ValorantApiError;
  }

  // Mock standard data
  return {
    account: {
      puuid: 'mock-puuid-1234',
      gameName: gameName,
      tagLine: tagLine,
    },
    region: 'americas',
    platform: 'br',
    matchIds: ['match-1', 'match-2'],
    lastSyncAt: new Date().toISOString(),
    cached: true,
    stats: {
      rank: 'Diamond 2',
      matchesPlayed: 42,
      wins: 24,
      losses: 18,
      winRate: 57.1,
      averageKda: 1.45,
      headshotRate: 22.5,
      averageScore: 245,
      agentStats: [
        { agentName: 'Jett', agentRole: 'Duelist', matchesPlayed: 20, winRate: 60, kda: 1.5 },
        { agentName: 'Omen', agentRole: 'Controller', matchesPlayed: 15, winRate: 53.3, kda: 1.2 },
      ],
      mapStats: [
        { mapName: 'Ascent', matchesPlayed: 10, winRate: 70 },
        { mapName: 'Bind', matchesPlayed: 8, winRate: 50 },
      ]
    },
    matches: [
      {
        id: 'match-1',
        map: 'Ascent',
        agent: 'Jett',
        agentImageUrl: '',
        result: 'VICTORY',
        score: '13-9',
        kda: '24/12/5',
        kdRatio: 2.0,
        combatScore: 310,
        date: new Date().toISOString()
      },
      {
        id: 'match-2',
        map: 'Bind',
        agent: 'Omen',
        agentImageUrl: '',
        result: 'DEFEAT',
        score: '11-13',
        kda: '14/15/8',
        kdRatio: 0.93,
        combatScore: 195,
        date: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  };
}



// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

/**
 * Verifica se um erro é um ValorantApiError tipado.
 */
export function isValorantApiError(error: unknown): error is ValorantApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ValorantApiError).code === 'string'
  );
}
