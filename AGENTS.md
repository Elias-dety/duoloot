# AGENTS.md — Regras obrigatórias para agentes no DuoLoot

Este arquivo define regras obrigatórias para qualquer agente, assistente, automação ou pessoa alterando este repositório.

O objetivo é evitar regressões de segurança, vazamento de dados, permissões fracas, bypass de autenticação e mudanças amplas sem revisão.

Estas regras devem ser seguidas estritamente.

---

## 1. Princípio central

Segurança real nunca deve depender apenas do frontend.

O frontend pode esconder botões, melhorar UX e guiar o usuário, mas toda ação sensível deve ser validada no servidor, no banco ou em Edge Function.

Ações sensíveis incluem, sem limitar:

- login;
- cadastro;
- logout;
- alteração de perfil;
- criação/entrada em lobby;
- convites;
- mensagens;
- conexões;
- ranking;
- Cofre/Vault;
- missões;
- submissões;
- validações admin;
- Premium;
- pagamentos;
- integração Riot/Valorant;
- funções Supabase RPC;
- Edge Functions;
- qualquer ação que altere estado ou leia dados privados.

---

## 2. Proibições absolutas

Nunca fazer:

1. Nunca colocar secrets no frontend.
2. Nunca usar `VITE_` para segredo real.
3. Nunca expor `RIOT_API_KEY`, service role key, client secret, webhook secret ou token privado.
4. Nunca commitar `.env`, `.env.local`, dumps de banco, logs sensíveis ou tokens.
5. Nunca confiar em `user_id`, `owner_id`, `role`, `is_admin`, `is_premium`, `plan`, `status`, `points`, `balance`, `rank` ou `trust_score` vindo do cliente.
6. Nunca usar `select('*')` em tabela que possa ter dados privados ou crescer no futuro.
7. Nunca criar action/admin apenas escondendo botão no frontend.
8. Nunca criar RPC que altera estado sem validar `auth.uid()`.
9. Nunca criar Edge Function pública para recurso sensível sem autenticação.
10. Nunca devolver erro interno cru para o cliente.
11. Nunca criar migration gigante sem separar por domínio.
12. Nunca alterar regras de permissão sem explicar impacto.
13. Nunca reduzir validação para “fazer funcionar rápido”.
14. Nunca usar `dangerouslySetInnerHTML` sem sanitização formal e justificativa documentada.
15. Nunca aceitar payload aberto em inserts/updates.
16. Nunca usar dados reais de usuários em mocks, seeds ou testes.
17. Nunca publicar documentação interna com endpoints sensíveis, tokens ou exemplos reais.
18. Nunca adicionar dependência nova sem avaliar risco, manutenção e necessidade.

---

## 3. Regras para Supabase

Toda tabela sensível deve ter:

- RLS ativo;
- policies explícitas;
- menor privilégio;
- índices para campos usados em filtros;
- constraints contra duplicidade;
- timestamps quando fizer sentido;
- validações por dono/participante/admin;
- migrations versionadas no repositório.

### 3.1 RPCs

Toda RPC deve:

- validar usuário via `auth.uid()`;
- negar usuário anônimo quando a ação exigir login;
- validar dono do objeto;
- validar participação em conexão/lobby/cofre quando aplicável;
- validar role/admin no banco, nunca no payload;
- usar parâmetros mínimos;
- ignorar ou rejeitar campos extras;
- retornar mensagens seguras;
- ser documentada em migration.

### 3.2 RPCs administrativas

RPC administrativa deve:

- checar role/admin no banco;
- nunca aceitar `is_admin` do cliente;
- registrar auditoria;
- negar por padrão;
- retornar erro genérico para usuário comum;
- ter teste comprovando que usuário comum não executa.

Exemplos críticos:

```txt
validate_vault_submission
finalize_vault_event
```

---

## 4. Regras para frontend

### 4.1 Queries

Evitar:

```ts
.select('*')
```

Preferir:

```ts
.select('id, name, nickname, avatar_url')
```

Nunca buscar campo que a tela não usa.

### 4.2 Payloads

Todo insert/update deve usar allowlist.

Errado:

```ts
.insert([{ ...payload, owner_id: user.id }])
```

Correto:

```ts
const safePayload = {
  owner_id: user.id,
  mode: safeText(payload.mode),
  queue: safeText(payload.queue),
  metadata: sanitizeMetadata(payload.metadata),
};
```

### 4.3 Rotas protegidas

Rotas protegidas no frontend são apenas UX.

Para áreas admin, usar também:

- role real no banco;
- RLS;
- RPC com checagem admin;
- auditoria.

### 4.4 Auth

Não armazenar tokens manualmente em `localStorage`.

Usar o SDK do Supabase e sessão oficial.

---

## 5. Regras para Edge Functions

Toda Edge Function sensível deve:

- validar método permitido;
- aceitar apenas métodos necessários;
- validar origem quando chamada por navegador;
- exigir JWT real de usuário logado quando necessário;
- validar payload com allowlist;
- limitar tamanho dos campos;
- usar allowlist para enums como região/plataforma/status;
- não retornar stack trace, erro cru ou mensagem interna;
- logar detalhes apenas no servidor;
- nunca expor secrets;
- ter rate limit ou controle equivalente quando possível.

### 5.1 CORS

Evitar:

```ts
'Access-Control-Allow-Origin': '*'
```

Preferir allowlist de origens:

```ts
const allowedOrigins = [
  'http://localhost:5173',
  'https://seudominio.com',
];
```

### 5.2 Métodos

Evitar permitir método não usado.

Se a função só usa POST:

```ts
'Access-Control-Allow-Methods': 'POST, OPTIONS'
```

---

## 6. Regras para Riot/Valorant

1. A Riot API Key nunca deve ir para React.
2. A Riot API Key deve ficar em Supabase secrets.
3. O frontend deve chamar apenas Edge Function.
4. A Edge Function deve validar usuário logado antes de consultar Riot, exceto em mocks locais claramente isolados.
5. Não usar PUUID, nick real ou dados reais em mocks sem autorização.
6. Não mascarar erro de configuração em produção com fallback mock silencioso.
7. Tratar rate limit da Riot com cuidado.

---

## 7. Regras para Premium, pontos e recompensas

Qualquer lógica de Premium, pontos, saldo, recompensa ou ranking deve ser server-side.

Nunca confiar em:

```txt
is_premium
plan
balance
points
rank
reward_status
```

quando vier do cliente.

Requisitos mínimos:

- histórico transacional;
- idempotência;
- auditoria;
- constraints contra duplicidade;
- RLS;
- validação por usuário/tenant;
- testes de abuso.

---

## 8. Regras para logs e erros

Não logar:

- tokens;
- senhas;
- secrets;
- headers completos de auth;
- payload com PII desnecessária;
- dados financeiros;
- dumps completos de perfil;
- respostas completas de APIs externas se contiverem dado sensível.

No cliente, mensagens devem ser genéricas.

No servidor, logs podem ter detalhes técnicos, mas sem segredos.

---

## 9. Regras para migrations

Toda mudança no banco deve ser versionada.

Usar:

```txt
supabase/migrations/[timestamp]_[descricao].sql
```

Cada migration deve conter, quando aplicável:

- criação/alteração de tabela;
- constraints;
- índices;
- RLS;
- policies;
- funções RPC;
- grants/revokes;
- comentários de segurança.

Não criar tabela em produção manualmente sem depois versionar a migration correspondente.

---

## 10. Comandos obrigatórios antes de considerar pronto

Quando estiver em máquina local, executar:

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
```

Se Playwright não estiver instalado:

```bash
npx playwright install
npm run test:e2e
```

Se algum comando falhar, não considerar pronto.

---

## 11. Checklist de revisão antes de qualquer PR/commit grande

Antes de finalizar alteração, verificar:

- [ ] Não há secrets no código.
- [ ] Não há `.env` commitado.
- [ ] Não há `select('*')` novo em área sensível.
- [ ] Inserts/updates usam allowlist.
- [ ] Usuário/dono/role vêm da sessão ou banco, não do payload.
- [ ] RPCs validam `auth.uid()`.
- [ ] Edge Functions exigem autenticação quando necessário.
- [ ] CORS não está aberto sem justificativa.
- [ ] Erros internos não vazam para cliente.
- [ ] Admin é validado server-side.
- [ ] RLS está previsto ou implementado.
- [ ] Testes/build foram executados ou pendência foi documentada.

---

## 12. Como agir quando houver dúvida

Se houver dúvida entre segurança e conveniência, escolher segurança.

Se a mudança exigir schema do banco e o schema não estiver versionado, não inventar.

Em vez disso:

1. documentar a suposição;
2. pedir ou criar migration;
3. fazer alteração pequena;
4. validar com build/testes;
5. só então avançar.

---

## 13. Regra final

Todo agente deve deixar o projeto mais seguro do que encontrou.

Se uma alteração melhora visual mas reduz segurança, ela deve ser recusada ou refeita.

Se uma alteração corrige bug mas abre permissão indevida, ela não é correção: é dívida com fantasia.
