# Patch 001 — Edge Function Valorant: CORS e métodos

Objetivo: primeira micro-etapa de endurecimento da Edge Function `valorant-profile-lookup`.

Este patch altera apenas:

- remove `Access-Control-Allow-Origin: '*'`;
- remove `GET` dos métodos permitidos;
- adiciona `Vary: Origin`;
- prepara allowlist via variável `ALLOWED_ORIGINS`.

Arquivo alvo:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

## Trecho atual

```ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}
```

## Substituir por

```ts
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
]

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
```

Depois, substituir todos os usos de:

```ts
corsHeaders
```

por:

```ts
getCorsHeaders(req)
```

Exemplo:

```ts
return new Response('ok', { headers: getCorsHeaders(req) })
```

E nas respostas JSON:

```ts
{ status: 405, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
```

## Variável necessária no Supabase

Em produção, configurar:

```txt
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

Em desenvolvimento local pode manter:

```txt
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

## Como verificar

Depois de aplicar:

- `GET` deve responder 405;
- `OPTIONS` deve responder com `Access-Control-Allow-Methods: POST, OPTIONS`;
- origem fora da allowlist deve receber `Access-Control-Allow-Origin: null`;
- origem permitida deve receber ela mesma no header.

## Status

Este patch ainda não foi aplicado automaticamente porque o conector atual não faz edição parcial por diff. Ele deve ser aplicado como primeira micro-etapa antes das próximas mudanças.
