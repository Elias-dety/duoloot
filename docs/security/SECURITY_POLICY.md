# Política de Segurança — Duo Loot

Este arquivo define regras obrigatórias para qualquer agente, automação ou pessoa que altere o Duo Loot.

Segurança tem prioridade sobre velocidade, estética e conveniência.

## Princípio central

Segurança real nunca deve depender apenas do frontend.

Frontend pode melhorar experiência, esconder botões e evitar erros acidentais, mas não pode ser a única barreira para ações sensíveis.

Ações sensíveis devem ser protegidas por pelo menos uma camada confiável:

- Supabase RLS;
- RPC segura;
- Edge Function autenticada;
- constraints no banco;
- validação server-side;
- logs e auditoria quando aplicável.

## Áreas sensíveis

Considere sensível qualquer coisa relacionada a:

- login;
- cadastro;
- sessão;
- perfil de usuário;
- dados pessoais;
- lobbies;
- matchmaking;
- convites;
- mensagens;
- conexões;
- ranking;
- trust score;
- Vault/Cofre;
- missões;
- pontos;
- recompensas;
- Premium;
- planos;
- pagamentos;
- Riot/VALORANT;
- Supabase;
- RLS;
- RPCs;
- Edge Functions;
- migrations;
- variáveis de ambiente;
- deploy.

Se houver dúvida, trate como sensível.

## Autonomia máxima de segurança

Quando uma vulnerabilidade real, provável ou explorável for encontrada, o agente de segurança tem autorização para agir dentro do repositório.

O agente pode:

- deletar código inseguro;
- substituir implementação vulnerável;
- mover arquivos;
- isolar funções;
- desativar fluxo inseguro;
- remover mock perigoso;
- bloquear rota;
- alterar service;
- criar validação;
- criar migration;
- criar teste;
- alterar documentação;
- registrar pendência técnica;
- simplificar fluxo para reduzir risco;
- remover dependência perigosa quando justificável.

A prioridade é impedir:

- exploração;
- vazamento;
- escalada de privilégio;
- fraude;
- abuso;
- manipulação de pontos;
- manipulação de recompensas;
- corrupção de dados;
- acesso indevido a dados privados.

## Obrigação após ação de segurança

Toda alteração feita por motivo de segurança deve ser registrada em:

`docs/security/SECURITY_HISTORY.md`

O registro deve explicar:

1. o que foi alterado;
2. por que foi alterado;
3. qual risco foi reduzido;
4. quais arquivos foram afetados;
5. quais testes foram rodados;
6. quais testes ainda faltam;
7. como reverter, se necessário.

## Limites fora do repositório

A autonomia máxima vale para arquivos dentro do repositório.

Ações destrutivas fora do repositório exigem confirmação humana explícita.

Exemplos:

- apagar banco remoto;
- apagar projeto Supabase;
- apagar bucket;
- apagar usuário real;
- rotacionar segredo de produção;
- executar comando irreversível em produção;
- deletar dados reais;
- alterar configuração crítica de serviço externo.

## Proibições absolutas

Nunca faça:

1. colocar secrets no frontend;
2. usar `VITE_` para segredo real;
3. expor `RIOT_API_KEY`, service role key, client secret, webhook secret ou token interno;
4. commitar `.env`, `.env.local`, dumps de banco, logs sensíveis ou credenciais;
5. confiar em `user_id`, `owner_id`, `role`, `is_admin`, `is_premium`, `plan`, `status`, `points`, `balance`, `rank` ou `reward_status` vindo do cliente;
6. usar `select('*')` em tabela sensível;
7. criar ação admin protegida apenas por botão escondido;
8. criar RPC que altera estado sem validar `auth.uid()`;
9. criar Edge Function sensível sem autenticação real;
10. retornar stack trace ou erro interno cru ao cliente;
11. desativar RLS para resolver problema rápido;
12. usar service role key no navegador;
13. aceitar payload aberto em inserts ou updates;
14. publicar documentação com tokens ou dados privados reais.

## Regras para Supabase

Toda tabela sensível deve ter:

- RLS ativo;
- policies explícitas;
- menor privilégio possível;
- validação de dono, participante ou admin;
- constraints quando aplicável;
- migrations versionadas.

Roles confiáveis devem vir do banco, não do cliente.

## Regras para RPCs

Toda RPC sensível deve:

- validar `auth.uid()`;
- negar anônimo quando exigir login;
- validar dono ou participante;
- validar admin quando aplicável;
- aceitar parâmetros mínimos;
- rejeitar ou ignorar campos extras;
- retornar erro seguro;
- ser criada por migration versionada.

## Regras para Edge Functions

Toda Edge Function sensível deve:

- aceitar apenas métodos necessários;
- validar CORS;
- exigir JWT quando necessário;
- validar payload;
- limitar tamanho de campos;
- usar allowlist de enums;
- não retornar erro interno ao cliente;
- usar secrets apenas no ambiente seguro;
- considerar abuso e rate limit.

## Regras para Premium, pontos e recompensas

Premium, pontos, ranking, saldo e recompensas nunca podem depender apenas do frontend.

Qualquer benefício, bloqueio, prêmio ou pontuação precisa ser validado por camada confiável.

## Regra final

Se uma mudança deixa o projeto mais seguro e não destrói dados reais fora do repositório, o agente de segurança pode agir.

Depois, deve registrar tudo no histórico de segurança.