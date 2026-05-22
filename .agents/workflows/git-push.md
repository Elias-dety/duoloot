---
description: 
---

Use este fluxo sempre que o usuário pedir para:

- Fazer commit
- Preparar commit
- Separar commits
- Revisar alterações antes de commitar
- Criar mensagem de commit
- Organizar alterações no Git
- Subir alterações para o repositório

---

## Regras principais

1. Nunca faça commit sem revisar as alterações primeiro.
2. Nunca inclua arquivos sensíveis no commit.
3. Nunca misture mudanças sem relação no mesmo commit.
4. Sempre explique ao usuário o que foi alterado antes de commitar.
5. Se houver dúvida sobre uma alteração, pare e pergunte antes de incluir.
6. Se encontrar arquivos de build, cache, logs ou dependências geradas, não inclua sem necessidade.
7. Use mensagens de commit objetivas, no padrão Conventional Commits.
8. Depois do commit, informe o hash curto e um resumo do que foi salvo.

---

## Fluxo obrigatório

### 1. Identificar o estado do Git

Execute:

```bash
git status --short
```

Analise:

- Arquivos modificados
- Arquivos novos
- Arquivos deletados
- Arquivos não rastreados
- Arquivos possivelmente sensíveis

Não faça commit ainda.

---

### 2. Revisar diferenças

Para arquivos modificados, execute:

```bash
git diff
```

Para arquivos já staged, execute também:

```bash
git diff --staged
```

Entenda exatamente o que mudou.

Procure por:

- Alterações reais de código
- Mudanças de layout ou UI
- Refatorações
- Correções de bug
- Mudanças em dependências
- Alterações em configuração
- Arquivos gerados automaticamente
- Dados sensíveis

---

### 3. Verificar arquivos sensíveis

Antes de adicionar arquivos ao commit, confira se existe algo como:

- `.env`
- `.env.local`
- `.env.production`
- Chaves API
- Tokens
- Senhas
- Credenciais
- Arquivos `.pem`, `.key`, `.crt`
- Dumps de banco
- Logs com dados privados
- Arquivos contendo informações pessoais

Se encontrar algo sensível:

1. Não adicione ao commit.
2. Avise o usuário.
3. Sugira adicionar ao `.gitignore`, se fizer sentido.

---

### 4. Separar alterações por intenção

Agrupe as mudanças por objetivo.

Exemplos de grupos:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `style`: ajuste visual sem mudar lógica
- `refactor`: reorganização de código sem alterar comportamento
- `test`: criação ou ajuste de testes
- `docs`: documentação
- `chore`: tarefas internas, configs ou manutenção
- `build`: dependências, build ou empacotamento
- `perf`: melhoria de performance

Se houver várias intenções diferentes, faça commits separados.

Exemplo:

```bash
git add src/components/Button.tsx
git commit -m "style: adjust primary button appearance"

_git add src/pages/Home.tsx src/sections/Hero.tsx_
git commit -m "feat: update home hero section"
```

Corrija o exemplo acima removendo underscores se for executar:

```bash
git add src/pages/Home.tsx src/sections/Hero.tsx
git commit -m "feat: update home hero section"
```

---

## Padrão de mensagem de commit

Use este formato:

```text
tipo: descrição curta no imperativo
```

Exemplos:

```text
feat: add loot vault page
fix: correct mobile navbar behavior
style: update landing page button design
refactor: simplify auth form structure
test: add basic home page coverage
docs: document git commit workflow
chore: update project configuration
```

A descrição deve:

- Ser curta
- Explicar a intenção
- Não terminar com ponto final
- Preferencialmente usar inglês técnico simples

---

## Antes de commitar

Sempre apresente ao usuário um resumo assim:

```md
## Revisão antes do commit

Arquivos que serão incluídos:

- `caminho/do/arquivo.tsx` — breve explicação da mudança
- `outro/arquivo.ts` — breve explicação da mudança

Arquivos ignorados:

- `.env.local` — possível arquivo sensível
- `dist/` — build gerado automaticamente

Commit sugerido:

`tipo: descrição do commit`
```

Se o usuário já pediu para executar sem nova confirmação, continue. Caso contrário, aguarde aprovação.

---

## Execução do commit

Depois de definir os arquivos corretos:

```bash
git add caminho/do/arquivo1 caminho/do/arquivo2
git commit -m "tipo: descrição do commit"
```

Depois confirme:

```bash
git status --short
git log -1 --oneline
```

Informe ao usuário:

```md
Commit criado com sucesso.

Hash: `abc1234`
Mensagem: `tipo: descrição do commit`
Resumo: breve explicação do que foi salvo.
```

---

## Push para o repositório remoto

Só faça push se o usuário pedir explicitamente algo como:

- “suba para o Git”
- “faz push”
- “envia para o GitHub”
- “manda para o repositório”

Antes do push, confira a branch atual:

```bash
git branch --show-current
```

Depois execute:

```bash
git push
```

Se a branch não tiver upstream configurado:

```bash
git push -u origin nome-da-branch
```

Nunca troque de branch ou faça merge/rebase sem o usuário pedir.

---

## Quando houver erro

Se um comando falhar:

1. Leia a mensagem de erro.
2. Explique de forma simples.
3. Não tente soluções perigosas automaticamente.
4. Nunca use `--force`, `reset --hard`, `clean -fd` ou comandos destrutivos sem autorização explícita.

Comandos proibidos sem autorização clara:

```bash
git push --force
git reset --hard
git clean -fd
git checkout -- .
git restore .
git rebase
git merge
git branch -D
```

---

## Checklist final

Antes de finalizar, confirme:

- [ ] O commit contém apenas arquivos relacionados
- [ ] Nenhum segredo foi incluído
- [ ] A mensagem segue Conventional Commits
- [ ] O status do Git foi verificado
- [ ] O hash do commit foi informado
- [ ] Push só foi feito se solicitado

---

## Comportamento esperado

Atue como um assistente cuidadoso, técnico e direto.

Sempre procure entender o projeto antes de commitar. Não seja um apertador de botão. Seja um curador de mudanças: cada commit deve contar uma pequena história limpa, rastreável e fácil de desfazer.

