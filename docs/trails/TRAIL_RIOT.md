# Trilha — Riot/VALORANT

Esta trilha orienta trabalhos relacionados à integração Riot/VALORANT, perfis externos, Edge Functions, autenticação e proteção de chaves.

## Objetivo

Usar dados Riot/VALORANT para aumentar confiança e contexto dos perfis gamer sem expor segredos, depender cegamente de API externa ou abrir abuso de consulta.

## Escopo

Faz parte desta trilha:

- conexão de conta Riot;
- perfil público Riot/VALORANT;
- lookup de jogador;
- Edge Function de consulta;
- variáveis de ambiente da função;
- autenticação para consultas sensíveis;
- tratamento de erro da API Riot;
- fallback mock controlado;
- cache quando aplicável;
- rate limit quando aplicável.

## Fora de escopo

Não alterar sem autorização ou trilha complementar:

- chaves reais em produção;
- service role key;
- política global de autenticação;
- dados reais de usuários;
- remoção de projeto Supabase;
- secrets de outros serviços.

## Regras de produto

1. Integração Riot deve aumentar confiança, não travar toda a plataforma.
2. Quando a API externa falhar, a resposta deve ser clara e segura.
3. Usuário não deve ver erro interno técnico.
4. Dados Riot devem ser usados com respeito a privacidade e regras da plataforma.
5. Fallback mock não deve parecer dado real em produção.

## Regras técnicas

1. `RIOT_API_KEY` nunca fica no frontend.
2. Consulta à Riot deve passar por Edge Function.
3. Edge Function deve validar método HTTP.
4. Edge Function deve validar CORS.
5. Edge Function deve validar payload.
6. Edge Function deve retornar erros seguros.
7. Consulta sensível deve exigir sessão real do usuário.
8. Fallback mock em produção deve ser evitado.
9. Variáveis de ambiente devem ficar no ambiente seguro do Supabase.

## Regras de segurança

Nunca aceitar do cliente como fonte confiável:

- `user_id`;
- status de conexão Riot;
- role;
- permissão;
- chave de API;
- token interno;
- dados que alterem conta vinculada sem validação.

Atenção máxima para:

- vazamento de `RIOT_API_KEY`;
- CORS aberto demais;
- Edge Function pública sem controle;
- abuso de consultas;
- payload malicioso;
- erro interno vazando detalhes;
- mock ativo em produção;
- token de sessão ausente ou inválido.

Mudanças de segurança devem ser registradas em:

`docs/security/SECURITY_HISTORY.md`

## Arquivos prováveis

- `src/services/valorant/`
- `src/pages/Riot*`
- `src/routes/`
- `supabase/functions/valorant-profile-lookup/`
- `supabase/migrations/`
- `.env.example` quando existir

## Fluxos principais

- usuário pesquisa perfil Riot/VALORANT;
- usuário conecta conta Riot;
- frontend chama Edge Function;
- Edge Function valida sessão quando necessário;
- Edge Function valida payload;
- Edge Function chama Riot API;
- resposta é normalizada;
- erro externo é tratado sem vazar detalhes internos.

## Testes esperados

- request sem token recebe 401 quando autenticação for exigida;
- request com token inválido recebe 401;
- payload vazio recebe 400;
- payload com região inválida recebe 400;
- método não permitido recebe 405;
- origem não permitida não passa no CORS;
- erro Riot não vaza stack trace;
- `RIOT_API_KEY` não aparece no bundle/frontend.

## Pendências conhecidas

- [ ] Confirmar variáveis da Edge Function no Supabase.
- [ ] Validar deploy real da Edge Function.
- [ ] Testar usuário logado e deslogado.
- [ ] Testar CORS com origem permitida e origem bloqueada.
- [ ] Testar payload inválido.
- [ ] Confirmar que fallback mock não fica ativo em produção.

## Critério de pronto

Uma alteração Riot/VALORANT só está pronta quando:

- segredo não está no frontend;
- Edge Function valida entrada e sessão quando necessário;
- erros são seguros;
- testes foram rodados ou registrados em `docs/REMOTE_TODO.md`;
- mudanças sensíveis foram registradas no histórico de segurança.