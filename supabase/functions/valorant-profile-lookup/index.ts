import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Tipos inline (Deno não compartilha tipos com o front-end)
interface LookupRequestBody {
  gameName: string;
  tagLine: string;
  region?: string;
  platform?: string;
}

interface RiotAccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface ErrorResponse {
  code: string;
  message: string;
  riotStatus?: number;
}

const VALID_REGIONS = ['americas', 'europe', 'asia', 'esports'];
const VALID_PLATFORMS = ['br', 'na', 'latam', 'eu', 'ap', 'kr'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(code: string, message: string, status = 400, riotStatus?: number): Response {
  const body: ErrorResponse = { code, message };
  if (riotStatus !== undefined) body.riotStatus = riotStatus;
  return jsonResponse(body, status);
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse('VALIDATION_ERROR', 'Método não permitido. Use POST.', 405);
  }

  // 1. Validar RIOT_API_KEY
  const riotApiKey = Deno.env.get('RIOT_API_KEY');
  if (!riotApiKey) {
    console.error('[valorant-profile-lookup] RIOT_API_KEY não configurada.');
    return errorResponse('RIOT_API_KEY_MISSING', 'Chave da Riot API não configurada no servidor.', 500);
  }

  // 2. Parsear body
  let body: LookupRequestBody;
  try {
    body = await req.json();
  } catch {
    return errorResponse('VALIDATION_ERROR', 'Body inválido. Envie JSON com gameName e tagLine.', 400);
  }

  const { gameName, tagLine } = body;
  const region = body.region || 'americas';
  const platform = body.platform || 'br';

  // 3. Validações
  if (!gameName?.trim() || !tagLine?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'gameName e tagLine são obrigatórios.', 400);
  }
  if (!VALID_REGIONS.includes(region)) {
    return errorResponse('VALIDATION_ERROR', `Região inválida: "${region}".`, 400);
  }
  if (!VALID_PLATFORMS.includes(platform)) {
    return errorResponse('VALIDATION_ERROR', `Plataforma inválida: "${platform}".`, 400);
  }

  // 4. Chamar Riot Account API (account-v1)
  const riotUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  console.log(`[valorant-profile-lookup] Buscando: ${gameName}#${tagLine} (${region})`);

  let riotResponse: Response;
  try {
    riotResponse = await fetch(riotUrl, {
      headers: { 'X-Riot-Token': riotApiKey, Accept: 'application/json' },
    });
  } catch (fetchError) {
    console.error('[valorant-profile-lookup] Erro de rede:', fetchError);
    return errorResponse('NETWORK_ERROR', 'Falha ao conectar à Riot API.', 502);
  }

  // 5. Tratar erros da Riot API
  if (!riotResponse.ok) {
    const s = riotResponse.status;
    if (s === 404) return errorResponse('PLAYER_NOT_FOUND', `Jogador "${gameName}#${tagLine}" não encontrado.`, 404, s);
    if (s === 429) return errorResponse('RATE_LIMITED', 'Rate limit da Riot API atingido.', 429, s);
    if (s === 403) return errorResponse('RIOT_API_ERROR', 'RIOT_API_KEY inválida ou expirada.', 500, s);
    return errorResponse('RIOT_API_ERROR', `Erro da Riot API (status ${s}).`, 502, s);
  }

  // 6. Montar resposta normalizada
  const accountData: RiotAccountResponse = await riotResponse.json();

  // TODO: Buscar matchlist por PUUID via val-match-v1
  // TODO: Buscar detalhes de cada partida via val-match-v1
  // TODO: Calcular estatísticas reais (winRate, KDA, rank)
  // TODO: Salvar/atualizar perfil no Supabase (tabelas: valorant_profiles, valorant_match_history)
  // TODO: Integrar RSO (Riot Sign On) para opt-in de dados pessoais em produção

  const result = {
    account: { puuid: accountData.puuid, gameName: accountData.gameName, tagLine: accountData.tagLine },
    region,
    platform,
    matchIds: [],
    stats: null,
    lastSyncAt: new Date().toISOString(),
  };

  console.log(`[valorant-profile-lookup] OK: ${accountData.gameName}#${accountData.tagLine}`);
  return jsonResponse(result);
});
