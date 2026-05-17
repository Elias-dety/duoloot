import type { RouteObject } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import EventLayout from '@/layouts/EventLayout';
import HomePage from '@/pages/HomePage';
import VaultPage from '@/pages/VaultPage';
import LobbyPage from '@/pages/LobbyPage';
import CoachesPage from '@/pages/CoachesPage';
import PlayerProfilePage from '@/pages/PlayerProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { ROUTES } from '@/constants/routes';

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOBBY, element: <LobbyPage /> },
      { path: ROUTES.COACHES, element: <CoachesPage /> },
      { path: ROUTES.PLAYER_PROFILE, element: <PlayerProfilePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    element: <EventLayout />,
    children: [
      { path: ROUTES.VAULT, element: <VaultPage /> },
    ],
  }
];
