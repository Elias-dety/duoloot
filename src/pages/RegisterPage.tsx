import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button, Card } from '@/components/atoms';
import { useLanguage } from '@/i18n';

const RegisterPage: React.FC = () => {
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const { messages: copy } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleRegister = async (data: AuthFormSubmission) => {
    setIsLoading(true);
    try {
      if (!data.name || !data.nickname) {
        return { success: false, error: copy.auth.nameNicknameRequired };
      }

      const result = await signUp(data.email, data.password, {
        name: data.name,
        nickname: data.nickname,
      });

      if (result.success) {
        if (result.sessionCreated) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          setRegisteredEmail(data.email);
          setNeedsVerification(true);
        }
      }

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : copy.auth.registerFailure,
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
            'radial-gradient(ellipse 55% 45% at 12% 20%, rgba(176,132,255,0.09), transparent 62%)',
            'radial-gradient(ellipse 45% 38% at 86% 78%, rgba(255,70,85,0.08), transparent 60%)',
            'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 42%)',
          ].join(', '),
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-11rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <aside className="hidden lg:block">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--dl-function)]/30 bg-[var(--dl-function)]/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--dl-function)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dl-function)] shadow-[0_0_8px_var(--dl-function)]" />
              Criação de conta
            </div>

            <h1 className="mb-5 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
              Monte seu perfil antes de entrar no jogo.
            </h1>

            <p className="mb-8 max-w-md font-['Inter'] text-[0.98rem] font-light leading-8 text-[var(--dl-muted-light)]">
              O cadastro cria a conta base. Depois disso, o onboarding coleta seu perfil gamer para alimentar lobbies, recomendações e futuras integrações.
            </p>

            <div className="grid gap-3">
              {[
                { label: 'Cadastro real', value: 'Supabase Auth', color: 'var(--dl-string)' },
                { label: 'Identidade gamer', value: 'Nome + nickname', color: 'var(--dl-function)' },
                { label: 'Depois', value: 'Onboarding obrigatório', color: 'var(--dl-warning)' },
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
          {needsVerification ? (
            <Card variant="elevated" className="w-full max-w-md space-y-6 overflow-hidden rounded-[1.75rem] border-white/[0.08] bg-white/[0.04] p-6 text-center backdrop-blur-xl md:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] text-2xl">
                ✉
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold uppercase tracking-[-0.02em] text-white">{copy.auth.verificationSent}</h2>
                <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
                  {copy.auth.verificationDescription}
                </p>
                <p className="rounded-[1rem] border border-white/[0.08] bg-black/20 px-3 py-2 text-sm font-semibold text-white">
                  {registeredEmail}
                </p>
              </div>

              <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
                {copy.auth.verificationInstructions}
              </p>

              <Button fullWidth variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
                {copy.auth.backToLogin}
              </Button>
            </Card>
          ) : (
            <AuthForm
              type="register"
              onSubmit={handleRegister}
              isLoading={isLoading || authLoading}
              isSupabaseConfigured={isSupabaseConfigured}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
