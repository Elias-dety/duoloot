# Trilha — Modelo

Use este arquivo como base para criar novas trilhas de trabalho no Duo Loot.

Trilhas servem para orientar agentes em tarefas de um domínio específico sem misturar tudo nos documentos globais.

## Quando usar uma trilha

Use uma trilha quando a tarefa envolver uma área clara do projeto, como:

- Premium;
- Vault/Cofre;
- Riot/VALORANT;
- Matchmaking;
- Lobbies;
- Mensagens;
- Convites;
- Admin;
- Perfil gamer.

## Arquivos que ainda devem ser lidos

Mesmo usando uma trilha, o agente deve ler:

1. `AGENTS.md`
2. `docs/PROJECT_RULES.md`
3. `docs/TECHNICAL_GUIDE.md`
4. `docs/security/SECURITY_POLICY.md`
5. `docs/REMOTE_TODO.md`
6. esta trilha específica

## Modelo de trilha

```md
# Trilha — Nome da Área

## Objetivo

Explique o objetivo desta área.

## Escopo

Liste o que faz parte desta trilha.

## Fora de escopo

Liste o que não deve ser alterado sem autorização ou sem outra trilha.

## Regras de produto

Explique regras de experiência, comportamento e intenção.

## Regras técnicas

Explique padrões técnicos específicos.

## Regras de segurança

Explique riscos e validações obrigatórias.

## Arquivos prováveis

Liste pastas e arquivos normalmente relacionados.

## Fluxos principais

Liste fluxos que precisam continuar funcionando.

## Testes esperados

Liste testes automáticos ou manuais.

## Pendências conhecidas

Liste pontos ainda não resolvidos.

## Critério de pronto

Explique como saber que a tarefa ficou realmente pronta.
```

## Regra final

Trilha não substitui segurança.

Se a trilha entrar em conflito com `docs/security/SECURITY_POLICY.md`, vence a política de segurança.