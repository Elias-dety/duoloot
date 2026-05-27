# Histórico de auditoria defensiva do DuoLoot

Data: 2026-05-27
Escopo: auditoria defensiva baseada no documento `super_checklist_vulnerabilidades_web_pre_lancamento` e inspeção do projeto `Elias-dety/duoloot`.

Este arquivo registra o que foi encontrado, o que foi alterado, o que ainda falta testar e quais comandos devem ser executados depois em ambiente local.

---

## 1. Objetivo desta auditoria

O objetivo foi começar uma revisão minuciosa de vulnerabilidades no DuoLoot, com foco inicial em:

- autenticação;
- rotas protegidas;
- Supabase;
- RLS/RPCs;
- exposição de dados no frontend;
- mass assignment;
- Edge Functions;
- segredos e variáveis de ambiente.

A auditoria foi feita em etapas pequenas para evitar alterações amplas e perigosas.

---

## 2. Arquivos alterados nesta etapa

### 2.1 `src/services/auth.service.ts`

Commit: `cc9d7b6209460697fe2139058f7906475aa87b2d`

Mudança aplicada:

- substituído `select('*')` por uma lista explícita de campos permitidos do perfil;
- objetivo: reduzir risco de vazamento futuro caso a tabela `profiles` receba campos sensíveis.

Campos permitidos:

```ts
id,
name,
nickname,
avatar_url,
trust_score,
status,
is_premium,
created_at,
updated_at,
game_profile,
metadata
```

### 2.2 `src/services/profiles.service.ts`

Commit: `35f7f0d5df6cd203f61b766969c85b678fb4fcbb`

Mudança aplicada:

- substituído `select('*')` por lista explícita de campos;
- objetivo: evitar retorno acidental de dados internos/sensíveis do perfil.

### 2.3 `src/services/lobbies.service.ts`

Commit: `4eae98165fe00e84c2784e4b77b06d9f2106523d`

Mudanças aplicadas:

- removido `owner:profiles!owner_id(*)`;
- agora a consulta do dono do lobby usa apenas campos necessários;
- `createLobby` passou a usar allowlist de campos;
- campos extras enviados pelo cliente são ignorados;
- `owner_id` é sempre derivado de `user.id`;
- `slots_filled` é sempre fixado como `1` na criação;
- `status` é sempre fixado como `open` na criação;
- strings são limitadas em tamanho;
- `metadata` é filtrado por chaves permitidas.

Chaves permitidas em `metadata`:

```ts
mainGame,
riotId,
currentRank,
mainRole,
secondaryRole,
playStyle,
sessionFocus,
availability,
microphone,
region,
bio
```

### 2.4 `src/services/valorant/valorantProfileService.ts`

Commit: `8f44347d8d1ba5c90cf360bf438e4318847600e5`

Mudanças aplicadas:

- removido uso de `VITE_SUPABASE_ANON_KEY` como Bearer token;
- `createHeaders()` agora usa `supabase.auth.getSession()`;
- chamada real da Edge Function envia `session.access_token`;
- se não houver sessão válida, o usuário recebe erro solicitando login.

### 2.5 `supabase/functions/valorant-profile-lookup/index.ts`

Commit: `e93cf2c84df07bde54d00420025696833fbb1e60`

Mudanças aplicadas:

- removido CORS aberto com `*`;
- adicionada allowlist de origem via `ALLOWED_ORIGINS`;
- métodos permitidos reduzidos para `POST, OPTIONS`;
- `GET` passa a retornar 405;
- payload passa a ser parseado com segurança;
- `gameName` limitado a 32 caracteres;
- `tagLine` limitado a 16 caracteres;
- `region` e `platform` usam allowlist;
- erros internos não retornam `err.message` ou `apiErr.message` ao cliente;
- adicionada validação de JWT em `/auth/v1/user` antes de chamar Riot;
- request sem sessão retorna 401;
- fallback mock agora depende de `ALLOW_RIOT_MOCK_FALLBACK=true`.

---

## 3. Pontos importantes encontrados

### 3.1 Banco/Supabase ainda precisa validação real

Foi criada a migration base de roles e helpers, mas ainda precisa ser aplicada no Supabase real.

Migration criada:

```txt
supabase/migrations/20260527000100_security_roles_and_helpers.sql
```

Risco enquanto não aplicar:

- RLS/RPCs ainda não estão comprovados no ambiente real;
- regras críticas podem continuar apenas no painel do Supabase;
- não é possível garantir admin/owner confiável sem aplicar `user_roles`.

Ação posterior:

- aplicar migration base;
- definir primeiro owner/admin;
- mapear schema real;
- criar RLS definitivo por domínio.

### 3.2 RPCs críticas dependem de validação no banco

O frontend chama RPCs como:

```txt
join_lobby
join_vault_event
claim_vault_mission_progress
finalize_vault_event
validate_vault_submission
send_player_invite
respond_player_invite
get_connection_messages
send_connection_message
mark_connection_messages_as_read
get_my_connections_with_unread
```

Risco:

- se a RPC não validar `auth.uid()`, dono do objeto e role/admin, pode ocorrer Broken Access Control, IDOR/BOLA ou BFLA.

Ação posterior:

- revisar cada função SQL;
- negar tudo por padrão;
- validar usuário pela sessão;
- nunca confiar em `user_id`, `owner_id`, `role`, `status`, `plan` ou `is_admin` enviados pelo cliente.

### 3.3 Edge Function Valorant foi endurecida, mas falta validação/deploy

Arquivo alterado:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

Status:

- código endurecido no repositório;
- Vercel passou no commit principal;
- ainda falta redeploy da Edge Function no Supabase;
- ainda falta testar requests reais com/sem token.

Ação posterior:

- configurar variáveis da Edge Function;
- fazer redeploy;
- rodar testes manuais com `curl`;
- validar fluxo no frontend logado.

---

## 4. Comandos para executar depois no computador

Execute a partir da raiz do projeto.

### 4.1 Atualizar repositório

```bash
git checkout main
git pull origin main
git status
```

O `git status` deve retornar árvore limpa antes de iniciar os testes.

### 4.2 Instalar dependências

Preferencialmente:

```bash
npm ci
```

Se não houver `package-lock.json` atualizado ou se `npm ci` falhar por lockfile:

```bash
npm install
```

### 4.3 Rodar auditoria de dependências

```bash
npm audit --audit-level=high --omit=dev
```

Critério:

- vulnerabilidade alta/crítica em dependência de produção deve bloquear release até revisão.

### 4.4 Rodar lint

```bash
npm run lint
```

Critério:

- nenhum erro de lint deve permanecer.

### 4.5 Rodar testes unitários em modo CI

```bash
npm run test -- --run
```

Critério:

- todos os testes unitários devem passar;
- se algum teste ficar em modo watch, usar sempre `-- --run` para execução única.

### 4.6 Rodar testes com cobertura

```bash
npm run test:coverage
```

Critério:

- cobertura deve ser analisada especialmente em services críticos:
  - auth;
  - lobbies;
  - profiles;
  - valorant;
  - invites;
  - messages;
  - vault.

### 4.7 Validar TypeScript e build de produção

```bash
npm run build
```

O script atual executa:

```bash
tsc -b && vite build
```

Critério:

- nenhum erro TypeScript;
- build Vite gerado sem falha.

### 4.8 Rodar testes E2E com Playwright

Primeira vez ou quando faltar browser:

```bash
npx playwright install
```

Depois:

```bash
npm run test:e2e
```

Critério:

- fluxo principal deve passar;
- se algum teste falhar por ambiente/credenciais, registrar claramente a causa.

### 4.9 Rodar ambiente local

```bash
npm run dev
```

Verificar manualmente:

- login;
- cadastro;
- logout;
- onboarding;
- `/lobby`;
- criar lobby;
- entrar em lobby;
- `/cofre`;
- `/admin/cofre`;
- fluxo Riot/Valorant;
- deploy preview na Vercel.

---

## 5. Sequência completa recomendada de testes locais

Use esta ordem para evitar caçar fantasmas cedo demais:

```bash
git checkout main
git pull origin main
git status
npm ci
npm audit --audit-level=high --omit=dev
npm run lint
npm run test -- --run
npm run test:coverage
npm run build
npx playwright install
npm run test:e2e
npm run dev
```

Se algum comando falhar:

1. parar a sequência;
2. corrigir a falha;
3. repetir a partir do comando que falhou;
4. só seguir depois que passar.

---

## 6. Testes manuais obrigatórios pós-patch

### 6.1 Lobby

- [ ] Criar lobby com usuário logado.
- [ ] Confirmar que `owner_id` é do usuário logado.
- [ ] Confirmar que `slots_filled` inicia como `1`.
- [ ] Confirmar que `status` inicia como `open`.
- [ ] Tentar enviar `owner_id` falso e confirmar que é ignorado.
- [ ] Tentar enviar `status` falso e confirmar que é ignorado.
- [ ] Tentar enviar `slots_filled` falso e confirmar que é ignorado.
- [ ] Confirmar que campos extras enviados pelo frontend não aparecem no banco.
- [ ] Confirmar que a UI ainda exibe nome/avatar/trust score do dono.

### 6.2 Perfil

- [ ] Login de usuário existente.
- [ ] Cadastro de novo usuário.
- [ ] Criação automática de perfil.
- [ ] Carregamento de perfil no dashboard/lobby/onboarding.
- [ ] Confirmar que não houve quebra por campos não retornados.
- [ ] Confirmar que queries de perfil não usam `select('*')` em área sensível.

### 6.3 Auth e rotas protegidas

- [ ] Usuário deslogado não acessa rotas protegidas.
- [ ] Usuário logado acessa rotas normais protegidas.
- [ ] Logout limpa sessão corretamente.
- [ ] Usuário comum não executa ações admin.
- [ ] `/admin/cofre` não deve depender só de proteção visual no frontend.

### 6.4 Supabase/RLS

No painel ou via migrations, verificar:

- [ ] RLS ativo em `user_roles`.
- [ ] `duoloot_is_admin()` retorna `true` para owner/admin.
- [ ] `duoloot_is_admin()` retorna `false` para usuário comum.
- [ ] RLS ativo em `profiles`.
- [ ] RLS ativo em `lobbies`.
- [ ] RLS ativo em `lobby_members`.
- [ ] RLS ativo em `player_invites`.
- [ ] RLS ativo em tabelas do cofre.
- [ ] RLS ativo em mensagens/conexões.
- [ ] Policies de leitura/escrita por dono.
- [ ] Policies administrativas separadas.

### 6.5 Admin/RPCs

- [ ] Usuário comum não pode chamar `validate_vault_submission`.
- [ ] Usuário comum não pode chamar `finalize_vault_event`.
- [ ] Admin real consegue executar ações permitidas.
- [ ] Toda ação admin usa `duoloot_is_admin()` ou validação equivalente no banco.
- [ ] Toda ação admin gera log/auditoria quando aplicável.

### 6.6 Edge Function Valorant

Antes dos testes, configurar no Supabase:

```txt
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
RIOT_API_KEY=...
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

Em ambiente local/controlado:

```txt
ALLOW_RIOT_MOCK_FALLBACK=true
```

Redeploy:

```bash
supabase functions deploy valorant-profile-lookup
```

Variável local para facilitar testes:

```bash
export SUPABASE_FUNCTION_URL="https://SEU_PROJECT_REF.functions.supabase.co"
```

Testar `GET` negado:

```bash
curl -i -X GET "$SUPABASE_FUNCTION_URL/valorant-profile-lookup"
```

Esperado:

```txt
HTTP 405
```

Testar sem token:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"americas","platform":"br"}'
```

Esperado:

```txt
HTTP 401
```

Testar payload vazio:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Authorization: Bearer $SUPABASE_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Esperado:

```txt
HTTP 400
```

Testar região inválida:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Authorization: Bearer $SUPABASE_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"../../x","platform":"br"}'
```

Esperado:

```txt
HTTP 400
```

Testar plataforma inválida:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Authorization: Bearer $SUPABASE_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"americas","platform":"../../x"}'
```

Esperado:

```txt
HTTP 400
```

Testar CORS com origem inválida:

```bash
curl -i -X OPTIONS "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Origin: https://dominio-nao-autorizado.com"
```

Esperado:

```txt
Access-Control-Allow-Origin: null
Access-Control-Allow-Methods: POST, OPTIONS
```

Testar token válido:

```bash
curl -i -X POST "$SUPABASE_FUNCTION_URL/valorant-profile-lookup" \
  -H "Authorization: Bearer $SUPABASE_USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameName":"Teste","tagLine":"BR1","region":"americas","platform":"br"}'
```

Esperado:

- `HTTP 200`, ou;
- erro controlado da Riot, sem `err.message`, stack trace ou detalhes internos.

### 6.7 CI/CD e Vercel

- [ ] Confirmar que Vercel passou no commit atual.
- [ ] Confirmar que GitHub Actions rodou.
- [ ] Se GitHub Actions não aparecer, abrir a aba Actions e executar `Security Checks` manualmente.
- [ ] Confirmar que falha em `lint`, `test` ou `build` bloqueia merge em PR.

---

## 7. Próximas etapas recomendadas

### Etapa A: validar build local

Primeiro rode:

```bash
npm audit --audit-level=high --omit=dev
npm run lint
npm run test -- --run
npm run test:coverage
npm run build
npm run test:e2e
```

Se quebrar, corrigir antes de mexer no banco.

### Etapa B: aplicar e validar Supabase RLS

Aplicar migration base:

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

Definir primeiro owner/admin após obter o `auth.users.id` real:

```sql
insert into public.user_roles (user_id, role)
values ('COLE_AQUI_O_AUTH_USER_ID', 'owner')
on conflict (user_id)
do update set
  role = excluded.role,
  updated_at = now();
```

Depois criar migrations por domínio:

1. profiles;
2. lobbies;
3. convites;
4. mensagens/conexões;
5. Vault/Cofre;
6. Premium/pontos/recompensas;
7. RPCs administrativas.

### Etapa C: criar testes de segurança automatizados

Criar testes para:

- usuário A não ler dados do usuário B;
- usuário comum não executar admin RPC;
- payload com campo `owner_id` falso ser ignorado;
- payload com `status`, `role`, `is_premium` falso ser ignorado;
- conexão/mensagem não acessível por quem não participa;
- Edge Function sem token retornar 401;
- Edge Function com payload inválido retornar 400.

---

## 8. Regra de ouro

Nada no frontend é proteção real.

Frontend ajuda na experiência. Segurança real precisa estar em:

- Supabase RLS;
- RPCs;
- Edge Functions;
- validação server-side;
- logs/auditoria;
- menor privilégio.

Se uma ação muda estado, dinheiro, premium, ranking, convite, mensagem, cofre ou permissão, ela precisa ser validada no servidor/banco.
