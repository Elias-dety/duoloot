# Histórico de implementação do Duo Loot

Este arquivo registra alterações feitas por agentes na branch `ui/extend-kombai-visuals`.

## 2026-05-27

### Etapa 2 autorizada pelo usuário: componente visual de regras do lobby

Arquivos alterados nesta etapa:

- `src/features/lobby/components/LobbyRulesSummary.tsx`
- `docs/implementation-history.md`
- `docs/test-checklist.md`

Resumo:

- Criado componente isolado para exibir regras configuradas do lobby a partir de `metadata`.
- O componente lê `requiredPositionLabels`, `requiredPositions`, `creatorPositionLabel`, `creatorPosition` e `maxReputationAllowed`.
- O componente retorna `null` quando o lobby não possui regras configuradas, evitando poluir cards antigos.
- Criado checklist de testes para execução posterior no PC.
- Ainda não foi conectado ao `LobbyCard`; isso fica para a próxima etapa autorizada.

Testes pendentes para o PC:

- `npm run build`
- `npm run test:e2e:lobby -- --repeat-each=3`

Observação:

- Não rodei build nem E2E localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 3 autorizada pelo usuário: conexão das regras no card do lobby

Arquivos alterados nesta etapa:

- `src/features/lobby/components/LobbyCard.tsx`
- `docs/implementation-history.md`

Resumo:

- Importado `LobbyRulesSummary` no `LobbyCard`.
- Renderizado `<LobbyRulesSummary metadata={lobby.metadata} />` logo depois da seção `Capacidade do lobby`.
- A seção `Regras do lobby` agora fica antes de `Resumo rápido` quando o lobby possui regras configuradas em `metadata`.
- O componente continua retornando `null` para lobbies sem regras, preservando o visual dos cards antigos.

Commit de código relacionado:

- `4df75bc3666e567e4bb6273c7b4640546fde5de3`

Testes pendentes para o PC:

- `npm run build`
- `npm run test:e2e:lobby -- --repeat-each=3`

Observação:

- Não rodei build nem E2E localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 4 autorizada pelo usuário: atualização do checklist de testes do lobby

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Atualizado o checklist manual das regras do lobby para refletir que o componente já está conectado ao card.
- Adicionada verificação para confirmar `Regras do lobby` logo depois de `Capacidade do lobby`.
- Adicionada verificação para garantir que posições necessárias, posição do dono e reputação máxima aparecem no card configurado.
- Adicionada verificação do fluxo rápido `+ Criar Lobby`, garantindo que lobbies sem regras não exibem a seção.
- Adicionada lista de evidências úteis para falhas: erro completo, print do card, `BAD RESPONSE` e `error-context.md`.

Commit de checklist relacionado:

- `ef1011f55a04971f6099d52de1b4b0f0d2f344df`

Testes pendentes para o PC:

- `npm run build`
- `npm run test:e2e:lobby -- --repeat-each=3`

Observação:

- Não rodei build nem E2E localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 5 autorizada pelo usuário: base de banco do sistema de Karma

Arquivos alterados nesta etapa:

- `supabase/migrations/20260527154500_create_karma_reputation_system.sql`
- `docs/implementation-history.md`

Resumo:

- Criada migration base para o sistema de Karma/Reputação.
- Criados enums `categoria_desempenho_partida` e `categoria_comportamento_partida`.
- Criada tabela `avaliacoes_partidas` para registrar avaliações pós-partida entre jogadores.
- Criada tabela `reputacao_jogador` para armazenar score consolidado de desempenho, comportamento e `karma_geral`.
- Criadas funções de pontuação para desempenho e comportamento conforme as regras definidas.
- Criada trigger para recalcular automaticamente o Karma quando avaliações forem inseridas, atualizadas ou removidas.
- Ativadas policies básicas de RLS para avaliações e leitura autenticada de Karma.

Commit da migration:

- Não retornado pelo conector nesta etapa; arquivo confirmado na branch `ui/extend-kombai-visuals`.

Testes pendentes para o PC:

- Aplicar migration do Supabase.
- Validar criação das tabelas `avaliacoes_partidas` e `reputacao_jogador`.
- Inserir avaliação de teste e confirmar atualização automática de `karma_geral`.

Observação:

- Não rodei migration nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 6 autorizada pelo usuário: checklist de validação da migration de Karma

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada seção `Karma / Reputação` no checklist de testes.
- Adicionado comando sugerido `supabase db push` para aplicar a migration localmente.
- Adicionadas verificações esperadas para enums, tabelas e trigger da migration de Karma.
- Adicionados comandos SQL com `to_regtype` e `to_regclass` para validar objetos criados no banco.
- Adicionada validação manual futura do fluxo de avaliação quando a página/modal existir.
- Atualizada a lista de evidências úteis para falhas de migration, SQL ou interface.

Commit do checklist relacionado:

- `f047d3788c1f5dc6efe44d5d78385268f849062f`

Testes pendentes para o PC:

- Aplicar a migration com `supabase db push`.
- Rodar as consultas SQL listadas em `docs/test-checklist.md`.
- Conferir se nenhum objeto de banco retornou `null`.

Observação:

- Não rodei migration nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.
