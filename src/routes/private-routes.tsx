/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import { ROUTES } from '@/constants/routes';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
const AdminVaultPage = lazy(() => import('@/pages/AdminVaultPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));

import { DuolootLoadingState } from '@/components/duoloot';

function LazyFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <DuolootLoadingState message="Acessando vault..." />
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

export const privateRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <Lazy><DashboardPage /></Lazy> },
      { path: ROUTES.PREMIUM, element: <Lazy><PremiumPage /></Lazy> },
      { path: ROUTES.ADMIN_VAULT, element: <Lazy><AdminVaultPage /></Lazy> },
    ],
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute>
        <Lazy><OnboardingPage /></Lazy>
      </ProtectedRoute>
    ),
  },
];
