import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

// =============================================================================
// Valorant Profile Lookup — Fluxo completo real
// =============================================================================
// Account → Matchlist → Match Details → Stats → Salvar no Supabase → Retornar
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_REGIONS = ['americas', 'europe', 'asia', 'esports'];
const VALID_PLATFORMS = ['br', 'na', 'latam', 'eu', 'ap', 'kr'];
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos
const MAX_MATCHES = 10;
const MATCH_FETCH_DELAY_MS = 1200; // Rate limit safety

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const MAP_NAMES: Record<string, string> = {
  '/Game/Maps/Ascent/Ascent': 'Ascent',
  '/Game/Maps/Duality/Duality': 'Bind',
  '/Game/Maps/Triad/Triad': 'Haven',
  '/Game/Maps/Bonsai/Bonsai': 'Split',
  '/Game/Maps/Port/Port': 'Icebox',
  '/Game/Maps/Foxtrot/Foxtrot': 'Breeze',
  '/Game/Maps/Canyon/Canyon': 'Fracture',
  '/Game/Maps/Pitt/Pitt': 'Pearl',
  '/Game/Maps/Jam/Jam': 'Lotus',
  '/Game/Maps/Juliett/Juliett': 'Sunset',
  '/Game/Maps/HURM/HURM_Alley/HURM_Alley': 'District',
  '/Game/Maps/HURM/HURM_Bowl/HURM_Bowl': 'Kasbah',
  '/Game/Maps/HURM/HURM_Yard/HURM_Yard': 'Piazza',
  '/Game/Maps/Infinity/Infinity': 'Abyss',
};

const AGENT_NAMES: Record<string, string> = {
  '5f8d3a7f-467b-97f3-062c-13acf203c006': 'Breach',
  'f94c3b30-42be-e959-889c-5aa313dba261': 'Raze',
  '22697a3d-45bf-8dd7-4fec-84a9e28c69d7': 'Chamber',
  '601dbbe7-43ce-be57-2a40-4abd24953621': 'KAY/O',
  '6f2a04ca-43e0-be17-7f36-b3908627744d': 'Skye',
  '117ed9e3-49f3-6571-8559-92d6e538d515': 'Cypher',
  'dade69b4-4f5a-8528-247b-219e5a1facd6': 'Fade',
  '320b2a48-4d9b-a075-30f1-1f93a9b638fa': 'Sova',
  '1e58de9c-4950-5125-93e9-a0aee9f98746': 'Killjoy',
  '707eab51-4836-f488-046a-cda6bf494f14': 'Viper',
  'eb93336a-449b-9c1b-0a54-a891f7921d69': 'Phoenix',
  '41fb69c1-4189-7b37-f117-bcaf1e96f1bf': 'Astra',
  '9f0d8ba9-4140-b941-57d3-a7ad57c6b417': 'Brimstone',
  '0e38b510-41a8-5780-5e8f-568b2a4f2d6c': 'Iso',
  'bb2a4828-46eb-8cd1-e765-15848195d751': 'Neon',
  '7f94d92c-4234-0a36-9646-3a87eb8b5c89': 'Yoru',
  '569fdd95-4d10-43ab-ca70-79becc718b46': 'Sage',
  'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc': 'Reyna',
  '8e253930-4c05-31dd-1b6c-968525494517': 'Omen',
  'add6443a-41bd-e414-f6ad-e58d267f4e95': 'Jett',
  'e370fa57-4757-3604-3648-499e1f642d3f': 'Gekko',
  'cc8b64c8-4b25-4ff9-6e7f-37b4da43d235': 'Deadlock',
  '95b78ed7-4637-86d9-7e41-71ba8c293152': 'Harbor',
  '1dbf2edd-4729-0984-3115-daa5eed44993': 'Clove',
  'efba5359-4016-a1e5-7626-b1ae76895940': 'Vyse',
};

const RANK_TIERS: Record<number, string> = {
  0: 'Unranked', 3: 'Iron 1', 4: 'Iron 2', 5: 'Iron 3',
  6: 'Bronze 1', 7: 'Bronze 2', 8: 'Bronze 3',
  9: 'Silver 1', 10: 'Silver 2', 11: 'Silver 3',
  12: 'Gold 1', 13: 'Gold 2', 14: 'Gold 3',
  15: 'Platinum 1', 16: 'Platinum 2', 17: 'Platinum 3',
  18: 'Diamond 1', 19: 'Diamond 2', 20: 'Diamond 3',
  21: 'Ascendant 1', 22: 'Ascendant 2', 23: 'Ascendant 3',
  24: 'Immortal 1', 25: 'Immortal 2', 26: 'Immortal 3',
  27: 'Radiant',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveMapName(mapUrl: string): string {
  return MAP_NAMES[mapUrl] || mapUrl.split('/').pop() || 'Unknown';
}

function resolveAgentName(agentId: string): string {
  return AGENT_NAMES[agentId.toLowerCase()] || agentId;
}

function resolveRank(tier: number): string {
  return RANK_TIERS[tier] || 'Unranked';
}

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Riot API helpers
// ---------------------------------------------------------------------------

async function riotFetch(url: string, riotApiKey: string): Promise<Response> {
  return fetch(url, {
    headers: { 'X-Riot-Token': riotApiKey, Accept: 'application/json' },
  });
}

// deno-lint-ignore no-explicit-any
function extractPlayerFromMatch(matchData: any, puuid: string) {
  const players = matchData?.players || [];
  // deno-lint-ignore no-explicit-any
  const player = players.find((p: any) => p.puuid === puuid);
  if (!player) return null;

  const teamId = player.teamId;
  const teams = matchData?.teams || [];
  // deno-lint-ignore no-explicit-any
  const playerTeam = teams.find((t: any) => t.teamId === teamId);

  const roundResults = matchData?.roundResults || [];
  const roundsPlayed = roundResults.length || player.stats?.roundsPlayed || 0;

  // Count headshots from round results
  let headshots = 0;
  for (const round of roundResults) {
    const playerStats = round.playerStats || [];
    // deno-lint-ignore no-explicit-any
    const pStats = playerStats.find((ps: any) => ps.puuid === puuid);
    if (pStats) {
      for (const dmg of pStats.damage || []) {
        headshots += dmg.headshots || 0;
      }
    }
  }

  const won = playerTeam ? playerTeam.won : false;
  const teamRoundsWon = playerTeam?.roundsWon ?? 0;
  // deno-lint-ignore no-explicit-any
  const otherTeam = teams.find((t: any) => t.teamId !== teamId);
  const teamRoundsLost = otherTeam?.roundsWon ?? 0;

  let result: 'VICTORY' | 'DEFEAT' | 'DRAW' = 'DRAW';
  if (won === true) result = 'VICTORY';
  else if (won === false) result = 'DEFEAT';

  return {
    matchId: matchData.matchInfo?.matchId,
    map: resolveMapName(matchData.matchInfo?.mapId || ''),
    agent: resolveAgentName(player.characterId || ''),
    result,
    score: `${teamRoundsWon}-${teamRoundsLost}`,
    kills: player.stats?.kills ?? 0,
    deaths: player.stats?.deaths ?? 0,
    assists: player.stats?.assists ?? 0,
    combatScore: player.stats?.score ?? 0,
    headshots,
    roundsPlayed,
    competitiveTier: player.competitiveTier ?? 0,
    playedAt: matchData.matchInfo?.gameStartMillis
      ? new Date(matchData.matchInfo.gameStartMillis).toISOString()
      : new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

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

  // 4. Supabase client (service role for upserts)
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 5. Chamar Riot Account API (account-v1)
  const riotUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  console.log(`[valorant-profile-lookup] Buscando: ${gameName}#${tagLine} (${region})`);

  let riotResponse: Response;
  try {
    riotResponse = await riotFetch(riotUrl, riotApiKey);
  } catch (fetchError) {
    console.error('[valorant-profile-lookup] Erro de rede:', fetchError);
    return errorResponse('NETWORK_ERROR', 'Falha ao conectar à Riot API.', 502);
  }

  if (!riotResponse.ok) {
    const s = riotResponse.status;
    if (s === 404) return errorResponse('PLAYER_NOT_FOUND', `Jogador "${gameName}#${tagLine}" não encontrado.`, 404, s);
    if (s === 429) return errorResponse('RATE_LIMITED', 'Rate limit da Riot API atingido.', 429, s);
    if (s === 403) return errorResponse('RIOT_API_ERROR', 'RIOT_API_KEY inválida ou expirada.', 500, s);
    return errorResponse('RIOT_API_ERROR', `Erro da Riot API (status ${s}).`, 502, s);
  }

  const accountData: RiotAccountResponse = await riotResponse.json();
  const { puuid } = accountData;

  // 6. Cache check — buscar dados existentes no banco
  const { data: existingAccount } = await supabase
    .from('riot_accounts')
    .select('id, last_sync_at')
    .eq('puuid', puuid)
    .maybeSingle();

  if (existingAccount?.last_sync_at) {
    const lastSync = new Date(existingAccount.last_sync_at).getTime();
    const now = Date.now();
    if (now - lastSync < CACHE_TTL_MS) {
      console.log(`[valorant-profile-lookup] Cache hit para ${gameName}#${tagLine}`);

      // Retornar dados do banco
      const { data: cachedStats } = await supabase
        .from('riot_stats')
        .select('*')
        .eq('riot_account_id', existingAccount.id)
        .maybeSingle();

      const { data: cachedMatches } = await supabase
        .from('riot_matches')
        .select('*')
        .eq('riot_account_id', existingAccount.id)
        .order('played_at', { ascending: false })
        .limit(MAX_MATCHES);

      return jsonResponse({
        account: { puuid: accountData.puuid, gameName: accountData.gameName, tagLine: accountData.tagLine },
        region,
        platform,
        stats: cachedStats ? {
          matchesPlayed: cachedStats.matches_analyzed,
          winRate: Number(cachedStats.win_rate),
          averageKda: Number(cachedStats.kda),
          headshotRate: Number(cachedStats.headshot_rate),
          averageScore: Number(cachedStats.average_score),
          wins: cachedStats.wins,
          losses: cachedStats.losses,
          rank: cachedStats.current_rank,
          agentStats: cachedStats.agent_stats,
          mapStats: cachedStats.map_stats,
        } : null,
        matches: (cachedMatches || []).map((m) => ({
          id: m.match_id,
          result: m.result,
          agent: m.agent,
          map: m.map,
          score: m.score || '',
          kda: `${m.kills}/${m.deaths}/${m.assists}`,
          kdRatio: m.deaths > 0 ? Number(((m.kills + m.assists * 0.5) / m.deaths).toFixed(2)) : m.kills + m.assists * 0.5,
          combatScore: m.combat_score,
          date: new Date(m.played_at).toLocaleDateString('pt-BR'),
        })),
        matchIds: (cachedMatches || []).map((m) => m.match_id),
        lastSyncAt: existingAccount.last_sync_at,
        cached: true,
      });
    }
  }

  // 7. Buscar matchlist
  const matchlistUrl = `https://${platform}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`;
  console.log(`[valorant-profile-lookup] Buscando matchlist para ${puuid}`);

  let matchHistory: { matchId: string; gameStartTimeMillis: number }[] = [];
  try {
    const matchlistRes = await riotFetch(matchlistUrl, riotApiKey);
    if (matchlistRes.ok) {
      const matchlistData = await matchlistRes.json();
      matchHistory = (matchlistData.history || []).slice(0, MAX_MATCHES);
    } else {
      console.warn(`[valorant-profile-lookup] Matchlist falhou (status ${matchlistRes.status}). A key pode não ter acesso a val/match/v1.`);
    }
  } catch (err) {
    console.warn('[valorant-profile-lookup] Erro ao buscar matchlist:', err);
  }

  // 8. Buscar detalhes de cada partida
  // deno-lint-ignore no-explicit-any
  const matchDetails: any[] = [];
  for (let i = 0; i < matchHistory.length; i++) {
    const entry = matchHistory[i];
    try {
      if (i > 0) await delay(MATCH_FETCH_DELAY_MS); // Rate limit
      const matchUrl = `https://${platform}.api.riotgames.com/val/match/v1/matches/${entry.matchId}`;
      const matchRes = await riotFetch(matchUrl, riotApiKey);
      if (matchRes.ok) {
        const data = await matchRes.json();
        const playerData = extractPlayerFromMatch(data, puuid);
        if (playerData) {
          matchDetails.push(playerData);
        }
      } else {
        console.warn(`[valorant-profile-lookup] Match ${entry.matchId} falhou (status ${matchRes.status})`);
      }
    } catch (err) {
      console.warn(`[valorant-profile-lookup] Erro ao buscar match ${entry.matchId}:`, err);
    }
  }

  // 9. Calcular stats agregados
  let stats = null;
  if (matchDetails.length > 0) {
    const totalKills = matchDetails.reduce((s, m) => s + m.kills, 0);
    const totalDeaths = matchDetails.reduce((s, m) => s + m.deaths, 0);
    const totalAssists = matchDetails.reduce((s, m) => s + m.assists, 0);
    const totalScore = matchDetails.reduce((s, m) => s + m.combatScore, 0);
    const totalRounds = matchDetails.reduce((s, m) => s + m.roundsPlayed, 0);
    const totalHeadshots = matchDetails.reduce((s, m) => s + m.headshots, 0);
    const wins = matchDetails.filter((m) => m.result === 'VICTORY').length;
    const losses = matchDetails.filter((m) => m.result === 'DEFEAT').length;

    const kda = totalDeaths > 0
      ? Number(((totalKills + totalAssists) / totalDeaths).toFixed(2))
      : totalKills + totalAssists;
    const winRate = matchDetails.length > 0
      ? Number(((wins / matchDetails.length) * 100).toFixed(1))
      : 0;
    const headshotRate = totalRounds > 0
      ? Number(((totalHeadshots / totalRounds) * 100).toFixed(1))
      : 0;
    const averageScore = totalRounds > 0
      ? Number((totalScore / totalRounds).toFixed(0))
      : 0;

    // Best rank from recent matches
    const bestTier = Math.max(...matchDetails.map((m) => m.competitiveTier || 0));
    const currentRank = resolveRank(bestTier);

    // Agent stats aggregation
    const agentMap = new Map<string, { wins: number; matches: number; kills: number; deaths: number; assists: number }>();
    for (const m of matchDetails) {
      const existing = agentMap.get(m.agent) || { wins: 0, matches: 0, kills: 0, deaths: 0, assists: 0 };
      existing.matches++;
      if (m.result === 'VICTORY') existing.wins++;
      existing.kills += m.kills;
      existing.deaths += m.deaths;
      existing.assists += m.assists;
      agentMap.set(m.agent, existing);
    }
    const agentStats = Array.from(agentMap.entries())
      .map(([agentName, data]) => ({
        agentName,
        agentRole: '', // Could be enriched later
        winRate: data.matches > 0 ? Number(((data.wins / data.matches) * 100).toFixed(0)) : 0,
        matchesPlayed: data.matches,
        kda: data.deaths > 0 ? Number(((data.kills + data.assists) / data.deaths).toFixed(2)) : data.kills + data.assists,
      }))
      .sort((a, b) => b.matchesPlayed - a.matchesPlayed);

    // Map stats aggregation
    const mapMap = new Map<string, { wins: number; matches: number }>();
    for (const m of matchDetails) {
      const existing = mapMap.get(m.map) || { wins: 0, matches: 0 };
      existing.matches++;
      if (m.result === 'VICTORY') existing.wins++;
      mapMap.set(m.map, existing);
    }
    const mapStats = Array.from(mapMap.entries())
      .map(([mapName, data]) => ({
        mapName,
        winRate: data.matches > 0 ? Number(((data.wins / data.matches) * 100).toFixed(0)) : 0,
        matchesPlayed: data.matches,
      }))
      .sort((a, b) => b.matchesPlayed - a.matchesPlayed);

    stats = {
      matchesPlayed: matchDetails.length,
      winRate,
      averageKda: kda,
      headshotRate,
      averageScore,
      wins,
      losses,
      rank: currentRank,
      agentStats,
      mapStats,
    };
  }

  // 10. Salvar no Supabase
  try {
    // Upsert riot_accounts
    const { data: accountRow, error: accountError } = await supabase
      .from('riot_accounts')
      .upsert({
        ...(existingAccount?.id ? { id: existingAccount.id } : {}),
        puuid,
        game_name: accountData.gameName,
        tag_line: accountData.tagLine,
        region,
        last_sync_at: new Date().toISOString(),
        // profile_id will be null for public lookups (no authenticated user)
      }, { onConflict: 'puuid', ignoreDuplicates: false })
      .select('id')
      .single();

    if (accountError) {
      console.error('[valorant-profile-lookup] Erro ao salvar conta:', accountError.message);
    }

    const riotAccountId = accountRow?.id;

    if (riotAccountId && stats) {
      // Upsert riot_stats
      const { error: statsError } = await supabase
        .from('riot_stats')
        .upsert({
          riot_account_id: riotAccountId,
          matches_analyzed: stats.matchesPlayed,
          win_rate: stats.winRate,
          kda: stats.averageKda,
          headshot_rate: stats.headshotRate,
          average_score: stats.averageScore,
          wins: stats.wins,
          losses: stats.losses,
          current_rank: stats.rank,
          agent_stats: stats.agentStats,
          map_stats: stats.mapStats,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'riot_account_id' });

      if (statsError) {
        console.error('[valorant-profile-lookup] Erro ao salvar stats:', statsError.message);
      }

      // Upsert matches (deduplicação via UNIQUE)
      for (const m of matchDetails) {
        const { error: matchError } = await supabase
          .from('riot_matches')
          .upsert({
            riot_account_id: riotAccountId,
            match_id: m.matchId,
            map: m.map,
            agent: m.agent,
            result: m.result,
            score: m.score,
            kills: m.kills,
            deaths: m.deaths,
            assists: m.assists,
            combat_score: m.combatScore,
            headshots: m.headshots,
            rounds_played: m.roundsPlayed,
            played_at: m.playedAt,
          }, { onConflict: 'riot_account_id,match_id' });

        if (matchError) {
          console.warn(`[valorant-profile-lookup] Erro ao salvar match ${m.matchId}:`, matchError.message);
        }
      }
    }
  } catch (dbError) {
    console.error('[valorant-profile-lookup] Erro de banco:', dbError);
    // Continue — retorna os dados mesmo se o salvamento falhar
  }

  // 11. Montar e retornar resposta completa
  const matches = matchDetails.map((m) => ({
    id: m.matchId,
    result: m.result,
    agent: m.agent,
    map: m.map,
    score: m.score,
    kda: `${m.kills}/${m.deaths}/${m.assists}`,
    kdRatio: m.deaths > 0 ? Number(((m.kills + m.assists * 0.5) / m.deaths).toFixed(2)) : m.kills + m.assists * 0.5,
    combatScore: m.combatScore,
    date: new Date(m.playedAt).toLocaleDateString('pt-BR'),
  }));

  const result = {
    account: { puuid: accountData.puuid, gameName: accountData.gameName, tagLine: accountData.tagLine },
    region,
    platform,
    stats,
    matches,
    matchIds: matchDetails.map((m) => m.matchId),
    lastSyncAt: new Date().toISOString(),
    cached: false,
  };

  console.log(`[valorant-profile-lookup] OK: ${accountData.gameName}#${accountData.tagLine} — ${matchDetails.length} matches processados`);
  return jsonResponse(result);
});
