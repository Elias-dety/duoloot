import type { RouteObject } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import PremiumPage from '@/pages/PremiumPage';
import AdminVaultPage from '@/pages/AdminVaultPage';
import OnboardingPage from '@/pages/OnboardingPage';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import { ROUTES } from '@/constants/routes';

export const privateRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
      { path: ROUTES.PREMIUM, element: <PremiumPage /> },
      { path: ROUTES.ADMIN_VAULT, element: <AdminVaultPage /> },
    ],
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
];
