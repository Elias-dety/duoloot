# Histórico de Segurança — Duo Loot

Este arquivo registra alterações feitas por motivo de segurança.

Ele deve funcionar como um histórico append-only: não apague entradas antigas sem justificativa forte. Prefira adicionar novas entradas.

## Quando registrar

Registre aqui quando a alteração envolver:

- autenticação;
- autorização;
- permissões;
- Supabase;
- RLS;
- RPC;
- Edge Function;
- Riot/VALORANT;
- Premium;
- pontos;
- ranking;
- Vault/Cofre;
- missões;
- recompensas;
- dados de usuário;
- secrets;
- variáveis de ambiente;
- correção de vulnerabilidade;
- remoção de código inseguro;
- hardening.

## Modelo de entrada

```md
## AAAA-MM-DD — Título da alteração

### Tipo

- [ ] Correção preventiva
- [ ] Correção de vulnerabilidade
- [ ] Hardening
- [ ] Remoção de código inseguro
- [ ] Alteração de permissão
- [ ] Alteração de RLS/RPC
- [ ] Alteração de Edge Function
- [ ] Alteração de dependência
- [ ] Documentação de segurança

### Risco encontrado

Descreva o problema ou risco.

### Ação tomada

Descreva o que foi feito.

### Arquivos afetados

- `caminho/do/arquivo`

### Por que foi necessário

Explique por que a alteração foi necessária.

### Testes executados

```bash
comando aqui
```

### Testes pendentes

- [ ] Descrever teste pendente

### Como reverter

Explique como reverter caso necessário.

### Observações

Inclua contexto adicional.
```

---

## 2026-05-29 — Reestruturação inicial da documentação de segurança

### Tipo

- [x] Documentação de segurança
- [x] Hardening

### Risco encontrado

A documentação antiga estava espalhada em vários arquivos Markdown com responsabilidades sobrepostas. Isso podia fazer agentes ignorarem regras importantes, perderem histórico de segurança ou trabalharem sem uma ordem clara de leitura.

### Ação tomada

Foi criada uma nova estrutura de documentação com separação entre:

- entrada obrigatória de agentes;
- regras de projeto;
- guia técnico;
- política de segurança;
- histórico de segurança;
- pendências remotas;
- trilhas por domínio.

### Arquivos afetados

- `AGENTS.md`
- `README.md`
- `docs/PROJECT_RULES.md`
- `docs/TECHNICAL_GUIDE.md`
- `docs/REMOTE_TODO.md`
- `docs/security/SECURITY_POLICY.md`
- `docs/security/SECURITY_HISTORY.md`

### Por que foi necessário

A nova estrutura reduz ambiguidade para agentes e cria uma regra clara: qualquer alteração de segurança deve ser registrada neste histórico.

### Testes executados

Nenhum teste de código foi executado. A alteração é documental.

### Testes pendentes

- [ ] Rodar `find . -type f -iname "*.md"` no computador local para verificar se ainda existem arquivos antigos.
- [ ] Revisar se todos os agentes conseguem seguir a nova ordem de leitura.

### Como reverter

Restaurar os arquivos Markdown antigos pelo histórico do Git, se necessário.

### Observações

A partir desta estrutura, novas mudanças de segurança devem ser registradas neste arquivo.