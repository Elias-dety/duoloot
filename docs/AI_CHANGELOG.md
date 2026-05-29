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
