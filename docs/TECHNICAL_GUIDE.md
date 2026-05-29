# Guia Técnico — Duo Loot

Este arquivo define como o Duo Loot está sendo construído e como deve continuar evoluindo tecnicamente.

Para regras de produto, leia `docs/PROJECT_RULES.md`.
Para segurança, leia `docs/security/SECURITY_POLICY.md`.

## Stack principal

- Frontend: React + TypeScript
- Build: Vite
- Estilo: Tailwind CSS + CSS variables/design tokens
- Backend: Supabase Auth, Database e Edge Functions
- Validação: Zod quando aplicável
- Formulários: React Hook Form quando aplicável
- Rotas: React Router
- Testes: Vitest e Playwright

## Estrutura esperada

```txt
src/
  components/
  features/
  pages/
  layouts/
  routes/
  styles/
  constants/
  schemas/
  data/mocks/
  services/
  hooks/
```

## Princípios técnicos

1. Código deve ser simples de revisar.
2. Features devem ficar separadas por domínio sempre que possível.
3. Services devem concentrar acesso externo, Supabase e APIs.
4. Componentes não devem carregar regra sensível de permissão sozinhos.
5. Dados mockados devem ficar isolados e nunca parecer produção.
6. Tipos e validações devem ser explícitos.
7. Toda alteração que tocar segurança deve seguir `docs/security/SECURITY_POLICY.md`.

## Supabase

Supabase deve ser usado para:

- autenticação;
- banco de dados;
- RLS;
- RPCs;
- Edge Functions;
- integração segura com APIs externas.

### Regras para queries

Evite `select('*')` em tabelas sensíveis.

Prefira campos explícitos:

```ts
.select('id, nickname, avatar_url, trust_score')
```

Busque apenas o que a tela realmente usa.

### Regras para inserts e updates

Todo insert/update deve usar allowlist.

Nunca aceite diretamente payload aberto vindo do frontend.

Errado:

```ts
.insert([{ ...payload }])
```

Certo:

```ts
const safePayload = {
  owner_id: user.id,
  mode: safeText(payload.mode),
  region: safeText(payload.region),
};
```

Campos como `user_id`, `owner_id`, `role`, `is_admin`, `is_premium`, `plan`, `status`, `points`, `balance`, `rank` e `reward_status` não devem ser confiados quando enviados pelo cliente.

## Rotas e acesso

Rotas públicas podem ser acessadas sem login.
Rotas privadas exigem sessão.
Rotas administrativas exigem validação real em camada confiável.

Proteção visual no frontend não é segurança.

## Edge Functions

Use Edge Functions para integrações e ações que não devem expor segredo no navegador.

Regras:

- secrets nunca ficam no frontend;
- validar método HTTP;
- validar CORS;
- validar JWT quando necessário;
- validar payload;
- retornar erro seguro;
- registrar detalhes técnicos apenas no servidor;
- evitar fallback mock em produção.

## Riot/VALORANT

A integração Riot/VALORANT deve passar por Edge Function.

Nunca coloque `RIOT_API_KEY` no frontend.

O frontend deve enviar sessão real do usuário quando a consulta exigir autenticação.

A Edge Function deve validar o usuário antes de chamar APIs externas quando o recurso for sensível.

## Mocks

Mocks são permitidos para desenvolvimento e protótipo.

Regras:

- mocks devem ficar em `src/data/mocks/` ou área claramente marcada;
- não devem aparecer em produção como dados reais;
- fluxo mockado deve ter fallback explícito;
- se o mock for temporário, registre pendência em `docs/REMOTE_TODO.md`.

## Testes

Comandos principais:

```bash
npm run lint
npm run test -- --run
npm run build
npm run test:e2e
```

Se o agente não puder rodar algum teste, deve registrar em `docs/REMOTE_TODO.md`.

## Checklist técnico antes de considerar pronto

- [ ] Lint executado ou pendência registrada.
- [ ] Testes unitários executados ou pendência registrada.
- [ ] Build executado ou pendência registrada.
- [ ] E2E executado quando necessário ou pendência registrada.
- [ ] Nenhum mock perigoso ficou parecendo produção.
- [ ] Nenhuma permissão sensível depende apenas do frontend.
- [ ] Segurança registrada quando aplicável.

## Commits e documentação

Quando alterar documentação estrutural, use commits claros.

Quando alterar segurança, registre também em:

`docs/security/SECURITY_HISTORY.md`

Quando deixar algo para testar depois, registre em:

`docs/REMOTE_TODO.md`