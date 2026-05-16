# Integração Riot Games API — VALORANT

## Visão Geral

Esta documentação descreve a arquitetura de integração entre o **Duo Loot** e a **Riot Games API** para dados de VALORANT.

## Por que NÃO chamar a Riot API no front-end?

A Riot Games exige que a `RIOT_API_KEY` seja mantida em segredo.
Expor a chave no front-end (via `VITE_*`) a torna visível no bundle JavaScript, permitindo que qualquer pessoa:

- Abuse a chave para fazer requisições não autorizadas
- Esgote o rate limit da sua aplicação
- Viole os Termos de Uso da Riot, resultando em **revogação permanente** da chave

**Solução:** Toda comunicação com a Riot API passa por uma **Edge Function server-side** do Supabase, que é a única camada com acesso à `RIOT_API_KEY`.

```
┌──────────┐       ┌──────────────────┐       ┌──────────────┐
│  React   │──────>│  Supabase Edge   │──────>│  Riot Games  │
│  (front) │<──────│  Function (BE)   │<──────│  API         │
└──────────┘       └──────────────────┘       └──────────────┘
  usa apenas         RIOT_API_KEY aqui          dados oficiais
  anon key           (env server-side)
```

## Endpoints Riot que serão utilizados

| Endpoint | Descrição | Status |
|----------|-----------|--------|
| `account-v1` `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` | Buscar conta pelo Riot ID | ✅ Implementado |
| `val-match-v1` `/val/match/v1/matchlists/by-puuid/{puuid}` | Lista de partidas por PUUID | 🔜 Próximo |
| `val-match-v1` `/val/match/v1/matches/{matchId}` | Detalhes de uma partida | 🔜 Próximo |
| `val-ranked-v1` `/val/ranked/v1/leaderboards/by-act/{actId}` | Leaderboard competitivo | 📋 Backlog |
| `val-content-v1` `/val/content/v1/contents` | Conteúdo público (agentes, mapas) | 📋 Backlog |

## O que foi implementado agora

### 1. Tipos TypeScript (`src/types/valorant.types.ts`)
- `RiotRegion`, `ValorantPlatform` — enums de região/plataforma
- `RiotAccountDto` — resposta da account-v1
- `ValorantMatchListDto`, `ValorantMatchSummaryDto` — DTOs de partidas
- `ValorantPlayerStats` — estatísticas agregadas
- `ValorantProfileLookupResult` — payload normalizado da Edge Function
- `ValorantProfileLookupParams` — parâmetros de busca
- `ValorantApiError`, `ValorantErrorCode` — erros tipados

### 2. Serviço front-end (`src/services/valorant/valorantProfileService.ts`)
- `lookupValorantProfile()` — busca perfil via Edge Function
- `syncValorantProfile()` — preparado para sync futuro
- `isValorantApiError()` — type guard para erros
- Tratamento de erros: rede, rate limit, jogador não encontrado, API key ausente

### 3. Edge Function (`supabase/functions/valorant-profile-lookup/index.ts`)
- Aceita POST com `gameName`, `tagLine`, `region`, `platform`
- Valida campos obrigatórios e valores permitidos
- Lê `RIOT_API_KEY` via `Deno.env.get()`
- Chama `account-v1` da Riot API
- Retorna payload normalizado
- CORS configurado

### 4. O que NÃO foi alterado
- Nenhuma tela (LobbyPage, PlayerProfilePage) foi modificada
- Nenhum mock existente foi substituído
- O build continua funcionando normalmente

## O que fica para depois

| Funcionalidade | Prioridade |
|----------------|------------|
| Buscar matchlist por PUUID (val-match-v1) | Alta |
| Calcular stats reais (winRate, KDA, rank) | Alta |
| Persistir perfis no Supabase | Alta |
| Conectar PlayerProfilePage ao serviço real | Média |
| Integrar RSO (Riot Sign On / OAuth) | Média |
| Leaderboard competitivo (val-ranked-v1) | Baixa |
| Cache de dados de conteúdo (val-content-v1) | Baixa |

## Variáveis de ambiente

### Front-end (`.env`)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Server-side (Supabase Edge Functions)
```env
RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> ⚠️ **NUNCA** adicione `RIOT_API_KEY` com prefixo `VITE_`. Ela deve existir apenas no ambiente server-side.

## Como configurar a RIOT_API_KEY no Supabase

```bash
# Via Supabase CLI
supabase secrets set RIOT_API_KEY=RGAPI-xxxxx

# Ou via Dashboard do Supabase:
# Project Settings → Edge Functions → Secrets
```

## Como testar manualmente a Edge Function

### Via Supabase CLI (local)
```bash
# 1. Iniciar o Supabase localmente
supabase start

# 2. Definir a chave como secret local
supabase secrets set RIOT_API_KEY=RGAPI-sua-chave-aqui

# 3. Servir a função
supabase functions serve valorant-profile-lookup

# 4. Testar com curl
curl -X POST http://localhost:54321/functions/v1/valorant-profile-lookup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"gameName": "Jett", "tagLine": "BR1", "region": "americas", "platform": "br"}'
```

### Resposta esperada (sucesso)
```json
{
  "account": {
    "puuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "gameName": "Jett",
    "tagLine": "BR1"
  },
  "region": "americas",
  "platform": "br",
  "matchIds": [],
  "stats": null,
  "lastSyncAt": "2026-05-16T03:00:00.000Z"
}
```

### Resposta esperada (jogador não encontrado)
```json
{
  "code": "PLAYER_NOT_FOUND",
  "message": "Jogador \"Jett#BR1\" não encontrado.",
  "riotStatus": 404
}
```

## Aviso sobre RSO (Riot Sign On)

Para acessar **dados pessoais de jogadores** em produção (matchlist, stats detalhados), a Riot Games exige:

1. **Aplicação aprovada** no [Riot Developer Portal](https://developer.riotgames.com/)
2. **Riot Sign On (RSO)** — OAuth 2.0 onde o jogador autoriza o acesso
3. **Opt-in explícito** do jogador

Sem RSO, apenas dados **públicos** são acessíveis (conta por Riot ID, conteúdo geral).
A implementação de RSO está planejada como etapa futura.

## Estrutura de arquivos

```
src/
├── types/
│   └── valorant.types.ts          # Tipos TypeScript
├── services/
│   └── valorant/
│       ├── index.ts               # Barrel exports
│       └── valorantProfileService.ts  # Serviço front-end
supabase/
└── functions/
    └── valorant-profile-lookup/
        └── index.ts               # Edge Function server-side
docs/
└── valorant-api-integration.md    # Este documento
```
