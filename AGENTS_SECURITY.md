# Contexto de Segurança para Agentes e Automações (DuoLoot)

Este arquivo serve como um ponto de partida e guia de governança para agentes de IA, IDE assistants e ferramentas automáticas de desenvolvimento que interagem com o repositório **DuoLoot**.

O objetivo principal é garantir que qualquer agente tenha o contexto necessário sobre a estabilidade de testes, as políticas de segurança ativas no projeto e saiba como proceder ao refazer ou implementar novas alterações sem introduzir regressões.

---

## 1. Documentos Obrigatórios de Leitura

Antes de realizar qualquer modificação no código-fonte, nos testes ou no banco de dados, o agente **DEVE** ler os seguintes arquivos de governança:

1. [AGENTS.md](file:///d:/meusProjeto/duoloot/AGENTS.md) — Regras de ouro de segurança do projeto (RLS, RPCs, Edge Functions, Front-end e proibições absolutas).
2. [docs/security/critical-changes.md](file:///d:/meusProjeto/duoloot/docs/security/critical-changes.md) — Registro de alterações críticas de segurança e estabilização de infraestrutura de testes E2E do Playwright.
3. [docs/security/SECURITY_AUDIT_HISTORY.md](file:///d:/meusProjeto/duoloot/docs/security/SECURITY_AUDIT_HISTORY.md) — Histórico detalhado de auditorias de segurança e pendências.
4. [implementation-history.md](file:///d:/meusProjeto/duoloot/implementation-history.md) — Histórico geral de implementação e estabilizações.

---

## 2. Fluxo de Trabalho e Diretrizes de Segurança

### A. Consciência de Alterações Críticas de Infraestrutura
Sempre consulte o arquivo [critical-changes.md](file:///d:/meusProjeto/duoloot/docs/security/critical-changes.md) para estar ciente de quais modificações de configuração de testes E2E (Playwright) foram aplicadas para estabilizar o ambiente (por exemplo, limitação de concorrência a 1 worker, skips de testes de cadastro que excedem rate limits, e cleanups de contextos com `try/finally`). Isso evita que você desfaça correções de estabilidade por engano.

### B. Refazendo ou Ajustando Alterações Sensíveis
Se você precisar ajustar ou refazer qualquer código de segurança, de banco de dados ou de integração, você **deve seguir rigorosamente** as diretrizes estabelecidas no [AGENTS.md](file:///d:/meusProjeto/duoloot/AGENTS.md). 

Toda alteração deve ser fundamentada nas seguintes diretrizes:
*   Não depender do frontend para segurança;
*   Usar allowlist estrita em inserts/updates;
*   Nunca usar `select('*')` em tabelas com dados privados;
*   Validar proprietários de recursos e sessões server-side através de `auth.uid()`.

### C. Validação Obrigatória
Antes de marcar qualquer tarefa como concluída, o agente deve rodar localmente e confirmar o sucesso de:
```bash
npm run lint
npm run build
npm run test:e2e:lobby -- --repeat-each=3  # Caso altere fluxos de lobby ou matchmaking
```

---

## 3. Regra Final para Agentes
Todo agente deve deixar o repositório mais seguro e estável do que encontrou. Na dúvida sobre qualquer alteração que afete o fluxo de testes ou regras de banco de dados, interrompa a execução, documente as premissas e consulte o desenvolvedor responsável.
