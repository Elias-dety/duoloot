# Trilha — Matchmaking, Lobbies e Conexões

Esta trilha orienta trabalhos relacionados a matchmaking, lobbies, duos, convites, conexões, mensagens e confiança entre jogadores.

## Objetivo

Ajudar jogadores a encontrar parceiros compatíveis e organizar sessões de jogo com menos atrito, menos bagunça e mais confiança.

## Escopo

Faz parte desta trilha:

- matchmaking;
- lobbies;
- criação de lobby;
- entrada e saída de lobby;
- convites entre jogadores;
- conexões;
- mensagens;
- filtros de busca;
- perfil usado para compatibilidade;
- trust score;
- disponibilidade;
- estilo de jogo;
- rank;
- roles/funções;
- região;
- comunicação.

## Fora de escopo

Não alterar sem trilha complementar:

- Premium pago;
- recompensas do Vault;
- validação Riot profunda;
- dados reais de pagamento;
- ações administrativas globais;
- políticas de segurança centrais.

## Regras de produto

1. Matchmaking deve priorizar compatibilidade real.
2. Lobby deve ser fácil de entender antes do usuário entrar.
3. Usuário deve saber por que um lobby combina ou não combina com ele.
4. Convites e mensagens devem respeitar privacidade e bloqueios futuros.
5. Trust score não pode ser manipulável pelo cliente.
6. O sistema deve reduzir toxicidade e abandono sempre que possível.

## Regras técnicas

1. `owner_id` do lobby deve vir da sessão, não do payload do cliente.
2. Status do lobby deve ser controlado por regra confiável.
3. Campos extras enviados pelo cliente devem ser ignorados ou rejeitados.
4. Entrada em lobby deve validar vaga, status e usuário.
5. Mensagens devem validar participantes da conexão.
6. Convites devem validar remetente e destinatário.
7. Trust score e ranking não devem ser alterados diretamente pelo frontend.

## Regras de segurança

Atenção máxima para:

- IDOR/BOLA em lobbies;
- usuário entrando em lobby fechado;
- usuário alterando lobby de outro dono;
- usuário lendo mensagem de conexão alheia;
- usuário enviando convite como outra pessoa;
- manipulação de `owner_id`;
- manipulação de `status`;
- manipulação de `slots_filled`;
- abuso de mensagens ou spam.

Mudanças de segurança devem ser registradas em:

`docs/security/SECURITY_HISTORY.md`

## Arquivos prováveis

- `src/services/lobbies*`
- `src/features/lobby/`
- `src/pages/Lobby*`
- `src/services/invites*`
- `src/services/messages*`
- `src/services/connections*`
- `src/services/profiles*`
- `supabase/migrations/`
- `supabase/functions/`

## Fluxos principais

- usuário cria lobby;
- usuário lista lobbies;
- usuário filtra lobbies;
- usuário entra em lobby;
- dono gerencia lobby;
- usuário envia convite;
- usuário responde convite;
- usuários conectados trocam mensagens;
- perfil alimenta compatibilidade.

## Testes esperados

- usuário deslogado não cria lobby;
- `owner_id` falso enviado pelo cliente é ignorado;
- `status` falso enviado pelo cliente é ignorado;
- `slots_filled` falso enviado pelo cliente é ignorado;
- usuário comum não altera lobby de outro dono;
- usuário não lê mensagens de conexão alheia;
- convite só pode ser criado pelo remetente real;
- filtros não quebram quando dados opcionais estão vazios.

## Pendências conhecidas

- [ ] Mapear schema real de lobbies.
- [ ] Confirmar RPCs de entrada em lobby.
- [ ] Confirmar RLS em lobbies e membros.
- [ ] Confirmar regras de convites.
- [ ] Confirmar regras de mensagens e conexões.
- [ ] Criar testes para IDOR/BOLA.

## Critério de pronto

Uma alteração de matchmaking/lobby só está pronta quando:

- compatibilidade e experiência continuam claras;
- permissões reais não dependem só do frontend;
- usuário não manipula dono, status, vagas, mensagens ou convites indevidamente;
- testes foram rodados ou registrados em `docs/REMOTE_TODO.md`;
- mudanças sensíveis foram registradas no histórico de segurança.