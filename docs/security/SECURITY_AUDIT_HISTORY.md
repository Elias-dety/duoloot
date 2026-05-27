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

---

## 3. Pontos importantes encontrados

### 3.1 Banco/Supabase ainda não está comprovadamente versionado

Não foram encontradas migrations SQL versionadas no repositório durante a auditoria.

Risco:

- não é possível auditar RLS/RPCs com segurança;
- não é possível reproduzir banco em outro ambiente;
- regras críticas podem estar apenas no painel do Supabase;
- outro agente pode criar código que depende de banco não versionado.

Ação posterior:

- exportar ou recriar migrations reais;
- versionar políticas RLS;
- versionar funções RPC;
- documentar quais tabelas existem em produção/staging.

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

### 3.3 Edge Function Valorant ainda precisa endurecimento

Arquivo pendente:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

Problemas encontrados:

- CORS com `Access-Control-Allow-Origin: *`;
- métodos permitidos incluem `GET`, embora a função só aceite `POST`;
- não foi comprovada validação de sessão real do usuário;
- mensagens internas de erro podem ser devolvidas ao cliente;
- fallback mock pode mascarar ausência da chave Riot em ambiente errado.

Ação posterior:

- restringir CORS para domínios oficiais;
- permitir apenas `POST` e `OPTIONS`;
- exigir JWT real de usuário logado;
- devolver erro genérico para o cliente;
- manter detalhes apenas no log servidor;
- adicionar rate limit/controle de abuso quando possível.

---

## 4. Comandos para executar depois no computador

Execute a partir da raiz do projeto.

### 4.1 Atualizar repositório

```bash
git checkout main
git pull origin main
```

### 4.2 Instalar dependências

Preferencialmente:

```bash
npm ci
```

Se não houver `package-lock.json` atualizado ou se `npm ci` falhar por lockfile:

```bash
npm install
```

### 4.3 Validar TypeScript e build

```bash
npm run build
```

O script atual executa:

```bash
tsc -b && vite build
```

### 4.4 Rodar lint

```bash
npm run lint
```

### 4.5 Rodar testes unitários

```bash
npm run test
```

### 4.6 Rodar testes com cobertura

```bash
npm run test:coverage
```

### 4.7 Rodar testes E2E

```bash
npm run test:e2e
```

Se o Playwright reclamar de browsers ausentes:

```bash
npx playwright install
npm run test:e2e
```

### 4.8 Rodar ambiente local

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

## 5. Checklist manual pós-patch

### 5.1 Lobby

- Criar lobby com usuário logado.
- Confirmar que `owner_id` é do usuário logado.
- Confirmar que `slots_filled` inicia como `1`.
- Confirmar que `status` inicia como `open`.
- Confirmar que campos extras enviados pelo frontend não aparecem no banco.
- Confirmar que a UI ainda exibe nome/avatar/trust score do dono.

### 5.2 Perfil

- Login de usuário existente.
- Cadastro de novo usuário.
- Criação automática de perfil.
- Carregamento de perfil no dashboard/lobby/onboarding.
- Confirmar que não houve quebra por campos não retornados.

### 5.3 Supabase/RLS

No painel ou via migrations, verificar:

- RLS ativo em `profiles`;
- RLS ativo em `lobbies`;
- RLS ativo em `lobby_members`;
- RLS ativo em `player_invites`;
- RLS ativo em tabelas do cofre;
- RLS ativo em mensagens/conexões;
- políticas de leitura/escrita por dono;
- policies administrativas separadas.

### 5.4 Admin

- Usuário comum não pode acessar ações admin.
- Usuário comum não pode chamar `validate_vault_submission`.
- Usuário comum não pode chamar `finalize_vault_event`.
- Admin real consegue executar ações permitidas.
- Toda ação admin gera log/auditoria.

### 5.5 Edge Function Valorant

- Usuário deslogado não consegue consultar.
- Usuário logado consegue consultar.
- Origem não autorizada é bloqueada.
- `GET` não é aceito.
- Erros internos não aparecem no cliente.
- Ausência de `RIOT_API_KEY` não passa despercebida em produção.

---

## 6. Próximas etapas recomendadas

### Etapa A: validar build local

Primeiro rode:

```bash
npm run build
npm run lint
npm run test
```

Se quebrar, corrigir antes de mexer no banco.

### Etapa B: endurecer Edge Function Valorant

Aplicar em micro-patches:

1. restringir CORS;
2. remover `GET` de `Access-Control-Allow-Methods`;
3. validar JWT real do usuário;
4. limitar tamanho de `gameName`, `tagLine`, `region`, `platform`;
5. usar allowlist de regiões/plataformas;
6. substituir mensagens internas por mensagens genéricas;
7. adicionar log seguro.

### Etapa C: versionar Supabase

Criar pasta:

```txt
supabase/migrations/
```

Adicionar migrations com:

- tabelas reais;
- constraints;
- índices;
- RLS;
- policies;
- RPCs;
- grants/revokes;
- comentários de segurança.

### Etapa D: criar testes de segurança

Criar testes para:

- usuário A não ler dados do usuário B;
- usuário comum não executar admin RPC;
- payload com campo `owner_id` falso ser ignorado;
- payload com `status`, `role`, `is_premium` falso ser ignorado;
- conexão/mensagem não acessível por quem não participa.

---

## 7. Regra de ouro

Nada no frontend é proteção real.

Frontend ajuda na experiência. Segurança real precisa estar em:

- Supabase RLS;
- RPCs;
- Edge Functions;
- validação server-side;
- logs/auditoria;
- menor privilégio.

Se uma ação muda estado, dinheiro, premium, ranking, convite, mensagem, cofre ou permissão, ela precisa ser validada no servidor/banco.
