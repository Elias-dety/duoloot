# Documentação do Projeto Duo Loot

Bem-vindo à documentação oficial do projeto **Duo Loot**. Este documento fornece uma visão geral técnica e arquitetural do projeto, detalhando a stack tecnológica, a estrutura de pastas e o progresso atual do desenvolvimento.

---

## 🚀 Visão Geral
O Duo Loot é uma plataforma voltada para jogadores, focada em recompensas, lobbies competitivos, serviços de coaching e uma experiência premium para entusiastas de eSports. O projeto utiliza uma arquitetura modular e escalável baseada em **Atomic Design**.

---

## 🛠️ Stack Tecnológica
*   **Core:** React 19 + TypeScript
*   **Build Tool:** Vite
*   **Estilização:** Tailwind CSS + CSS Variables (Design Tokens)
*   **Animações:** Framer Motion
*   **Ícones:** Lucide React
*   **Roteamento:** React Router Dom v7
*   **Formulários:** React Hook Form + Zod
*   **Gráficos:** Recharts

---

## 🏗️ Arquitetura e Estrutura de Pastas
O projeto segue uma abordagem híbrida de **Atomic Design** com **Feature-based logic**.

### Diretórios Principais
*   `src/components/`: Componentes globais e reutilizáveis divididos por nível atômico.
    *   `atoms/`: Componentes básicos (Button, Input, Badge, Typography).
    *   `molecules/`: Combinação de átomos (PlayerStat, CountdownTimer, RewardCard).
    *   `organisms/`: Blocos complexos (NavBar, SideBar, PremiumHero).
*   `src/features/`: Lógica e componentes específicos de cada domínio de negócio.
    *   `premium/`, `dashboard/`, `coaches/`, `profile/`, `lobby/`, `vault/`.
*   `src/pages/`: Componentes de página que montam os templates com dados.
*   `src/templates/`: Estruturas de layout de página (ex: `PremiumTemplate`).
*   `src/layouts/`: Wrappers de rota (ex: `DashboardLayout`, `PublicLayout`).
*   `src/styles/`: Configurações globais de estilo e tokens.
*   `src/routes/`: Configuração centralizada de rotas públicas e privadas.

---

## 🎨 Design System & Tokens
O sistema de design é controlado via variáveis CSS centralizadas em `src/styles/tokens.css`, integradas ao `tailwind.config.ts`.

### Cores Principais
*   **Brand Primary:** Violeta vibrante (Ações principais).
*   **Surface Dark:** Fundo escuro profundo.
*   **Content Primary:** Texto principal (Off-white).
*   **Success/Error/Warning:** Cores semânticas para estados.

---

## 📑 Funcionalidades Implementadas (Sprint 1)

### 1. Dashboard
Interface central para o usuário logado, exibindo:
*   Resumo de estatísticas do jogador.
*   Progresso de recompensas atuais.
*   Atalhos para lobbies e cofres.

### 2. Lobby & Partidas
Sistema de visualização de salas disponíveis:
*   Listagem de lobbies com filtros.
*   Cards de lobby com informações de rank, jogo e prêmios.

### 3. Sistema Premium
Página dedicada à conversão de usuários:
*   Hero section com apelo visual premium.
*   Tabela de comparação entre planos (Free vs Pro).
*   Seção de benefícios exclusivos.

### 4. Coaches & Aprendizado
Marketplace de treinadores:
*   Listagem de profissionais por jogo e rank.
*   Perfis de coaches com estatísticas e especialidades.

### 5. Player Profile
Página de identidade do jogador:
*   Exibição de conquistas e reputação.
*   Histórico de partidas e estatísticas detalhadas.

### 6. Vault (Cofre)
Área de recompensas e loot boxes:
*   Visualização de itens coletados.
*   Sistema de abertura de caixas (mock).

---

## 🚦 Rotas do Sistema

| Rota | Descrição | Acesso |
| :--- | :--- | :--- |
| `/` | Landing Page | Público |
| `/dashboard` | Painel Geral | Privado |
| `/lobby` | Busca de Partidas | Público |
| `/coaches` | Lista de Treinadores | Público |
| `/premium` | Planos e Assinaturas | Privado |
| `/profile` | Perfil do Jogador | Público |
| `/vault` | Recompensas e Loot | Público |

---

## 📝 Próximos Passos (Roadmap)
1.  **Integração com Supabase:** Implementação de autenticação e banco de dados real.
2.  **Sistema de Chat:** Mensageria em tempo real para lobbies.
3.  **Checkout Premium:** Integração com gateway de pagamentos.
4.  **Notificações em Real-time:** Alertas de convites e conquistas.

---

*Documentação atualizada em: 12 de Maio de 2026*
