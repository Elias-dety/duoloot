import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { isSupabaseConfigured } from '@/lib/supabase';

type LoginPageState = {
  from?: {
    pathname?: string;
  };
};

export const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as LoginPageState | null)?.from?.pathname || ROUTES.DASHBOARD;

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [authLoading, from, isAuthenticated, navigate]);

  const handleLogin = async (data: AuthFormSubmission) => {
    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha na conexão com o terminal.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-[#07090e] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 select-none bg-[radial-gradient(ellipse_at_center,var(--dl-tactical-green)_0%,transparent_70%)] opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.02]" />

      <div className="z-10 flex w-full justify-center">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          isLoading={isLoading || authLoading}
          isSupabaseConfigured={isSupabaseConfigured}
        />
      </div>
    </div>
  );
};

export default LoginPage;
