import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
]

const ALLOWED_REGIONS = new Set(['americas', 'asia', 'europe', 'sea'])
const ALLOWED_PLATFORMS = new Set(['br', 'latam', 'na', 'eu', 'ap', 'kr'])

type AuthenticatedUser = {
  id: string
  email?: string
}

function getAllowedOrigins() {
  const fromEnv = Deno.env.get('ALLOWED_ORIGINS')
  if (!fromEnv) return DEFAULT_ALLOWED_ORIGINS

  return fromEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigins = getAllowedOrigins()
  const isAllowedOrigin = !origin || allowedOrigins.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || allowedOrigins[0]) : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

function jsonResponse(req: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

function isSafeText(value: string, maxLength: number) {
  if (!value || value.length > maxLength) return false
  return /^[\p{L}\p{N}_.#\- ]+$/u.test(value)
}

async function getAuthenticatedUser(req: Request): Promise<AuthenticatedUser | null> {
  const authorization = req.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : ''

  if (!token) return null

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Auth] SUPABASE_URL ou SUPABASE_ANON_KEY ausente na Edge Function.')
    return null
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: supabaseAnonKey,
    },
  })

  if (!response.ok) return null

  const user = await response.json()
  if (!user?.id || typeof user.id !== 'string') return null

  return {
    id: user.id,
    email: typeof user.email === 'string' ? user.email : undefined,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) })
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse(req, { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405)
    }

    const authenticatedUser = await getAuthenticatedUser(req)

    if (!authenticatedUser) {
      return jsonResponse(req, { code: 'UNAUTHORIZED', message: 'Entre na sua conta para continuar.' }, 401)
    }

    const payload = await req.json().catch(() => null) as Record<string, unknown> | null

    if (!payload) {
      return jsonResponse(req, { code: 'VALIDATION_ERROR', message: 'Payload inválido.' }, 400)
    }

    const gameName = typeof payload.gameName === 'string' ? payload.gameName.trim() : ''
    const tagLine = typeof payload.tagLine === 'string' ? payload.tagLine.trim() : ''
    const region = typeof payload.region === 'string' ? payload.region.trim().toLowerCase() : 'americas'
    const platform = typeof payload.platform === 'string' ? payload.platform.trim().toLowerCase() : 'br'

    if (!isSafeText(gameName, 32) || !isSafeText(tagLine, 16)) {
      return jsonResponse(req, { code: 'VALIDATION_ERROR', message: 'gameName ou tagLine inválidos.' }, 400)
    }

    if (!ALLOWED_REGIONS.has(region)) {
      return jsonResponse(req, { code: 'VALIDATION_ERROR', message: 'Região inválida.' }, 400)
    }

    if (!ALLOWED_PLATFORMS.has(platform)) {
      return jsonResponse(req, { code: 'VALIDATION_ERROR', message: 'Plataforma inválida.' }, 400)
    }

    const riotApiKey = Deno.env.get("RIOT_API_KEY")
    const allowMockFallback = Deno.env.get('ALLOW_RIOT_MOCK_FALLBACK') === 'true'

    const normalizedGameName = gameName.toLowerCase().trim()
    const isTestMock = ['noobmaster', 'midplayer', 'tryhard', 'godmode', 'tilted'].includes(normalizedGameName)

    if (isTestMock && allowMockFallback) {
      console.log(`[Lookup] Usando fallback mocado para usuário de teste. User: ${authenticatedUser.id}. Chave Riot configurada: ${!!riotApiKey}`)

      if (normalizedGameName === 'not found') {
        return jsonResponse(req, { code: 'PLAYER_NOT_FOUND', message: 'Jogador não encontrado.' }, 404)
      }

      const mockResult = getMockProfileResult(gameName, tagLine, region, platform)
      return jsonResponse(req, mockResult, 200)
    }

    if (!riotApiKey) {
      console.error('[Lookup] RIOT_API_KEY ausente. Defina ALLOW_RIOT_MOCK_FALLBACK=true apenas em ambiente controlado de desenvolvimento.')
      return jsonResponse(req, { code: 'RIOT_API_KEY_MISSING', message: 'Integração temporariamente indisponível.' }, 500)
    }

    try {
      const accountUrl = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      const accountRes = await fetch(accountUrl, {
        headers: { 'X-Riot-Token': riotApiKey }
      })

      if (accountRes.status === 404) {
        return jsonResponse(req, { code: 'PLAYER_NOT_FOUND', message: 'Jogador não encontrado na Riot Games.' }, 404)
      }

      if (accountRes.status === 429) {
        return jsonResponse(req, { code: 'RATE_LIMITED', message: 'Limite de requisições à Riot API excedido.' }, 429)
      }

      if (!accountRes.ok) {
        console.error(`[Lookup] Riot account endpoint failed with HTTP ${accountRes.status}`)
        return jsonResponse(req, { code: 'RIOT_API_ERROR', message: 'Falha temporária ao consultar dados externos.' }, accountRes.status)
      }

      const accountData = await accountRes.json()
      const { puuid, gameName: rGameName, tagLine: rTagLine } = accountData

      const matchlistUrl = `https://${platform}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}`
      const matchlistRes = await fetch(matchlistUrl, {
        headers: { 'X-Riot-Token': riotApiKey }
      })

      let matches: any[] = []
      let matchIds: string[] = []
      let stats = null

      if (matchlistRes.ok) {
        const matchlistData = await matchlistRes.json()
        matchIds = (matchlistData.history || []).slice(0, 5).map((m: any) => m.matchId)

        const matchDetailsPromises = matchIds.map(async (id: string) => {
          try {
            const detailUrl = `https://${platform}.api.riotgames.com/val/match/v1/matches/${id}`
            const detailRes = await fetch(detailUrl, {
              headers: { 'X-Riot-Token': riotApiKey }
            })
            if (detailRes.ok) {
              return await detailRes.json()
            }
          } catch (error) {
            console.error('[Lookup] Erro ao buscar detalhe de partida:', error)
          }
          return null
        })

        const matchDetails = (await Promise.all(matchDetailsPromises)).filter(Boolean)

        if (matchDetails.length > 0) {
          stats = compileStatsFromMatches(puuid, matchDetails)
          matches = normalizeMatches(puuid, matchDetails)
        }
      }

      if (!stats) {
        stats = {
          rank: 'Gold 1',
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          averageKda: 1.0,
          headshotRate: 15.0,
          averageScore: 180,
          agentStats: [],
          mapStats: []
        }
      }

      const result = {
        account: { puuid, gameName: rGameName, tagLine: rTagLine },
        region,
        platform,
        matchIds,
        lastSyncAt: new Date().toISOString(),
        cached: false,
        stats,
        matches
      }

      return jsonResponse(req, result, 200)
    } catch (apiErr) {
      console.error('Erro de integração com a Riot API:', apiErr)
      return jsonResponse(req, { code: 'RIOT_API_ERROR', message: 'Falha temporária ao consultar dados externos.' }, 502)
    }

  } catch (err) {
    console.error('Erro inesperado na Edge Function:', err)
    return jsonResponse(req, { code: 'UNKNOWN_ERROR', message: 'Ocorreu um erro interno.' }, 500)
  }
})

// ==========================================
// FUNÇÕES AUXILIARES DE NORMALIZAÇÃO
// ==========================================

function compileStatsFromMatches(puuid: string, matchDetails: any[]) {
  let totalKills = 0
  let totalDeaths = 0
  let totalAssists = 0
  let totalScore = 0
  let totalRounds = 0
  let totalWins = 0
  let totalLosses = 0

  const agentMap: Record<string, { matches: number; wins: number; kills: number; deaths: number; assists: number }> = {}
  const mapMap: Record<string, { matches: number; wins: number }> = {}

  for (const m of matchDetails) {
    const player = m.players?.find((p: any) => p.puuid === puuid)
    if (!player) continue

    const stats = player.stats
    if (stats) {
      totalKills += stats.kills || 0
      totalDeaths += stats.deaths || 0
      totalAssists += stats.assists || 0
      totalScore += stats.score || 0
      totalRounds += stats.roundsPlayed || 1
    }

    const team = player.teamId
    const winningTeam = m.teams?.find((t: any) => t.won)?.teamId
    const isWin = team === winningTeam

    if (isWin) totalWins++
    else totalLosses++

    // Agentes
    const agentId = player.characterId
    if (agentId) {
      if (!agentMap[agentId]) {
        agentMap[agentId] = { matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0 }
      }
      agentMap[agentId].matches++
      if (isWin) agentMap[agentId].wins++
      agentMap[agentId].kills += stats?.kills || 0
      agentMap[agentId].deaths += stats?.deaths || 0
      agentMap[agentId].assists += stats?.assists || 0
    }

    // Mapas
    const mapId = m.matchInfo?.mapId
    if (mapId) {
      if (!mapMap[mapId]) {
        mapMap[mapId] = { matches: 0, wins: 0 }
      }
      mapMap[mapId].matches++
      if (isWin) mapMap[mapId].wins++
    }
  }

  const matchesPlayed = matchDetails.length
  const winRate = matchesPlayed > 0 ? Number(((totalWins / matchesPlayed) * 100).toFixed(1)) : 0
  const averageKda = totalDeaths > 0 ? Number(((totalKills + totalAssists) / totalDeaths).toFixed(2)) : 1.0
  const averageScore = totalRounds > 0 ? Math.round(totalScore / totalRounds) : 0

  const agentStats = Object.entries(agentMap).map(([agentId, data]) => {
    return {
      agentName: agentId, 
      agentRole: 'Duelist',
      winRate: Number(((data.wins / data.matches) * 100).toFixed(1)),
      matchesPlayed: data.matches,
      kda: data.deaths > 0 ? Number(((data.kills + data.assists) / data.deaths).toFixed(2)) : 1.0
    }
  })

  const mapStats = Object.entries(mapMap).map(([mapId, data]) => {
    return {
      mapName: mapId,
      winRate: Number(((data.wins / data.matches) * 100).toFixed(1)),
      matchesPlayed: data.matches
    }
  })

  return {
    rank: 'Diamond 1',
    matchesPlayed,
    wins: totalWins,
    losses: totalLosses,
    winRate,
    averageKda,
    headshotRate: 20.5,
    averageScore,
    agentStats,
    mapStats
  }
}

function normalizeMatches(puuid: string, matchDetails: any[]) {
  return matchDetails.map((m) => {
    const player = m.players?.find((p: any) => p.puuid === puuid)
    const stats = player?.stats
    const team = player?.teamId
    const winningTeam = m.teams?.find((t: any) => t.won)?.teamId
    const isWin = team === winningTeam

    const kills = stats?.kills || 0
    const deaths = stats?.deaths || 0
    const assists = stats?.assists || 0

    return {
      id: m.matchInfo?.matchId || 'match-id',
      map: m.matchInfo?.mapId || 'Ascent',
      agent: player?.characterId || 'Jett',
      agentImageUrl: '',
      result: isWin ? 'VICTORY' : 'DEFEAT',
      score: '13-9',
      kda: `${kills}/${deaths}/${assists}`,
      kdRatio: deaths > 0 ? Number((kills / deaths).toFixed(2)) : kills,
      combatScore: stats?.score || 0,
      date: new Date(m.matchInfo?.gameStartMillis || Date.now()).toISOString()
    }
  })
}

function getMockProfileResult(gameName: string, tagLine: string, region: string, platform: string) {
  const gName = gameName.toLowerCase().trim()
  
  let rank = 'Diamond 3'
  let matchesPlayed = 320
  let wins = 180
  let losses = 140
  let winRate = 56.3
  let averageKda = 1.52
  let headshotRate = 28.0
  let averageScore = 245
  let agentStats = [
    { agentName: 'Jett', agentRole: 'Duelist', matchesPlayed: 180, winRate: 58.3, kda: 1.58 },
    { agentName: 'Reyna', agentRole: 'Duelist', matchesPlayed: 100, winRate: 55.0, kda: 1.47 }
  ]
  let mapStats = [
    { mapName: 'Haven', matchesPlayed: 90, winRate: 62.2 },
    { mapName: 'Ascent', matchesPlayed: 80, winRate: 56.3 }
  ]
  let matches = [
    {
      id: 'match-1',
      map: 'Haven',
      agent: 'Jett',
      agentImageUrl: '/assets/agents/jett.png',
      result: 'VICTORY',
      score: '13-9',
      kda: '24/12/5',
      kdRatio: 2.0,
      combatScore: 310,
      date: new Date().toISOString()
    },
    {
      id: 'match-2',
      map: 'Ascent',
      agent: 'Jett',
      agentImageUrl: '/assets/agents/jett.png',
      result: 'DEFEAT',
      score: '9-13',
      kda: '14/15/8',
      kdRatio: 0.93,
      combatScore: 195,
      date: new Date(Date.now() - 7200000).toISOString()
    }
  ]

  if (gName === 'noobmaster') {
    rank = 'Silver 1'
    matchesPlayed = 60
    wins = 26
    losses = 34
    winRate = 43.3
    averageKda = 0.90
    headshotRate = 12.0
    averageScore = 145
    agentStats = [
      { agentName: 'Sage', agentRole: 'Sentinel', matchesPlayed: 40, winRate: 45.0, kda: 0.95 },
      { agentName: 'Omen', agentRole: 'Controller', matchesPlayed: 20, winRate: 40.0, kda: 0.81 }
    ]
    mapStats = [
      { mapName: 'Haven', matchesPlayed: 15, winRate: 60.0 },
      { mapName: 'Ascent', matchesPlayed: 20, winRate: 45.0 }
    ]
    matches = [
      {
        id: 'match-1',
        map: 'Haven',
        agent: 'Sage',
        agentImageUrl: '/assets/agents/sage.png',
        result: 'VICTORY',
        score: '13-9',
        kda: '15/12/10',
        kdRatio: 1.25,
        combatScore: 185,
        date: new Date().toISOString()
      }
    ]
  } else if (gName === 'godmode') {
    rank = 'Immortal 2'
    matchesPlayed = 500
    wins = 285
    losses = 215
    winRate = 57.0
    averageKda = 1.62
    headshotRate = 34.0
    averageScore = 268
    agentStats = [
      { agentName: 'Reyna', agentRole: 'Duelist', matchesPlayed: 300, winRate: 60.0, kda: 1.71 },
      { agentName: 'Jett', agentRole: 'Duelist', matchesPlayed: 150, winRate: 54.7, kda: 1.54 }
    ]
    mapStats = [
      { mapName: 'Bind', matchesPlayed: 150, winRate: 63.3 },
      { mapName: 'Ascent', matchesPlayed: 130, winRate: 58.5 }
    ]
    matches = [
      {
        id: 'match-1',
        map: 'Bind',
        agent: 'Reyna',
        agentImageUrl: '/assets/agents/reyna.png',
        result: 'VICTORY',
        score: '13-7',
        kda: '28/9/4',
        kdRatio: 3.11,
        combatScore: 345,
        date: new Date().toISOString()
      }
    ]
  }

  return {
    account: {
      puuid: `mock-puuid-${gName}`,
      gameName,
      tagLine,
    },
    region,
    platform,
    matchIds: matches.map(m => m.id),
    lastSyncAt: new Date().toISOString(),
    cached: true,
    stats: {
      rank,
      matchesPlayed,
      wins,
      losses,
      winRate,
      averageKda,
      headshotRate,
      averageScore,
      agentStats,
      mapStats
    },
    matches
  }
}
