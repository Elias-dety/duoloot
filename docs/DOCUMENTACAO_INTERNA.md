# 📖 Manual de Arquitetura e Documentação Interna — Duo Loot

Este documento serve como o repositório central de conhecimento técnico (Wiki/Index) para a plataforma **Duo Loot**. Ele unifica e explica a arquitetura de front-end, banco de dados, fluxos de integração e organização de diretórios do projeto.

---

## 🎯 1. Visão Geral do Produto

O **Duo Loot** é uma plataforma competitiva gamificada para jogadores de eSports (com foco inicial em VALORANT). Suas principais funcionalidades incluem:
- **Lobby Radar & Matchmaking**: Busca e formação de squads com base em compatibilidade de perfil gamer (`game_profile`).
- **Vault (Cofre)**: Temporadas de missões competitivas com resgate de recompensas (loot boxes, duocoins) e rankings (Leaderboard).
- **Marketplace de Coaches**: Espaço para contratação de treinamentos e análises de jogo.
- **Painel de Operador (Dashboard & Social)**: Conexões (amizades), chat em tempo real, recomendações de duos e envio de convites de jogo.
- **Integração com Riot Games API**: Exibição de estatísticas e histórico de partidas de VALORANT com suporte a modo real (via RSO) e modo demonstração (Demo).

---

## 🏗️ 2. Estrutura de Pastas e Componentização

O frontend é construído com **React 19 + TypeScript + Vite 8**, utilizando Tailwind CSS e CSS Variables para gerenciamento de tokens visuais.

### Estrutura de Pastas (`/src`)
- `assets/`: Imagens (elos, logos, vault) e ícones (library, red-vault) com mapeamento estático e tipagem total para autocomplete.
- `components/`: Design System modularizado:
  - `atoms/`: Componentes básicos sem lógica de estado complexa (botões, inputs, badges).
  - `molecules/`: Componentes compostos (stat cards, temporizadores, itens da lista).
  - `organisms/`: Seções complexas de interface (grids de lobbies, barras de progresso, resumos).
  - `duoloot/`: Componentes específicos do tema visual Codefire.
- `features/`: Lógica de negócio encapsulada por domínios específicos (auth, onboarding, lobby, vault, premium, messages, connections, invites, recommendations, riot).
- `pages/`: Controladores de rota que gerenciam estados principais e renderizam templates.
- `templates/`: Layouts visuais reutilizáveis (e.g. `LobbyTemplate`, `VaultTemplate`, `OnboardingTemplate`).
- `layouts/`: Wrappers estruturais de rota (`PublicLayout`, `DashboardLayout`, `EventLayout`).
- `routes/`: Definições de rotas com lazy loading e guardas de segurança.
- `services/`: Integrações com APIs externas e Supabase.
- `styles/`: Estilização global (`globals.css`, `tokens.css`, `tactical-theme.css`).
- `types/` / `schemas/` / `constants/` / `hooks/`: Suporte a tipagem, validação com Zod, constantes globais e lógica compartilhada.

---

## 🗄️ 3. Arquitetura do Banco de Dados e Migrações (Supabase)

O backend do Duo Loot roda sobre o **Supabase**, utilizando políticas de segurança RLS (Row Level Security) e funções RPC para operações atômicas seguras.

### Principais Tabelas e Relacionamentos
1. **`public.profiles`**: Informações dos jogadores.
   - Contém a coluna `game_profile` (JSONB) que armazena os dados competitivos e preferências do jogador.
   - Sincronizado automaticamente na criação da conta via trigger.
2. **`public.lobbies`**: Lobbies de matchmaking.
   - Relaciona-se com `profiles` via `owner_id` (líder do lobby).
   - Contém coluna `metadata` (JSONB) para busca rápida de perfil de jogo do líder.
3. **`public.vault_events`**: Eventos sazonais do Cofre.
4. **`public.vault_participants`**: Inscrições de jogadores nos eventos do Cofre, armazenando os pontos (`points`).
5. **`public.vault_missions`**: Contratos/missões ativas no evento.
6. **`public.vault_mission_progress`**: Progresso individual de cada missão por usuário.
7. **`public.vault_winners`**: Histórico de vencedores de cada temporada de cofre finalizada.
8. **`public.player_connections`** & **`public.connection_messages`**: Sistema social de amigos e chat integrado.
9. **`public.player_invites`**: Convites para lobbies/jogos.

### Funções RPC Relevantes (Database Functions)
- `join_lobby(p_lobby_id)`: Gerencia entrada em lobbies.
- `leave_lobby(p_lobby_id)`: Remove o jogador e atualiza o status.
- `join_vault_event(p_event_id)`: Registra no evento e instancia o progresso de todas as missões.
- `claim_vault_mission_progress(p_mission_id, p_increment)`: Incrementa progresso e credita pontos com segurança.
- `get_vault_leaderboard(p_event_id, p_limit)`: Gera o ranking ordenado de pontuação.
- `finalize_vault_event(p_event_id, p_winner_limit)`: Conclui o evento e distribui recompensas no histórico (vencedores).

---

## 🛡️ 4. Fluxo de Autenticação e Segurança (Auth & Onboarding)

- **`AuthProvider`**: Componente centralizador de estado da sessão. Expõe dados de usuário, sessão e perfil (`public.profiles`).
- **`ensureUserProfile(user)`**: Método de fallback que impede falhas ou inconsistências de dados ao registrar novos usuários no Supabase.
- **Guarda de Segurança (`ProtectedRoute`)**:
  - Filtra acesso a páginas privadas.
  - Verifica a completude do perfil gamer com `isGameProfileComplete(profile)`.
  - Redireciona usuários com perfil incompleto para o `/onboarding` de forma a garantir a qualidade de dados da plataforma, bloqueando loops de redirecionamento.
- **Onboarding Form**: Stepper tático de 3 passos integrado com Zod e `react-hook-form`, com preview em tempo real do cartão de operador do jogador.

---

## ⚔️ 5. Sistema de Matchmaking e Lobbies

O algoritmo de compatibilidade de duos calcula um score em tempo real de **0% a 100%** baseado em 6 critérios de sinergia:
1. **Jogo Principal** (Peso: +25)
2. **Equilíbrio de Patente/Rank** (Até +20)
3. **Funções Complementares** (Até +20)
4. **Horário de Disponibilidade** (Peso: +15)
5. **Modo de Jogo Preferido** (Peso: +10)
6. **Uso de Microfone** (Peso: +10)

- **Classificação Visual**: Os lobbies no radar são coloridos com bordas neon:
  - 🟢 `>= 85%`: Match Ideal (Glow azul/neon)
  - 🔵 `65% - 84%`: Compatível
  - 🟡 `40% - 64%`: Neutro
  - 🔴 `< 40%`: Risco de Baixa Sinergia

---

## 🔑 6. Integração Riot API & Perfil VALORANT

Toda a comunicação com a API oficial da Riot é realizada no servidor através do **Supabase Edge Functions** para manter a `RIOT_API_KEY` em segredo absoluto, evitando exposição no bundle client-side.
- **Edge Function `valorant-profile-lookup`**: Responsável por receber requisições de consulta de Riot ID, autenticar com a Riot API usando a chave secreta e retornar os dados padronizados.
- **Visualização Dual (Real vs. Demo)**:
  - **Modo Real**: Dados consumidos via API da Riot (depende de opt-in via Riot Sign On - RSO).
  - **Modo Demo**: Exibição de dados mockados realistas para demonstração visual, obrigando a exibição ostensiva do selo **"DEMO"** para manter a transparência da plataforma.

---

## 📁 7. Índice de Documentos de Detalhe

Para navegar pelas especificações completas de cada funcionalidade e bloco do sistema, utilize os links abaixo:

1. 🗃️ **Assets e Design System**:
   - [Guia de Uso e Organização de Assets](file:///d:/meusProjeto/duoloot/docs/assets-organization.md) - Estrutura dos diretórios de imagens, elos e biblioteca de ícones.
2. 🔑 **Autenticação**:
   - [Fluxo de Autenticação e Segurança](file:///d:/meusProjeto/duoloot/docs/auth/auth-flow.md) - Estrutura de rotas, `AuthProvider` e Row Level Security (RLS).
3. 🎮 **Onboarding**:
   - [Fluxo de Onboarding Gamer](file:///d:/meusProjeto/duoloot/docs/onboarding/onboarding-flow.md) - Validação de perfil, esquema JSONB de dados de jogo e stepper de setup.
4. 🏹 **Lobbies & Matchmaking**:
   - [Matchmaking Baseado no Perfil](file:///d:/meusProjeto/duoloot/docs/lobby/lobby-matchmaking-profile.md) - Algoritmo de sinergia, travas de entrada e estrutura de metadados.
   - [Histórico de Testes Funcionais do Lobby](file:///d:/meusProjeto/duoloot/docs/testes/lobby-real-bloco-5.md) - Registro de validações locais e resolução de bugs de ambiguidade Postgres.
5. 🏆 **Cofre (Vault)**:
   - [Fluxo Funcional do Cofre](file:///d:/meusProjeto/duoloot/docs/vault/vault-functional-flow.md) - Tabelas de progresso e sincronização Realtime de missões.
   - [Ranking do Cofre (Leaderboard)](file:///d:/meusProjeto/duoloot/docs/vault/vault-leaderboard-flow.md) - Funcionamento das RPCs de pontuação, desempate e visualização de rank.
   - [Histórico de Vencedores e Temporadas](file:///d:/meusProjeto/duoloot/docs/vault/vault-seasons-winners-flow.md) - Encerramento de cofre, distribuição percentual de prêmios e tela de histórico de temporadas.
6. 🎯 **Integração Valorant**:
   - [Integração Riot Games API](file:///d:/meusProjeto/duoloot/docs/valorant-api-integration.md) - Segurança com Edge Functions e roadmap de sincronização real de estatísticas.
   - [Manual do Valorant V2](file:///d:/meusProjeto/duoloot/Valorant_V2_Manual.md) - Especificação detalhada da arquitetura visual de perfil, abas, badges de conquistas, e regras de exibição do modo demo.
7. 🛡️ **Qualidade e Refatoração**:
   - [Limpeza Global de ESLint (Bloco 13)](file:///d:/meusProjeto/duoloot/docs/quality/eslint-cleanup-bloco-13.md) - Refatorações de dívidas técnicas e regras de build.
   - [Polimento Visual e Responsividade (Bloco 15)](file:///d:/meusProjeto/duoloot/docs/quality/visual-responsive-polish-bloco-15.md) - Ajustes de quebras mobile, consistência de espaçamentos desktop e padronização de estados visuais.

---

Este manual deve ser mantido atualizado a cada alteração estrutural no ecossistema da plataforma.
