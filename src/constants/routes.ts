export const ROUTES = {
  HOME: '/',
  VAULT: '/cofre',
  LOBBY: '/lobby',
  DASHBOARD: '/dashboard',
  PREMIUM: '/premium',
  COACHES: '/coaches',
  PLAYER_PROFILE: '/perfil/:playerId',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
