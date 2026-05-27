# Plano de funcionalização do Lobby Duo Loot

Este documento organiza o que já foi implementado, o que precisa ser testado no PC e quais próximos tijolos faltam para transformar o Lobby em um módulo profissional.

## Estado atual

### Já funcional

- Login de dois usuários de teste.
- Criação rápida de lobby via Supabase RPC `create_lobby`.
- Entrada em lobby via Supabase RPC `join_lobby`.
- Saída/fechamento de lobby via Supabase RPC `leave_lobby`.
- Realtime para atualizar lista de lobbies e membros.
- Correção do erro de presence duplicado.
- RPCs de lobby restritas para `authenticated`.
- Botão `+ Criar Lobby` mantido para fluxo rápido e compatibilidade com E2E.
- Botão `Configurar lobby` criado para fluxo completo.
- Modal de configuração criado em `src/features/lobby/components/LobbyCreateModal.tsx`.
- Estado de participação agora pode ser sincronizado com `lobby_members` via `getMyJoinedLobbyIds()`.

### Configurações novas já previstas no payload

As configurações abaixo são salvas em `metadata` do lobby no momento da criação:

- `creatorPosition`
- `creatorPositionLabel`
- `requiredPositions`
- `requiredPositionLabels`
- `maxReputationAllowed`

Esse formato é bom para MVP. Em fase mais profissional, esses campos podem virar colunas ou tabela própria.

## Como testar no PC

Sempre usar o script serializado para evitar corrida entre usuários fixos de teste:

```bash
git pull origin ui/extend-kombai-visuals
npm run build
npm run test:e2e:lobby -- --repeat-each=3
```

O pull precisa avançar até pelo menos o commit que adiciona sincronização de participação pelo banco.

## Risco conhecido dos testes

O teste E2E usa sempre os mesmos usuários:

- `owner_test@duoloot.com`
- `joiner_test@duoloot.com`

Por isso, testes paralelos podem brigar pelo mesmo estado do banco. Use sempre `--workers=1`, já incluído em `npm run test:e2e:lobby`.

## Próximos passos recomendados

### 1. Validar build e E2E

Critério de aceite:

- `npm run build` passa.
- `npm run test:e2e:lobby -- --repeat-each=3` passa 3/3.
- O card mostra `Você entrou` e `Sair do lobby` após o join.

### 2. Testar manualmente o novo botão `Configurar lobby`

Fluxo esperado:

1. Entrar como usuário com perfil gamer completo.
2. Ir para `/lobby`.
3. Clicar em `Configurar lobby`.
4. Escolher número de jogadores.
5. Escolher posições necessárias.
6. Escolher própria posição.
7. Escolher reputação máxima permitida.
8. Criar lobby configurado.
9. Confirmar que o lobby aparece na lista.
10. Confirmar no Supabase se `metadata` recebeu as regras.

### 3. Exibir regras novas no card

Adicionar no `LobbyCard` uma seção chamada `Regras do lobby` com:

- Posições necessárias.
- Sua posição.
- Reputação máxima permitida.

Sugestão visual:

- Tags pequenas para posições.
- Badge para reputação máxima.
- Texto curto, sem poluir o card.

### 4. Validar regra de entrada

Hoje as regras são salvas, mas ainda não bloqueiam entrada automaticamente.

Implementar depois:

- Bloquear entrada se a reputação do usuário estiver fora do limite configurado.
- Priorizar/avisar se a posição do jogador não estiver entre as posições necessárias.
- Mostrar mensagem clara no front.

### 5. Evoluir Supabase

MVP atual usa `metadata`. Para versão profissional:

- Criar tabela `lobby_requirements` ou colunas dedicadas em `lobbies`.
- Criar enum para posições.
- Criar enum ou regra para reputação/comportamento.
- Criar RLS específica.
- Atualizar types do Supabase.

### 6. Melhorar testes E2E

Criar novo teste específico:

- Abrir modal de configuração.
- Alterar número de jogadores.
- Selecionar posições.
- Criar lobby configurado.
- Validar visualmente as regras no card.
- Validar via API ou banco que `metadata` foi salvo.

Evitar colocar credenciais hardcoded em novos testes. Preferir variáveis de ambiente.

## Comandos úteis para diagnóstico

```bash
npm run build
npm run test:e2e:lobby
npm run test:e2e:lobby -- --repeat-each=3
```

## Observações de arquitetura

- O fluxo rápido continua existindo para não quebrar testes e para UX simples.
- O fluxo configurável fica separado no botão `Configurar lobby`.
- O estado visual de participação deve vir do banco quando possível, não apenas de estado local.
- Realtime é complemento, não deve ser a única fonte de verdade.
