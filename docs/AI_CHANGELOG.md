# Histórico de Alterações para IA — Duo Loot

Este arquivo registra alterações relevantes feitas por agentes, assistentes, automações ou IDE agents no projeto.

O objetivo é permitir que um novo chat, outro agente ou uma futura sessão entenda rapidamente o que foi alterado, por quê, onde e o que ainda falta validar.

## Regra obrigatória

Toda alteração feita por IA deve registrar uma entrada neste arquivo.

Isso vale mesmo para:

- alteração de uma linha;
- renomeação de arquivo;
- criação de documentação;
- remoção de código;
- ajuste visual;
- correção de texto;
- teste de escrita que não gera commit;
- mudança em arquivo de configuração;
- alteração em segurança;
- alteração em Supabase, Edge Functions, Premium, Riot, Vault, pontos, ranking, mensagens, convites ou dados de usuário.

## Quantidade mínima de contexto

Mantenha pelo menos os últimos 20 itens alterados na seção `Últimos 20 itens`.

Quando houver mais de 20 entradas, mova as mais antigas para `Histórico completo` ou mantenha todas abaixo. Não apague contexto importante sem justificar.

## Como registrar

Cada entrada deve conter:

```md
### AAAA-MM-DD — título curto

ID: AI-YYYYMMDD-NNN
Tipo: docs | fix | feature | security | refactor | test | chore | connection
Autor: nome do agente ou ferramenta
Commit: SHA ou `sem commit`
Arquivos alterados:
- `caminho/do/arquivo`

Resumo:
- O que mudou.

Motivo:
- Por que mudou.

Impacto:
- O que um próximo agente precisa saber.

Validação:
- Testes rodados ou motivo de não ter rodado.

Pendências:
- O que precisa ser feito depois, se houver.
```

## Regra anti-loop

Quando a alteração for apenas atualizar este histórico para registrar uma tarefa, não crie entradas infinitas sobre a própria atualização do histórico.

Registre uma única entrada por pacote de trabalho, incluindo `docs/AI_CHANGELOG.md` na lista de arquivos alterados.

---

# Últimos 20 itens

## 2026-05-30

### 2026-05-30 — Adição de mais 10 lobbies mockados

ID: AI-20260530-005
Tipo: test
Autor: Antigravity
Commit: pendente
Arquivos alterados:
- `src/data/mocks/lobbies.mock.ts`
- `docs/AI_CHANGELOG.md`

Resumo:
- Adicionados mais 10 lobbies gerados dinamicamente no mock de lobbies para melhor testar as listas na UI.

Motivo:
- O usuário solicitou visualizar mais exemplos de cards na tela ("quero mais 10").

Impacto:
- A interface renderizará mais cards (22 no total em vez de 12), facilitando a visualização e teste do layout da grade e do LobbyCard.

Validação:
- Validação no ambiente local.

Pendências:
- Nenhuma.

---


### 2026-05-30 — Correção de proporções do LobbyCard e Lobbies Mockados

ID: AI-20260530-004
Tipo: fix
Autor: Antigravity
Commit: pendente
Arquivos alterados:
- `src/features/lobby/components/LobbyCard.tsx` (restaurado)
- `src/components/organisms/LobbyGrid.tsx`
- `src/data/mocks/lobbies.mock.ts`

Resumo:
- Restaurado o tamanho original dos textos e espaçamentos do `LobbyCard`.
- Aplicada uma propriedade de zoom CSS diretamente na grade (`xl:[zoom:0.9] 2xl:[zoom:0.85] 3xl:[zoom:0.75]`) para escalar o componente inteiro sem quebrar ou deformar seu layout interno.
- Gerados 10 exemplos adicionais de lobbies no arquivo mock.

Motivo:
- A tentativa anterior de diminuir as fontes distorceu o design visual rico do card. A solução com `zoom` preserva a intenção original do componente, reduzindo seu footprint na tela em monitores gigantes para exibir 4 colunas sem espremer conteúdo horizontalmente.

Impacto:
- Os cards renderizam na sua proporção original, mas em escala fisicamente menor em resoluções altas, suportando com elegância as 4 colunas solicitadas.

Validação:
- Requer teste visual local.

Pendências:
- Nenhuma.

---

### 2026-05-30 — Ajuste de colunas no LobbyGrid

ID: AI-20260530-003
Tipo: refactor
Autor: Antigravity
Commit: pendente
Arquivos alterados:
- `src/components/organisms/LobbyGrid.tsx`

Resumo:
- Atualizada a grade de lobbies para `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`.

Motivo:
- Devido à expansão do layout para monitores gigantes, a restrição de apenas 2 colunas estava deixando os cards enormes. O usuário solicitou 4 cards por fileira.

Impacto:
- A exibição do lobby ficará mais densa e equilibrada em monitores QHD/FHD, exibindo até 4 lobbies por linha.

Validação:
- Requer teste visual local.

Pendências:
- Nenhuma.

---

### 2026-05-30 — Otimização de layouts para monitores 24" (FHD) e 27" (QHD)

ID: AI-20260530-002
Tipo: refactor
Autor: Antigravity
Commit: pendente
Arquivos alterados:
- `tailwind.config.ts`
- Vários templates e layouts (`DashboardTemplate`, `CoachesTemplate`, etc)

Resumo:
- Adicionados breakpoints `3xl` (1920px) e `4xl` (2560px) no Tailwind.
- Expandida largura máxima global para `max-w-[2560px]` com margens flexíveis (`3xl:px-12`, `4xl:px-24`).
- Ajustadas as colunas (`grid-cols`) em dashboards e vitrines para exibirem mais itens horizontalmente em telas gigantes (ex: 4 e 5 colunas).

Motivo:
- Monitores 27" ficavam com quase 50% de espaço vazio nas laterais mesmo com limite de 1600px. A adoção de layout quase fluido preenche melhor essas telas.

Impacto:
- Em monitores de 24" ou maiores, o site exibirá mais conteúdo lado a lado, aproveitando a largura extra.

Validação:
- Requer teste manual rodando `npm run dev` em tela QHD.

Pendências:
- Nenhuma.

---

### 2026-05-30 — Expansão de layouts para telas HD/QHD

ID: AI-20260530-001
Tipo: refactor
Autor: Antigravity
Commit: pendente
Arquivos alterados:
- `src/layouts/PublicLayout.tsx`
- `src/layouts/EventLayout.tsx`
- `src/templates/PremiumTemplate/index.tsx`
- `src/templates/ProfileTemplate/index.tsx`
- `src/templates/CoachesTemplate/index.tsx`
- `src/templates/LobbyTemplate/index.tsx`
- `src/templates/OnboardingTemplate/index.tsx`
- `src/templates/VaultTemplate/index.tsx`
- `src/templates/DashboardTemplate/index.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/KarmaPreviewPage.tsx`
- `src/pages/AdminVaultPage.tsx`
- `src/pages/LoginPage.tsx`
- Componentes da Home (`CoachesSection`, `FeaturesSection`, `FreeTournamentsSection`)

Resumo:
- Substituídas restrições `max-w-[1240px]`, `max-w-6xl` e `max-w-7xl` por `max-w-[1600px]`.

Motivo:
- Conteúdo estreito em resoluções grandes (HD e QHD). O aumento melhora aproveitamento de tela.

Impacto:
- Site utilizará melhor as bordas em monitores ultrawide ou QHD, evitando amontoamento no meio.

Validação:
- Testes manuais pendentes via preview local.

Pendências:
- Nenhuma.

---

## 2026-05-29

### 2026-05-29 — Criado histórico obrigatório para agentes

ID: AI-20260529-004
Tipo: docs
Autor: ChatGPT
Commit: pendente nesta criação
Arquivos alterados:
- `docs/AI_CHANGELOG.md`
- `AGENTS.md` após atualização relacionada

Resumo:
- Criado histórico geral para registrar alterações feitas por IA.
- Definida regra para registrar qualquer alteração, mesmo de uma linha.
- Definido mínimo de 20 itens recentes para preservar contexto entre chats e agentes.

Motivo:
- Evitar perda de contexto quando um novo chat, Codex, IDE agent ou outro assistente continuar o projeto.

Impacto:
- Agentes futuros devem consultar este arquivo antes de alterar o projeto.
- Toda alteração futura deve adicionar uma entrada aqui.

Validação:
- Validação será feita por leitura direta do arquivo após commit.

Pendências:
- Atualizar `AGENTS.md` para tornar este histórico leitura obrigatória.

---

### 2026-05-29 — Atualizado AGENTS.md para usar mapa de IA

ID: AI-20260529-003
Tipo: docs
Autor: ChatGPT
Commit: `d9de858aa1fb6d63cd6928e990f15252f9834ef8`
Arquivos alterados:
- `AGENTS.md`

Resumo:
- Adicionado `docs/AI_REPO_MAP.md` na ordem obrigatória de leitura.
- Adicionado `docs/AI_REPO_MAP.md` em arquivos sempre ativos.
- Criada seção de busca e indexação para orientar agentes quando a busca textual falhar.

Motivo:
- A busca textual do conector retornou vazia para termos existentes, mas leitura direta funcionou.

Impacto:
- Agentes devem usar leitura direta e consultar o mapa antes de concluir que algo não existe.

Validação:
- Arquivo foi lido diretamente após alteração.

Pendências:
- Nenhuma pendência funcional registrada.

---

### 2026-05-29 — Criado mapa de navegação para IA

ID: AI-20260529-002
Tipo: docs
Autor: ChatGPT
Commit: `bdbd41cde6e9223beb622cdb3d9bce576bc2a1bd`
Arquivos alterados:
- `docs/AI_REPO_MAP.md`

Resumo:
- Criado mapa para agentes navegarem no repositório mesmo quando busca/indexação falhar.
- Registrados arquivos principais conhecidos, estrutura esperada e comandos locais para reconstruir mapa.

Motivo:
- Reduzir trabalho no escuro e impedir que agentes se percam em caminhos aleatórios.

Impacto:
- `docs/AI_REPO_MAP.md` vira bússola operacional para ChatGPT, Codex e IDE agents.

Validação:
- Arquivo foi lido diretamente após criação.

Pendências:
- Expandir o mapa conforme novas áreas do código forem descobertas.

---

### 2026-05-29 — Testada conexão GitHub com leitura e escrita não invasiva

ID: AI-20260529-001
Tipo: connection
Autor: ChatGPT
Commit: `sem commit`
Arquivos alterados:
- Nenhum arquivo da árvore Git foi alterado.

Resumo:
- Validada conta GitHub `Elias-dety`.
- Validado repositório `Elias-dety/duoloot`.
- Leitura direta testada em `README.md` e `package.json`.
- Escrita não invasiva testada por criação de Git blob.
- Detectada limitação na busca/indexação textual do conector.

Motivo:
- Confirmar se a IA conseguiria ler e escrever no repositório.

Impacto:
- Acesso está funcional para leitura e escrita.
- Busca textual pode falhar, então agentes devem preferir leitura direta por caminho conhecido quando possível.

Validação:
- `README.md` e `package.json` foram lidos com sucesso.
- Blob criado com SHA `ee3a26bb836dfd8ab5f5657a27355ba774539c9e`.

Pendências:
- Não há como forçar indexação interna do conector via repositório.

---

# Histórico completo

Por enquanto, o histórico completo é igual aos últimos itens. Quando ultrapassar 20 entradas, mantenha o contexto antigo aqui ou em arquivo de arquivo histórico dedicado.
