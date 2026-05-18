# Bloco 13 — Limpeza técnica do ESLint global

## Objetivo

Este bloco removeu dívida técnica acumulada do front-end sem criar feature nova, sem alterar regras de negócio e sem redesenhar as telas existentes.

## Comandos executados

- `npm run lint`
- `npm run build`

## Categorias corrigidas

- `unused imports`
- `unused vars`
- `explicit any`
- `react-refresh/only-export-components`
- ajustes de tipagem em `game_profile`
- tratamento de erros com `cause` em services
- padronização de helpers de erro em services
- remoção de `alert()` do fluxo principal do Cofre
- inclusão de notificação inline no Cofre
- atualização do nome do pacote para `duoloot`
- ajuste de `watch()` para `useWatch()` no onboarding
- limpeza de exports e tipagens compartilhadas em auth/presence/messages

## Arquivos principais alterados

- `package.json`
- `eslint.config.js`
- `src/pages/VaultPage.tsx`
- `src/templates/VaultTemplate/index.tsx`
- `src/services/vault-progress.service.ts`
- `src/features/auth/AuthContext.ts`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/useAuth.ts`
- `src/features/auth/components/AuthForm.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/OnboardingPage.tsx`
- `src/pages/LobbyPage.tsx`
- `src/layouts/DashboardLayout.tsx`
- `src/features/onboarding/components/OnboardingForm.tsx`
- `src/features/messages/components/ConnectionChatDrawer.tsx`
- `src/hooks/usePlayerPresence.ts`
- `src/services/auth.service.ts`
- `src/services/onboarding.service.ts`
- `src/services/profiles.service.ts`
- `src/services/lobbies.service.ts`
- `src/services/messages.service.ts`
- `src/services/presence.service.ts`
- `src/services/recommendations.service.ts`
- `src/services/vault.service.ts`
- `src/services/invites.service.ts`
- `src/templates/LobbyTemplate/index.tsx`
- `src/components/organisms/DashboardSummary.tsx`
- `src/features/profile/components/ProfileGameInfo.tsx`
- `src/features/profile/components/ProfileHeader.tsx`

## Pendências

Sem pendências bloqueantes.

Compatibilidade de status do Cofre:

- Front e schemas permanecem alinhados com `draft`, `scheduled`, `active`, `ended`, `cancelled`.
- Missões permanecem com `active` e `inactive`.
- Participantes permanecem com `active`, `blocked` e `winner`.
- Não foi encontrado uso legado de `finished` nas migrations atuais do Cofre, então nenhuma adaptação destrutiva foi necessária.

## Resultado final

- Lint: passou
- Build: passou
