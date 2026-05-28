# Alterações Críticas de Segurança

Data: 2026-05-28

Este arquivo registra alterações críticas feitas para estabilizar e proteger a execução do projeto durante a validação local e E2E.

## Objetivos
- Evitar regressão de estabilidade nos testes.
- Impedir que specs de debug entrem no fluxo padrão de E2E.
- Manter o mesmo nível de cautela ao refazer ou alterar os pontos abaixo.
- Assegurar conformidade com as diretrizes de governança estabelecidas no [AGENTS_SECURITY.md](file:///d:/meusProjeto/duoloot/AGENTS_SECURITY.md) e [AGENTS.md](file:///d:/meusProjeto/duoloot/AGENTS.md).

## Alterações críticas aplicadas
- [playwright.config.ts](file:///d:/meusProjeto/duoloot/playwright.config.ts): `fullyParallel` foi desativado e `workers` foi fixado em `1` para reduzir concorrência e evitar travamento de worker no encerramento.
- `tests/e2e/debug_signup.spec.ts`: o teste ficou marcado como `skip` para não entrar nas execuções padrão.
- `tests/e2e/real_lobby_signup.spec.ts`: o teste de seed/debug ficou marcado como `skip` para evitar rate limit e dados artificiais no fluxo principal.
- `tests/e2e/real_lobby_flow.spec.ts`: o fluxo real ganhou cleanup com `try/finally` para fechar contextos mesmo se houver erro durante a execução.
- `tests/e2e/real_lobby_flow.spec.ts`: a asserção frágil de texto de sucesso foi removida e o teste agora valida o efeito real no card do lobby.

## Nível de segurança adotado
- Não reativar specs de debug no fluxo padrão de `npm run test:e2e`.
- Não voltar para execução paralela sem validar o encerramento correto dos workers.
- Não depender de mensagens de sucesso instáveis para validar o fluxo crítico.
- Não reintroduzir e-mails artificiais com formato conhecido por falhar no Supabase ou gerar rate limit.
- Sempre preservar o fechamento explícito de `browserContext`/`page` em testes que abrem múltiplos contextos.

## Regras para futuros agentes
1. Antes de alterar o código de testes E2E ou configurações, o agente **deve** ler os seguintes arquivos de governança:
   - [AGENTS.md](file:///d:/meusProjeto/duoloot/AGENTS.md) — Regras de ouro de segurança do projeto.
   - [AGENTS_SECURITY.md](file:///d:/meusProjeto/duoloot/AGENTS_SECURITY.md) — Guia de governança de agentes.
   - [SECURITY_AUDIT_HISTORY.md](file:///d:/meusProjeto/duoloot/docs/security/SECURITY_AUDIT_HISTORY.md) — Histórico de auditorias defensivas.
   - [implementation-history.md](file:///d:/meusProjeto/duoloot/implementation-history.md) — Histórico de implementação.
2. Se precisar reativar algum teste `skip`, mova primeiro para uma fila isolada de validação e não para a suíte padrão.
3. Se alterar o [playwright.config.ts](file:///d:/meusProjeto/duoloot/playwright.config.ts), mantenha a justificativa de concorrência baixa até confirmar estabilidade completa.
4. Se alterar o fluxo de lobby, mantenha o cleanup, evite dependência de mensagens de UI que possam mudar e verifique o comportamento no arquivo de testes atual [lobby.spec.ts](file:///d:/meusProjeto/duoloot/tests/e2e/lobby.spec.ts).
5. Se um teste falhar com erro de Supabase, diferencie erro de ambiente, rate limit e problema real do código antes de alterar a suíte.

## Validação Obrigatória
De acordo com o item 2.C do [AGENTS_SECURITY.md](file:///d:/meusProjeto/duoloot/AGENTS_SECURITY.md), antes de marcar qualquer tarefa como concluída, o agente **deve** rodar localmente e confirmar o sucesso dos seguintes comandos:

```bash
npm run lint
npm run build
npm run test:e2e:lobby -- --repeat-each=3  # Caso altere fluxos de lobby ou matchmaking
```

## Observações e Diretrizes Finais
- Este documento não substitui testes nem revisão de código. Ele apenas define o nível mínimo de cautela que deve ser mantido.
- Todo agente deve deixar o repositório mais seguro e estável do que o encontrou.
- Em caso de dúvida sobre qualquer alteração que afete o fluxo de testes ou as regras de banco de dados, interrompa a execução, documente as premissas e consulte o desenvolvedor responsável.

