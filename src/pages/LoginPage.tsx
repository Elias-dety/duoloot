import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/i18n';

type LoginPageState = {
  from?: {
    pathname?: string;
  };
};

const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const { messages: copy } = useLanguage();
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
        error: error instanceof Error ? error.message : copy.auth.loginFailure,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-11rem)] w-full max-w-[1600px] items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
        <aside className="hidden lg:block">
          <section className="dl-premium-hero p-8 xl:p-10" data-watermark="LOGIN">
            <div className="relative z-[2]">
              <div className="dl-premium-badge mb-8 px-3 py-1.5">
                Acesso seguro
              </div>

              <h1 className="dl-premium-title mb-6 text-[clamp(2.6rem,5vw,5.2rem)] font-black">
                Volte para o painel do seu jogador.
              </h1>

              <p className="dl-premium-muted mb-8 max-w-md font-['Inter'] text-base font-light">
                Use o login por e-mail enquanto Google e Riot Sign-On continuam fora da produção. Menos fumaça, mais fluxo testável.
              </p>

              <div className="grid gap-3">
                {[
                  { label: 'Auth real', value: 'Supabase e-mail/senha', color: 'var(--dl-string)' },
                  { label: 'Após login', value: 'Dashboard ou rota protegida', color: 'var(--dl-number)' },
                  { label: 'Próximo passo', value: 'Onboarding obrigatório', color: 'var(--dl-warning)' },
                ].map((item) => (
                  <div key={item.label} className="dl-stat-tile flex min-h-0 items-center justify-between px-4 py-3">
                    <span className="dl-stat-label">{item.label}</span>
                    <span className="text-right font-mono text-[0.72rem]" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>

        <div className="flex w-full justify-center lg:justify-end">
          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading || authLoading}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
