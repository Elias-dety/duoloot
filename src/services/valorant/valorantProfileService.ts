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

const EDGE_FUNCTION_BASE = `${SUPABASE_URL}/functions/v1`;

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
function createHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}

/**
 * Trata resposta de erro da Edge Function de forma padronizada.
 */
async function handleErrorResponse(response: Response): Promise<ValorantApiError> {
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
  const { gameName, tagLine, region = 'americas', platform = 'br' } = params;

  // Validação local antes de chamar o servidor
  if (!gameName?.trim() || !tagLine?.trim()) {
    throw {
      code: 'VALIDATION_ERROR',
      message: 'gameName e tagLine são obrigatórios.',
    } satisfies ValorantApiError;
  }

  try {
    const response = await fetch(
      `${EDGE_FUNCTION_BASE}/valorant-profile-lookup`,
      {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ gameName, tagLine, region, platform }),
      },
    );

    if (!response.ok) {
      throw await handleErrorResponse(response);
    }

    const data: ValorantProfileLookupResult = await response.json();
    return data;
  } catch (error) {
    // Se já é um ValorantApiError tipado, repassa
    if (isValorantApiError(error)) {
      throw error;
    }

    // Erro de rede (offline, DNS, CORS, etc.)
    throw {
      code: 'NETWORK_ERROR',
      message:
        error instanceof Error
          ? `Falha de rede: ${error.message}`
          : 'Não foi possível conectar ao servidor.',
    } satisfies ValorantApiError;
  }
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
