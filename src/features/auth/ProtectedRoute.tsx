import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '@/constants/routes';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isGameProfileComplete } from '@/services/onboarding.service';
import logger from '@/lib/logger';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#07090e] text-[var(--dl-tactical-green)] font-[Chakra_Petch]">
        {/* Spinner Tático */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Círculo externo pontilhado */}
          <div className="absolute inset-0 border-2 border-dashed border-[var(--dl-tactical-green)]/40 rounded-full animate-[spin_10s_linear_infinite]" />
          {/* Círculo interno girando rápido */}
          <div className="w-10 h-10 border-t-2 border-b-2 border-[var(--dl-tactical-green)] rounded-full animate-spin" />
          {/* Ponto central */}
          <div className="w-2.5 h-2.5 bg-[var(--dl-tactical-green)] rounded-full animate-pulse" />
        </div>
        
        <p className="mt-6 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
          DECIPHERING OPERATOR SESSION...
        </p>
        <span className="mt-2 text-[10px] text-[var(--dl-tactical-muted)] tracking-widest uppercase">
          Aguarde a resposta do servidor seguro
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info('Operador não autenticado. Redirecionando para login.');
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Redireciona para o Onboarding se o perfil gamer estiver incompleto
  if (isSupabaseConfigured) {
    const isComplete = isGameProfileComplete(profile);
    if (!isComplete && location.pathname !== ROUTES.ONBOARDING) {
      logger.info('Operador com perfil gamer incompleto. Redirecionando para onboarding.');
      return <Navigate to={ROUTES.ONBOARDING} replace state={{ from: location }} />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
