# Historico de vencedores e temporadas do Cofre - Duo Loot

## Tabela `vault_winners`

O historico de vencedores do Cofre fica em `public.vault_winners`.

Campos principais:

- `id`
- `event_id`
- `player_id`
- `participant_id`
- `rank_position`
- `points`
- `prize_label`
- `prize_value`
- `reward_status`
- `snapshot`
- `created_at`

Compatibilidade MVP:

- A tabela ja existia no schema inicial com colunas do fluxo legado de submissao.
- A migration `0004_vault_seasons_winners.sql` faz adaptacao incremental sem apagar a estrutura anterior.

## RPC `finalize_vault_event`

Funcao:

```sql
public.finalize_vault_event(p_event_id uuid, p_winner_limit integer default 3)
```

Comportamento:

- exige usuario autenticado
- no MVP ainda pode ser executada por `authenticated`
- deve virar admin-only no futuro
- seleciona o top por `points desc, joined_at asc`
- grava vencedores em `vault_winners`
- atualiza `vault_events.status` para `ended`
- atualiza `vault_events.ends_at` para `now()`
- nao duplica vencedores em nova execucao

## RPC `get_vault_winners`

Funcao:

```sql
public.get_vault_winners(p_event_id uuid default null, p_limit integer default 12)
```

Comportamento:

- com `p_event_id = null`, retorna vencedores recentes de varios eventos
- com `p_event_id` informado, filtra por evento
- ordena por `created_at desc, rank_position asc`

## RPC `get_vault_seasons`

Funcao:

```sql
public.get_vault_seasons(p_limit integer default 10)
```

Comportamento:

- retorna eventos recentes do Cofre
- inclui temporadas ativas, encerradas e canceladas
- agrega:
  - participantes
  - quantidade de vencedores
  - top winner
  - progresso de pontos

## Finalizacao no DEV

No front, o botao `DEV: finalizar cofre` aparece apenas quando:

- `import.meta.env.DEV` estiver ativo
- existir evento ativo

Ao clicar:

1. o front chama `finalizeVaultEvent(activeEvent.id, 3)`
2. o evento e encerrado
3. os vencedores sao gravados
4. winners e seasons sao recarregados
5. a notificacao tatico-inline e exibida

## Como calcula o top 3

Ordem do ranking final:

1. `points desc`
2. `joined_at asc`

Isso preserva o desempate do ranking atual do Cofre.

## Distribuicao de `prize_value` no MVP

Para `winner_limit = 3`:

- `#1`: 60%
- `#2`: 30%
- `#3`: 10%

Se o limite for maior que 3:

- apenas as tres primeiras posicoes recebem distribuicao percentual
- posicoes extras recebem `0`

Essa limitacao fica documentada para futura revisao.

## Como o front exibe vencedores

Componentes:

- `VaultWinnersPanel`
- `VaultWinnerCard`

Dados mostrados:

- posicao
- nickname
- avatar
- pontos
- premio
- status da recompensa
- evento
- trust score

## Como o front exibe temporadas

Componentes:

- `VaultSeasonHistory`
- `VaultSeasonCard`

Dados mostrados:

- titulo
- status
- progresso
- participantes
- vencedores
- top winner
- premio
- datas de inicio e fim

## Limitacoes MVP

- finalizacao ainda nao e admin-only
- distribuicao de premio fica fechada no top 3
- nao existe pagamento real
- nao existe auditoria forte de recompensa
- historico ainda nao foi aberto para publico anonimo

## Pendencias futuras

- admin real
- pagamento real
- anti-fraude
- temporadas automaticas
- badges permanentes
- historico publico
- auditoria de recompensas
