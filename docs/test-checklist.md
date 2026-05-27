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

### Validação manual futura do fluxo de avaliação

Quando a página/modal de Karma existir:

1. Abrir a página de prévia do Karma.
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
- nome da tabela, função ou trigger que não foi criada.
