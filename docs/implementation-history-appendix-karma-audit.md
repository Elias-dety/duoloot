# Apêndice do histórico de implementação: auditoria do Karma

Este apêndice registra correções pequenas feitas após a revisão geral do pacote de Karma na branch `ui/extend-kombai-visuals`.

## 2026-05-27

### Etapa 19 autorizada pelo usuário: correção de rótulo antigo no checklist

Arquivos alterados nesta etapa:

- `docs/test-checklist.md`
- `docs/implementation-history-appendix-karma-audit.md`

Resumo:

- Corrigida uma referência antiga a `Comportamento` na validação manual das regras do lobby.
- O checklist agora orienta validar `Resumo rápido`, `Karma`, `Tags do perfil`, `Descrição` e botões normalmente.
- Essa correção evita confusão durante os testes no PC, já que o card do lobby passou a exibir a seção `Karma` no lugar de `Comportamento`.
- O arquivo principal `docs/implementation-history.md` não foi alterado nesta etapa para evitar risco de sobrescrever o histórico extenso já existente.

Commit do checklist relacionado:

- `6e4a60384b096c0ea60a3a3622527d5a5fbff5dc`

Testes pendentes para o PC:

- Abrir `docs/test-checklist.md`.
- Confirmar que a validação manual das regras do lobby cita `Karma`, não `Comportamento`.
- Rodar `npm run build` antes dos testes manuais.

Observação:

- Não rodei build nem testes localmente. Alteração preparada pelo GitHub para validação posterior no PC.
