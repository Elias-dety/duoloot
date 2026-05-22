# Documentação Técnica — Duo Loot

Documentação oficial do projeto **Duo Loot**. Visão geral técnica, arquitetura, design system e estado atual de implementação.

---

## 🚀 Visão Geral

O Duo Loot é uma plataforma para jogadores de eSports focada em:
- **Lobbies competitivos** — encontrar duos e fechar times.
- **Vault (Cofre)** — missões gratuitas com prêmios reais.
- **Coaches** — marketplace de treinadores high elo.
- **Sistema Premium** — benefícios exclusivos para assinantes.
- **Estatísticas** — dados reais da Riot Games API (em implementação).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Estilização | Tailwind CSS + CSS Variables (Design Tokens) |
| Backend | Supabase (Auth, Database, Edge Functions) |
| Ícones | Lucide React |
| Validação | Zod |
| Roteamento | React Router 7 (lazy loading) |
| CMS | React Bricks |
| Testes | Vitest + Playwright |

---

## 🎨 Design System: Codefire UI

O sistema visual se chama **Duo Loot Codefire UI** e é inspirado em Riot Mobile + VS Code Dark Theme.

### Paleta de Cores

| Token CSS | Hex | Uso |
| :--- | :--- | :--- |
| `--dl-black` | `#0f0f12` | Fundo principal |
| `--dl-bg` | `#111116` | Fundo secundário |
| `--dl-surface` | `#18181c` | Cards/painéis |
| `--dl-surface-2` | `#202026` | Painéis elevados |
| `--dl-border` | `#29292f` | Bordas |
| `--dl-text` | `#ffffff` | Texto principal |
| `--dl-muted-light` | `#a6a6ad` | Texto secundário |
| `--dl-muted` | `#74747d` | Texto terciário |
| `--dl-keyword` | `#ff4655` | Vermelho CTA / ação principal |
| `--dl-number` | `#0df0ff` | Ciano / estatísticas |
| `--dl-string` | `#3bd982` | Verde / sucesso |
| `--dl-function` | `#b084ff` | Roxo / premium |
| `--dl-warning` | `#ffd166` | Amarelo / recompensas |
| `--dl-error` | `#ff5c7a` | Vermelho erro |

### Arquivos de Estilo

- `src/styles/tokens.css` — Tokens CSS globais e aliases de compatibilidade.
- `src/styles/globals.css` — Estilos base, fundo, tipografia.
- `src/styles/red-vault.css` — Classes utilitárias `.dl-*` do design system.
- `tailwind.config.ts` — Extensão das cores/tokens para classes Tailwind.

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes globais reutilizáveis
│   ├── atoms/           # Botões, inputs, badges
│   ├── molecules/       # Stat cards, timers
│   ├── organisms/       # Hero sections, grids
│   └── duoloot/         # Componentes Codefire UI (DuolootButton, DuolootCard, etc.)
├── features/            # Lógica por domínio
│   ├── auth/            # AuthProvider, ProtectedRoute, useAuth
│   ├── premium/         # Componentes premium
│   ├── dashboard/       # Componentes do dashboard
│   └── ...
├── pages/               # Páginas do app
│   ├── HomePage.tsx
│   ├── HomePage/components/  # Seções da Home (Hero, Lobby, Torneios, Coaches)
│   ├── LobbyPage.tsx
│   ├── VaultPage.tsx
│   └── ...
├── layouts/             # Wrappers de layout
│   ├── PublicLayout.tsx
│   ├── DashboardLayout.tsx
│   └── EventLayout.tsx
├── routes/              # Configuração de rotas (lazy loading)
├── styles/              # tokens.css, globals.css, red-vault.css
├── constants/           # Rotas e constantes
├── schemas/             # Schemas Zod para validação
├── data/mocks/          # Dados mockados para desenvolvimento
├── services/            # Serviços (auth, lobbies, vault admin)
└── hooks/               # Hooks customizados (usePlayerPresence, etc.)
```

### Padrão de Rotas

Todas as páginas usam **lazy loading** para code-splitting automático:
- Rotas públicas: `src/routes/public-routes.tsx`
- Rotas privadas: `src/routes/private-routes.tsx`

---

## 🚦 Rotas do Sistema

| Rota | Descrição | Acesso | Layout |
| :--- | :--- | :--- | :--- |
| `/` | Home — Hero, Lobbies, Torneios, Coaches | Público | PublicLayout |
| `/lobby` | Busca de lobbies | Público | PublicLayout |
| `/cofre` | Vault — Missões e recompensas | Público | EventLayout |
| `/coaches` | Marketplace de coaches | Público | PublicLayout |
| `/perfil/:playerId` | Perfil público do jogador | Público | PublicLayout |
| `/login` | Login | Público | PublicLayout |
| `/cadastro` | Cadastro | Público | PublicLayout |
| `/dashboard` | Painel do jogador logado | Privado | DashboardLayout |
| `/premium` | Planos Premium | Privado | DashboardLayout |
| `/onboarding` | Configuração de perfil gamer | Privado | ProtectedRoute |
| `/admin/cofre` | Admin do Vault | Privado | DashboardLayout |

---

## 📑 Funcionalidades Implementadas

### Home
- Hero com busca e texto syntax highlight.
- Preview de lobbies (3 cards mockados).
- Seção de torneios grátis com missões e placeholder de imagem.
- Seção de coaches high elo com cards detalhados.

### Lobby
- Listagem de lobbies com filtros.
- Cards de lobby com informações de rank, tamanho e vagas.
- Criação de lobby (mockado).

### Vault (Cofre)
- Missões ativas com progresso.
- Ranking de jogadores.
- Sistema de temporadas.
- Abertura de loot boxes (mockado).

### Dashboard
- Resumo de estatísticas do jogador.
- Progresso de recompensas.
- Atalhos para lobbies e cofre.

### Premium
- Landing page com comparativo de planos.
- Benefícios exclusivos.

### Coaches
- Marketplace com cards de treinadores.
- Filtros por jogo e rank.

### Autenticação
- Login/Cadastro com Supabase Auth.
- ProtectedRoute com redirecionamento.
- Onboarding de perfil gamer.
- Hooks: `useAuth`, `usePlayerPresence`.

---

## 🔮 Próximos Passos

### Prioridade 1: Integração Riot Games API
- Criar Edge Functions no Supabase para chamadas à Riot API.
- Buscar PUUID, matchlist e detalhes de partida.
- Salvar estatísticas no banco.

### Prioridade 2: Componentes de Estatísticas
- MatchHistoryList, AgentStatsGrid, MapStatsGrid.
- RankedProgressPanel, PerformanceCharts.

### Prioridade 3: Integração com Lobby e Cofre
- Usar estatísticas reais para matchmaking.
- Validar missões com dados reais da Riot.

### Prioridade 4: Polish e Deploy
- Responsividade final.
- Empty states, loading e erros.
- Deploy para produção.

---

*Documentação atualizada em: 22 de Maio de 2026*
