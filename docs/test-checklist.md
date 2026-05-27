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

### Evidências úteis se falhar

Se algum teste falhar, guardar e enviar:

- erro completo do terminal;
- print do card do lobby;
- trecho com `BAD RESPONSE`, se aparecer no Playwright;
- conteúdo de `error-context.md`, se o Playwright gerar.
