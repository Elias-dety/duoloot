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

### Validação manual futura das regras do lobby

Depois que o componente for conectado ao card:

1. Entrar em `/lobby`.
2. Clicar em `Configurar lobby`.
3. Escolher número de jogadores.
4. Escolher posições necessárias.
5. Escolher posição do dono.
6. Escolher reputação máxima.
7. Criar lobby configurado.
8. Confirmar se o card mostra `Regras do lobby`.
9. Confirmar se aparecem posições, posição do dono e reputação máxima.
