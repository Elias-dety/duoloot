import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

type LoginPageState = {
  from?: {
    pathname?: string;
  };
};

const LoginPage: React.FC = () => {
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
        error: error instanceof Error ? error.message : 'Falha ao conectar sua conta.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--dl-red-rgb)/0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
      <div className="relative z-10 flex w-full justify-center">
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
