# Pull Request

## Resumo

Descreva objetivamente o que foi alterado.

## Tipo de mudança

- [ ] Correção de bug
- [ ] Nova feature
- [ ] Refatoração
- [ ] Segurança
- [ ] Documentação
- [ ] Infra/CI/CD
- [ ] Banco/Supabase

## Impacto de segurança

Marque tudo que se aplica:

- [ ] Não altera superfície de segurança
- [ ] Altera autenticação
- [ ] Altera autorização/permissões
- [ ] Altera Supabase/RLS/RPC
- [ ] Altera Edge Function/API
- [ ] Altera dados de perfil/PII
- [ ] Altera Premium/pontos/ranking/recompensas
- [ ] Altera variáveis de ambiente/secrets
- [ ] Altera dependências

## Checklist obrigatório

- [ ] Li e segui o `AGENTS.md`
- [ ] Não adicionei secrets, tokens ou `.env`
- [ ] Não adicionei `select('*')` em área sensível
- [ ] Inserts/updates usam allowlist de campos
- [ ] Permissões críticas não dependem apenas do frontend
- [ ] RPCs/Edge Functions validam usuário via sessão quando necessário
- [ ] Erros internos não são enviados diretamente ao cliente
- [ ] CORS não foi aberto sem justificativa
- [ ] Se alterei banco, adicionei migration versionada
- [ ] Se alterei admin/premium/pontos/ranking, validei autorização server-side

## Testes executados

Cole os comandos rodados e resultado:

```bash
npm run lint
npm run test -- --run
npm run build
```

## Pendências conhecidas

Liste qualquer coisa que ainda precisa ser revisada.

## Observações

Contexto extra para revisão.
