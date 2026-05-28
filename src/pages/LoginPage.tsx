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
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 55% 45% at 12% 20%, rgba(13,240,255,0.08), transparent 62%)',
            'radial-gradient(ellipse 45% 38% at 86% 78%, rgba(255,70,85,0.08), transparent 60%)',
            'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 42%)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-11rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <aside className="hidden lg:block">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--dl-number)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-number)] shadow-[0_0_8px_var(--dl-number)]" />
              Acesso seguro
            </div>

            <h1 className="mb-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
              Volte para o painel do seu jogador.
            </h1>

            <p className="mb-8 max-w-md font-['Inter'] text-[0.98rem] font-light leading-8 text-[var(--dl-muted-light)]">
              Use o login por e-mail enquanto Google e Riot Sign-On continuam fora da produção. Menos fumaça, mais fluxo testável.
            </p>

            <div className="grid gap-3">
              {[
                { label: 'Auth real', value: 'Supabase e-mail/senha', color: 'var(--dl-string)' },
                { label: 'Após login', value: 'Dashboard ou rota protegida', color: 'var(--dl-number)' },
                { label: 'Próximo passo', value: 'Onboarding obrigatório', color: 'var(--dl-warning)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3">
                  <span className="font-['Inter'] text-[0.76rem] uppercase tracking-[0.13em] text-[var(--dl-muted)]">
                    {item.label}
                  </span>
                  <span className="text-right font-mono text-[0.72rem]" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
