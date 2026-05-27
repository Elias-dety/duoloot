# Patch 004 — Edge Function Valorant: autenticação real/JWT

Objetivo: quarta micro-etapa de endurecimento da Edge Function `valorant-profile-lookup`.

Esta etapa impede que qualquer pessoa use a Edge Function apenas com a anon key pública. A consulta à Riot deve exigir usuário logado com sessão válida.

Este patch tem dois lados:

1. frontend envia o `access_token` real da sessão Supabase;
2. Edge Function valida esse token antes de consultar Riot API.

Arquivos alvo:

```txt
src/services/valorant/valorantProfileService.ts
supabase/functions/valorant-profile-lookup/index.ts
```

---

## 1. Frontend: parar de usar anon key como Bearer token

### Trecho atual

```ts
import { isSupabaseConfigured } from '@/lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function createHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };
}
```

### Substituir por

```ts
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function createHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw {
      code: 'RIOT_API_ERROR',
      message: 'Entre na sua conta para consultar dados do VALORANT.',
    } satisfies ValorantApiError;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}
```

### Também alterar a chamada fetch

#### Trecho atual

```ts
const response = await fetch(`${EDGE_FUNCTION_BASE}/valorant-profile-lookup`, {
  method: 'POST',
  headers: createHeaders(),
  body: JSON.stringify({ gameName, tagLine, region, platform }),
});
```

#### Substituir por

```ts
const response = await fetch(`${EDGE_FUNCTION_BASE}/valorant-profile-lookup`, {
  method: 'POST',
  headers: await createHeaders(),
  body: JSON.stringify({ gameName, tagLine, region, platform }),
});
```

---

## 2. Edge Function: validar JWT antes de chamar Riot

Adicionar helper depois dos helpers de CORS/resposta:

```ts
type AuthenticatedUser = {
  id: string
  email?: string
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
```

Depois da validação de método `POST` e antes de ler/chamar Riot, adicionar:

```ts
const authenticatedUser = await getAuthenticatedUser(req)

if (!authenticatedUser) {
  return jsonResponse(
    req,
    { code: 'UNAUTHORIZED', message: 'Entre na sua conta para continuar.' },
    401
  )
}
```

---

## 3. Importante sobre service role

Não use service role key para autenticar o usuário do navegador.

Certo:

```txt
Frontend envia access_token da sessão do usuário.
Edge Function valida esse token com Supabase Auth usando SUPABASE_ANON_KEY.
```

Errado:

```txt
Frontend envia anon key como Bearer.
Frontend conhece service role key.
Edge Function confia em user_id vindo no body.
```

---

## 4. Variáveis necessárias na Edge Function

Garantir no Supabase:

```txt
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
RIOT_API_KEY=...
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

A `SUPABASE_ANON_KEY` pode existir na Edge Function para validar JWT com Auth. Ela não é service role e não deve ser usada para bypass de RLS.

---

## 5. Como verificar

Testes esperados:

- usuário deslogado recebe 401;
- request sem Authorization recebe 401;
- request com anon key como Bearer recebe 401;
- request com token expirado recebe 401;
- usuário logado com sessão válida passa;
- a Riot API só é chamada depois da autenticação;
- nenhum `user_id` vindo do body é aceito.

---

## 6. Ordem correta

Aplicar nesta ordem:

1. Patch 001 CORS/métodos;
2. Patch 002 validação payload;
3. Patch 003 erros seguros;
4. Patch 004 autenticação real/JWT.

Depois disso, criar testes ou pelo menos checklist manual para validar a função.

## Status

Patch documentado. Deve ser aplicado depois dos patches 001, 002 e 003.
