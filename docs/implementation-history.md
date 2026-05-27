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

### Etapa 7 autorizada pelo usuário: serviço frontend de Karma

Arquivos alterados nesta etapa:

- `src/services/karma.service.ts`
- `docs/implementation-history.md`

Resumo:

- Criado serviço isolado para operações de Karma no frontend.
- Criados tipos `CategoriaDesempenhoPartida`, `CategoriaComportamentoPartida`, `SubmitKarmaReviewPayload` e `KarmaSummary`.
- Criada função `submitKarmaReview` para inserir avaliações em `avaliacoes_partidas`.
- Criada validação para impedir autoavaliação.
- Criado corte automático de comentário para respeitar o limite de 150 caracteres.
- Criada função `getPlayerKarma` para carregar o resumo consolidado em `reputacao_jogador`.
- Mantido tratamento de erro compatível com o padrão dos serviços Supabase existentes.

Commit do serviço relacionado:

- `53d28a78a86e49a95295a516f3b07e809b447893`

Testes pendentes para o PC:

- `npm run build`
- Validar que o TypeScript aceita os tipos e imports do novo serviço.
- Depois da migration aplicada, testar `submitKarmaReview` com dois usuários diferentes.
- Depois da migration aplicada, testar `getPlayerKarma` para jogador com e sem avaliações.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 8 autorizada pelo usuário: checklist de validação do serviço de Karma

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada validação específica para o arquivo `src/services/karma.service.ts`.
- Adicionado `npm run build` como verificação de TypeScript, imports e tipos exportados pelo serviço.
- Adicionada validação manual de `submitKarmaReview` após aplicar a migration.
- Adicionada validação de autoavaliação bloqueada pelo serviço.
- Adicionada validação do limite de 150 caracteres do comentário.
- Adicionada validação manual de `getPlayerKarma` para jogador com avaliações e jogador sem avaliações.
- Atualizada a lista de evidências úteis com payload usado em `submitKarmaReview`, sem dados sensíveis.

Commit do checklist relacionado:

- `a62235d529ed70611b174de4dafa79192aeec872`

Testes pendentes para o PC:

- `npm run build`
- Aplicar migration com `supabase db push`.
- Executar as validações manuais do serviço listadas em `docs/test-checklist.md`.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 9 autorizada pelo usuário: página preview visual do Karma

Arquivos alterados nesta etapa:

- `src/pages/KarmaPreviewPage.tsx`
- `docs/implementation-history.md`

Resumo:

- Criada página preview visual do formulário/modal de Karma.
- Seguido o padrão visual do Duo Loot com `dl-panel`, gradientes, bordas arredondadas, cores do design system e tipografia `Rajdhani`.
- Adicionada pergunta de desempenho com opções `Ruim`, `Na Média` e `Mandou Bem`.
- Adicionada pergunta de comportamento com opções `Tóxico / Troll`, `Silencioso / Neutro` e `Gente Boa / Comunicativo`.
- Adicionado campo de comentário opcional com limite de 150 caracteres.
- Adicionado botão `Enviar Avaliação` bloqueado até as duas perguntas obrigatórias serem respondidas.
- Adicionado cálculo visual do Karma gerado pela avaliação selecionada.
- Mantida a página sem rota/menu e sem integração real com Supabase nesta etapa.

Commit da página relacionado:

- `a3be341d8e91ed6a8f81833bf1925e007e717668`

Testes pendentes para o PC:

- `npm run build`
- Conferir se a página compila sem erro de import/tipos.
- Após conectar rota/menu, abrir a página e validar o comportamento visual do formulário.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 10 autorizada pelo usuário: checklist de validação da página preview do Karma

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada validação específica para a página `src/pages/KarmaPreviewPage.tsx`.
- Adicionado `npm run build` como verificação de TypeScript, import de tipos e compilação da página.
- Adicionada validação visual para o padrão Duo Loot: fundo escuro, `dl-panel`, gradientes, bordas arredondadas e tipografia `Rajdhani`.
- Adicionada verificação do título `Avaliação pós-partida`, status `Preview • Karma` e jogador mockado `ShadowPhoenix`.
- Adicionada verificação das opções obrigatórias de desempenho e comportamento.
- Adicionada verificação de bloqueio/habilitação do botão `Enviar Avaliação` conforme respostas selecionadas.
- Adicionada verificação do contador de comentário até 150 caracteres.
- Adicionada verificação do cálculo visual do Karma desta avaliação.
- Adicionada evidência de print da página preview em desktop e mobile.

Commit do checklist relacionado:

- `5e1d360042183dff62e258cdf2aeda734b9659fd`

Testes pendentes para o PC:

- `npm run build`
- Após conectar rota/menu, abrir a página e executar a validação visual listada em `docs/test-checklist.md`.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.
