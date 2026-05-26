# 🎮 Duo Loot — Plataforma Gamer Competitiva

O **Duo Loot** é uma plataforma para jogadores de eSports que conecta duos, organiza lobbies competitivos, oferece coaching de alto nível e um sistema de recompensas gamificado (Vault) com missões gratuitas e prêmios reais.

## 🎨 Identidade Visual: Codefire UI

O projeto usa a identidade visual **Duo Loot Codefire UI** — dark mode premium inspirado em Riot Mobile + VS Code Dark Theme.

| Token | Cor |
| :--- | :--- |
| Fundo principal | `#0f0f12` |
| Fundo secundário | `#111116` |
| Painel/card | `#18181c` |
| Painel elevado | `#202026` |
| Borda | `#29292f` |
| Vermelho CTA | `#ff4655` |
| Ciano stats | `#0df0ff` |
| Verde sucesso | `#3bd982` |
| Roxo premium | `#b084ff` |
| Amarelo recompensa | `#ffd166` |
| Erro/derrota | `#ff5c7a` |

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Estilização:** Tailwind CSS + CSS Variables (Design Tokens)
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Ícones:** Lucide React
- **Validação:** Zod
- **Formulários:** React Hook Form
- **Roteamento:** React Router 7 (com lazy loading)
- **Testes:** Vitest + Playwright

## 🚦 Rotas do Sistema

| Rota | Descrição | Acesso |
| :--- | :--- | :--- |
| `/` | Home (Hero, Lobbies, Torneios, Coaches) | Público |
| `/lobby` | Busca de lobbies | Público |
| `/cofre` | Vault — Missões e recompensas | Público |
| `/coaches` | Marketplace de coaches | Público |
| `/perfil/:playerId` | Perfil público do jogador | Público |
| `/riot/:gameName/:tagLine` | Perfil Riot/VALORANT | Público |
| `/login` | Login | Público |
| `/cadastro` | Cadastro | Público |
| `/dashboard` | Painel do jogador logado | Privado |
| `/premium` | Planos Premium | Privado |
| `/riot/connect` | Conexão de conta Riot | Privado |
| `/riot/callback` | Callback Riot | Privado |
| `/onboarding` | Configuração de perfil gamer | Privado |
| `/admin/cofre` | Admin do Vault | Privado |

## 🏗️ Estrutura de Pastas

```
src/
├── components/        # Componentes globais reutilizáveis
│   ├── atoms/         # Botões, inputs, badges
│   ├── molecules/     # Stat cards, timers
│   └── organisms/     # Grids e blocos compostos
├── features/          # Lógica por domínio (auth, premium, vault, lobby etc.)
├── pages/             # Páginas do app
│   └── HomePage/      # Seções da Home (Hero, Lobby, Torneios, Coaches)
├── layouts/           # Wrappers de rota (PublicLayout, DashboardLayout)
├── routes/            # Rotas públicas e privadas (lazy loading)
├── styles/            # tokens.css, globals.css, red-vault.css
├── constants/         # Rotas, assets e constantes globais
├── schemas/           # Schemas Zod
├── data/mocks/        # Dados mockados para dev/protótipo
├── services/          # Serviços (auth, lobbies, vault, Riot etc.)
└── hooks/             # Hooks customizados
```

## 🏃 Como Rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173/

## ✅ Verificação

```bash
npm run lint          # ESLint
npm run build         # TypeScript + Vite build
npm run test -- --run # Vitest
npm run test:e2e      # Playwright
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

> ⚠️ Nunca coloque `RIOT_API_KEY` no front-end. Use apenas Supabase Edge Functions.

## 🧹 Limpeza e auditoria funcional

Antes de testar página por página, mantenha estas regras:

- Botão sem implementação real deve ficar escondido, desativado com mensagem clara ou marcado como “em breve”.
- Dados mockados não devem aparecer em produção como se fossem reais.
- Fluxos obrigatórios, como onboarding, não devem oferecer saídas que voltam para o mesmo bloqueio.
- Rotas administrativas precisam de proteção por role/permissão, não apenas login.

---

Desenvolvido pela equipe Duo Loot.
