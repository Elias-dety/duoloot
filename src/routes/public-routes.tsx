/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import EventLayout from '@/layouts/EventLayout';
import { ROUTES } from '@/constants/routes';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LobbyPage = lazy(() => import('@/pages/LobbyPage'));
const CoachesPage = lazy(() => import('@/pages/CoachesPage'));
const PlayerProfilePage = lazy(() => import('@/pages/PlayerProfilePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const VaultPage = lazy(() => import('@/pages/VaultPage'));

import { DuolootLoadingState } from '@/components/duoloot';

function LazyFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <DuolootLoadingState message="Inicializando módulo..." />
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <Lazy><HomePage /></Lazy> },
      { path: ROUTES.LOBBY, element: <Lazy><LobbyPage /></Lazy> },
      { path: ROUTES.COACHES, element: <Lazy><CoachesPage /></Lazy> },
      { path: ROUTES.PLAYER_PROFILE, element: <Lazy><PlayerProfilePage /></Lazy> },
      { path: ROUTES.LOGIN, element: <Lazy><LoginPage /></Lazy> },
      { path: ROUTES.REGISTER, element: <Lazy><RegisterPage /></Lazy> },
    ],
  },
  {
    element: <EventLayout />,
    children: [
      { path: ROUTES.VAULT, element: <Lazy><VaultPage /></Lazy> },
    ],
  }
];
