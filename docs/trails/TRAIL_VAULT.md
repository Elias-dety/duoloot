# Trilha — Vault/Cofre

Esta trilha orienta trabalhos relacionados ao Vault/Cofre, missões, pontos, recompensas, submissões e validações administrativas.

## Objetivo

Construir um sistema de missões e recompensas que gere engajamento saudável sem abrir espaço para fraude, manipulação de pontos ou abuso de recompensas.

## Escopo

Faz parte desta trilha:

- Vault/Cofre;
- missões;
- eventos;
- pontos;
- recompensas;
- submissões;
- validação de missão;
- painel admin do cofre;
- ranking relacionado ao cofre;
- auditoria de ações administrativas;
- antifraude básico;
- regras de elegibilidade.

## Fora de escopo

Não alterar sem autorização ou trilha complementar:

- pagamentos reais;
- dados financeiros;
- service role key;
- remoção de dados reais em produção;
- redefinição manual de pontos reais sem registro.

## Regras de produto

1. Missões devem ser claras e verificáveis.
2. Recompensas precisam ter regra de elegibilidade objetiva.
3. Pontos não podem ser manipuláveis pelo usuário.
4. Admin deve validar com responsabilidade e trilha de auditoria.
5. Usuário deve entender por que ganhou, perdeu ou ainda não recebeu recompensa.
6. Dados mockados de prêmio não podem parecer prêmio real em produção.

## Regras técnicas

1. Pontos, status de missão e recompensas não devem depender do frontend.
2. Validação de missão deve acontecer em RPC segura, Edge Function ou banco.
3. Ações admin precisam validar role real no banco.
4. Alterações de pontos devem ser auditáveis.
5. Não aceitar `user_id`, `points`, `reward_status` ou `mission_status` vindos livremente do cliente.
6. Submissões devem ter payload limitado e validado.

## Regras de segurança

Atenção máxima para:

- fraude de pontos;
- usuário validando própria missão;
- usuário comum executando ação admin;
- alteração de recompensa pelo cliente;
- IDOR/BOLA em submissões;
- leitura de dados privados de outros usuários;
- manipulação de ranking;
- replay de requisições.

Qualquer correção de segurança no Vault deve ser registrada em:

`docs/security/SECURITY_HISTORY.md`

## Arquivos prováveis

- `src/features/vault/`
- `src/pages/*Cofre*`
- `src/pages/*Vault*`
- `src/services/vault*`
- `src/routes/`
- `supabase/migrations/`
- `supabase/functions/`

## Fluxos principais

- usuário visualiza missões;
- usuário participa de missão;
- usuário envia submissão;
- sistema registra progresso;
- admin valida submissão;
- sistema concede ponto ou recompensa;
- usuário visualiza status;
- admin fecha evento ou missão.

## Testes esperados

- usuário comum não valida missão;
- usuário não altera pontos pelo frontend;
- usuário não reivindica recompensa de outro usuário;
- payload inválido é rejeitado;
- admin real consegue validar;
- usuário sem login recebe bloqueio adequado;
- ranking não aceita manipulação direta.

## Pendências conhecidas

- [ ] Mapear tabelas reais do Vault/Cofre.
- [ ] Confirmar RPCs existentes.
- [ ] Garantir RLS em tabelas do cofre.
- [ ] Criar testes para usuário comum vs admin.
- [ ] Definir modelo de auditoria para validações.

## Critério de pronto

Uma alteração no Vault só está pronta quando:

- pontos e recompensas são protegidos por camada confiável;
- admin é validado no banco ou backend confiável;
- testes foram rodados ou registrados em `docs/REMOTE_TODO.md`;
- qualquer risco de fraude foi analisado;
- alterações sensíveis foram registradas no histórico de segurança.