# Guia de operação para agentes no projeto Duo Loot

Este documento explica o contexto do trabalho em andamento, como o usuário está conduzindo o projeto e como um agente deve agir ao fazer alterações no repositório.

## Objetivo do projeto

O Duo Loot é um site/aplicação voltado para jogadores, com foco em matchmaking, lobbies, conexões entre players, sistema de confiança/reputação e futuras funcionalidades premium.

O trabalho atual está concentrado em transformar partes que eram visuais ou incompletas em funcionalidades reais conectadas ao Supabase.

## Forma como o usuário conduz o trabalho

O usuário normalmente trabalha assim:

1. Ele pede uma alteração ou funcionalidade.
2. O agente altera o código diretamente no GitHub, geralmente na branch `ui/extend-kombai-visuals`.
3. O agente explica exatamente o que mudou, quais arquivos foram alterados e qual commit foi gerado.
4. O agente pede para o usuário rodar comandos na IDE/local.
5. O usuário manda de volta o resultado do terminal.
6. O agente analisa o resultado e decide o próximo passo.

O usuário pode estar no celular e, nesse caso, não consegue rodar `git pull`, build ou testes imediatamente. Quando isso acontecer, o agente deve continuar com tarefas possíveis pelo GitHub, como documentação, ajustes pequenos, planejamento e preparação de arquivos.

## Branch de trabalho

Branch principal usada nesta fase:

```bash
ui/extend-kombai-visuals
```

Não trabalhar direto na `main`, a menos que o usuário peça explicitamente.

## Regras de comportamento para o agente

### 1. Fazer alterações pequenas e rastreáveis

Preferir commits pequenos, com escopo claro.

Bons exemplos:

```text
feat(lobby): add configurable lobby creation modal
fix(lobby): sync joined state from database
security(db): revoke lobby RPC execution from public
docs(agent): add operating guide for implementation workflow
```

Evitar commits gigantes misturando UI, banco, testes e limpeza sem necessidade.

### 2. Sempre explicar o que foi feito

Após qualquer alteração, responder com:

- arquivos alterados;
- resumo do que mudou;
- commit SHA;
- comandos que o usuário deve rodar;
- resultado esperado.

Modelo de resposta:

```text
Alterei:
- caminho/do/arquivo.tsx
- caminho/do/outro/arquivo.ts

Commit:
abc1234

Agora rode:

git pull origin ui/extend-kombai-visuals
npm run build
npm run test:e2e:lobby -- --repeat-each=3

Me mande o resultado completo se falhar.
```

### 3. Não fingir teste local

O agente não deve dizer que testou localmente se apenas alterou arquivos no GitHub.

Correto:

```text
Não rodei o build local aqui. Deixei a alteração no GitHub para você puxar e testar na IDE.
```

Errado:

```text
Testei e está tudo funcionando.
```

### 4. Pedir testes específicos

O agente deve pedir comandos específicos, não genéricos.

Para o fluxo atual de lobby, usar:

```bash
git pull origin ui/extend-kombai-visuals
npm run build
npm run test:e2e:lobby -- --repeat-each=3
```

O script `test:e2e:lobby` deve ser preferido porque roda com `--workers=1`, evitando corrida entre usuários de teste fixos.

### 5. Se o usuário mandar erro, analisar antes de mexer

Quando o usuário enviar logs:

1. identificar se é erro de build, teste, frontend, Supabase, permissão ou flakiness;
2. evitar mexer em várias coisas ao mesmo tempo;
3. corrigir a causa mais provável;
4. pedir novo teste.

## Estado atual do trabalho no Lobby

### Já foi feito

- Fluxo real de criar lobby com Supabase RPC `create_lobby`.
- Fluxo real de entrar no lobby com RPC `join_lobby`.
- Fluxo real de sair/fechar lobby com RPC `leave_lobby`.
- Correção de presence duplicado.
- Hardening de RPCs de lobby para `authenticated`.
- Build limpo após remover warning do Vite.
- Script `test:e2e:lobby` para rodar E2E serializado.
- Novo card visual de lobby.
- Modal `Configurar lobby` para criação completa.
- Criação rápida mantida no botão `+ Criar Lobby`.
- Deduplicação de lobbies abertos por dono.
- Sincronização do estado de participação pelo banco com `getMyJoinedLobbyIds()`.

### Funcionalidade de criação configurável

O usuário pediu que a criação de lobby permita definir:

- número de jogadores;
- posições necessárias, como `duelista`, `sentinela`, `controlador`, `iniciador`, `flex`;
- nível máximo de reputação permitido;
- pré-seleção da própria posição.

A implementação atual salva esses dados no `metadata` do lobby:

```ts
creatorPosition
creatorPositionLabel
requiredPositions
requiredPositionLabels
maxReputationAllowed
```

Por enquanto isso é adequado para MVP. Depois, pode virar schema dedicado no Supabase.

## Arquivos importantes

### Frontend Lobby

```text
src/pages/LobbyPage.tsx
src/templates/LobbyTemplate/index.tsx
src/components/organisms/LobbyGrid.tsx
src/features/lobby/components/LobbyCard.tsx
src/features/lobby/components/LobbyActionsBar.tsx
src/features/lobby/components/LobbyCreateModal.tsx
src/services/lobbies.service.ts
src/schemas/lobby.schema.ts
```

### Testes

```text
tests/e2e/real_lobby_flow.spec.ts
package.json
```

O teste atual usa usuários fixos e, por isso, deve rodar serializado.

### Supabase

```text
supabase/migrations/
```

Já existem migrations de lobby, RLS e hardening de RPCs.

## Como agir quando o usuário estiver no celular

Quando o usuário disser que está no celular e não pode testar:

1. não pedir para ele rodar comandos imediatamente;
2. fazer tarefas possíveis remotamente;
3. documentar o que ficou pronto;
4. deixar um bloco claro de comandos para quando ele voltar ao PC;
5. evitar alterações arriscadas no Supabase sem validação local próxima.

Boas tarefas para fazer enquanto o usuário está no celular:

- criar documentação;
- preparar checklist;
- ajustar UI de baixo risco;
- organizar types;
- criar arquivos novos sem quebrar fluxo antigo;
- melhorar textos e estados vazios;
- preparar testes, mas avisar que precisam rodar depois.

Evitar enquanto ele está no celular:

- grandes migrations destrutivas;
- renomear colunas críticas;
- mexer em autenticação sem teste;
- remover funcionalidades antigas usadas pelo E2E;
- alterar testes com credenciais hardcoded se a ferramenta bloquear.

## Fluxo padrão após alterações

Sempre pedir ao usuário para rodar:

```bash
git pull origin ui/extend-kombai-visuals
npm run build
npm run test:e2e:lobby -- --repeat-each=3
```

Se o build falhar, pedir o erro completo do TypeScript/Vite.

Se o teste falhar, pedir:

- trecho completo do erro;
- linha do teste;
- mensagens `BAD RESPONSE`, se existirem;
- se possível, conteúdo do `error-context.md`.

## Como interpretar falhas comuns

### Falha esperando `Você entrou`

Possíveis causas:

- join aconteceu no banco, mas estado visual não sincronizou;
- card errado foi selecionado por haver múltiplos lobbies do mesmo owner;
- realtime ainda não atualizou;
- `joinedLobbyIds` não foi sincronizado;
- RPC `join_lobby` falhou.

Ações recomendadas:

1. verificar se `getMyJoinedLobbyIds()` existe e é usado na página;
2. garantir que `fetchLobbies()` sincroniza lobbies e participações;
3. garantir que `getOpenLobbies()` mantém só o lobby aberto mais recente por dono;
4. se persistir, melhorar o teste para selecionar o card mais recente ou validar estado por banco/API.

### Falha depois de hardening de RPC

Possíveis causas:

- permissão `PUBLIC` ainda herdada;
- falta `grant execute to authenticated`;
- cache do PostgREST desatualizado.

Ações recomendadas:

- validar `has_function_privilege`;
- aplicar `revoke execute from public` e `grant execute to authenticated`;
- recarregar schema com `notify pgrst, 'reload schema';`, se possível.

### Falha intermitente com `--repeat-each`

Possível causa:

- testes usando os mesmos usuários em paralelo.

Solução:

- usar `npm run test:e2e:lobby`, que já inclui `--workers=1`.

## Próximos passos planejados

### 1. Validar os commits mais recentes

Quando o usuário voltar ao PC, validar que o pull chegou aos commits mais novos e rodar build/teste.

### 2. Exibir regras novas no card

Adicionar seção `Regras do lobby` no `LobbyCard` mostrando:

- posições necessárias;
- posição do dono;
- reputação máxima permitida.

### 3. Criar teste E2E para modal configurável

Criar novo teste sem remover o fluxo antigo:

- abrir `Configurar lobby`;
- escolher vagas;
- escolher posições;
- criar lobby configurado;
- validar que o card exibe as regras.

Preferir variáveis de ambiente para credenciais de teste.

### 4. Evoluir Supabase

Depois do MVP estabilizado:

- decidir se `metadata` continua ou vira tabela dedicada;
- criar enum de posições;
- criar validação de entrada por posição/reputação;
- gerar types do Supabase;
- revisar RLS das novas tabelas.

## Como responder ao usuário

O usuário prefere respostas diretas, em português, com leve humor. Evite enrolar.

Exemplo bom:

```text
Feito. Criei o modal e mantive o botão rápido para não quebrar o teste antigo.

Commit: abc1234

Quando voltar ao PC, rode:

git pull origin ui/extend-kombai-visuals
npm run build
npm run test:e2e:lobby -- --repeat-each=3
```

## Regra de ouro

Não avance como trator em banco de dados ou auth sem teste logo depois. Para UI/documentação, pode avançar mais. Para Supabase, passos pequenos, seguros e reversíveis.
