# Patch 003 — Edge Function Valorant: erros seguros

Objetivo: terceira micro-etapa de endurecimento da Edge Function `valorant-profile-lookup`.

Este patch impede que detalhes internos, mensagens de exceção e status técnicos da Riot sejam devolvidos diretamente ao cliente.

Arquivo alvo:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

## 1. Adicionar helper de resposta JSON

Depois dos helpers de CORS do Patch 001, adicionar:

```ts
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
```

Se o Patch 001 ainda não foi aplicado, substitua temporariamente `getCorsHeaders(req)` por `corsHeaders`, mas a ordem correta é aplicar o Patch 001 primeiro.

## 2. Substituir erro da Riot com mensagem técnica

### Trecho atual

```ts
if (!accountRes.ok) {
  return new Response(
    JSON.stringify({ code: 'RIOT_API_ERROR', message: `Erro ao buscar conta Riot: HTTP ${accountRes.status}` }),
    { status: accountRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
```

### Substituir por

```ts
if (!accountRes.ok) {
  console.error(`[Lookup] Riot account endpoint failed with HTTP ${accountRes.status}`)
  return jsonResponse(
    req,
    { code: 'RIOT_API_ERROR', message: 'Falha temporária ao consultar dados externos.' },
    accountRes.status
  )
}
```

## 3. Substituir catch da Riot API

### Trecho atual

```ts
} catch (apiErr) {
  console.error('Erro de integração com a Riot API:', apiErr)
  return new Response(
    JSON.stringify({ code: 'RIOT_API_ERROR', message: apiErr.message || 'Falha ao conectar à API da Riot Games.' }),
    { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
```

### Substituir por

```ts
} catch (apiErr) {
  console.error('Erro de integração com a Riot API:', apiErr)
  return jsonResponse(
    req,
    { code: 'RIOT_API_ERROR', message: 'Falha temporária ao consultar dados externos.' },
    502
  )
}
```

## 4. Substituir catch geral

### Trecho atual

```ts
} catch (err) {
  console.error('Erro inesperado na Edge Function:', err)
  return new Response(
    JSON.stringify({ code: 'UNKNOWN_ERROR', message: err.message || 'Ocorreu um erro interno.' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
```

### Substituir por

```ts
} catch (err) {
  console.error('Erro inesperado na Edge Function:', err)
  return jsonResponse(
    req,
    { code: 'UNKNOWN_ERROR', message: 'Ocorreu um erro interno.' },
    500
  )
}
```

## 5. Opcional: trocar respostas existentes para `jsonResponse`

Depois que o patch estiver funcionando, você pode padronizar as demais respostas:

```ts
return jsonResponse(req, { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' }, 405)
```

Isso reduz repetição e evita esquecer headers seguros.

## 6. Como verificar

Testes manuais esperados:

- erro da Riot não deve retornar `HTTP 500/502` com detalhe interno no `message`;
- exception inesperada não deve retornar `err.message`;
- logs internos ainda aparecem no servidor;
- resposta do cliente permanece genérica;
- headers continuam incluindo `Content-Type: application/json`;
- headers incluem `Cache-Control: no-store`.

## Status

Patch documentado. Deve ser aplicado depois dos patches 001 e 002.
