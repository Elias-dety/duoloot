# Bloco 15 — Polimento visual e responsivo geral

## Páginas revisadas
- `/`
- `/login`
- `/cadastro`
- `/onboarding`
- `/lobby`
- `/cofre`
- `/dashboard`
- `/premium`
- `/coaches`
- `/perfil/:playerId`

## Principais correções feitas
- Header público ganhou navegação mobile funcional, com ações de autenticação acessíveis em telas pequenas.
- Layouts `PublicLayout`, `EventLayout` e `DashboardLayout` foram ajustados para reduzir aperto no mobile e manter consistência de wrapper, espaçamento e hierarquia.
- `index.html` passou a usar `lang="pt-BR"` e título `Duo Loot`.
- Tema tático global foi consolidado em `tactical-theme.css`, incluindo utilitários faltantes usados pelos templates (`dl-title`, `dl-muted`, variantes de `dl-btn`, `dl-stamp`, `dl-chip`, `dl-search-*` e estados visuais).
- Home recebeu CTA mais claro para `Entrar no Lobby` e `Abrir Cofre`, com hero menos confuso no mobile.
- Lobby recebeu ajustes de empty/error state, filtros mais estáveis no mobile e cards sem dependência de hover para leitura.
- Cofre recebeu copy corrigida, melhor respiro vertical no mobile e notificação inline preservada.
- Auth e onboarding tiveram copy revisada, mensagens de erro mais curtas e formulários mais legíveis em telas pequenas.
- Dashboard social foi polido com cards e chat drawer mais seguros no mobile.
- Perfil público teve CTAs mais claros e consistentes com o estado atual do produto.

## Ajustes mobile
- Navegação mobile real no header público.
- Header do dashboard dividido em brand, ações rápidas e grade de navegação.
- Header do cofre reduzido e com quebra melhor em telas pequenas.
- Formulários de auth/onboarding com campos e CTAs mais previsíveis.
- Drawer de chat com quebra de linha para mensagens longas.
- Botões principais passaram a ocupar largura total quando necessário.

## Ajustes desktop
- Wrappers principais padronizados com `max-w-[1240px]`, `px-3 md:px-6`, `pb-12` e `space-y-6` onde fazia sentido.
- Footer público ficou menos pesado visualmente.
- Home e Premium ganharam hierarquia de CTA mais clara.
- Dashboard e Cofre ficaram mais legíveis com espaçamento entre blocos e títulos HUD consistentes.

## Estados loading, empty e error revisados
- `PageState` foi normalizado com mensagens mais curtas e consistentes.
- Lobby, Cofre, Premium, Dashboard e painéis sociais exibem mensagens mais alinhadas ao padrão:
  - `Configuração do Supabase ausente.`
  - `Nenhum registro encontrado.`
  - `Falha ao sincronizar o módulo.`
  - `Entre para continuar.`

## Textos corrigidos
- Correção de textos com encoding quebrado em layouts, auth, onboarding, dashboard, premium, profile e chat.
- Revisão de acentuação em termos táticos do produto:
  - operação
  - missão
  - prêmio
  - benefícios
  - configuração
  - possível
  - histórico

## Pendências restantes
- Warning não bloqueante do Vite sobre chunk grande no bundle principal.
- Não foi aplicado lazy loading neste bloco para evitar risco de regressão no roteamento.

## Resultado de lint/build
- `npm run lint`: passou
- `npm run build`: passou
- `npm run test -- --run`: passou
