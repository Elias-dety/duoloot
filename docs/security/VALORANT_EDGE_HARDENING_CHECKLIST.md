# Checklist de aplicação — Edge Function Valorant

Este checklist organiza a aplicação dos patches de segurança da Edge Function `valorant-profile-lookup`.

Arquivo alvo principal:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

Arquivo alvo secundário:

```txt
src/services/valorant/valorantProfileService.ts
```

## Ordem obrigatória

Aplicar exatamente nesta ordem:

1. `docs/security/patches/001-valorant-edge-cors-methods.patch.md`
2. `docs/security/patches/002-valorant-edge-payload-validation.patch.md`
3. `docs/security/patches/003-valorant-edge-safe-errors.patch.md`
4. `docs/security/patches/004-valorant-edge-auth-jwt.patch.md`

Não aplicar o Patch 004 antes dos anteriores.

---

## Patch 001 — CORS e métodos

Status esperado depois de aplicar:

- [ ] `Access-Control-Allow-Origin: '*'` removido.
- [ ] `GET` removido de `Access-Control-Allow-Methods`.
- [ ] Métodos permitidos: `POST, OPTIONS`.
- [ ] `Vary: Origin` presente.
- [ ] `ALLOWED_ORIGINS` usado para domínios permitidos.
- [ ] Origem desconhecida recebe `Access-Control-Allow-Origin: null`.

Teste manual:

```bash
curl -i -X OPTIONS "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Origin: https://dominio-nao-autorizado.com"
```

Resultado esperado:

```txt
Access-Control-Allow-Origin: null
Access-Control-Allow-Methods: POST, OPTIONS
```

---

## Patch 002 — Validação de payload

Status esperado depois de aplicar:

- [ ] `req.json()` usa `.catch(() => null)`.
- [ ] `gameName` precisa ser string válida.
- [ ] `tagLine` precisa ser string válida.
- [ ] `gameName` tem limite de 32 caracteres.
- [ ] `tagLine` tem limite de 16 caracteres.
- [ ] `region` usa allowlist.
- [ ] `platform` usa allowlist.
- [ ] Payload inválido retorna 400.

Testes manuais:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Content-Type: application/json" \
  -d '{}'
```

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"abc","tagLine":"123","region":"../../x","platform":"br"}'
```

Resultado esperado:

```txt
HTTP 400
```

---

## Patch 003 — Erros seguros

Status esperado depois de aplicar:

- [ ] `jsonResponse()` criado.
- [ ] Respostas JSON incluem `Cache-Control: no-store`.
- [ ] `apiErr.message` não é enviado ao cliente.
- [ ] `err.message` não é enviado ao cliente.
- [ ] Erros internos ficam apenas em `console.error`.
- [ ] Cliente recebe mensagem genérica segura.

Resultado esperado em falha externa:

```json
{
  "code": "RIOT_API_ERROR",
  "message": "Falha temporária ao consultar dados externos."
}
```

Resultado esperado em falha interna:

```json
{
  "code": "UNKNOWN_ERROR",
  "message": "Ocorreu um erro interno."
}
```

---

## Patch 004 — Autenticação real/JWT

Status esperado depois de aplicar no frontend:

- [ ] `valorantProfileService.ts` importa `supabase`.
- [ ] `SUPABASE_ANON_KEY` não é usado como Bearer token.
- [ ] `createHeaders()` é assíncrona.
- [ ] `createHeaders()` lê `supabase.auth.getSession()`.
- [ ] `Authorization` usa `session.access_token`.
- [ ] `fetch` usa `headers: await createHeaders()`.

Status esperado depois de aplicar na Edge Function:

- [ ] Existe helper `getAuthenticatedUser(req)`.
- [ ] A função lê `Authorization: Bearer <token>`.
- [ ] A função valida token em `/auth/v1/user`.
- [ ] Request sem token retorna 401.
- [ ] Request com token inválido retorna 401.
- [ ] Riot API só é chamada após autenticação válida.
- [ ] Nenhum `user_id` vindo do body é usado para autenticar.

Testes manuais:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"americas","platform":"br"}'
```

Resultado esperado:

```txt
HTTP 401
```

Com token válido:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Authorization: Bearer $SUPABASE_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"americas","platform":"br"}'
```

Resultado esperado:

```txt
HTTP 200
```

ou erro controlado da Riot, sem detalhes internos.

---

## Variáveis necessárias no Supabase

Configurar no ambiente da Edge Function:

```txt
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
RIOT_API_KEY=...
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

Para desenvolvimento local:

```txt
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
ALLOW_RIOT_MOCK_FALLBACK=true
```

Em produção, evitar fallback mock silencioso.

---

## Comandos de validação após aplicar os patches

Na raiz do projeto:

```bash
npm run lint
npm run test -- --run
npm run build
```

Depois validar deploy da Edge Function no Supabase.

---

## Critérios para considerar pronto

- [ ] Os 4 patches foram aplicados na ordem correta.
- [ ] Build do frontend passou.
- [ ] Edge Function foi redeployada.
- [ ] Usuário deslogado recebe 401.
- [ ] Usuário logado consegue consultar.
- [ ] CORS não aceita domínio estranho.
- [ ] GET não é permitido.
- [ ] Payload inválido retorna 400.
- [ ] Erros internos não aparecem para o cliente.
- [ ] Nenhum segredo foi exposto no frontend.
