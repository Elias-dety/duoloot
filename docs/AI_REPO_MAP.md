# Mapa para IA e Agentes — Duo Loot

Este arquivo existe para ajudar ChatGPT, Codex, IDE agents e automações a navegar no repositório mesmo quando a busca/indexação de código do conector estiver indisponível ou incompleta.

## Diagnóstico de conexão

Em 2026-05-29, a conexão com GitHub foi validada com sucesso para:

- leitura direta de arquivos conhecidos;
- escrita Git não invasiva;
- permissões de `pull`, `push`, `maintain`, `triage` e `admin`.

A limitação encontrada foi na busca textual/indexação de código: consultas por termos existentes como `Duo Loot` e `duoloot` retornaram vazias pelo conector, apesar de os arquivos poderem ser lidos diretamente por caminho.

## Como agentes devem navegar

Quando a busca não funcionar, não conclua que o arquivo não existe.

Use leitura direta por caminhos conhecidos e siga esta ordem:

1. `AGENTS.md`
2. `docs/PROJECT_RULES.md`
3. `docs/TECHNICAL_GUIDE.md`
4. `docs/security/SECURITY_POLICY.md`
5. `docs/REMOTE_TODO.md`
6. Trilhas em `docs/trails/`, quando a tarefa envolver uma área específica.

## Arquivos principais conhecidos

| Caminho | Finalidade |
|---|---|
| `README.md` | Visão geral do projeto. |
| `AGENTS.md` | Entrada obrigatória para agentes. |
| `docs/PROJECT_RULES.md` | Regras de produto e limites de decisão. |
| `docs/TECHNICAL_GUIDE.md` | Stack, estrutura esperada, comandos e padrões técnicos. |
| `docs/security/SECURITY_POLICY.md` | Regras obrigatórias de segurança. |
| `docs/security/SECURITY_HISTORY.md` | Histórico de alterações motivadas por segurança. |
| `docs/REMOTE_TODO.md` | Pendências que exigem validação local ou externa. |
| `docs/trails/TRAIL_PREMIUM.md` | Trilha de Premium. |
| `docs/trails/TRAIL_VAULT.md` | Trilha de Vault/Cofre. |
| `docs/trails/TRAIL_RIOT.md` | Trilha de Riot/VALORANT. |
| `docs/trails/TRAIL_MATCHMAKING.md` | Trilha de matchmaking e lobbies. |

## Estrutura esperada do projeto

A estrutura técnica esperada está descrita em `docs/TECHNICAL_GUIDE.md`:

```txt
src/
  components/
  features/
  pages/
  layouts/
  routes/
  styles/
  constants/
  schemas/
  data/mocks/
  services/
  hooks/
```

## Regras para trabalhar com limitação de busca

- Prefira `fetch_file` ou leitura direta quando souber o caminho.
- Use os documentos principais como índice humano antes de procurar arquivos específicos.
- Se a busca do conector retornar vazia, registre isso como limitação da ferramenta, não como ausência de código.
- Antes de alterar arquivos sensíveis, leia `docs/security/SECURITY_POLICY.md`.
- Quando não puder rodar lint, testes ou build, registre a pendência em `docs/REMOTE_TODO.md`.

## Comandos locais úteis para reconstruir o mapa

Execute na raiz do projeto quando estiver em ambiente local:

```bash
find . -maxdepth 3 -type f | sort
find src -maxdepth 4 -type f | sort
find docs -maxdepth 4 -type f | sort
```

## Critério de uso

Este arquivo não substitui as regras do projeto. Ele é apenas uma bússola para contornar falhas de busca/indexação e reduzir trabalho no escuro.
