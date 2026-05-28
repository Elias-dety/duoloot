# Checklist de testes do Duo Loot

Use este arquivo como fila de validação quando voltar ao PC.

## Lobby

### Build

```bash
git pull origin ui/extend-kombai-visuals
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- Vite finaliza o build.

### E2E serializado do lobby

```bash
npm run test:e2e:lobby -- --repeat-each=3
```

Resultado esperado:

- O fluxo cria lobby com `+ Criar Lobby`.
- O segundo usuário vê o lobby.
- O segundo usuário entra no lobby.
- O card mostra `Você entrou` e `Sair do lobby`.

### Validação manual das regras do lobby

Fluxo configurável:

1. Entrar em `/lobby`.
2. Clicar em `Configurar lobby`.
3. Escolher número de jogadores.
4. Escolher posições necessárias.
5. Escolher posição do dono.
6. Escolher reputação máxima.
7. Criar lobby configurado.
8. Confirmar se o card mostra `Regras do lobby` logo depois de `Capacidade do lobby`.
9. Confirmar se aparecem posições necessárias, posição do dono e reputação máxima.
10. Confirmar que o card continua mostrando `Resumo rápido`, `Comportamento`, `Tags do perfil`, `Descrição` e botões normalmente.

Fluxo antigo/rápido:

1. Criar lobby usando `+ Criar Lobby`.
2. Confirmar que o card continua aparecendo sem quebrar.
3. Confirmar que `Regras do lobby` não aparece quando não houver regras salvas em `metadata`.

## Karma / Reputação

### Migration base do Karma

Arquivo esperado:

```text
supabase/migrations/20260527154500_create_karma_reputation_system.sql
```

Aplicar migration, conforme seu fluxo local do Supabase:

```bash
supabase db push
```

Resultado esperado:

- Migration aplica sem erro.
- Enums `categoria_desempenho_partida` e `categoria_comportamento_partida` existem.
- Tabela `avaliacoes_partidas` existe.
- Tabela `reputacao_jogador` existe.
- Trigger `trg_sincronizar_reputacao_jogador` existe em `avaliacoes_partidas`.

### Validação SQL do cálculo de Karma

Depois de aplicar a migration, validar no SQL Editor do Supabase ou via banco local:

```sql
select to_regtype('public.categoria_desempenho_partida') as enum_desempenho;
select to_regtype('public.categoria_comportamento_partida') as enum_comportamento;
select to_regclass('public.avaliacoes_partidas') as tabela_avaliacoes;
select to_regclass('public.reputacao_jogador') as tabela_reputacao;
```

Resultado esperado:

- Todas as consultas retornam nomes válidos, não `null`.

### Validação do serviço frontend de Karma

Arquivo esperado:

```text
src/services/karma.service.ts
```

Build:

```bash
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- O import `@/lib/supabase` é resolvido corretamente.
- Os tipos `CategoriaDesempenhoPartida`, `CategoriaComportamentoPartida`, `SubmitKarmaReviewPayload` e `KarmaSummary` não geram erro.

Validação manual após aplicar a migration:

1. Entrar com um usuário autenticado.
2. Usar `submitKarmaReview` com `partidaId`, `avaliadoId`, `categoriaDesempenho`, `categoriaComportamento` e comentário opcional.
3. Confirmar que a linha aparece em `avaliacoes_partidas`.
4. Confirmar que `comentario` fica com no máximo 150 caracteres.
5. Confirmar que autoavaliação retorna erro: `Você não pode avaliar a si mesmo.`.
6. Usar `getPlayerKarma` para o jogador avaliado.
7. Confirmar que retorna `karmaGeral`, `scoreDesempenhoTotal`, `scoreComportamentoTotal` e `totalPartidasAvaliadas`.
8. Usar `getPlayerKarma` para jogador sem avaliações.
9. Confirmar que retorna `null`, sem quebrar a UI.

### Validação da rota da página preview do Karma

Arquivos esperados:

```text
src/constants/routes.ts
src/routes/private-routes.tsx
src/pages/KarmaPreviewPage.tsx
```

Build:

```bash
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- `ROUTES.KARMA_PREVIEW` existe e aponta para `/karma/preview`.
- `private-routes.tsx` carrega `KarmaPreviewPage` via lazy import.
- A rota `/karma/preview` fica protegida pelo `DashboardLayout`.

Validação manual da rota:

1. Entrar com um usuário autenticado.
2. Abrir `/karma/preview` diretamente no navegador.
3. Confirmar que a página carrega sem tela branca.
4. Confirmar que o layout protegido aparece ao redor da página.
5. Sair da conta e tentar abrir `/karma/preview` novamente.
6. Confirmar que usuário deslogado não acessa a página protegida.

### Validação do link Karma no menu

Arquivo esperado:

```text
src/layouts/DashboardLayout.tsx
```

Build:

```bash
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- O array `navItems` contém o item `Karma`.
- O item `Karma` aponta para `ROUTES.KARMA_PREVIEW`.
- O código visual do menu para Karma é `KM`.

Validação manual do menu:

1. Entrar com um usuário autenticado.
2. Confirmar que o item `Karma` aparece no menu lateral em desktop.
3. Confirmar que o item `Karma` aparece no menu superior/mobile quando a largura for pequena.
4. Clicar em `Karma`.
5. Confirmar que abre `/karma/preview`.
6. Confirmar que o item `Karma` fica com estado visual ativo.
7. Confirmar que os links antigos `Dashboard`, `Perfil`, `Premium`, `Lobby` e `Cofre` continuam aparecendo.

### Validação do Karma real no card do lobby

Arquivo esperado:

```text
src/features/lobby/components/LobbyCard.tsx
```

Build:

```bash
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- O card importa `getPlayerKarma` de `@/services/karma.service`.
- O card usa `KarmaSummary` para tipar o estado `karmaSummary`.
- O card busca Karma real usando `lobby.owner.id`.
- O card exibe `Carregando` enquanto busca o Karma.
- O card exibe `Sem Karma` quando `getPlayerKarma` retorna `null`.
- O card exibe pontos e total de avaliações quando houver registro em `reputacao_jogador`.
- A UI não quebra se a busca falhar ou se o dono do lobby não tiver ID.

Validação manual do card:

1. Aplicar a migration com `supabase db push`, se ainda não tiver aplicado.
2. Entrar em `/lobby` com usuário autenticado.
3. Confirmar que os cards continuam carregando normalmente.
4. Confirmar que a seção `Karma` aparece no card.
5. Confirmar que aparece `Carregando` rapidamente durante a busca.
6. Confirmar que jogador sem avaliações mostra `Sem Karma` e `Jogador ainda sem avaliações`.
7. Criar/inserir uma avaliação para o dono de um lobby.
8. Confirmar que o card passa a mostrar pontos, por exemplo `+4 pontos`, e o total de avaliações.
9. Confirmar que Karma `<= -10` aparece como `Karma baixo`.
10. Confirmar que Karma `>= 50` aparece como `Karma alto`.
11. Confirmar que valores intermediários aparecem como `Karma neutro`.
12. Confirmar que o restante do card segue funcionando: `Resumo rápido`, `Tags do perfil`, `Descrição`, `Ver Perfil` e botão de entrada/saída.

### Validação da página preview do Karma

Arquivo esperado:

```text
src/pages/KarmaPreviewPage.tsx
```

Build:

```bash
npm run build
```

Resultado esperado:

- TypeScript compila sem erro.
- A página resolve o import de tipos de `@/services/karma.service`.
- A página pode ser aberta diretamente em `/karma/preview` quando o usuário está autenticado.

Validação visual:

1. Abrir `/karma/preview`.
2. Confirmar que o visual segue o padrão Duo Loot: fundo escuro, `dl-panel`, gradientes, bordas arredondadas e tipografia `Rajdhani`.
3. Confirmar que aparece o título `Avaliação pós-partida`.
4. Confirmar que aparece o status `Preview • Karma`.
5. Confirmar que aparece o jogador mockado `ShadowPhoenix`.
6. Confirmar que aparece a pergunta `Como foi o desempenho desse jogador na partida?`.
7. Confirmar que aparecem as opções `Ruim`, `Na Média` e `Mandou Bem`.
8. Confirmar que aparece a pergunta `Como foi o comportamento desse jogador?`.
9. Confirmar que aparecem as opções `Tóxico / Troll`, `Silencioso / Neutro` e `Gente Boa / Comunicativo`.
10. Confirmar que o botão `Enviar Avaliação` começa bloqueado.
11. Selecionar uma resposta de desempenho e confirmar que o botão ainda fica bloqueado.
12. Selecionar uma resposta de comportamento e confirmar que o botão fica habilitado.
13. Digitar no comentário opcional e confirmar o contador `0/150` até `150/150`.
14. Confirmar que o card lateral mostra o Karma desta avaliação mudando conforme as opções.
15. Confirmar que a página informa que a integração real com Supabase virá depois.

### Validação manual futura do fluxo real de avaliação

Quando a página/modal estiver integrada ao Supabase:

1. Abrir a página/modal após uma partida encerrada.
2. Selecionar uma opção em `Como foi o desempenho desse jogador na partida?`.
3. Selecionar uma opção em `Como foi o comportamento desse jogador?`.
4. Confirmar que `Enviar Avaliação` fica habilitado apenas após as duas respostas obrigatórias.
5. Escrever até 150 caracteres no comentário opcional.
6. Enviar avaliação.
7. Confirmar que `karma_geral` é atualizado em `reputacao_jogador`.
8. Confirmar que resposta `TOXICO` aplica -5 pontos no comportamento.
9. Confirmar que resposta `RUIM` aplica 0 pontos no desempenho.

## Evidências úteis se falhar

Se algum teste falhar, guardar e enviar:

- erro completo do terminal;
- print do card ou página afetada;
- trecho com `BAD RESPONSE`, se aparecer no Playwright;
- conteúdo de `error-context.md`, se o Playwright gerar;
- erro SQL completo se a migration falhar;
- nome da tabela, função ou trigger que não foi criada;
- payload usado no `submitKarmaReview`, ocultando dados sensíveis se houver;
- URL acessada no teste da rota `/karma/preview`;
- print do item `Karma` no menu desktop e mobile;
- print do card do lobby mostrando `Carregando`, `Sem Karma` ou Karma real;
- print da linha em `reputacao_jogador` usada para validar o card;
- print da página preview do Karma em desktop e, se possível, em mobile.
