# Implementation History — DuoLoot

Última atualização: 2026-05-27

Este arquivo registra o histórico de implementação e hardening feito no projeto DuoLoot, com foco em segurança, rastreabilidade e próximos passos.

---

## 1. Objetivo geral

O trabalho começou a partir do documento de vulnerabilidades usado como checklist defensivo.

Objetivos principais:

- reduzir vazamento de dados no frontend;
- evitar mass assignment;
- preparar RLS e migrations no Supabase;
- endurecer Edge Function Valorant;
- criar trilhas de auditoria e issues rastreáveis;
- definir regras para agentes futuros;
- configurar verificações automáticas.

---

## 2. Arquivos de documentação e governança criados

### `AGENTS.md`

Commit: `89565c425b9558d1dcb4659fd22b0cb68070df37`

Criado para definir regras obrigatórias para agentes e automações.

Principais regras:

- não colocar secrets no frontend;
- não usar `select('*')` em áreas sensíveis;
- usar allowlist em inserts/updates;
- não confiar em `user_id`, `owner_id`, `role`, `is_admin`, `is_premium` vindos do cliente;
- validar permissões no banco/RPC/Edge Function;
- versionar migrations;
- executar build/testes antes de considerar pronto.

### `docs/security/SECURITY_AUDIT_HISTORY.md`

Commit: `76defc259decde889b00897449805f697b18be7b`

Criado para registrar auditoria inicial, comandos para rodar depois e pendências.

### `.github/pull_request_template.md`

Commit: `6af9476b6c81627106bc406eb917483769561bc8`

Criado para obrigar PRs a declararem impacto de segurança, testes e pendências.

### `.github/workflows/security-checks.yml`

Commit: `34325b769c677bb2cdc392ec2fa37ef6f06e606b`

Criado para rodar validações em `push`, `pull_request` e manualmente.

Comandos configurados:

```bash
npm ci
npm audit --audit-level=high --omit=dev
npm run lint
npm run test -- --run
npm run build
```

Observação: posteriormente foi verificado que Vercel passou nos commits principais, mas o GitHub Actions não apareceu como run associado pelo conector no commit da Edge Function.

---

## 3. Hardening aplicado em serviços frontend

### `src/services/auth.service.ts`

Commit: `cc9d7b6209460697fe2139058f7906475aa87b2d`

Alterações:

- substituído `select('*')` por allowlist de campos do perfil;
- objetivo: evitar vazamento futuro de campos sensíveis em `profiles`.

Campos permitidos:

```txt
id
name
nickname
avatar_url
trust_score
status
is_premium
created_at
updated_at
game_profile
metadata
```

### `src/services/profiles.service.ts`

Commit: `35f7f0d5df6cd203f61b766969c85b678fb4fcbb`

Alterações:

- substituído `select('*')` por allowlist de campos;
- objetivo: limitar retorno do perfil ao necessário.

### `src/services/lobbies.service.ts`

Commit: `4eae98165fe00e84c2784e4b77b06d9f2106523d`

Alterações:

- removido `owner:profiles!owner_id(*)`;
- consulta do dono do lobby agora usa campos explícitos;
- `createLobby` agora usa allowlist;
- campos extras do cliente são ignorados;
- `owner_id` é derivado de `user.id`;
- `slots_filled` é fixado como `1`;
- `status` é fixado como `open`;
- textos são limitados em tamanho;
- `metadata` é filtrado por chaves permitidas.

Chaves permitidas em `metadata`:

```txt
mainGame
riotId
currentRank
mainRole
secondaryRole
playStyle
sessionFocus
availability
microphone
region
bio
```

---

## 4. Supabase RLS e migrations

### Migration base criada

Arquivo:

```txt
supabase/migrations/20260527000100_security_roles_and_helpers.sql
```

Commit: `01ac1f69df95bd7a4fedc05db5bab431471770a4`

Criado para adicionar uma base segura de roles.

Inclui:

- tabela `public.user_roles`;
- função `public.duoloot_current_user_role()`;
- função `public.duoloot_has_role(text[])`;
- função `public.duoloot_is_admin()`;
- RLS na tabela `user_roles`;
- policy para usuário ver a própria role e admin ver todas.

Importante:

- a migration não define nenhum admin automaticamente;
- o primeiro owner/admin precisa ser definido manualmente com `auth.users.id` real;
- ainda falta aplicar essa migration no Supabase remoto.

### Guia criado

Arquivo:

```txt
docs/security/SUPABASE_RLS_SETUP.md
```

Commit: `9649635fc52a1408d8e59d057d911e09246e8714`

Inclui:

- como aplicar migration com Supabase CLI;
- como configurar primeiro owner/admin;
- exemplos de policies para `profiles`, `lobbies` e `player_invites`;
- checklist antes de considerar RLS pronto.

### Issue aberta

Issue: `#3 — Configurar Supabase RLS e migrations versionadas`

Link:

```txt
https://github.com/Elias-dety/duoloot/issues/3
```

Status:

- aberta;
- depende de aplicar migration no Supabase real;
- depende de mapear schema real antes de criar RLS definitivo por tabela.

---

## 5. Hardening da Edge Function Valorant

### Patches documentados criados

Foram criados patches documentados em:

```txt
docs/security/patches/001-valorant-edge-cors-methods.patch.md
docs/security/patches/002-valorant-edge-payload-validation.patch.md
docs/security/patches/003-valorant-edge-safe-errors.patch.md
docs/security/patches/004-valorant-edge-auth-jwt.patch.md
```

Commits:

```txt
001: e876f34824dd5bf5f2725b508e30c58f233724fe
002: c2079c9dd917498f5c9742ee521d9d040744c18a
003: 3091ab7b1a6395308c7fe42fd03072f2b7714a5a
004: 2b8ea541b120466f592c4db5a1334a0b1cf3dc0d
```

### Checklist central criado

Arquivo:

```txt
docs/security/VALORANT_EDGE_HARDENING_CHECKLIST.md
```

Commit: `a06178abc071a3e0a510918b23daddfad8d1546d`

Inclui:

- ordem dos patches;
- critérios de aceite;
- comandos `curl` para teste;
- variáveis necessárias no Supabase.

### Frontend Valorant atualizado

Arquivo:

```txt
src/services/valorant/valorantProfileService.ts
```

Commit: `8f44347d8d1ba5c90cf360bf438e4318847600e5`

Alterações:

- removido uso de `VITE_SUPABASE_ANON_KEY` como Bearer token;
- `createHeaders()` agora usa `supabase.auth.getSession()`;
- chamada real da Edge Function envia `session.access_token`;
- se não houver sessão, retorna erro pedindo login.

### Edge Function Valorant atualizada

Arquivo:

```txt
supabase/functions/valorant-profile-lookup/index.ts
```

Commit: `e93cf2c84df07bde54d00420025696833fbb1e60`

Alterações aplicadas:

- removido `Access-Control-Allow-Origin: '*'`;
- adicionada allowlist de origem via `ALLOWED_ORIGINS`;
- métodos permitidos reduzidos para `POST, OPTIONS`;
- `GET` passa a retornar 405;
- payload passa a ser parseado com segurança;
- `gameName` limitado a 32 caracteres;
- `tagLine` limitado a 16 caracteres;
- `region` e `platform` usam allowlist;
- respostas JSON passam por helper `jsonResponse()`;
- adicionado `Cache-Control: no-store`;
- erros internos não retornam `err.message` ou `apiErr.message` ao cliente;
- adicionada validação de JWT em `/auth/v1/user` antes de chamar Riot;
- request sem sessão retorna 401;
- fallback mock agora depende de `ALLOW_RIOT_MOCK_FALLBACK=true`.

### Issue atualizada

Issue: `#2 — Aplicar hardening da Edge Function Valorant`

Link:

```txt
https://github.com/Elias-dety/duoloot/issues/2
```

Status:

- patches marcados como aplicados;
- permanece aberta até validação local/deploy real no Supabase.

Pendências da issue:

- rodar lint/test/build;
- configurar variáveis no Supabase;
- redeploy da Edge Function;
- testar token válido/inválido;
- testar CORS;
- testar payload inválido.

---

## 6. Testes de segurança

### Issue criada

Issue: `#4 — Criar testes automatizados de segurança`

Link:

```txt
https://github.com/Elias-dety/duoloot/issues/4
```

Cobre testes para:

- mass assignment no `createLobby`;
- usuário comum vs admin;
- payload malicioso;
- RLS/Supabase;
- Edge Function Valorant;
- CI/CD bloqueando regressão.

Status:

- aberta;
- implementação dos testes ainda pendente.

---

## 7. Status de CI/deploy verificado

Verificação feita após aplicação dos commits de hardening.

Resultado:

- Vercel passou no commit do frontend Valorant: `8f44347d8d1ba5c90cf360bf438e4318847600e5`;
- Vercel passou no commit da Edge Function: `e93cf2c84df07bde54d00420025696833fbb1e60`;
- GitHub Actions estava configurado, mas não apareceu como workflow run associado ao commit da Edge Function pelo conector disponível.

Interpretação:

- build/deploy da Vercel está verde;
- ainda é necessário rodar localmente e/ou confirmar GitHub Actions manualmente.

---

## 8. Comandos que devem ser executados no computador local

A partir da raiz do projeto:

```bash
git pull origin main
npm ci
npm run lint
npm run test -- --run
npm run build
```

Testes adicionais:

```bash
npm run test:coverage
npx playwright install
npm run test:e2e
```

---

## 9. Supabase: próximos comandos e ações

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

Configurar variáveis da Edge Function:

```txt
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
RIOT_API_KEY=...
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

Para ambiente local/controlado:

```txt
ALLOW_RIOT_MOCK_FALLBACK=true
```

Redeploy da Edge Function após configurar variáveis:

```bash
supabase functions deploy valorant-profile-lookup
```

---

## 10. Testes manuais obrigatórios após deploy

### Edge Function Valorant

- request sem token deve retornar 401;
- request com token inválido deve retornar 401;
- request com token válido deve consultar ou retornar erro controlado;
- `GET` deve retornar 405;
- payload vazio deve retornar 400;
- `region` inválida deve retornar 400;
- `platform` inválida deve retornar 400;
- origem fora de `ALLOWED_ORIGINS` deve retornar `Access-Control-Allow-Origin: null`;
- erros internos não devem vazar stack/message técnico.

### Supabase/RLS

- usuário comum não deve executar RPC admin;
- owner/admin deve executar RPC admin;
- usuário A não deve ler dados privados do usuário B;
- inserts não devem aceitar dono falso;
- updates não devem aceitar alteração de `owner_id`, `role`, `is_premium`, `points` ou status crítico vindo do cliente.

---

## 11. Pendências principais

1. Rodar validação local (`lint`, `test`, `build`).
2. Confirmar GitHub Actions executando corretamente.
3. Aplicar migration Supabase no projeto real.
4. Definir primeiro owner/admin.
5. Mapear schema real do banco.
6. Criar RLS definitivo por domínio.
7. Redeploy da Edge Function Valorant.
8. Configurar variáveis da Edge Function.
9. Implementar testes automatizados da issue #4.
10. Configurar proteção da branch `main` no GitHub.

---

## 12. Estado final desta rodada

O projeto agora possui:

- regras para agentes;
- histórico de auditoria;
- histórico de implementação;
- workflow de validação;
- template de PR com segurança;
- migration base de roles;
- guia de RLS;
- hardening aplicado no frontend Valorant;
- hardening aplicado na Edge Function Valorant;
- issues rastreáveis para Edge Function, RLS e testes.

Ainda não está completamente “blindado”, porque falta validar localmente e aplicar configurações no Supabase real. Mas a parte rastreável e boa parte do código defensivo já foi implementada.
