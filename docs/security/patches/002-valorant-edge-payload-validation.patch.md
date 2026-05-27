# Patch 002 — Edge Function Valorant: validação de payload

Objetivo: segunda micro-etapa de endurecimento da Edge Function `valorant-profile-lookup`.

Este patch altera apenas a entrada recebida do cliente:

- troca `await req.json()` direto por parse seguro;
- valida tipo dos campos;
- limita tamanho de `gameName` e `tagLine`;
- adiciona allowlist de `region` e `platform`;
- rejeita payload inválido antes de chamar Riot API.

Arquivo alvo:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

## 1. Adicionar constantes e helper depois do bloco de CORS

```ts
const ALLOWED_REGIONS = new Set(['americas', 'asia', 'europe', 'sea'])
const ALLOWED_PLATFORMS = new Set(['br', 'latam', 'na', 'eu', 'ap', 'kr'])

function isSafeText(value: string, maxLength: number) {
  if (!value || value.length > maxLength) return false
  return /^[\p{L}\p{N}_.#\- ]+$/u.test(value)
}
```

## 2. Substituir o parse atual

### Trecho atual

```ts
const { gameName, tagLine, region = 'americas', platform = 'br' } = await req.json()

// 1. Validação do Payload
if (!gameName?.trim() || !tagLine?.trim()) {
  return new Response(
    JSON.stringify({ code: 'VALIDATION_ERROR', message: 'gameName e tagLine são obrigatórios.' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
```

### Substituir por

```ts
const payload = await req.json().catch(() => null) as Record<string, unknown> | null

if (!payload) {
  return new Response(
    JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Payload inválido.' }),
    { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
  )
}

const gameName = typeof payload.gameName === 'string' ? payload.gameName.trim() : ''
const tagLine = typeof payload.tagLine === 'string' ? payload.tagLine.trim() : ''
const region = typeof payload.region === 'string' ? payload.region.trim().toLowerCase() : 'americas'
const platform = typeof payload.platform === 'string' ? payload.platform.trim().toLowerCase() : 'br'

if (!isSafeText(gameName, 32) || !isSafeText(tagLine, 16)) {
  return new Response(
    JSON.stringify({ code: 'VALIDATION_ERROR', message: 'gameName ou tagLine inválidos.' }),
    { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
  )
}

if (!ALLOWED_REGIONS.has(region)) {
  return new Response(
    JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Região inválida.' }),
    { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
  )
}

if (!ALLOWED_PLATFORMS.has(platform)) {
  return new Response(
    JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Plataforma inválida.' }),
    { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
  )
}
```

## 3. Observação importante

Este patch assume que o Patch 001 já foi aplicado, porque usa:

```ts
getCorsHeaders(req)
```

Se o Patch 001 ainda não foi aplicado, use temporariamente `corsHeaders`, mas a ordem correta é:

1. Patch 001 CORS/métodos;
2. Patch 002 validação payload.

## 4. Como verificar

Testes manuais esperados:

- payload vazio retorna 400;
- `gameName` vazio retorna 400;
- `tagLine` vazio retorna 400;
- `region=../../x` retorna 400;
- `platform=../../x` retorna 400;
- `gameName` muito longo retorna 400;
- `tagLine` muito longo retorna 400;
- payload válido continua funcionando.

## Status

Patch documentado. Deve ser aplicado depois do Patch 001.
