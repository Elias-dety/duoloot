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

### Etapa 11 autorizada pelo usuário: rota privada da página preview do Karma

Arquivos alterados nesta etapa:

- `src/constants/routes.ts`
- `src/routes/private-routes.tsx`
- `docs/implementation-history.md`

Resumo:

- Adicionada constante `KARMA_PREVIEW` em `ROUTES`.
- Definido o caminho `/karma/preview` para acessar a página preview do Karma.
- Adicionado lazy import de `KarmaPreviewPage` nas rotas privadas.
- Registrada rota privada para renderizar `KarmaPreviewPage` dentro do `DashboardLayout`.
- Mantido o menu do cabeçalho sem alteração nesta etapa.

Commits de rota relacionados:

- `cb38904e56782b4e2340a90269912cd5f35e0f5e`
- `577b0995c4986c5107e1c2ea36c649f11098d2e6`

Testes pendentes para o PC:

- `npm run build`
- Entrar autenticado e abrir `/karma/preview` diretamente no navegador.
- Confirmar que a página carrega dentro do layout protegido.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 12 autorizada pelo usuário: checklist de validação da rota preview do Karma

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada validação específica para a rota `/karma/preview`.
- Adicionados arquivos esperados da rota: `src/constants/routes.ts`, `src/routes/private-routes.tsx` e `src/pages/KarmaPreviewPage.tsx`.
- Adicionado `npm run build` como verificação de TypeScript, rota constante e lazy import.
- Adicionada checagem de `ROUTES.KARMA_PREVIEW` apontando para `/karma/preview`.
- Adicionada validação manual para abrir `/karma/preview` com usuário autenticado.
- Adicionada validação manual para confirmar que usuário deslogado não acessa a rota protegida.
- Atualizada a lista de evidências úteis com a URL acessada no teste da rota.

Commit do checklist relacionado:

- `7fdcb831ebf810259227453dd187ce65e1f05f28`

Testes pendentes para o PC:

- `npm run build`
- Abrir `/karma/preview` autenticado.
- Tentar abrir `/karma/preview` deslogado e confirmar bloqueio pelo fluxo protegido.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 13 autorizada pelo usuário: link temporário de Karma no menu

Arquivos alterados nesta etapa:

- `src/layouts/DashboardLayout.tsx`
- `docs/implementation-history.md`

Resumo:

- Adicionado item temporário `Karma` no array `navItems` do `DashboardLayout`.
- O novo item aponta para `ROUTES.KARMA_PREVIEW`.
- O menu lateral passa a exibir o código visual `KM` para a página de Karma.
- A página preview pode ser acessada pelo menu sem digitar `/karma/preview` manualmente.
- Nenhuma alteração foi feita no card do lobby nesta etapa.

Commit do menu relacionado:

- `c15ae2a05d3210e3fb435ea82ae126ae767ab78b`

Testes pendentes para o PC:

- `npm run build`
- Entrar autenticado e confirmar que o item `Karma` aparece no menu.
- Clicar em `Karma` e confirmar que abre a página `/karma/preview`.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 14 autorizada pelo usuário: checklist de validação do link Karma no menu

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada validação específica para o link `Karma` no menu.
- Adicionado `npm run build` como verificação de TypeScript para o `DashboardLayout`.
- Adicionada checagem para confirmar que `navItems` contém o item `Karma`.
- Adicionada checagem para confirmar que `Karma` aponta para `ROUTES.KARMA_PREVIEW`.
- Adicionada checagem do código visual `KM` no menu lateral.
- Adicionada validação manual do item `Karma` no menu desktop e mobile.
- Adicionada verificação para garantir que os links antigos continuam aparecendo.
- Atualizada a lista de evidências úteis com print do item `Karma` no menu desktop e mobile.

Commit do checklist relacionado:

- `ac9653844509764c08e3b280533e9e1fccc12761`

Testes pendentes para o PC:

- `npm run build`
- Entrar autenticado e confirmar o item `Karma` no menu desktop e mobile.
- Clicar em `Karma` e confirmar abertura de `/karma/preview`.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 15 autorizada pelo usuário: troca visual de Reputação para Karma no card do lobby

Arquivos alterados nesta etapa:

- `src/features/lobby/components/LobbyCard.tsx`
- `docs/implementation-history.md`

Resumo:

- Renomeado o tipo interno `BehaviorLevel` para `KarmaLevel`.
- Renomeadas funções auxiliares de comportamento para helpers de Karma.
- Renomeada a variável fake `behaviorLevel` para `karmaLevel`.
- Atualizado o TODO para indicar que o dado real virá de `reputacao_jogador` em etapa futura.
- Trocada a seção visual `Comportamento` para `Karma`.
- Trocado o texto `Reputação do jogador` para `Karma do jogador`.
- Atualizados os rótulos da barra para `Karma baixo`, `Neutro` e `Karma alto`.
- Mantida a barra usando dado fake, sem conectar Supabase nesta etapa.

Commit do card relacionado:

- `6e1f7bf6c0ec5b54ac7555e1cb70527a21abf278`

Testes pendentes para o PC:

- `npm run build`
- Abrir `/lobby` e confirmar que o card mostra `Karma` no lugar de `Comportamento`.
- Confirmar que aparece `Karma do jogador` e que a barra continua visualmente funcionando.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.

### Etapa 16 autorizada pelo usuário: checklist de validação do Karma no card do lobby

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history.md`

Resumo:

- Adicionada validação específica para o Karma no card do lobby.
- Adicionado `npm run build` como verificação de TypeScript para `LobbyCard.tsx`.
- Adicionada checagem para confirmar que o tipo `KarmaLevel` existe no card.
- Adicionada checagem para confirmar que a variável fake `karmaLevel` ainda é usada.
- Adicionada checagem para garantir que o card ainda não busca Karma real no Supabase.
- Adicionada validação manual para confirmar `Karma` no lugar de `Comportamento`.
- Adicionada validação manual para confirmar `Karma do jogador`.
- Adicionada validação manual da barra com `Karma baixo`, `Neutro` e `Karma alto`.
- Atualizada a lista de evidências úteis com print do card do lobby mostrando a seção `Karma`.

Commit do checklist relacionado:

- `586db23387d37ee55d7d9b850235389638e81eb1`

Testes pendentes para o PC:

- `npm run build`
- Abrir `/lobby` e validar a seção `Karma` no card.
- Confirmar que o restante do card continua funcionando normalmente.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.
