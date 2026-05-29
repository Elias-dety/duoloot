# Pendências Remotas — Duo Loot

Este arquivo registra tudo que ainda precisa ser feito manualmente, testado localmente ou validado fora do ambiente do agente.

Ele existe porque parte do trabalho pode ser feita remotamente, mas alguns testes só podem ser feitos depois no computador local ou no painel de serviços externos.

## Regras

1. Sempre registre pendências quando algo não puder ser validado no ambiente atual.
2. Cada pendência deve ter ação clara.
3. Cada pendência deve dizer por que existe.
4. Quando concluir, marque como feito e mantenha o histórico visível.
5. Não apague pendências importantes sem resolver ou justificar.

## Modelo de pendência

```md
### Título da pendência

Status: pendente
Prioridade: alta | média | baixa
Área: frontend | backend | Supabase | segurança | testes | deploy | produto
Criado em: AAAA-MM-DD

#### Motivo

Explique por que esta pendência existe.

#### Ação necessária

Explique o que deve ser feito.

#### Comandos, se houver

```bash
comando aqui
```

#### Critério de conclusão

Explique como saber que terminou.
```

## Pendências atuais

### Puxar alterações no computador local

Status: pendente
Prioridade: alta
Área: testes
Criado em: 2026-05-29

#### Motivo

Foram feitas alterações remotas no repositório e elas precisam ser sincronizadas no computador local.

#### Ação necessária

Rodar os comandos abaixo a partir da raiz do projeto.

```bash
git checkout main
git pull origin main
git status
npm ci
npm run lint
npm run test -- --run
npm run build
```

#### Critério de conclusão

- `git status` sem alterações inesperadas.
- lint sem erro.
- testes unitários passando.
- build passando.

---

### Verificar se ainda existem arquivos Markdown antigos

Status: pendente
Prioridade: média
Área: documentação
Criado em: 2026-05-29

#### Motivo

Alguns arquivos Markdown antigos não puderam ser removidos pelo agente por bloqueio da ferramenta ou limitação de listagem completa.

#### Ação necessária

Rodar no computador local:

```bash
find . -type f -iname "*.md"
```

Se aparecer arquivo antigo que não faz parte da nova estrutura, remover manualmente.

#### Critério de conclusão

A lista deve conter apenas os arquivos Markdown da nova estrutura planejada.

---

### Validar ambiente Supabase

Status: pendente
Prioridade: alta
Área: Supabase
Criado em: 2026-05-29

#### Motivo

Regras de segurança dependem de validação real em Supabase, RLS, RPCs e Edge Functions.

#### Ação necessária

Verificar no Supabase:

- migrations aplicadas;
- RLS ativo nas tabelas sensíveis;
- roles reais configuradas;
- RPCs críticas validando `auth.uid()`;
- Edge Functions com secrets corretos.

#### Critério de conclusão

Usuário comum não consegue executar ação admin, alterar dono, manipular pontos ou acessar dados privados de outro usuário.