import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { corsHeaders } from '../_shared/cors.ts';

// =============================================================================
// Riot Sync Stats — Sincronização real de estatísticas
// =============================================================================
// Requer autenticação. Busca matchlist + match details + calcula stats reais.
// =============================================================================

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const riotApiKey = Deno.env.get('RIOT_API_KEY');

const MAX_MATCHES = 10;
const MATCH_FETCH_DELAY_MS = 1200;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

// ---------------------------------------------------------------------------
// Mappers (mesmo da lookup)
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

function resolveMapName(mapUrl: string): string {
  return MAP_NAMES[mapUrl] || mapUrl.split('/').pop() || 'Unknown';
}

function resolveAgentName(agentId: string): string {
  return AGENT_NAMES[agentId.toLowerCase()] || agentId;
}

function resolveRank(tier: number): string {
  return RANK_TIERS[tier] || 'Unranked';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!riotApiKey) throw new Error('RIOT_API_KEY não configurada.');

    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) throw new Error('Acesso não autorizado.');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Token inválido ou expirado.');

    // Buscar PUUID do jogador no banco
    const { data: riotAccount, error: accountError } = await supabase
      .from('riot_accounts')
      .select('id, puuid, region')
      .eq('profile_id', user.id)
      .single();

    if (accountError || !riotAccount) {
      throw new Error('Conta Riot não vinculada. Faça o vínculo primeiro.');
    }

    // Cache check
    const { data: existingAccount } = await supabase
      .from('riot_accounts')
      .select('last_sync_at')
      .eq('id', riotAccount.id)
      .single();

    if (existingAccount?.last_sync_at) {
      const lastSync = new Date(existingAccount.last_sync_at).getTime();
      if (Date.now() - lastSync < CACHE_TTL_MS) {
        return new Response(
          JSON.stringify({ message: 'Dados já sincronizados recentemente. Tente novamente em alguns minutos.', cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    const valRegion = riotAccount.region || 'br';

    // Buscar matchlist real
    const matchlistRes = await fetch(
      `https://${valRegion}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${riotAccount.puuid}`,
      { headers: { 'X-Riot-Token': riotApiKey } }
    );

    if (!matchlistRes.ok) {
      const status = matchlistRes.status;
      if (status === 403) throw new Error('A chave de API não tem acesso ao endpoint de partidas do Valorant.');
      throw new Error(`Falha ao buscar o histórico de partidas na Riot (status ${status}).`);
    }

    const matchlistData = await matchlistRes.json();
    const matchHistory = (matchlistData.history || []).slice(0, MAX_MATCHES);

    // Buscar detalhes reais de cada partida
    // deno-lint-ignore no-explicit-any
    const matchDetails: any[] = [];
    for (let i = 0; i < matchHistory.length; i++) {
      const entry = matchHistory[i];
      try {
        if (i > 0) await delay(MATCH_FETCH_DELAY_MS);
        const matchRes = await fetch(
          `https://${valRegion}.api.riotgames.com/val/match/v1/matches/${entry.matchId}`,
          { headers: { 'X-Riot-Token': riotApiKey } }
        );
        if (matchRes.ok) {
          const data = await matchRes.json();
          const playerData = extractPlayerFromMatch(data, riotAccount.puuid);
          if (playerData) {
            matchDetails.push(playerData);
          }
        }
      } catch (err) {
        console.warn(`[riot-sync-stats] Erro ao buscar match ${entry.matchId}:`, err);
      }
    }

    // Calcular stats reais
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
      const winRate = Number(((wins / matchDetails.length) * 100).toFixed(1));
      const headshotRate = totalRounds > 0
        ? Number(((totalHeadshots / totalRounds) * 100).toFixed(1))
        : 0;
      const averageScore = totalRounds > 0
        ? Number((totalScore / totalRounds).toFixed(0))
        : 0;
      const bestTier = Math.max(...matchDetails.map((m) => m.competitiveTier || 0));

      // Agent stats
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
          agentRole: '',
          winRate: data.matches > 0 ? Number(((data.wins / data.matches) * 100).toFixed(0)) : 0,
          matchesPlayed: data.matches,
          kda: data.deaths > 0 ? Number(((data.kills + data.assists) / data.deaths).toFixed(2)) : data.kills + data.assists,
        }))
        .sort((a, b) => b.matchesPlayed - a.matchesPlayed);

      // Map stats
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

      // Atualizar riot_stats com dados REAIS
      const { error: statsError } = await supabase
        .from('riot_stats')
        .upsert({
          riot_account_id: riotAccount.id,
          matches_analyzed: matchDetails.length,
          win_rate: winRate,
          kda,
          headshot_rate: headshotRate,
          average_score: averageScore,
          wins,
          losses,
          current_rank: resolveRank(bestTier),
          agent_stats: agentStats,
          map_stats: mapStats,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'riot_account_id' });

      if (statsError) throw new Error(`Erro ao atualizar stats: ${statsError.message}`);

      // Salvar partidas reais (deduplicação via UNIQUE)
      for (const m of matchDetails) {
        await supabase
          .from('riot_matches')
          .upsert({
            riot_account_id: riotAccount.id,
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
      }
    }

    // Update last_sync
    await supabase.from('riot_accounts').update({ last_sync_at: new Date().toISOString() }).eq('id', riotAccount.id);

    return new Response(
      JSON.stringify({
        message: 'Sincronização concluída com sucesso!',
        matchesProcessed: matchDetails.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
