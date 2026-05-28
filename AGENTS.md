# AGENTS.md — Regras obrigatórias de segurança para agentes no DuoLoot

Este arquivo é obrigatório para qualquer agente, assistente, automação, IDE agent, pessoa desenvolvedora ou ferramenta que vá ler, alterar, testar, refatorar, migrar, publicar ou revisar este projeto.

O objetivo é simples: **nenhuma mudança deve criar brecha de segurança, vazar dados, enfraquecer permissões, expor secrets ou depender apenas do frontend para proteger ações sensíveis.**

Se houver conflito entre rapidez e segurança, escolha segurança.

---

## 1. Antes de fazer qualquer coisa

Antes de alterar qualquer arquivo, o agente deve ler:

```txt
AGENTS.md
implementation-history.md
docs/security/SECURITY_AUDIT_HISTORY.md
docs/security/SUPABASE_RLS_SETUP.md
docs/security/VALORANT_EDGE_HARDENING_CHECKLIST.md
```

Depois disso, deve identificar:

- qual área será alterada;
- se a alteração toca autenticação, autorização, Supabase, Edge Function, Riot, Premium, pontos, ranking, mensagens, convites, cofre ou dados de usuário;
- quais riscos a alteração pode criar;
- quais testes precisam ser executados.

Não altere código sem entender o impacto.

---

## 2. Princípio central

Segurança real nunca deve depender apenas do frontend.

Frontend pode:

- esconder botões;
- melhorar experiência;
- evitar ações acidentais;
- validar formulário de forma inicial.

Frontend não pode ser a única barreira para:

- admin;
- Premium;
- pontos;
- ranking;
- saldo;
- recompensas;
- mensagens;
- convites;
- alteração de dono;
- validação de missão;
- ações do Cofre/Vault;
- integração Riot/Valorant;
- leitura de dados privados;
- qualquer alteração de estado sensível.

Toda ação sensível deve ser validada em pelo menos uma camada confiável:

- Supabase RLS;
- RPC SQL segura;
- Edge Function autenticada;
- backend confiável;
- constraints no banco;
- logs/auditoria quando aplicável.

---

## 3. Ações sensíveis

Considere sensível qualquer coisa relacionada a:

- login;
- cadastro;
- logout;
- sessão;
- alteração de perfil;
- dados pessoais;
- criação/entrada/fechamento de lobby;
- convites;
- mensagens;
- conexões;
- matchmaking;
- ranking;
- trust score;
- Cofre/Vault;
- missões;
- submissões;
- validações admin;
- Premium;
- planos;
- pagamentos;
- pontos;
- saldo;
- recompensas;
- integrações Riot/Valorant;
- Supabase RPC;
- Supabase RLS;
- Edge Functions;
- migrations;
- variáveis de ambiente;
- CI/CD;
- deploy.

Se houver dúvida, trate como sensível.

---

## 4. Proibições absolutas

Nunca faça:

1. Nunca coloque secrets no frontend.
2. Nunca use `VITE_` para segredo real.
3. Nunca exponha `RIOT_API_KEY`, service role key, client secret, webhook secret, API key privada ou token interno.
4. Nunca commite `.env`, `.env.local`, dumps de banco, logs sensíveis, tokens ou arquivos de credenciais.
5. Nunca confie em `user_id`, `owner_id`, `role`, `is_admin`, `is_premium`, `plan`, `status`, `points`, `balance`, `rank`, `reward_status` ou `trust_score` vindo do cliente.
6. Nunca use `select('*')` em tabela que tenha, possa ter ou venha a ter dados privados.
7. Nunca crie ação admin apenas escondendo botão no frontend.
8. Nunca crie RPC que altera estado sem validar `auth.uid()`.
9. Nunca crie Edge Function pública para recurso sensível sem autenticação real.
10. Nunca retorne stack trace, exception crua, `err.message` interno ou detalhes técnicos ao cliente.
11. Nunca crie migration gigante misturando vários domínios.
12. Nunca altere regra de permissão sem explicar impacto.
13. Nunca reduza validação para “fazer funcionar rápido”.
14. Nunca use `dangerouslySetInnerHTML` sem sanitização formal, justificativa e revisão.
15. Nunca aceite payload aberto em inserts/updates.
16. Nunca use dados reais de usuários em mocks, seeds ou testes.
17. Nunca publique documentação com tokens, endpoints privados sensíveis, chaves, IDs reais de usuários ou dumps.
18. Nunca adicione dependência sem avaliar necessidade, manutenção e risco.
19. Nunca rode `npm audit fix --force` sem revisão, porque pode quebrar dependências e introduzir comportamento inesperado.
20. Nunca rode migrations, deploy ou comandos destrutivos sem autorização explícita.
21. Nunca apague dados, branches, tabelas, buckets ou policies sem backup/plano de reversão.
22. Nunca desative RLS para “testar rápido” em ambiente compartilhado ou produção.
23. Nunca use service role key no navegador.
24. Nunca aceite `user_id` no body para autenticar uma pessoa.
25. Nunca faça bypass de testes para concluir tarefa.

---

## 5. Protocolo obrigatório antes de alterar código

Antes de qualquer mudança, o agente deve responder internamente:

```txt
1. Qual arquivo será alterado?
2. Qual comportamento muda?
3. Toca autenticação/autorização/dados privados?
4. Pode criar IDOR/BOLA/BFLA?
5. Pode vazar dados sensíveis?
6. Pode aceitar payload malicioso?
7. Precisa de RLS/RPC/Edge Function?
8. Precisa de migration?
9. Quais testes serão rodados?
10. Como reverter se der errado?
```

Se a resposta for incerta, não invente. Documente a suposição ou peça confirmação.

---

## 6. Regras para frontend

### 6.1 Queries

Evite:

```ts
.select('*')
```

Prefira campos explícitos:

```ts
.select('id, name, nickname, avatar_url, trust_score')
```

Regra:

- buscar apenas o que a tela usa;
- nunca buscar campos futuros “por conveniência”;
- se a tabela puder conter dados privados, considere criar view segura no banco.

### 6.2 Payloads

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

Regra:

- campos extras devem ser ignorados ou rejeitados;
- IDs de dono devem vir da sessão, nunca do cliente;
- status sensível deve ser definido pelo servidor/banco;
- role/plano/pontos nunca devem vir do cliente.

### 6.3 Estado de autenticação

Não armazene tokens manualmente em `localStorage`.

Use o SDK do Supabase e a sessão oficial.

Não crie lógica paralela de autenticação sem necessidade.

### 6.4 Rotas protegidas

Rotas protegidas no frontend são UX, não segurança real.

Para áreas admin, use também:

- role real no banco;
- RLS;
- RPC com checagem admin;
- auditoria.

### 6.5 XSS

Não use `dangerouslySetInnerHTML` sem:

- sanitização formal;
- justificativa;
- teste;
- revisão explícita.

Nunca renderize HTML vindo do usuário sem sanitizar.

---

## 7. Regras para Supabase

Toda tabela sensível deve ter:

- RLS ativo;
- policies explícitas;
- menor privilégio;
- constraints;
- índices para filtros importantes;
- timestamps quando fizer sentido;
- validação de dono/participante/admin;
- migrations versionadas.

### 7.1 RLS

RLS deve responder:

```txt
Quem pode ler?
Quem pode inserir?
Quem pode atualizar?
Quem pode deletar?
Com qual condição?
```

Nunca liberar policy ampla sem motivo.

Evite policies como:

```sql
using (true)
```

exceto quando os dados forem realmente públicos e seguros.

Se uma tabela mistura dados públicos e privados, prefira criar uma view pública segura.

### 7.2 Roles

Roles confiáveis devem vir do banco, não do cliente.

Usar helpers versionados:

```sql
public.duoloot_current_user_role()
public.duoloot_has_role(text[])
public.duoloot_is_admin()
```

Nunca aceitar:

```txt
role
is_admin
is_owner
```

vindos do frontend.

### 7.3 RPCs

Toda RPC deve:

- validar `auth.uid()`;
- negar anônimo quando exigir login;
- validar dono do objeto;
- validar participação em conexão/lobby/cofre quando aplicável;
- validar admin no banco;
- usar parâmetros mínimos;
- ignorar ou rejeitar campos extras;
- retornar mensagens seguras;
- estar em migration versionada;
- ter teste de usuário comum e admin quando for sensível.

### 7.4 RPCs administrativas

RPC administrativa deve negar por padrão:

```sql
if not public.duoloot_is_admin() then
  raise exception 'permission denied' using errcode = '42501';
end if;
```

Exemplos críticos:

```txt
validate_vault_submission
finalize_vault_event
```

Toda RPC admin deve ter:

- checagem admin no banco;
- auditoria quando aplicável;
- teste comprovando que usuário comum não executa;
- erro seguro para usuário sem permissão.

---

## 8. Regras para Edge Functions

Toda Edge Function sensível deve:

- aceitar apenas métodos necessários;
- responder `OPTIONS` corretamente quando houver CORS;
- validar origem quando chamada por navegador;
- usar allowlist de origens;
- exigir JWT real quando necessário;
- validar payload com allowlist;
- limitar tamanho de campos;
- validar enums com allowlist;
- não retornar erro interno cru;
- logar detalhes apenas no servidor;
- usar secrets via ambiente seguro;
- nunca expor service role ao frontend;
- considerar rate limit/controle de abuso.

### 8.1 CORS

Evite:

```ts
'Access-Control-Allow-Origin': '*'
```

Prefira:

```ts
const allowedOrigins = [
  'http://localhost:5173',
  'https://seudominio.com',
];
```

Também usar:

```ts
'Vary': 'Origin'
```

### 8.2 Métodos

Se a função só usa POST:

```ts
'Access-Control-Allow-Methods': 'POST, OPTIONS'
```

GET deve retornar 405.

### 8.3 Autenticação

Frontend deve enviar `session.access_token`.

Edge Function deve validar o token antes de executar ação sensível.

Nunca confie em `user_id` enviado no body.

### 8.4 Erros

Cliente deve receber mensagens genéricas:

```json
{
  "code": "RIOT_API_ERROR",
  "message": "Falha temporária ao consultar dados externos."
}
```

Servidor pode logar detalhes técnicos, mas sem secrets.

---

## 9. Regras para Riot/Valorant

1. A Riot API Key nunca deve ir para React.
2. A Riot API Key deve ficar em Supabase secrets ou ambiente server-side seguro.
3. O frontend deve chamar apenas Edge Function.
4. A Edge Function deve validar usuário logado antes de consultar Riot.
5. Não usar PUUID, nick real ou dados reais em mocks sem autorização.
6. Não mascarar erro de configuração em produção com fallback mock silencioso.
7. Fallback mock só deve existir em ambiente controlado.
8. Tratar rate limit da Riot com cuidado.
9. Nunca logar token Riot.
10. Não transformar dados Riot em permissão interna sem validação server-side.

---

## 10. Regras para Premium, pontos, ranking e recompensas

Qualquer lógica de Premium, pontos, saldo, recompensa ou ranking deve ser server-side.

Nunca confiar em valores vindos do cliente:

```txt
is_premium
plan
balance
points
rank
reward_status
subscription_status
```

Requisitos mínimos:

- histórico transacional;
- idempotência;
- auditoria;
- constraints contra duplicidade;
- RLS;
- validação por usuário;
- validação server-side;
- testes de abuso.

Pagamentos/webhooks devem validar assinatura do provedor antes de alterar estado.

---

## 11. Regras para logs e erros

Não logar:

- tokens;
- senhas;
- secrets;
- headers completos de auth;
- payloads com PII desnecessária;
- dados financeiros;
- dumps completos de perfil;
- respostas completas de APIs externas se contiverem dados sensíveis;
- service role key;
- Riot API key.

No cliente:

- mensagens genéricas;
- sem stack trace;
- sem detalhes internos.

No servidor:

- logs técnicos permitidos;
- sem secrets;
- sem dados pessoais desnecessários.

---

## 12. Regras para migrations

Toda mudança no banco deve ser versionada em:

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

Não criar tabela manualmente em produção sem depois versionar migration correspondente.

Não misturar vários domínios em uma migration gigante.

Prefira migrations pequenas:

```txt
profiles
lobbies
invites
messages
vault
premium
admin-rpcs
```

---

## 13. Regras para dependências

Antes de adicionar dependência:

- verificar se é realmente necessária;
- preferir solução nativa quando simples;
- avaliar manutenção;
- avaliar popularidade/confiabilidade;
- verificar licença;
- verificar vulnerabilidades conhecidas;
- evitar pacotes abandonados.

Depois de alterar dependências:

```bash
npm audit --audit-level=high --omit=dev
npm run build
npm run test -- --run
```

Não usar `npm audit fix --force` sem revisão.

---

## 14. Regras para arquivos de ambiente e secrets

Arquivos proibidos no commit:

```txt
.env
.env.local
.env.production
.env.development
supabase/.env.local
*.pem
*.key
*.p12
*.pfx
credentials.json
service-account.json
```

Variáveis com prefixo `VITE_` são expostas ao navegador.

Só use `VITE_` para valores públicos.

Segredos devem ficar em:

- Supabase secrets;
- Vercel Environment Variables seguras;
- GitHub Actions secrets;
- ambiente server-side confiável.

---

## 15. Regras para testes

Antes de considerar pronto, executar:

```bash
npm ci
npm audit --audit-level=high --omit=dev
npm run lint
npm run test -- --run
npm run test:coverage
npm run build
```

Para E2E:

```bash
npx playwright install
npm run test:e2e
```

Se qualquer comando falhar:

1. parar;
2. registrar erro;
3. corrigir;
4. repetir a partir do comando que falhou.

Não ignorar erro de teste.

---

## 16. Testes mínimos de segurança

Quando a área existir, criar ou manter testes para:

- usuário deslogado não acessa rota protegida;
- usuário comum não executa ação admin;
- admin/owner executa ação admin permitida;
- usuário A não lê dados privados do usuário B;
- insert com `owner_id` falso falha ou é ignorado;
- update tentando trocar `owner_id` falha;
- payload com `role`, `is_admin`, `is_premium`, `points` ou `status` crítico falha;
- convite só pode ser respondido pelo receiver correto;
- mensagem só pode ser lida por participante da conexão;
- Edge Function sem token retorna 401;
- Edge Function com payload inválido retorna 400;
- CORS não aceita origem desconhecida;
- GET retorna 405 quando só POST é permitido.

---

## 17. Regras para PRs e commits

Todo PR deve explicar:

- o que mudou;
- por que mudou;
- impacto de segurança;
- testes executados;
- pendências;
- se alterou Supabase/RLS/RPC/Edge Function;
- se alterou auth/admin/Premium/pontos/ranking.

Commits devem ser pequenos e rastreáveis.

Evite commits gigantes.

Não misture refatoração visual com mudança de autorização.

---

## 18. Fluxo seguro para agentes

Siga esta ordem:

```txt
1. Ler AGENTS.md.
2. Ler implementation-history.md.
3. Ler SECURITY_AUDIT_HISTORY.md.
4. Entender escopo.
5. Identificar riscos.
6. Fazer alteração pequena.
7. Rodar testes relacionados.
8. Atualizar documentação se necessário.
9. Registrar pendências.
10. Não avançar para outra área sem concluir ou registrar status.
```

Se a tarefa for grande, dividir em etapas.

Cada etapa deve ser pequena o suficiente para revisar.

---

## 19. Como agir em caso de possível vazamento

Se encontrar secret, token ou credencial exposta:

1. não imprimir o valor no chat, PR ou issue;
2. registrar apenas o nome do arquivo e tipo de segredo;
3. remover do código;
4. rotacionar a credencial no provedor;
5. verificar histórico Git se necessário;
6. atualizar `.gitignore`;
7. adicionar nota em issue privada ou canal seguro.

Nunca copie o segredo para documentação.

---

## 20. Checklist antes de finalizar qualquer tarefa

Antes de declarar pronto:

- [ ] Li e segui `AGENTS.md`.
- [ ] Não adicionei secrets.
- [ ] Não alterei `.env` indevidamente.
- [ ] Não adicionei `select('*')` em área sensível.
- [ ] Inserts/updates usam allowlist.
- [ ] Permissões críticas não dependem só do frontend.
- [ ] RPCs validam `auth.uid()` quando necessário.
- [ ] Admin é validado server-side/banco.
- [ ] Edge Functions validam JWT quando necessário.
- [ ] CORS não foi aberto sem justificativa.
- [ ] Erros internos não vazam para o cliente.
- [ ] Se alterei banco, criei migration versionada.
- [ ] Se alterei Premium/pontos/ranking, validei server-side.
- [ ] Testes relevantes foram executados ou pendência foi documentada.
- [ ] Atualizei documentação/histórico se necessário.

---

## 21. Definition of Done de segurança

Uma tarefa só pode ser considerada pronta quando:

- comportamento foi implementado;
- permissões foram revisadas;
- dados privados não vazam;
- payload malicioso foi considerado;
- testes passaram;
- build passou;
- migrations estão versionadas, se houver banco;
- documentação foi atualizada, se houver impacto;
- pendências foram registradas.

Sem teste, sem pronto.

Sem validação server-side para ação sensível, sem pronto.

Sem migration para mudança de banco, sem pronto.

---

## 22. Regra final

Todo agente deve deixar o projeto mais seguro do que encontrou.

Se uma alteração melhora visual mas reduz segurança, ela deve ser recusada ou refeita.

Se uma alteração corrige um bug mas abre permissão indevida, ela não é correção: é dívida técnica com fantasia de solução.

Segurança não é decoração no DuoLoot. É fundação.
