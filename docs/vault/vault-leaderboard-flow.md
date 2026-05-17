# Ranking do Cofre — Duo Loot

## Visão geral

O ranking do Cofre usa os pontos acumulados em `public.vault_participants.points` para ordenar os operadores do evento atual ou de um evento informado manualmente.

## RPC `get_vault_leaderboard`

Função:

```sql
public.get_vault_leaderboard(p_event_id uuid, p_limit integer default 20)
```

Retorno:

- `rank_position`
- `participant_id`
- `player_id`
- `player_name`
- `player_nickname`
- `avatar_url`
- `trust_score`
- `points`
- `joined_at`
- `missions_completed`
- `total_missions`
- `game_profile`

Comportamento:

- Se `p_event_id` for `null`, a função usa o evento ativo mais recente.
- O ranking lê `vault_participants` e faz join com `profiles`.
- A posição é calculada com `rank() over (order by points desc, joined_at asc)`.
- O top retornado respeita `p_limit`.
- `missions_completed` conta registros concluídos em `vault_mission_progress`.
- `total_missions` conta missões ativas em `vault_missions`.

## RPC `get_my_vault_rank`

Função:

```sql
public.get_my_vault_rank(p_event_id uuid)
```

Comportamento:

- Exige `auth.uid()`.
- Se `p_event_id` for `null`, usa o evento ativo mais recente.
- Calcula a posição do jogador dentro do ranking completo do evento.
- Se o usuário não participa do evento, retorna vazio.

## Origem dos pontos

- A pontuação do ranking vem de `vault_participants.points`.
- Esses pontos são incrementados pela RPC `claim_vault_mission_progress`.
- Este bloco não altera nenhuma regra de pontuação existente.

## Critério de desempate

- Primeiro critério: `points desc`
- Segundo critério: `joined_at asc`

Quem entrou antes no evento fica acima em caso de empate.

## Posição do usuário

- O front usa `get_my_vault_rank` para mostrar a posição do jogador logado.
- O painel individual mostra posição, pontos, progresso de missões, trust score e diferença para o top 1.

## Realtime usado

O `VaultPage` recarrega dados do ranking quando há mudanças em:

- `vault_participants`
- `vault_mission_progress`
- `vault_events`

O refresh é silencioso para evitar flicker e sem abrir subscription quando o Supabase não está configurado.

## Componentes criados

- `VaultLeaderboard`
- `VaultLeaderboardRow`
- `VaultUserRankPanel`

## Como testar no front-end

1. Abrir `/cofre` sem participantes.
2. Confirmar a mensagem `Nenhum operador ranqueado ainda.`
3. Participar do evento logado.
4. Confirmar que o usuário entra no ranking e no painel de posição.
5. Registrar progresso em missões.
6. Confirmar atualização de pontos, posição e diferença até o topo.
7. Testar com dois usuários para validar ordenação e desempate.
8. Confirmar atualização sem reload após mudanças via realtime.

## Como testar no SQL Editor

Top 20 do evento ativo:

```sql
select * from public.get_vault_leaderboard(null, 20);
```

Top 10 de um evento específico:

```sql
select * from public.get_vault_leaderboard('EVENT_ID_AQUI'::uuid, 10);
```

Posição do usuário autenticado:

```sql
select * from public.get_my_vault_rank(null);
```

## Limitações MVP

- Ranking depende do evento ativo ou de um evento existente informado.
- Não há histórico visual de temporadas.
- A posição individual depende de autenticação real.
- O ranking público ainda não foi aberto para `anon`.

## Pendências futuras

- leaderboard público
- histórico de temporadas
- anti-fraude
- premiação real
- ranking por jogo
- ranking semanal/mensal
- badges permanentes
