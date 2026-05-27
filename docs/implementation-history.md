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
