# AGENTS.md — Entrada obrigatória para agentes

Este é o primeiro arquivo que qualquer agente, assistente, automação, IDE agent ou pessoa deve ler antes de alterar o Duo Loot.

O objetivo deste arquivo é indicar quais documentos governam o projeto e impedir que agentes trabalhem sem contexto.

## Ordem obrigatória de leitura

Antes de qualquer alteração, leia nesta ordem:

1. `docs/PROJECT_RULES.md`
2. `docs/TECHNICAL_GUIDE.md`
3. `docs/security/SECURITY_POLICY.md`
4. `docs/REMOTE_TODO.md`
5. Uma trilha em `docs/trails/`, quando a tarefa pedir foco em uma área específica.

## Arquivos sempre ativos

Estes documentos devem ser considerados sempre ativos:

- `AGENTS.md`
- `docs/PROJECT_RULES.md`
- `docs/TECHNICAL_GUIDE.md`
- `docs/security/SECURITY_POLICY.md`
- `docs/REMOTE_TODO.md`

## Arquivos de trilha

Arquivos em `docs/trails/` são usados quando a tarefa tiver um tema específico.

Exemplos:

- Premium: `docs/trails/TRAIL_PREMIUM.md`
- Vault/Cofre: `docs/trails/TRAIL_VAULT.md`
- Riot/VALORANT: `docs/trails/TRAIL_RIOT.md`
- Matchmaking/Lobbies: `docs/trails/TRAIL_MATCHMAKING.md`

## Regra de ouro

Não altere o projeto sem entender:

1. qual problema está sendo resolvido;
2. quais arquivos serão afetados;
3. se a mudança toca autenticação, autorização, banco, Edge Functions, Premium, pontos, ranking, Vault, Riot, mensagens, convites ou dados de usuário;
4. quais testes precisam ser rodados;
5. quais pendências devem ir para `docs/REMOTE_TODO.md`.

## Segurança

Quando a tarefa envolver segurança, a autoridade principal é:

`docs/security/SECURITY_POLICY.md`

Se uma alteração for feita por motivo de segurança, registre no histórico:

`docs/security/SECURITY_HISTORY.md`

## Pendências remotas

Se algo não puder ser testado pelo agente no ambiente atual, registre em:

`docs/REMOTE_TODO.md`

Inclua sempre comando, ação esperada e motivo.

## Proibição

Nunca finja que testou algo que não foi testado.

Se não rodou, registre como pendente.